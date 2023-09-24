'use client'

import React, {useState} from "react";
import Slider from "../components/Slider";
import StatsChart from "./StatsChart";
import {ElectricityStats} from "./ElectricityStats";
import SolarStats from "./SolarStats";
import TotalCostSavings from "./TotalCostSavings";
import {selectClientById, useGetClientQuery, useGetGeneralParamsQuery} from "@/context/RootApi";
import styles from '@/src/stats/stats.module.css'
import Loading from "@/src/components/Loading";
import {useSelector} from "react-redux";
import {Fab} from "@mui/material";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import {Link, useNavigate, useParams} from 'react-router-dom';

export default function SolarElecStats() {
    const { clientId, pDate } = useParams();
    const navigate = useNavigate();
    if (!clientId || !pDate) {
        navigate('/');
    }
    const [year, setYear] = useState<number>(0);
    const {data: generalParams, isLoading: isGeneralParamLoading, isError: isGeneralParamsError} = useGetGeneralParamsQuery(undefined);
    // const clientParams = useSelector(state => selectClientById(undefined, "cid_1"));
    const {data: clientParams, isLoading: isClientParamLoading, isError: isClientParamError} = useGetClientQuery({pDate, clientId});

    if (isClientParamLoading || isGeneralParamLoading) {
        return <Loading/>;
    }
    //todo why undef rendered twice
    if (isClientParamError || isGeneralParamsError) {
        return <div>no data, fix me</div>
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
            <div className="absolute bottom-7 left-7">
                <Tooltip title="comparison chart" arrow>
                    <Fab variant="circular" color="inherit" component={Link} to={`/solarElecChart/${pDate}/${clientId}`}
                         aria-label="add" >
                        <ArrowBack/>
                    </Fab>
                </Tooltip>
            </div>
            <div className="absolute bottom-7 right-7">
                <Tooltip title="generation consumption chart" arrow>
                    <Fab variant="circular" color="inherit" component={Link} to={`/generationConsumChart/${pDate}/${clientId}`}
                         aria-label="add" >
                        <ArrowForward/>
                    </Fab>
                </Tooltip>
            </div>
        </>
    )
}