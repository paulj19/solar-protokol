'use client'

import { useGetPredictionParamsQuery } from "@/context/RootApi"
import { worker } from "@/mocks/browser";


if (process.env.NODE_ENV === 'development') {
    worker.listen({ onUnhandledRequest: 'bypass' })
}

export function Home() {
    const { data: predicitonParams, isSuccess } = useGetPredictionParamsQuery(undefined);

    if (isSuccess) {
        console.log("HOME", predicitonParams)
        return <div>XXX</div>
    }
}