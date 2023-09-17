'use client'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClientList from "./ClientList"
import Stats from "./comparison/stats/Stats";
import ComparisonChart from "./comparison/chart/ComparisonChart";
import { CreateClient } from "./CreateClient";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

export function Home() {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ClientList />} />
                    <Route path="/comparisonChart/:clientId" element={<ComparisonChart />} />
                    <Route path="/comparisonStats/:clientId" element={<Stats />} />
                </Routes>
            </BrowserRouter>
        </LocalizationProvider >
    )
}
