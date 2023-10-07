import React, {useEffect, useState} from 'react';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    ComposedChart, Label
} from 'recharts';
import {Tooltip as RechartToolTop} from 'recharts';
import Tooltip from '@mui/material/Tooltip';
import styles from './ComparisonChart.module.css'
import Slider from '../components/Slider';
import {
    useGetGeneralParamsQuery,
    selectClientById,
    selectClientByIdResult,
    useGetClientQuery
} from '@/src/context/RootApi';
import Loading from "@/src/components/Loading";
import ErrorScreen from "@/src/components/ErrorScreen";
import {calcPredictions} from '@/utils/ElectricityCostCalculator';
import {CostPredictions} from '@/types/types';
import {Link, Navigate, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {Fab} from "@mui/material";
import {ArrowForward, Title} from "@mui/icons-material";
import {right} from "@popperjs/core";

export default function SolarElecChart() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get('clientId');
    const pDate = searchParams.get('pDate');
    // const clientId = "873"
    // const pDate = "2021-10-03"
    useEffect(() => {
        if (!clientId || !pDate) {
            navigate('/');
        }
    }, []);
    const [inflationRate, setInflationRate] = useState<number>(null)
    const [elecIncreaseRate, setElecIncreaseRate] = useState<number>(null)
    const [showSolar, setShowSolar] = useState<boolean>(false);
    const {data: clientParams, isLoading: isClientParamLoading, isError: isClientParamError} = useGetClientQuery({pDate, clientId});
    const {data: generalParams, isLoading: isGeneralParamLoading, isError: isGeneralParamsError} = useGetGeneralParamsQuery(undefined);
    // const clientParams = useSelector(state => selectClientById(state, "cid_1"));
    if (isClientParamLoading || isGeneralParamLoading) {
        return <Loading/>;
    }
    //todo why undef rendered twice
    if (isClientParamError || isGeneralParamsError) {
        return <ErrorScreen/>
    }
    //todo no direct url calls with cid, then have to handle loading and error conditions of query

    const comparisonData: Array<CostPredictions> = calcPredictions({year: undefined, clientParams: {...clientParams}, generalParams: {...generalParams, inflationRate: inflationRate ?? generalParams.inflationRate, electricityIncreaseRate: elecIncreaseRate ?? generalParams.electricityIncreaseRate}});
    let xx = false;
    const comparisonDataWithRange = comparisonData.reduce((acc, item, i, array) => {
        // if (i % 5 !== 0) {
        //     return acc;
        // }
        if (item.electricityCost >= item.solarCost) {
            if (i >= 1 && xx === false) {
                const intersectionResut = intersect(array[i - 1].year, array[i - 1].solarCost, item.year, item.solarCost, array[i - 1].year, array[i - 1].electricityCost, item.year, item.electricityCost);
                if (intersectionResut) {
                    const {x, y}: any = intersectionResut;
                    const intersection = {year: Math.floor(x), electricityCost: y, solarCost: y, range: [y, y]}
                    acc = acc.concat(intersection);
                    xx = true;
                }
            }
            const range = item.electricityCost !== undefined && item.solarCost !== undefined
                ? [item.electricityCost - 1, item.solarCost + 1]
                : [];
            item['range'] = range;
        }
        return acc.concat(item);
    }, []);

    return (
        <>
            <div className={styles.chartContainer} data-testid="solar-elec-chart">
                <h1 className="font-bold text-3xl font-sans text-cyan-900 m-auto pb-4">STROM SOLAR VERGLEICH </h1>
                <div className={styles.chart}>
                    <ResponsiveContainer className={styles.responseChart}>
                        <ComposedChart
                            data={comparisonDataWithRange}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="year" ticks={[0, 5, 10, 15, 20, 25]} tickFormatter={formatXAxisTicks} tick={{fill: 'green'}} tickSize={8} tickMargin={15} strokeWidth={0.7}/>
                            <YAxis ticks={getYAxisTicks(comparisonDataWithRange)} tickFormatter={formatYAxisTicks} tick={{fill: 'green'}} tickSize={8} tickMargin={15} width={80} strokeWidth={0.7}>
                                <Label
                                    style={{
                                        textAnchor: "middle",
                                        fontSize: "1.4em",
                                        fill: "#072543",
                                    }}
                                    dx={-50}
                                    angle={270}
                                    value={"Miete Pro Monat"} />
                            </YAxis >
                            <RechartToolTop/>
                            <defs>
                                <linearGradient id="splitColor">
                                    <stop offset="1" stopColor="#bff593" stopOpacity={1}/>
                                </linearGradient>
                            </defs>
                            <Legend layout="horizontal" verticalAlign="top" align="right"/>
                            <Line type="linear" dataKey="electricityCost" name="Ohne PV" stroke="#FF0000"
                                  strokeWidth={3.5} activeDot={{r: 8}} dot={<CustomizedDot />}/>
                            <Line type="linear" dataKey="solarCost" name="Mit Enpal" stroke="#072543" strokeWidth={3.5}
                                  hide={!showSolar} dot={<CustomizedDot />}/>
                            <Area type="linear" dataKey="range" fill="url(#splitColor)" hide={!showSolar}
                                  legendType='none' tooltipType='none'/>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.toggle} data-testid="solar-toggle">
                    <label className={styles.switch}>
                        <input type="checkbox" onChange={(e) => setShowSolar(e.target.checked)}/>
                        <span className={styles.slider + " " + styles.round}></span>
                    </label>
                </div>
                <div className={styles.rangeSelectors} data-testid="inflation-elec-slider">
                    <Slider ticks={[3, 4, 5, 6, 7, 8]} onChangeHandler={setInflationRate}
                            defaultValue={generalParams.inflationRate} label={"inflation rate(%)"} step={1}/>
                    <Slider ticks={[1, 2, 3, 4, 5, 6]} onChangeHandler={setElecIncreaseRate}
                            defaultValue={generalParams.electricityIncreaseRate} label={"strom increase rate(%)"} step={1}/>
                </div>
            </div>
            <div className="absolute bottom-7 right-7" data-testid="forward-fab">
                <Tooltip title="comparison stat" arrow>
                    <Fab variant="circular" color="inherit" component={Link}
                         to={`/stats?pDate=${pDate}&clientId=${clientId}`}
                         aria-label="add">
                        <ArrowForward/>
                    </Fab>
                </Tooltip>
            </div>
        </>
    );
}

