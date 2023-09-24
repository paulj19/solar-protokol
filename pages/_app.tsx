import {Provider} from "react-redux";
import store from "@/src/store"
import Layout from "@/src/components/Layout";
import NoSSR from 'react-no-ssr';
import '@/src/globals.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SolarElecChart from "@/src/SolarElecChart/SolarElecChart";
import SolarElecStats from "@/src/stats/SolarElecStats";
import React from "react";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers";
import Home from "@/src/Home";
import GenerationConsumChart from "@/src/GenerationConsumChart/GenerationConsumChart";

export default function SolarProtokol() {
    return (
        <NoSSR>
            <Provider store={store}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <BrowserRouter>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/solarElecChart/:pDate/:clientId" element={<SolarElecChart/>}/>
                                <Route path="/solarElecStats/:pDate/:clientId" element={<SolarElecStats/>}/>
                                <Route path="/generationConsumChart/:pDate/:clientId" element={<GenerationConsumChart/>}/>
                            </Routes>
                        </Layout>
                    </BrowserRouter>
                </LocalizationProvider>
            </Provider>
        </NoSSR>
    )
}