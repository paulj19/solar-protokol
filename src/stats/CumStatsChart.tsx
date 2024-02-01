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
//todo definition of ineffi
    const {totalElecCost, totalSolarCost} = calcTotalSaved(params);
    const {totalElecCost: elecTotal, totalSolarCost: solarTotal} = calcTotalSaved({
        ...params,
        year: params.generalParams.yearLimitPrediction
    });
    const selectedYear = params.year + new Date().getFullYear();
    return (
        <div className="min-w-[400px] h-full self-end" data-testid="cum-chart">
            <ResponsiveContainer>
                <BarChart
                    data={[{totalElecCost, totalSolarCost}]}
                    margin={{
                        right: 10,
                        left: 10,
                        bottom: 20,
                        top: 33
                    }}
                >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <YAxis ticks={getYAxisTicks(elecTotal)} domain={["dataMin", "dataMax"]} hide={true}/>
                    {/* <Tooltip /> */}
                    <Legend wrapperStyle={{bottom: 12}} formatter={value => <span
                        className="text-cumLabelCost opacity-70 tracking-wide">{value}</span>}/>
                    <defs>
                        <linearGradient id='stat-solar-total' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='20%' stopColor={"rgb(var(--cumStats-bar-solar))"}/>
                            <stop offset='90%' stopColor="rgb(var(--stats-bar-solar))"/>
                        </linearGradient>
                        <linearGradient id='stat-elec' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='20%' stopColor="rgb(var(--stats-bar-elecShade))"/>
                            <stop offset='90%' stopColor="rgb(var(--stats-bar-elec))"/>
                        </linearGradient>
                    </defs>
                    <Bar dataKey="totalElecCost" name={"OHNE ENPAL"} fill={`url(#stat-elec)`}
                         label={customLabel} radius={2}>
                        {getBarLabel(`GESAMTKOSTEN BIS ${selectedYear} OHNE SOLAR`, (totalElecCost / elecTotal) < 0.15)}
                    </Bar>
                    <Bar dataKey="totalSolarCost" name={"MIT ENPAL"} fill={`url(#stat-solar-total)`}
                         label={customLabel} radius={2}>
                        {getBarLabel(`GESAMTKOSTEN BIS ${selectedYear} MIT SOLAR`, (totalSolarCost / solarTotal) < 0.21)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function getYAxisTicks(savedElecTotal): Array<number> {
    const ticks = []
    for (let i = 0; (i - 1000) <= savedElecTotal; i += 1000) {
        ticks.push(i);
    }
    return ticks;
}
