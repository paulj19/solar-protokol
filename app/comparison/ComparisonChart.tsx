'use client'

import React, { PureComponent, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart } from 'recharts';
import { fetchPredictionParams, fetchUserParams } from "@/api/comparisonParam";
import { getPredictedMonthlyTotalCost, getPredictedMonthlyUsageCost } from "@/utils/EnergyCostCalculator";
import { getTotalSolarCost } from "@/utils/SolarCostCalculator";
import { ComparisonContext } from '@/context/ComparisonParamProvider';
import { worker } from '@/mocks/browser'
import styles from './ComparisonChart.module.css'
import { ExternPredictionParams, PredictionParams, ClientPredictionParams } from '@/types/types';
import Slider from '../components/Slider';
import { it } from 'node:test';
const predictionPoints = [0, 5, 10, 15, 20, 25];


if (process.env.NODE_ENV === 'development') {
    worker.listen({ onUnhandledRequest: 'bypass' })
}

export default function ComparisonChart() {
    const [inflationRate, setInflationRate] = useState<number>(0)
    const [priceCurrentAvgKwh, setPriceCurrentKwh] = useState<number>(0)
    const [showSloar, setShowSolar] = useState<boolean>(false);

    const { state, comparisonContext }: any = useContext(ComparisonContext);
    let comparisonData
    console.log("STATE", state)

    useEffect(() => {
        const getPredictionParams = async (userId: number) => {
            const externPredictionParams: ExternPredictionParams = await fetchPredictionParams();
            const userSpecificParams: ClientPredictionParams = await fetchUserParams(userId);
            if (externPredictionParams && userSpecificParams) {
                const costPredicted = getPredictionCostsAllYears({ userSpecificParams, externPredictionParams });
                comparisonContext.initContext({ userSpecificParams: { ...userSpecificParams } as ClientPredictionParams, externPredictionParams: { ...externPredictionParams } as ExternPredictionParams, costPredicted });
                setInflationRate(externPredictionParams.inflationRate);
                setPriceCurrentKwh(externPredictionParams.priceCurrentAvgKwh);
            } else {
                // todo dialog to enter manually
            }
        }
        getPredictionParams(123);
    }, [])
    let off;
    let comparisonDataWithRange;
    if (state) {
        comparisonData = getComparisonData({ ...state, externPredictionParams: { inflationRate, priceCurrentAvgKwh, priceEnpalMonthly: state.externPredictionParams.priceEnpalMonthly, priceBase: state.externPredictionParams.priceBase } });
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
    }

    return (
        <>
            {state != null ?
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
                                {/* <YAxis ticks={[0, 50, 100, 150, 200, 250, 300, 350]} /> */}
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
                                {/* <Area type="monotone" dataKey="Mit_Enpal" stackId="2" stroke="#072543" fill='#fff' hide={!showSloar} /> */}
                                {/* <Line type="linear" dataKey="Mit_Enpal" stroke="#072543" hide={false} /> */}
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
                        <Slider ticks={[0.03, 0.04, 0.05, 0.06, 0.07, 0.08]} onChangeHandler={setInflationRate} defaultValue={inflationRate} label={"inflation rate"} />
                        <Slider ticks={[0.30, 0.40, 0.50, 0.60, 0.70, 0.80]} onChangeHandler={setPriceCurrentKwh} defaultValue={priceCurrentAvgKwh} label={"cost per kwh"} />
                    </div>
                </div >
                : null
            }
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

function getComparisonData(params) {
    let comparisonData = [];
    predictionPoints.forEach((i) => {
        const [energyCostUsage, energyCostTotal, solarCostTotal] = getPredictedCosts({ year: i, ...params });
        comparisonData.push({ year: i + 2013, Ohne_PV: energyCostTotal, Mit_Enpal: solarCostTotal })
    });
    return comparisonData;
}

function getPredictionCostsAllYears(params) {
    let costPredictedAllYears = {};
    predictionPoints.forEach((i) => {
        const predictedCosts = getPredictedCosts({ year: i, ...params });
        costPredictedAllYears = Object.assign({ [i]: { ...predictedCosts } }, costPredictedAllYears);
    });
    return costPredictedAllYears;
}

function getPredictedCosts(params) {
    const predictedMonthlyUsageCost = getPredictedMonthlyUsageCost(params);
    const predictedMonthlyTotalCost = getPredictedMonthlyTotalCost(params, predictedMonthlyUsageCost);
    const solarCostTotal = getTotalSolarCost(params);
    return [predictedMonthlyUsageCost, predictedMonthlyTotalCost, solarCostTotal];
}
