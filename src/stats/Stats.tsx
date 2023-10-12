import React, {useEffect, useState} from "react";
import StatsChart from "./StatsChart";
import {ElectricityStats} from "./ElectricityStats";
import SolarStats from "./SolarStats";
import TotalCostSavings from "./TotalCostSavings";
import {useGetClientQuery, useGetGeneralParamsQuery} from "@/src/context/RootApi";
import styles from '@/src/stats/stats.module.css'
import Loading from "@/src/components/Loading";
import {Fab} from "@mui/material";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import {Link, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import ErrorScreen from "@/src/components/ErrorScreen";
import Slider from "@mui/joy/Slider";
import {Mark} from "@mui/base";

export default function Stats() {
    // const navigate = useNavigate();
    // const [searchParams] = useSearchParams();
    // const clientId = searchParams.get('clientId');
    // const pDate = searchParams.get('pDate');
    // useEffect(() => {
    //     if (!clientId || !pDate) {
    //         navigate('/');
    //     }
    // }, []);
    const pDate = "2023-10-03";
    const clientId = "873";
    const [year, setYear] = useState<number>(0);
    const {
        data: generalParams,
        isLoading: isGeneralParamLoading,
        isError: isGeneralParamsError
    } = useGetGeneralParamsQuery(undefined);
    const {data: clientParams, isLoading: isClientParamLoading, isError: isClientParamError} = useGetClientQuery({
        pDate,
        clientId
    });

    if (isClientParamLoading || isGeneralParamLoading) {
        return <Loading/>;
    }
    //todo why undef rendered twice
    if (isClientParamError || isGeneralParamsError) {
        return <ErrorScreen/>
    }
    //isError -> error page, put in rootApi, if undefined show error
    //do all error checks

    const predictionParams = {year, clientParams, generalParams};
    return (
        <>
            <h1 className="m-auto font-medium font-sans text-3xl tracking-wide text-cyan-900">{"Jahr " + (new Date().getFullYear() + year)}</h1>
            <div className="w-full h-full" data-testid="stats">
                <div className="flex pb-12 justify-center h-[650px]">
                    <ElectricityStats {...predictionParams} />
                    <StatsChart {...predictionParams} />
                    <SolarStats {...predictionParams} />
                </div>
                <div className="flex m-auto flex-col">
                    <TotalCostSavings {...predictionParams} />
                </div>
            </div>
            {/*<Slider ticks={[0, 5, 10, 15, 20, 25]} onChangeHandler={setYear} defaultValue={year} label={""}*/}
            {/*        step={1}/>*/}
            <div className="w-[200px] pt-6" data-testid="year-slider">
                <Slider
                    orientation="horizontal"
                    color="neutral"
                    aria-label="year-slider"
                    defaultValue={year}
                    min={0}
                    max={25}
                    step={1}
                    marks={getSliderMarks()}
                    valueLabelDisplay="off"
                    onChange={( e, value) => setYear(Number(value))}
                    sx={{
                        "--Slider-markSize": "3px"
                    }}
                />
            </div>
            {/*<div className="absolute bottom-7 left-7" data-testid="backward-fab">*/}
            {/*    <Tooltip title="comparison chart" arrow>*/}
            {/*        <Fab variant="circular" color="inherit" component={Link} to={`/solarElecChart?pDate=${pDate}&clientId=${clientId}`}*/}
            {/*             aria-label="add">*/}
            {/*            <ArrowBack/>*/}
            {/*        </Fab>*/}
            {/*    </Tooltip>*/}
            {/*</div>*/}
            {/*<div className="absolute bottom-7 right-7" data-testid="forward-fab">*/}
            {/*    <Tooltip title="generation consumption chart" arrow>*/}
            {/*        <Fab variant="circular" color="inherit" component={Link}*/}
            {/*             to={`/generationConsumChart?pDate=${pDate}&clientId=${clientId}`}*/}
            {/*             aria-label="add">*/}
            {/*            <ArrowForward/>*/}
            {/*        </Fab>*/}
            {/*    </Tooltip>*/}
            {/*</div>*/}
        </>
    )
}
function getSliderMarks(): Array<Mark> {
    const marks = [];
    for (let i = 0; i <= 25 ; i+=5) {
        marks.push({value: i, label: i.toString()});
    }
    return marks;
}
