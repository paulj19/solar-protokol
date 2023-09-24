import {createSelector} from '@reduxjs/toolkit';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {create} from 'domain';
import {createScanner} from 'typescript';
import arg from "arg";
import {ResultType} from "@remix-run/router/utils";
import {BaseQueryMeta, BaseQueryResult} from "@reduxjs/toolkit/src/query/baseQueryTypes";
import {isEmpty} from "@/utils/util";

let currentStartDate;
let currentEndDate;
// <>{
//                     console.log("key", key);
//                     console.log("value", value);
//                     Object.values(value).map((client) => {
//                         console.log("client", client);
//                          return (
//                              <tr key={client.id}>
//                                  <td>{client.nickname}</td>
//                                  <td>{client.remarks}</td>
//                              </tr>
//                          );
//                     }
//                 </>)
//todo single query both client and general params
export const rootApi = createApi({
    reducerPath: 'rootApi',
    baseQuery: fetchBaseQuery({baseUrl: "https://solar-protokol-default-rtdb.europe-west1.firebasedatabase.app"}),
    tagTypes: ["HighestClientId", "ClientList", "GeneralParams", "Client"],
    endpoints: builder => ({
        getGeneralParams: builder.query({
            query: () => ({
                url: "/generalParams.json",
                method: "get",
            }),
            providesTags: ["GeneralParams"],
        }),
        updateGeneralParams: builder.mutation({
            query: (data) => ({
                url: `/generalParams.json`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, {pDate}) => {
                return !error && ["GeneralParams"]
            },
        }),
        getClientListByPDate: builder.query({
            query: ({startDate, endDate}) => {
                currentStartDate = startDate;
                currentEndDate = endDate;
                return {
                    url: `/clientList/uid_1.json?`,
                    method: "get",
                    params: {
                        orderBy: '"$key"',
                        startAt: `"${startDate}"`,
                        endAt: `"${endDate}"`,
                    }
                }
            },
            transformResponse(result, meta, arg) {
                if(!isEmpty(result)) {
                    const clients = Object.assign({}, ...Object.values(result));
                    return Object.values(clients).sort((a, b) => {
                        return a.presentationDate.localeCompare(b.presentationDate)});
                }
                return [];
            },
            providesTags: (result, error, {startDate}) =>
                result
                    ? [({type: "ClientList" as const, id: startDate}), "ClientList"]
                    : ["ClientList"],
        }),
        getClient: builder.query({
            query: ({pDate, clientId}) => ({
                url: `/clientList/uid_1/${pDate}/cid_${clientId}.json`,
                method: "get",
            }),
            providesTags: (result, error, {clientId}) =>
                result ? [{type: "Client" as const, id: clientId}] : null,
        }),
        addClient: builder.mutation({
            query: ({pDate, data}) => {
                return {
                    url: `/clientList.json`,
                    method: 'PATCH',
                    body: data,
                }
            },
            invalidatesTags: (result, error, {pDate, data}) => ([{type: "ClientList", id: pDate}, {type: "Client", id: Object.values(data)[0].id}])
        }),
        getHighestClientId: builder.query({
            query: (userId) => ({
                url: `/highestClientId/${userId}.json`,
            }),
            transformResponse: function (response, meta, arg) {
                return {"highestClientId": response}
            },
            providesTags: ["HighestClientId"],
        }),
        updateHighestClientId: builder.mutation({
            query: (data) => ({
                url: `/highestClientId.json`,
                method: 'PATCH',
                body: data,
            }),
            async onQueryStarted({...data}, {dispatch, queryFulfilled}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(rootApi.util.updateQueryData("getHighestClientId", "uid_1", (draft) => {
                        Object.assign(draft, {"highestClientId": result?.data?.uid_1});
                    }))
                } catch (e) {
                    console.error(e);
                }
            },
        }),
        deleteClient: builder.mutation({
            query: ({pDate, clientId}) => ({
                url: `/clientList/uid_1/${pDate}/${clientId}.json`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, {pDate}) => [{type: "ClientList", id: pDate}]
        }),
        updateClientStats: builder.mutation({
            query: (data) => ({
                url: `/clientList.json`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, {pDate}) => [{type: "ClientList", id: pDate}]
        }),
    })
})

export const selectClientByIdResult = rootApi.endpoints.getClientListByPDate.select({
    endDate: currentEndDate,
    startDate: currentStartDate,
});

export const selectClientById = createSelector(
    selectClientByIdResult, (state, clientId) => clientId,
    ({data: clients}, clientId: string) => {

        console.log("clients", clients)
        if (!clients) return {
            "basePrice": 10,
            "consumptionYearly": 3500,
            "creationDate": "2023-08-22T12:04:24.211Z",
            "presentationDate": "2023-08-22T15:04:24.211Z",
            "productionYearly": 7192,
            "unitPrice": 0.32
        }
        const clientList = Object.assign({}, ...Object.values(clients));
        return clientList[clientId];
    }
)

// export const selectClientByIdToday = createSelector(
//     selectAllClientListToday, (state, clientId) => clientId,
//     (client, clientId) => client[clientId])

export const {
    useGetGeneralParamsQuery,
    useGetClientListByPDateQuery,
    useAddClientMutation,
    useGetHighestClientIdQuery,
    useUpdateHighestClientIdMutation,
    useDeleteClientMutation,
    useUpdateGeneralParamsMutation,
    useUpdateClientStatsMutation,
    useGetClientQuery,
} = rootApi;
