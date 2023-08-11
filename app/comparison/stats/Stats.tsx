'use client'

import { useState } from "react";
import Slider from "../../components/Slider";
import StatsChart from "./StatsChart";
import { ElectricityStats } from "./ElectricityStats";
import SolarStats from "./SolarStats";
import TotalCostSavings from "./TotalCostSavings";
import Loading from "@/app/Loading";
import { useGetClientParamsQuery, useGetPredictionParamsQuery } from "@/context/RootApi";
import { getPredictionCostsAllYears } from "@/utils/EnergyCostCalculator";
import { useParams, useSearchParams } from 'next/navigation'
import styles from '@/app/comparison/stats/stats.module.css'

export default function Stats({ clientId }) {
    console.log("paraMS", clientId)
    const [year, setYear] = useState<number>(0);
    const { data: externParams, isLoading: isExternParamLoading, isError: isExternParamQueryError } = useGetPredictionParamsQuery(undefined);
    const { data: clientParams, isLoading: isClientParamLoading, isError: isClientParamQueryError } = useGetClientParamsQuery(clientId);

    if (isClientParamLoading || isExternParamLoading) {
        return <Loading />;
    }
    //isError -> error page, put in rootApi, if undefined show error
    //do all error checks

    const costPredicted = getPredictionCostsAllYears({ clientParams: clientParams, externPredictionParams: externParams });
    return (
        <div className={styles.statsContainer}>
            <h1 className={styles.yearHeading}>{"In " + (new Date().getFullYear() + year)}</h1>
            <div className={styles.statsSection}>
                <ElectricityStats year={year} costPredicted={costPredicted} externParams={externParams} />
                <StatsChart year={year} costPredicted={costPredicted} />
                <SolarStats year={year} costPredicted={costPredicted} externParams={externParams} clientParams={clientParams} />
            </div>
            <TotalCostSavings year={year} />
            <div className={styles.yearSlider}>
                <Slider ticks={[0, 5, 10, 15, 20, 25]} onChangeHandler={setYear} defaultValue={year} label={""} />
            </div>
        </div>
    )
}