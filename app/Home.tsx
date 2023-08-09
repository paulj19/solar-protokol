'use client'

import { worker } from "@/mocks/browser";
import ComparisonChart from "./comparison/ComparisonChart";

if (process.env.NODE_ENV === 'development') {
    worker.listen({ onUnhandledRequest: 'bypass' })
}

export function Home() {
    return < ComparisonChart clientId={123} />
}
