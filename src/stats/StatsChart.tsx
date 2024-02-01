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
    const maxElecCost = calcMaxElecCost({...params, year: params.generalParams.yearLimitPrediction});
    const maxSolarFeedIn = calcMaxSolarFeedInGen({...params, year: params.generalParams.yearLimitPrediction});
    return (
        <div className="min-w-[400px]" data-testid="stats-chart">
            <ResponsiveContainer>
                <BarChart
                    data={[{electricityCost, electricityCostNew, solarCost, rent}]}
                    margin={{
                        right: 10,
                        left: 10,
                        bottom: 20,
                        top: 20
                    }}
                    stackOffset="sign"
                >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    {/*//todo fix me*/}
                    {/*<XAxis />*/}
                    <YAxis ticks={getYAxisTicks(maxElecCost, maxSolarFeedIn)} domain={["dataMin", "dataMax"]} hide={true}/>
                    {/*<YAxis/>*/}
                    {/*<Tooltip/>*/}
                    <Legend wrapperStyle={{bottom: 12}} formatter={value => <span
                        className="text-statsBarLabel opacity-70 tracking-wide ">{value}</span>}/>
                    <defs>
                        <linearGradient id='stat-solar' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='20%' stopColor='rgb(var(--stats-bar-solar))'/>
                            <stop offset='90%' stopColor={'rgb(var(--stats-bar-solar))'}/>
                        </linearGradient>
                        <linearGradient id='stat-solar-negative' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='' stopColor='rgb(var(--stats-bar-solar))'/>
                            <stop offset='79%' stopColor={'rgb(var(--stats-bar-solar))'}/>
                        </linearGradient>
                        <linearGradient id='stat-elec' gradientTransform="rotate(90)" spreadMethod='reflect'>
                            <stop offset='20%' stopColor="rgb(var(--stats-bar-elecShade))"/>
                            <stop offset='90%' stopColor="rgb(var(--stats-bar-elec))"/>
                        </linearGradient>
                    </defs>
                    <Bar dataKey="electricityCost" name={"OHNE ENPAL"} fill={`url(#stat-elec)`}

                         label={customLabel} radius={2}>
                        {getBarLabel("STROMRECHNUNG ALT")}
                    </Bar>
                    <Bar stackId="a" dataKey="electricityCostNew" name={"MIT ENPAL"} fill="rgb(var(--stats-bar-elec-new))"
                         legendType={'none'} radius={2}
                         label={props => solarCost < 0 ? customLabel({...props, value: totalSolarCost}) : null}
                    >
                        {electricityCostNew ? getBarLabel(`STROMRECH. NEU`) : null}
                        {electricityCostNew ? getBarLabelCost(`${electricityCostNew} €`) : null}
                    </Bar>
                    <Bar stackId="a" dataKey="solarCost" name={"MIT ENPAL"}
                         fill={"rgb(var(--statsChart-solarCost))"}
                         label={props => props.value > 0 ? customLabel({...props, value: totalSolarCost}) : null}
                         radius={2}>
    <LabelList position={"insideTop"} fill={"rgb(var(--stats-bar-label))"}
                                     className="font-sans font-medium tracking-wide whitespace-pre-line"
                                     style={{paddingLeft: "5px", textOverflow: "visible", whiteSpace: "pre-line"}}>{solarCost > 0 ? `ENPAL\n MONATL. RATE ${rent} €`:  `RATE ${rent} €`}</LabelList>
    <LabelList position={solarCost > 0 ? "center": "insideBottom"} fill={"rgb(var(--stats-bar-label))"}
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
