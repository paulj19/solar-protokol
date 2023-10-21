import styles from '@/src/stats/stats.module.css'
import {PredictionParams} from '@/types/types';
import {calcElectricityCostMonthly, calcSolarCostMonthly} from '@/utils/ElectricityCostCalculator';
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
import Stats, {getBarLabel, customLabel} from "@/src/stats/Stats";
import React from "react";

export default function StatsChart(params: PredictionParams) {
    const electricityCost = calcElectricityCostMonthly(params);
    const {basePrice, residualConsumptionCostMonthly, rent, feedInTariffMonthly, solarCost: totalSolarCost} = calcSolarCostMonthly(params);

    const electricityCostNew = basePrice + residualConsumptionCostMonthly;
    const solarCost = rent - feedInTariffMonthly;
    return (
        <div className="min-w-[400px]" data-testid="comparisonStats-chart">
            <ResponsiveContainer>
                <BarChart
                    data={[{electricityCost, electricityCostNew, solarCost}]}
                    margin={{
                        top: 23,
                        right: 10,
                        left: 10,
                    }}
                    stackOffset="sign"
                >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis ticks={["Strom", "Solar"]}/>
                    {/* <YAxis ticks={[0, 50, 100, 150, 200, 250, 300, 350]} /> */}
                    {/*<Tooltip/>*/}
                    <Legend wrapperStyle={{bottom: 12}} formatter={value => <span
                        className="text-[rgba(var(--color-title))] opacity-70 tracking-wide">{value}</span>}/>
                    <defs>
                        <linearGradient id='stat-solar' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='20%' stopColor='rgb(var(--color-bar))'/>
                            <stop offset='90%' stopColor={'rgb(var(--stats-chart-solar))'}/>
                        </linearGradient>
                        <linearGradient id='stat-solar-negative' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='' stopColor='rgb(var(--color-bar))'/>
                            <stop offset='79%' stopColor={'rgb(var(--stats-chart-solar))'}/>
                        </linearGradient>
                        <linearGradient id='stat-elec' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='20%' stopColor="rgb(var(--stats-chart-elecShade))"/>
                            <stop offset='90%' stopColor="rgb(var(--stats-chart-elec))"/>
                        </linearGradient>
                    </defs>
                    <Bar dataKey="electricityCost" name={"Ohne Enpal"} fill={`url(#stat-elec)`}
                         label={customLabel} radius={2}>
                        {getBarLabel("Stromrechnung Alt")}
                    </Bar>
                    <Bar stackId="a" dataKey="electricityCostNew" name={"Mit Enpal"} fill="rgb(var(--stats-chart-elec))"
                         legendType={'none'} radius={2}
                         label={props => solarCost < 0 ? customLabel({...props, value: totalSolarCost}) : null}
                    >
                        {electricityCostNew ? getBarLabel(`Stromrechnung Neu ${electricityCostNew} €`) : null}
                    </Bar>
                    <Bar stackId="a" dataKey="solarCost" name={"Mit Enpal"} fill={solarCost >= 0 ?`url(#stat-solar)`: `url(#stat-solar-negative)`}
                         label={props => props.value > 0 ? customLabel(props) : null} radius={2}>
                        {getBarLabel(`Enpal Komplettlösung ${solarCost} €`)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
