import styles from '@/src/stats/stats.module.css'
import {PredictionParams} from '@/types/types';
import {calcElectricityCostMonthly, calcSolarCostMonthly, calcTotalSaved} from '@/utils/ElectricityCostCalculator';
import {
    XAxis,
    BarChart,
    Bar,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
    Label, Text
} from 'recharts';
import {getBarLabel, customLabel} from "@/src/stats/Stats";
import React from "react";

export default function CumStatsChart(params: PredictionParams) {
    const {totalElecCost, totalSolarCost} = calcTotalSaved(params);
    const selectedYear = params.year + new Date().getFullYear();
    return (
        <div className="min-w-[400px]" data-testid="comparisonStats-chart">
            < ResponsiveContainer>
                <BarChart
                    data={[{totalElecCost, totalSolarCost}]}
                    margin={{
                        top: 20,
                        right: 10,
                        left: 10,
                    }}
                >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis ticks={["Strom"]}/>
                    {/* <YAxis ticks={[0, 50, 100, 150, 200, 250, 300, 350]} /> */}
                    {/* <Tooltip /> */}
                    <Legend wrapperStyle={{bottom: 12}} formatter={value => <span
                        className="text-[#fff] opacity-70 tracking-wide">{value}</span>}/>
                    <defs>
                        <linearGradient id='stat-solar' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='20%' stopColor='rgb(var(--color-bar))'/>
                            <stop offset='90%' stopColor={'rgb(var(--stats-chart-solar))'}/>
                        </linearGradient>
                        <linearGradient id='stat-elec' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='20%' stopColor="rgb(var(--stats-chart-elecShade))"/>
                            <stop offset='90%' stopColor="rgb(var(--stats-chart-elec))"/>
                        </linearGradient>
                    </defs>
                    <Bar dataKey="totalElecCost" name={"OHNE ENPAL"} fill={`url(#stat-elec)`}
                         label={customLabel} radius={2}>
                        {getBarLabel(`GESAMTKOSTEN BIS ${selectedYear} OHNE SOLAR`)}
                    </Bar>
                    <Bar stackId="a" dataKey="totalSolarCost" name={"MIT ENPAL"} fill={`url(#stat-solar)`}
                         label={customLabel} radius={2}>
                        {getBarLabel(`GESAMTKOSTEN BIS ${selectedYear} MIT SOLAR`)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
