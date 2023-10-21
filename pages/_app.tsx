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
import Theme from "@/src/components/Theme";
import {ThemeProvider} from "next-themes";

export default function SolarProtokol({Component, pageProps}) {
    const xxx = true;
    return (
        xxx ?
        <NoSSR>
            <html data-theme="gray-bg" suppressHydrationWarning>
            <Provider store={store}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <BrowserRouter>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/solarElecChart" element={<SolarElecChart/>}/>
                                <Route path="/stats" element={<Stats/>}/>
                                <Route path="/generationConsumChart" element={<GenerationConsumChart/>}/>
                                <Route path="*" element={<NotFound/>}/>
                            </Routes>
                        </Layout>
                    </BrowserRouter>
                </LocalizationProvider>
            </Provider>
            </html>
        </NoSSR>  :
        <NoSSR>
            <html data-theme="gray-bg" suppressHydrationWarning>
                <Provider store={store}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Layout>
                            <Component />
                        </Layout>
                    </LocalizationProvider>
                </Provider>
            </html >
        </NoSSR>
    )
}