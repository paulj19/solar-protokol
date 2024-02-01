import React, {ReactElement, useEffect, useState} from "react";
import StatsChart from "./StatsChart";
import {ElectricityStats} from "./ElectricityStats";
import TotalCostSavings from "./TotalCostSavings";
import {useGetClientQuery, useGetGeneralParamsQuery} from "@/src/context/RootApi";
import Loading from "@/src/components/Loading";
import {Fab} from "@mui/material";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import {Link, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import ErrorScreen from "@/src/components/ErrorScreen";
import {Mark} from "@mui/base";
import ColoredSlider from "../components/ColoredSlider";
import {LabelList} from 'recharts';
import CumStatsChart from "@/src/stats/CumStatsChart";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary from "@mui/joy/AccordionSummary";
import {PredictionParams} from "@/types/types";

export default function Stats() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get('clientId');
    const pDate = searchParams.get('pDate');
    useEffect(() => {
        if (!clientId || !pDate) {
            navigate('/');
        }
    }, []);
    // const clientId = "54"
    // const pDate = "2024-01-26"
    const [year, setYear] = useState<number>(10);
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

    const predictionParams: PredictionParams = {year, clientParams, generalParams};
    return (
        <>
            <h1 className="m-auto font-medium font-sans text-4xl tracking-wide text-h1">{"Jahr " + (new Date().getFullYear() + year)}</h1>
            <div className="w-full h-full" data-testid="stats">
                <div className="flex w-[1800px] pb-10 h-[650px]">
                    <div className="flex w-[1400px] justify-end h-[650px] pr-14 gap-12">
                        <StatsChart {...predictionParams} />
                        <CumStatsChart {...predictionParams} />
                    </div>
                    <div className="flex flex-col">
                        <div className="pt-14 pb-10">
                            <AccordionGroup variant="plain">
                                <Accordion>
                                    <AccordionSummary><span
                                        className='text-legend'>Rechnung Details</span></AccordionSummary>
                                    {/* <AccordionSummary><span className='text-legend'> PV Rate</span></AccordionSummary> */}
                                    <AccordionDetails>
                                        <ElectricityStats {...predictionParams} />
                                    </AccordionDetails>
                                </Accordion>
                            </AccordionGroup>
                        </div>
                        <div className="flex m-auto flex-col pt-24">
                            <TotalCostSavings {...predictionParams} />
                        </div>
                    </div>
                </div>
            </div>
            {/*<Slider ticks={[0, 5, 10, 15, 20, 25]} onChangeHandler={setYear} defaultValue={year} label={""}*/}
            {/*        step={1}/>*/}
            <div className="flex w-full justify-center">
                <div className="w-[200px] self-end" data-testid="year-slider">
                    <ColoredSlider
                        orientation="horizontal"
                        color="neutral"
                        aria-label="year-slider"
                        // defaultValue={year}
                        min={0}
                        max={generalParams.yearLimitPrediction}
                        step={1}
                        defaultValue={year}
                        marks={getSliderMarks(generalParams.yearLimitPrediction)}
                        onChange={(e, value) => setYear(Number(value))}
                        sx={{
                            "--Slider-markSize": "3px"
                        }}
                    />
                </div>
            </div>
            <div className="absolute bottom-7 left-7" data-testid="backward-fab">
                <Tooltip title="comparison chart" arrow>
                    <Fab variant="circular" sx={{backgroundColor: "#474747", color: "#878787de"}} component={Link}
                         to={`/solarElecChart?pDate=${pDate}&clientId=${clientId}`}
                         aria-label="add">
                        <ArrowBack/>
                    </Fab>
                </Tooltip>
            </div>
            <div className="absolute bottom-7 right-7" data-testid="forward-fab">
                <Tooltip title="generation consumption chart" arrow>
                    <Fab variant="circular" sx={{backgroundColor: "#474747", color: "#878787de"}} component={Link}
                         to={`/generationConsumChart?pDate=${pDate}&clientId=${clientId}`}
                         aria-label="add">
                        <ArrowForward/>
                    </Fab>
                </Tooltip>
            </div>
        </>
    )
}

function getSliderMarks(tickLimit: number): Array<Mark> {
    const marks = [];
    const style = "text-sliderMarks font-medium";
    for (let i = 0; i < tickLimit; i += 5) {
        marks.push({value: i, label: <span className={style}>{i}</span>});
    }
    marks.push({value: tickLimit, label: <span className={style}>{tickLimit}</span>});
    return marks;
}

export function PriceHeading({text}) {
    return (<div className="font-sans font-normal text-2xl pl-3 tracking-wide text-h1">{text}</div>)
}
export const customLabel = (props) => {
    const {x, y, width, height, value} = props;
    const radius = 10;

    return (
        <g>
            <text x={x + width / 2} y={y - radius} fill="rgb(var(--stats-bar-label))" textAnchor="middle"
                  className="font-sans text-2xl font-bold">
                {getFormattedCost(value)}
            </text>
        </g>
    );
};

export function getFormattedCost(cost: number) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(cost);
}

export function getBarLabel(text, isValueTiny = false): ReactElement {
    return !isValueTiny ? <LabelList position={"middle"} fill={"rgb(var(--stats-bar-label-cost))"}
                                     className="font-sans font-medium tracking-wide whitespace-pre-line"
                                     style={{paddingLeft: "5px", textOverflow: "visible"}}>{text}</LabelList> : null
}

export function getBarLabelCost(text): ReactElement {
    return <LabelList position={"right"} fill="rgb(var(--stats-bar-label))"
                      className="font-sans font-medium tracking-wide "
                      style={{paddingLeft: "5px", textOverflow: "visible"}}>{text}</LabelList>
}
