'use client'

import React, {useState} from "react";
import Slider from "../../components/Slider";
import StatsChart from "./StatsChart";
import {ElectricityStats} from "./ElectricityStats";
import SolarStats from "./SolarStats";
import TotalCostSavings from "./TotalCostSavings";
import {selectClientById, useGetClientParamsQuery, useGetGeneralParamsQuery} from "@/context/RootApi";
import {getPredictionCostsAllYears} from "@/utils/EnergyCostCalculator";
import styles from '@/src/comparison/stats/stats.module.css'
import {Link, useParams, useSearchParams} from "react-router-dom";
import Loading from "@/src/components/Loading";
import {useSelector} from "react-redux";
import {Fab} from "@mui/material";
import {ArrowBack, ArrowForward} from "@mui/icons-material";

export default function ComparisonStats({clientId}) {
    // const {clientId} = useParams();
    const [year, setYear] = useState<number>(0);
    const {data: generalParams, isLoading: isGeneralParamLoading, isError: isGeneralParamQueryError} = useGetGeneralParamsQuery(undefined);
    const clientParams = useSelector(state => selectClientById(state, "cid_1"));

    if (isGeneralParamLoading) {
        return <Loading/>;
    }
    //isError -> error page, put in rootApi, if undefined show error
    //do all error checks

    const predictionParams = {year, clientParams, generalParams};
    return (
        <>
            <div className={styles.statsContainer}>
                <h1 className={styles.yearHeading}>{"In " + (new Date().getFullYear() + year)}</h1>
                <div className={styles.statsSection}>
                    <ElectricityStats {...predictionParams} />
                    <StatsChart {...predictionParams} />
                    <SolarStats {...predictionParams} />
                </div>
                <TotalCostSavings {...predictionParams} />
                <div className={styles.yearSlider}>
                    <Slider ticks={[0, 5, 10, 15, 20, 25]} onChangeHandler={setYear} defaultValue={year} label={""}
                            step={1}/>
                </div>
            </div>
            <Fab variant="extended" color="primary" aria-label="add">
                <ArrowBack/>
                <Link to={'/comparison/chart/123'}> STATS </Link>
            </Fab>
        </>
    )
}