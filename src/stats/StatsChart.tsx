import styles from '@/src/stats/stats.module.css'
import { PredictionParams } from '@/types/types';
import { calcElectricityCostMonthly, calcSolarCostMonthly } from '@/utils/ElectricityCostCalculator';
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
import Stats, {getBarLabel, renderCustomizedLabel} from "@/src/stats/Stats";

export default function StatsChart(params: PredictionParams) {
    const electricityCost = calcElectricityCostMonthly(params);
    const { basePrice, residualConsumptionCostMonthly, rent, feedInTariffMonthly } = calcSolarCostMonthly(params);

    const electricityCostNew = basePrice + residualConsumptionCostMonthly;
    const solarCost = rent - feedInTariffMonthly;
    return (
        <div className="min-w-[400px]" data-testid="comparisonStats-chart">
            <ResponsiveContainer>
                <BarChart
                    data={[{ electricityCost, electricityCostNew, solarCost }]}
                    margin={{
                        top: 20,
                        right: 10,
                        left: 10,
                    }}
                >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis ticks={["Strom", "Solar"]} />
                    {/* <YAxis ticks={[0, 50, 100, 150, 200, 250, 300, 350]} /> */}
                    <Tooltip />
                     <Legend />
                    <Bar dataKey="electricityCost" name={"ohne enpal"} fill="rgb(var(--stats-chart-elec))" label={renderCustomizedLabel} radius={2}>
                        {getBarLabel("STROMRECHNUNG ALT")}
                    </Bar>
                        <Bar stackId="a" dataKey="electricityCostNew" name={"mit enpal"} fill="rgb(var(--stats-chart-elec))" label={renderCustomizedLabel}  radius={2}>
                        {getBarLabel(`STROMRECHNUNG NEU ${electricityCostNew} €`)}
                    </Bar>
                    <Bar stackId="a" dataKey="solarCost" name={"mit enpal"} fill="rgb(var(--stats-chart-solar))" label={renderCustomizedLabel} radius={2}>
                        {getBarLabel(`ENPAL KOMPLETTLÖSUNG ${solarCost} €`)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div >
    );
}
