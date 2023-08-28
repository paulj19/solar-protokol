import { createSelector } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { create } from 'domain';
import { createScanner } from 'typescript';

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
    baseQuery: fetchBaseQuery({ baseUrl: "https://solar-protokol-default-rtdb.europe-west1.firebasedatabase.app" }),
    endpoints: builder => ({
        getGeneralParams: builder.query({
            query: () => ({
                url: "/generalParams.json",
                method: "get",
            })
        }),
        getClientListByPDate: builder.query({
            query: ({ startDate, endDate }) => {
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
        })
    })
})

export const selectClientByIdResult = rootApi.endpoints.getClientListByPDate.select({ endDate: currentEndDate, startDate: currentStartDate, });

export const selectClientById = createSelector(
    selectClientByIdResult, (state, clientId) => clientId,
    ({ data: clients }, clientId: string) => {
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

export const { useGetGeneralParamsQuery, useGetClientListByPDateQuery } = rootApi;
