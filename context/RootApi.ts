import { URL_EXTERN_PREDICTION_PARAMS } from '@/utils/Urls'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import build from 'next/dist/build'

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
        getClientPredictionParams: builder.query({
            query: (clientId) => ({
                url: `/${clientId}/user-params`,
                method: "get",
            })
        })

    })
})

export const { useGetPredictionParamsQuery, useGetClientPredictionParamsQuery } = rootApi;
