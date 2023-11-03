import React, {ReactElement, useEffect, useState} from "react";
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
import ColoredSlider from "../components/ColoredSlider";
import {
    XAxis,
    BarChart,
    Bar,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    LabelList,
    Label, Text
} from 'recharts';
import {calcTotalSaved} from "@/utils/ElectricityCostCalculator";
import CumStatsChart from "@/src/stats/CumStatsChart";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary from "@mui/joy/AccordionSummary";

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
    // const clientId = "43"
    // const pDate = "2023-11-09"
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

    const predictionParams = {year, clientParams, generalParams};
    return (
        <>
            <h1 className="m-auto font-medium font-sans text-4xl tracking-wide text-gray-300">{"Jahr " + (new Date().getFullYear() + year)}</h1>
            <div className="w-full h-full" data-testid="stats">
                <div className="flex w-[1800px] pb-10 h-[650px]">
                    <div className="flex w-[1400px] justify-end h-[650px] pr-14 gap-12">
                        <StatsChart {...predictionParams} />
                        <CumStatsChart {...predictionParams} />
                    </div>
                    <div className="pt-32 pb-10">
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
                </div>
                <div className="flex m-auto flex-col pt-4">
                    <TotalCostSavings {...predictionParams} />
                </div>
            </div>
            {/*<Slider ticks={[0, 5, 10, 15, 20, 25]} onChangeHandler={setYear} defaultValue={year} label={""}*/}
            {/*        step={1}/>*/}
            <div className="flex w-full justify-center gap-20 pt-3">
                <div className="w-[200px] self-end" data-testid="year-slider">
                    <ColoredSlider
                        orientation="horizontal"
                        color="neutral"
                        aria-label="year-slider"
                        // defaultValue={year}
                        min={0}
                        max={25}
                        step={1}
                        defaultValue={year}
                        marks={getSliderMarks()}
                        onChange={(e, value) => setYear(Number(value))}
                        sx={{
                            "--Slider-markSize": "3px"
                        }}
                    />
                </div>
            </div>
            <div className="absolute bottom-7 left-7" data-testid="backward-fab">
                <Tooltip title="comparison chart" arrow>
                <Fab variant="circular"  sx={{backgroundColor: "#474747", color: "#878787de"}} component={Link} to={`/solarElecChart?pDate=${pDate}&clientId=${clientId}`}
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

function getSliderMarks(): Array<Mark> {
    const marks = [];
    for (let i = 0; i <= 25; i += 5) {
        marks.push({value: i, label: <span className="text-gray-400 font-medium">{i}</span>});
    }
    return marks;
}

export function PriceHeading({text}) {
    return (<div className="font-sans font-normal text-2xl pl-3 tracking-wide text-gray-300">{text}</div>)
}

{/*<div className="absolute bottom-7 left-7" data-testid="backward-fab">*/
}
{/*    <Tooltip title="comparison chart" arrow>*/
}
{/*        <Fab variant="circular" color="inherit" component={Link} to={`/solarElecChart?pDate=${pDate}&clientId=${clientId}`}*/
}
{/*             aria-label="add">*/
}
{/*            <ArrowBack/>*/
}
{/*        </Fab>*/
}
{/*    </Tooltip>*/
}
{/*</div>*/
}
{/*<div className="absolute bottom-7 right-7" data-testid="forward-fab">*/
}
{/*    <Tooltip title="generation consumption chart" arrow>*/
}
{/*        <Fab variant="circular" color="inherit" component={Link}*/
}
{/*             to={`/generationConsumChart?pDate=${pDate}&clientId=${clientId}`}*/
}
{/*             aria-label="add">*/
}
{/*            <ArrowForward/>*/
}
{/*        </Fab>*/
}
{/*    </Tooltip>*/
}
{/*</div>*/
}
{/* <div className="absolute bottom-7 left-7" data-testid="backward-fab">
                <Tooltip title="comparison chart" arrow>
                    <Fab variant="circular" color="inherit" component={Link} to={`/solarElecChart?pDate=${pDate}&clientId=${clientId}`}
                        aria-label="add">
                        <ArrowBack />
                    </Fab>
                </Tooltip>
            </div>
            <div className="absolute bottom-7 right-7" data-testid="forward-fab">
                <Tooltip title="generation consumption chart" arrow>
                    <Fab variant="circular" color="inherit" component={Link}
                        to={`/generationConsumChart?pDate=${pDate}&clientId=${clientId}`}
                        aria-label="add">
                        <ArrowForward />
                    </Fab>
                </Tooltip>
            </div> */
}
export const customLabel = (props) => {
    const {x, y, width, height, value} = props;
    const radius = 10;

    return (
        <g>
            <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle"
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
    return !isValueTiny ? <LabelList position={"middle"} fill={"rgb(243 244 246)"}
                                     className="font-sans font-medium tracking-wide"
                                     style={{paddingLeft: "5px", textOverflow: "visible"}}>{text}</LabelList> : null
}
export function getBarLabelCost(text): ReactElement {
    return <LabelList position={"right"} fill="#fff"
                                     className="font-sans font-medium tracking-wide "
                                     style={{paddingLeft: "5px", textOverflow: "visible"}}>{text}</LabelList>
}