function getYAxisTicks(comparisonDataWithRange): Array<number> {
    const highestYValue = comparisonDataWithRange[comparisonDataWithRange.length - 1].electricityCost;
    const lowestYValue = Math.min(...comparisonDataWithRange.map(item => item.solarCost));
    const roundedToLowerHundreds = Math.floor(lowestYValue/100)*100;
    const ticks = []
    for (let i = roundedToLowerHundreds; (i - 100) <= highestYValue; i += 100) {
        ticks.push(i);
    }
    return ticks;
}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false;
    }

    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
        return false;
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    const line1isHigher = y1 > y3;
    const line1isHigherNext = y2 > y4;

    return {x, y, line1isHigher, line1isHigherNext};
}

function LineLabel({x, y, stroke, value}) {
    return (
        <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} className='custom-label' textAnchor="middle">
            {value + "€"}
        </text>
    );
}

function formatYAxisTicks(value) {
    return value + '€';
}

function formatXAxisTicks(value) {
    return value + 2013;
}

const CustomizedDot = (props) => {
    const { cx, cy, stroke, payload, value } = props;

    if (payload.year % 5 === 0) {
        return (
            <svg x={cx - 4} y={cy - 4} width={8} height={8} fill="white">
                <g transform="translate(4 4)">
                    <circle r="4" fill={stroke} />
                    <circle r="2" fill="white" />
                </g>
            </svg>
        );
    }

    return null;
};