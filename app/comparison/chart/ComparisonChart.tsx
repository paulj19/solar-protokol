'use client'

import React, { useState } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart } from 'recharts';
import { getComparisonData, getPredictedMonthlyTotalCost, getPredictedMonthlyUsageCost } from "@/utils/EnergyCostCalculator";
import { worker } from '@/mocks/browser'
import styles from './ComparisonChart.module.css'
import Slider from '../../components/Slider';
import { useGetClientParamsQuery, useGetPredictionParamsQuery } from '@/context/RootApi';
import Loading from '../../Loading';
import Link from 'next/link';

export default function ComparisonChart({ clientId }) {
    const [inflationRate, setInflationRate] = useState<number>(null)
    const [priceCurrentKwh, setPriceCurrentKwh] = useState<number>(null)
    const [showSloar, setShowSolar] = useState<boolean>(false);

    const { data: externParams, isLoading: isExternParamLoading, isError: isExternParamQueryError } = useGetPredictionParamsQuery(undefined);
    const { data: clientParams, isLoading: isClientParamLoading, isError: isClientParamQueryError } = useGetClientParamsQuery(clientId);
    let comparisonData
    //todo why undef rendered twice
    console.log("STATE", externParams, clientParams)
    let comparisonDataWithRange;

    if (isClientParamLoading || isExternParamLoading) {
        return <Loading />;
    }
    if (isExternParamQueryError) {
        //todo modal to enter params manually
    }
    if (isClientParamQueryError) {
        //todo modal to enter params manually
    }

    comparisonData = getComparisonData({ clientParams: { ...clientParams }, externPredictionParams: { inflationRate: inflationRate ?? externParams.inflationRate, priceCurrentKwh: priceCurrentKwh ?? externParams.priceCurrentKwh, priceEnpalMonthly: externParams.priceEnpalMonthly, priceBase: externParams.priceBase } });
    let xx = false;
    comparisonDataWithRange = comparisonData.reduce((acc, item, i, array) => {
        if (item.Ohne_PV >= item.Mit_Enpal) {
            if (i >= 1 && xx === false) {
                const intersectionResut = intersect(array[i - 1].year, array[i - 1].Mit_Enpal, item.year, item.Mit_Enpal, array[i - 1].year, array[i - 1].Ohne_PV, item.year, item.Ohne_PV);
                if (intersectionResut) {
                    const { x, y }: any = intersectionResut;
                    const intersection = { year: Math.floor(x), Ohne_PV: y, Mit_Enpal: y, range: [y, y] }
                    acc = acc.concat(intersection);
                    xx = true;
                }
            }
            const range = item.Ohne_PV !== undefined && item.Mit_Enpal !== undefined
                ? [item.Ohne_PV - 1, item.Mit_Enpal + 1]
                : [];
            item['range'] = range;
        }
        return acc.concat(item);
    }, []);

    return (
        <>
            <div className={styles.chartContainer}>
                <div className={styles.chart}>
                    <ResponsiveContainer className={styles.responseChart}>
                        {/* <LineChart */}
                        <ComposedChart
                            data={comparisonDataWithRange}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis ticks={[0, 100, 200, 300, 400, 500, 600, 700]} />
                            <Tooltip />
                            <defs>
                                <linearGradient id="splitColor">
                                    <stop offset="1" stopColor="#bff593" stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <Legend />
                            <Line type="linear" dataKey="Ohne_PV" stroke="#FF0000" strokeWidth={1.5} activeDot={{ r: 8 }} label={CustomizedLabel} />
                            <Line type="linear" dataKey="Mit_Enpal" stroke="#072543" strokeWidth={1.5} hide={!showSloar} label={CustomizedLabel} />
                            <Area type="linear" dataKey="range" fill="url(#splitColor)" hide={!showSloar} legendType='none' tooltipType='none' />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.toggle}>
                    <label className={styles.switch}>
                        <input type="checkbox" onChange={(e) => setShowSolar(e.target.checked)} />
                        <span className={styles.slider + " " + styles.round}></span>
                    </label>
                </div>
                <div className={styles.rangeSelectors}>
                    <Slider ticks={[0.03, 0.04, 0.05, 0.06, 0.07, 0.08]} onChangeHandler={setInflationRate} defaultValue={externParams.inflationRate} label={"inflation rate"} />
                    <Slider ticks={[0.30, 0.40, 0.50, 0.60, 0.70, 0.80]} onChangeHandler={setPriceCurrentKwh} defaultValue={externParams.priceCurrentKwh} label={"cost per kwh"} />
                </div>
                <Link href={'/comparison/stats/123'}> STATS </Link>
            </div >
        </>
    );
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

    return { x, y, line1isHigher, line1isHigherNext };
}

function CustomizedLabel({ x, y, stroke, value }) {
    return (
        <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} className='custom-label' textAnchor="middle">
            {value + "€"}
        </text>
    );
}