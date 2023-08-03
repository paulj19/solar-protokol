'use client'

import React, { PureComponent, useContext, useEffect, useReducer, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchPredictionParams, fetchUserParams } from "@/api/comparisonParam";
import { getPredictedMonthlyTotalCost, getPredictedMonthlyUsageCost } from "@/utils/EnergyCostCalculator";
import { getTotalSolarCost } from "@/utils/SolarCostCalculator";
import { ComparisonContext } from '@/context/ComparisonParamProvider';
import { worker } from '@/mocks/browser'
import styles from './ComparisonChart.module.css'

if (process.env.NODE_ENV === 'development') {
    worker.listen({ onUnhandledRequest: 'bypass' })
}

export default function ComparisonChart() {
    const [showSloar, setShowSolar] = useState<boolean>(false);
    const [year, setYear] = useState(0)
    const { state, comparisonContext }: any = useContext(ComparisonContext);

    useEffect(() => {
        const getPredictionParams = async (userId: number) => {
            const predictionParams = await fetchPredictionParams();
            const userSpecificParams = await fetchUserParams(userId);
            let costPredictedAllYears = {};
            if (predictionParams && userSpecificParams) {
                for (let i = 0; i <= 25; i += 5) {
                    const predictedMonthlyUsageCost = getPredictedMonthlyUsageCost({ year: i, userSpecificParams, predictionParams });
                    const predictedMonthlyTotalCost = getPredictedMonthlyTotalCost({ year: i, userSpecificParams, predictionParams }, predictedMonthlyUsageCost);
                    const solarCostTotal = getTotalSolarCost({ year: i, userSpecificParams, predictionParams });
                    costPredictedAllYears = Object.assign({ [i]: { energyCostUsage: predictedMonthlyUsageCost, energyCostTotal: predictedMonthlyTotalCost, solarCostTotal: solarCostTotal } }, costPredictedAllYears);
                }
                comparisonContext.initContext({ ...predictionParams, ...userSpecificParams, costPredicted: costPredictedAllYears })
            } else {
                // todo dialog to enter manually
            }
        }
        getPredictionParams(123);
    }, [])

    let comparisonData = [];
    if (state) {
        for (let i = 0; i <= 25; i += 5) {
            comparisonData.push({ year: i + 2013, Ohne_PV: state.costPredicted[i].energyCostTotal, Mit_Enpal: state.costPredicted[i].solarCostTotal })
        }
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