import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const rootApi = createApi({
    reducerPath: 'rootApi',
    baseQuery: fetchBaseQuery({ baseUrl: "" }),
    endpoints: builder => ({
        getGeneralParams: builder.query({
            query: () => ({
                url: "/general-params",
                method: "get",
            })
        }),
        getClientParams: builder.query({
            query: (clientId) => ({
                url: `/${clientId}/client-params`,
                method: "get",
            })
        })

    })
})


export const { useGetGeneralParamsQuery, useGetClientParamsQuery } = rootApi;
