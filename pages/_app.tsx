import type {ReactElement, ReactNode} from 'react'
import type {NextPage} from 'next'
import type {AppProps} from 'next/app'
import {Provider} from "react-redux";
import store from "@/src/store"
import Layout from "@/src/components/Layout";
import NoSSR from 'react-no-ssr';
import '@/src/globals.css'

export default function SolarProtokol({Component, pageProps}) {
    return (
        <NoSSR>
            <Provider store={store}>
                {<Layout>
                    <Component {...pageProps} />
                </Layout>}
            </Provider>
        </NoSSR>
    )
}