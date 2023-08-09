'use client'

import { useState } from "react";
import Slider from "../components/Slider";
import ComparisonstatsChart from "./ComparisonstatsChart";
import { ElectricityStats } from "./ElectricityStats";
import SolarStats from "./SolarStats";
import TotalCostSavings from "./TotalCostSavings";

export default function ComparisonStats() {
    const [year, setYear] = useState<number>(5);
    return (
        <div className="comparison-container">
            <div className="comparison-section">
                <ElectricityStats year={year} />
                <ComparisonstatsChart year={year} />
                <SolarStats year={year} />
            </div>
            <TotalCostSavings year={year} />
            <div className="slider">
                <Slider ticks={[0, 5, 10, 15, 20, 25]} onChangeHandler={setYear} defaultValue={year} label={""} />
            </div>
        </div>
    )
}