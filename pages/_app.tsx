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

export default function SolarProtokol({Component, pageProps}) {
    const design = false;
    return (
        !design ?
            <NoSSR>
                <ThemeProvider defaultTheme="light">
                    <Provider store={store}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <BrowserRouter>
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<Home/>}/>
                                        <Route path="/solarElecChart" element={<SolarElecChart/>}/>
                                        <Route path="/payoffChart" element={<PayoffChart/>}/>
                                        <Route path="/stats" element={<Stats/>}/>
                                        <Route path="/generationConsumChart" element={<GenerationConsumChart/>}/>
                                        <Route path="*" element={<NotFound/>}/>
                                    </Routes>
                                </Layout>
                            </BrowserRouter>
                        </LocalizationProvider>
                    </Provider>
                </ThemeProvider>
            </NoSSR> :
        <NoSSR>
            <ThemeProvider defaultTheme="light">
                <Provider store={store}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Layout>
                            <Component/>
                        </Layout>
                    </LocalizationProvider>
                </Provider>
            </ThemeProvider>
</NoSSR>
)
}
