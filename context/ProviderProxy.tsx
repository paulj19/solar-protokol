'use client'

import { Provider } from "react-redux";
import store from "@/app/store"
import { worker } from "@/mocks/browser";

if (process.env.NODE_ENV === 'development') {
    worker.listen({ onUnhandledRequest: 'bypass' })
}

export default function ProviderProxy({ children }) {
    return (
        <Provider store={store}>{children}</Provider >
    );
}
