'use client'

import React, { PureComponent, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchPredictionParams, fetchUserParams } from "@/api/comparisonParam";
import { getPredictedMonthlyTotalCost, getPredictedMonthlyUsageCost } from "@/utils/EnergyCostCalculator";
import { getTotalSolarCost } from "@/utils/SolarCostCalculator";
import { ComparisonContext } from '@/context/ComparisonParamProvider';
import { worker } from '@/mocks/browser'
import styles from './ComparisonChart.module.css'
import { ExternPredictionParams, PredictionParams, UserSpecificParams } from '@/types/types';

if (process.env.NODE_ENV === 'development') {
    worker.listen({ onUnhandledRequest: 'bypass' })
}
const predictionPoints = [0, 5, 10, 15, 20, 25];

export default function ComparisonChart() {
    const [year, setYear] = useState<number>(0)
    const [inflationRate, setInflationRate] = useState<number>(0)
    const [priceBase, setPriceBase] = useState<number>(0)
    const [priceCurrentAvgKwh, setPriceCurrentKwh] = useState<number>(0)
    const [showSloar, setShowSolar] = useState<boolean>(false);

    const { state, comparisonContext }: any = useContext(ComparisonContext);
    let comparisonData;

    useEffect(() => {
        const getPredictionParams = async (userId: number) => {
            const externPredictionParams: ExternPredictionParams = await fetchPredictionParams();
            const userSpecificParams: UserSpecificParams = await fetchUserParams(userId);
            if (externPredictionParams && userSpecificParams) {
                const costPredicted = getPredictionCostsAllYears({ userSpecificParams, externPredictionParams });
                comparisonContext.initContext({ userSpecificParams: { ...userSpecificParams } as UserSpecificParams, externPredictionParams: { ...externPredictionParams } as ExternPredictionParams, costPredicted });
                setInflationRate(externPredictionParams.inflationRate);
                setPriceBase(externPredictionParams.priceBase);
                setPriceCurrentKwh(externPredictionParams.priceCurrentAvgKwh);
            } else {
                // todo dialog to enter manually
            }
        }
        getPredictionParams(123);
    }, [])

    if (state) {
        comparisonData = getComparisonData({ ...state, externPredicitonParams: { inflationRate, priceBase, priceCurrentAvgKwh } });
    }

    return (
        <>
            {state != null ?
                <div className={styles.chartContainer}>
                    <div className={styles.chart}>
                        <ResponsiveContainer className={styles.responseChart}>
                            <LineChart
                                data={comparisonData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis ticks={[0, 50, 100, 150, 200, 250, 300, 350]} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Ohne_PV" stroke="#FF0000" activeDot={{ r: 8 }} label={CustomizedLabel} />
                                <Line type="monotone" dataKey="Mit_Enpal" stroke="#072543" hide={!showSloar} label={CustomizedLabel} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.toggle}>
                        <label className={styles.switch}>
                            <input type="checkbox" onChange={(e) => setShowSolar(e.target.checked)} />
                            <span className={styles.slider + " " + styles.round}></span>
                        </label>
                    </div>
                </div >
                : null
            }
        </>
    );
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
        const [energyCostUsage, energyCostTotal, solarCostTotal] = getPredictedCosts({ year: i, ...params });
        costPredictedAllYears = Object.assign({ [i]: { ...getPredictedCosts({ year: i, ...params }) } }, costPredictedAllYears);
    });
    return costPredictedAllYears;
}

function getPredictedCosts(params) {
    const predictedMonthlyUsageCost = getPredictedMonthlyUsageCost(params);
    const predictedMonthlyTotalCost = getPredictedMonthlyTotalCost(params, predictedMonthlyUsageCost);
    const solarCostTotal = getTotalSolarCost(params);
    return [predictedMonthlyUsageCost, predictedMonthlyTotalCost, solarCostTotal];
}
