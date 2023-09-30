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
    ComposedChart
} from 'recharts';
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
import {ArrowForward} from "@mui/icons-material";

export default function SolarElecChart() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get('clientId');
    const pDate = searchParams.get('pDate');
    useEffect(() => {
        if (!clientId || !pDate) {
            navigate('/');
        }
    }, []);
    const [inflationRate, setInflationRate] = useState<number>(null)
    const [unitPrice, setUnitPrice] = useState<number>(null)
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

    const comparisonData: Array<CostPredictions> = calcPredictions({year: undefined, clientParams: {...clientParams, unitPrice: unitPrice ?? clientParams.unitPrice}, generalParams: {...generalParams, inflationRate: inflationRate ?? generalParams.inflationRate}});
    let xx = false;
    const comparisonDataWithRange = comparisonData.reduce((acc, item, i, array) => {
        if (i % 5 !== 0) {
            return acc;
        }
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
                            <XAxis dataKey="year"/>
                            <YAxis ticks={getYAxisTicks(comparisonDataWithRange)}/>
                            <Tooltip/>
                            <defs>
                                <linearGradient id="splitColor">
                                    <stop offset="1" stopColor="#bff593" stopOpacity={1}/>
                                </linearGradient>
                            </defs>
                            <Legend/>
                            <Line type="linear" dataKey="electricityCost" name="Ohne PV" stroke="#FF0000"
                                  strokeWidth={1.5} activeDot={{r: 8}} label={CustomizedLabel}/>
                            <Line type="linear" dataKey="solarCost" name="Mit Enpal" stroke="#072543" strokeWidth={1.5}
                                  hide={!showSolar} label={CustomizedLabel}/>
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
                <div className={styles.rangeSelectors} data-testid="inflation-unitPrice-slider">
                    <Slider ticks={[3, 4, 5, 6, 7, 8]} onChangeHandler={setInflationRate}
                            defaultValue={generalParams.inflationRate} label={"inflation rate(in %)"} step={1}/>
                    <Slider ticks={[0.30, 0.40, 0.50, 0.60, 0.70, 0.80]} onChangeHandler={setUnitPrice}
                            defaultValue={clientParams.unitPrice} label={"cost per kwh"} step={0.01}/>
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
    const ticks = [0, 100, 200, 300, 400, 500, 600, 700]
    for (let i = 800; (i - 100) <= highestYValue; i += 100) {
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

function CustomizedLabel({x, y, stroke, value}) {
    return (
        <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} className='custom-label' textAnchor="middle">
            {value + "€"}
        </text>
    );
}