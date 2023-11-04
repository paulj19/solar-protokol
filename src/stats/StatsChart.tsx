import styles from '@/src/stats/stats.module.css'
import {PredictionParams} from '@/types/types';
import {
    calcElectricityCostMonthly,
    calcMaxElecCost,
    calcMaxSolarFeedInGen,
    calcSolarCostMonthly
} from '@/utils/ElectricityCostCalculator';
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
import Stats, {getBarLabel, customLabel, getBarLabelCost} from "@/src/stats/Stats";
import React from "react";

export default function StatsChart(params: PredictionParams) {
    const electricityCost = calcElectricityCostMonthly(params);
    const {basePrice, residualConsumptionCostMonthly, rent, feedInTariffMonthly, solarCost: totalSolarCost} = calcSolarCostMonthly(params);

    const electricityCostNew = basePrice + residualConsumptionCostMonthly;
    const solarCost = rent - feedInTariffMonthly;
    const maxElecCost = calcMaxElecCost({...params, year: 25});
    const maxSolarFeedIn = calcMaxSolarFeedInGen({...params, year: 25});
    console.log("totalSolar", totalSolarCost)
    return (
        <div className="min-w-[400px]" data-testid="comparisonStats-chart">
            <ResponsiveContainer>
                <BarChart
                    data={[{electricityCost, electricityCostNew, solarCost, rent}]}
                    margin={{
                        right: 10,
                        left: 10,
                        bottom: 20
                    }}
                    stackOffset="sign"
                >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    {/*//todo fix me*/}
                    {/*<XAxis />*/}
                    <YAxis ticks={getYAxisTicks(maxElecCost, maxSolarFeedIn)} domain={["dataMin", "dataMax"]} hide={true} />
                    {/*<YAxis/>*/}
                    {/*<Tooltip/>*/}
                    <Legend wrapperStyle={{bottom: 12}} formatter={value => <span
                        className="text-[#fff] opacity-70 tracking-wide ">{value}</span>}/>
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
                        <linearGradient id='stat-rent' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='20%' stopColor={"#0d7a34"}/>
                            <stop offset='90%' stopColor="rgb(var(--stats-chart-solar))"/>
                        </linearGradient>
                    </defs>
                    <Bar dataKey="electricityCost" name={"OHNE ENPAL"} fill={`url(#stat-elec)`}
                         label={customLabel} radius={2}>
                        {getBarLabel("STROMRECHNUNG ALT")}
                    </Bar>
                    <Bar stackId="a" dataKey="electricityCostNew" name={"MIT ENPAL"} fill="#0d7a34"
                         legendType={'none'} radius={2}
                         label={props => solarCost < 0 ? customLabel({...props, value: totalSolarCost}) : null}
                    >
                        {electricityCostNew ? getBarLabel(`STROMRECH. NEU`) : null}
                        {electricityCostNew ? getBarLabelCost(`${electricityCostNew} €`) : null}
                    </Bar>
                    <Bar stackId="a" dataKey="solarCost" name={"MIT ENPAL"}
                         fill={"#1fa24e"}
                         label={props => props.value > 0 ? customLabel({...props, value: totalSolarCost}) : null}
                         radius={2}>
    <LabelList position={"insideTop"} fill={"rgb(243 244 246)"}
                                     className="font-sans font-medium tracking-wide whitespace-pre-line"
                                     style={{paddingLeft: "5px", textOverflow: "visible", whiteSpace: "pre-line"}}>{solarCost > 0 ? `ENPAL\n MONATL. RATE ${rent} €`:  `RATE ${rent} €`}</LabelList>
    <LabelList position={solarCost > 0 ? "center": "insideBottom"} fill={"rgb(243 244 246)"}
                                     className="font-sans font-medium tracking-wide whitespace-pre-line"
                                     style={{paddingLeft: "5px", textOverflow: "visible", whiteSpace: "pre-line"}}>{solarCost > 0 ? `EINSPEISE-\nVERGÜTUNG${-1 * feedInTariffMonthly} €` : `EV${-1 * feedInTariffMonthly}€` }</LabelList>
                        {solarCost !== 0 ? getBarLabelCost(`${solarCost} €`) : null}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function getYAxisTicks(maxElecCost, maxFeedIn): Array<number> {
    const ticks = []
    // const roundedMaxFeedIn = year === 0 ? Math.round(solarCost / -10) * -10: Math.round(maxFeedIn / -10) * -10;
    const roundedMaxFeedIn = Math.round(maxFeedIn / -10) * -10;
    for (let i = 0; (i - 50) <= maxElecCost; i += 50) {
        ticks.push(i);
    }
    return ticks;
}

const BarWithBorder = (borderHeight, borderColor) => {
    return (props) => {
        const { fill, x, y, width, height } = props;
        return (
            <g>
                <rect x={x} y={y} width={width} height={height} stroke="none" fill={fill} />
                <rect x={x} y={y} width={width} height={borderHeight} stroke="none" fill={borderColor} />
            </g>
        );
    };
};

                    // <Bar stackId="a" dataKey="rent" name={"MIT ENPAL"}
                    //      fill={`url(#stat-rent)`}
                    //      legendType='none'
                    //      label={props => props.value > 0 ? customLabel({...props, value: totalSolarCost}) : null}
                    //     // shape={BarWithBorder(3, "#ff0000")}
                    //      radius={2}>
                    // </Bar>
