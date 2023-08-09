import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const rootApi = createApi({
    reducerPath: 'rootApi',
    baseQuery: fetchBaseQuery({ baseUrl: "" }),
    endpoints: builder => ({
        getPredictionParams: builder.query({
            query: () => ({
                url: "/extern-prediction-params",
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


export const { useGetPredictionParamsQuery, useGetClientParamsQuery } = rootApi;
