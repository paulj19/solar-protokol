import {Provider} from "react-redux";
import store from "@/src/store"
import Layout from "@/src/components/Layout";
import NoSSR from 'react-no-ssr';
import '@/src/globals.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SolarElecChart from "@/src/SolarElecChart/SolarElecChart";
import Stats from "@/src/stats/Stats";
import React from "react";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers";
import Home from "@/src/Home";
import GenerationConsumChart from "@/src/GenerationConsumChart/GenerationConsumChart";
import {NotFound} from "next/dist/client/components/error";
import {ThemeProvider} from "next-themes";
import PayoffChart from "@/src/payoffChart/PayoffChart";
import {SessionProvider, getSession} from "next-auth/react";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {getServerSession} from "next-auth";
import ErrorScreen from "@/src/components/ErrorScreen";
import ErrorBoundary  from "@/src/components/ErrorBoundary";

export default function SolarProtokol({Component, pageProps: {...pageProps}, session}) {
    const design = false;
    return (
        !design ?
            <NoSSR>
                <SessionProvider session={session}>
                    <ThemeProvider>
                        <Provider store={store}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <ErrorBoundary>
                                <BrowserRouter>
                                    <Layout>
                                        <Routes>
                                            <Route path="/" element={<Home/>}/>
                                            <Route path="/solarElecChart" element={<SolarElecChart/>}/>
                                            <Route path="/payoffChart" element={<PayoffChart/>}/>
                                            <Route path="/stats" element={<Stats/>}/>
                                            <Route path="/generationConsumChart" element={<GenerationConsumChart/>}/>
                                            <Route path="*" element={<NotFound/>}/>
                                            <Route path="/error" element={<ErrorScreen/>}/>
                                        </Routes>
                                    </Layout>
                                </BrowserRouter>
                              </ErrorBoundary>
                            </LocalizationProvider>
                        </Provider>
                    </ThemeProvider>
                </SessionProvider>
            </NoSSR> :
        <NoSSR>
            <ThemeProvider>
                <SessionProvider session={session}>
                    <Provider store={store}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Layout>
                                <Component {...pageProps}/>
                            </Layout>
                        </LocalizationProvider>
                    </Provider>
                </SessionProvider>
            </ThemeProvider>
        </NoSSR>
    )
}

// SolarProtokol.getInitialProps = async (ctx) => {
//     const session = await getServerSession(ctx.req, ctx.res, authOptions)
//     if (session) {
//         return {
//             session: {session}
//         }
//     }
//     return {
//         redirect: { destination: "/api/auth/signin/okta", permanent: false }
//     }
// }

