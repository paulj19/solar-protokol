'use client'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClientList from "./ClientList"
import Stats from "./comparison/stats/Stats";
import ComparisonChart from "./comparison/chart/ComparisonChart";

export function Home() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ClientList />} />
                <Route path="/comparisonChart/:clientId" element={<ComparisonChart />} />
                <Route path="/comparisonStats/:clientId" element={<Stats />} />
            </Routes>
        </BrowserRouter>
    )
}
