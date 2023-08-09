'use client'

import { Provider } from "react-redux";
import store from "@/app/store"

export default function ProviderProxy({ children }) {
    return (
        <Provider store={store}>{children}</Provider >
    );
}
