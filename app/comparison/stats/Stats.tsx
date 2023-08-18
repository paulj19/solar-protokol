'use client'

import { useState } from "react";
import Slider from "../../components/Slider";
import StatsChart from "./StatsChart";
import { ElectricityStats } from "./ElectricityStats";
import SolarStats from "./SolarStats";
import TotalCostSavings from "./TotalCostSavings";
import Loading from "@/app/Loading";
import { useGetClientParamsQuery, useGetGeneralParamsQuery } from "@/context/RootApi";
import { getPredictionCostsAllYears } from "@/utils/EnergyCostCalculator";
import styles from '@/app/comparison/stats/stats.module.css'

export default function Stats({ clientId }) {
    const [year, setYear] = useState<number>(0);
    const { data: generalParams, isLoading: isGeneralParamLoading, isError: isGeneralParamQueryError } = useGetGeneralParamsQuery(undefined);
    const { data: clientParams, isLoading: isClientParamLoading, isError: isClientParamQueryError } = useGetClientParamsQuery(clientId);

    if (isClientParamLoading || isGeneralParamLoading) {
        return <Loading />;
    }
    //isError -> error page, put in rootApi, if undefined show error
    //do all error checks

    return (
        <div className={styles.statsContainer}>
            <h1 className={styles.yearHeading}>{"In " + (new Date().getFullYear() + year)}</h1>
            <div className={styles.statsSection}>
                <ElectricityStats {...{ year, generalParams, clientParams }} />
                <StatsChart {...{ year, generalParams, clientParams }} />
                <SolarStats {...{ year, generalParams, clientParams }} />
            </div>
            <TotalCostSavings year={year} />
            <div className={styles.yearSlider}>
                <Slider ticks={[0, 5, 10, 15, 20, 25]} onChangeHandler={setYear} defaultValue={year} label={""} step={1} />
            </div>
        </div>
    )
}