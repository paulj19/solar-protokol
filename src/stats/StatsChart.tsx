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
                    {/*//todo fix me*/}
                    <XAxis ticks={["Strom", "Solar"]}/>
                    {/* <YAxis ticks={[0, 50, 100, 150, 200, 250, 300, 350]} /> */}
                    {/*<YAxis/>*/}
                    {/*<Tooltip/>*/}
                    <Legend wrapperStyle={{bottom: 12}} formatter={value => <span
                        className="text-[#fff] opacity-70 tracking-wide">{value}</span>}/>
                    <defs>
                        <linearGradient id='stat-solar' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='20%' stopColor='rgb(var(--stats-chart-solar))'/>
                            <stop offset='90%' stopColor={'rgb(var(--stats-chart-solar))'}/>
                        </linearGradient>
                        <linearGradient id='stat-solar-negative' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='' stopColor='rgb(var(--stats-chart-solar))'/>
                            <stop offset='79%' stopColor={'rgb(var(--stats-chart-solar))'}/>
                        </linearGradient>
                        <linearGradient id='stat-elec' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='20%' stopColor="rgb(var(--stats-chart-elecShade))"/>
                            <stop offset='90%' stopColor="rgb(var(--stats-chart-elec))"/>
                        </linearGradient>
                    </defs>
                    <Bar dataKey="electricityCost" name={"OHNE ENPAL"} fill={`url(#stat-elec)`}
                         label={customLabel} radius={2}>
                        {getBarLabel("STROMRECHNUNG ALT")}
                    </Bar>
                    <Bar stackId="a" dataKey="electricityCostNew" name={"MIT ENPAL"} fill="#00a115"
                         legendType={'none'} radius={2}
                         label={props => solarCost < 0 ? customLabel({...props, value: totalSolarCost}) : null}
                    >
                        {electricityCostNew ? getBarLabel(`STROMRECHNUNG NEU ${electricityCostNew} €`, electricityCost < 10) : null}
                    </Bar>
                    <Bar stackId="a" dataKey="solarCost" name={"MIT ENPAL"} fill={solarCost >= 0 ?`url(#stat-solar)`: `url(#stat-solar-negative)`}
                         label={props => props.value > 0 ? customLabel(props) : null} radius={2}>
                        {solarCost !== 0 ? getBarLabel(`PV-Rate ${solarCost} €`, solarCost < 10 && solarCost > -50) : null}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
