import {Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis} from "recharts";
import React from "react";
import {CostPredictions} from "@/types/types";
import {format} from "date-fns";

export default function ElecBarChart({comparisonData}:{comparisonData: Array<CostPredictions>}) {
    function XAxisTickFormatter(value, index) {
        return (index % 2 === 0) ? value + Number(format(new Date, 'yyyy')) : ""
    }

    //todo on hover show the value in the bar
    return (
        <>
            <h1 className="font-bold text-3xl font-sans text-cyan-900 m-auto pb-2">IHRE MONATLICHE STROMRECHNUNG IN DER ZUKUNFT OHNE SOLAR</h1>
            <div data-testid="elecBarChart">
                <ResponsiveContainer width="100%" height={750}>
                    <BarChart
                        data={comparisonData}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid stroke="#000000" vertical={false} strokeWidth={0.1} strokeOpacity={1}/>
                        <XAxis dataKey="year" tick={{fill: '#1c6b02'}} tickFormatter={XAxisTickFormatter} tickLine={false}/>
                        <YAxis axisLine={false} tick={{fill: '#1c6b02'}} tickLine={false}
                               tickMargin={15} ticks={getYAxisTicks(comparisonData)} tickFormatter={(value, index) => `${value} €`}/>
                        {/*<Tooltip/>*/}
                        <Bar dataKey="electricityCost" barSize={30} fill="#071730" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

function getYAxisTicks(comparisonData: Array<CostPredictions>): Array<number> {
    const highestYValue = Math.max(...comparisonData.map(item => item.electricityCost));
    const ticks = []
    for (let i = 0; (i - 100) < highestYValue; i += 50) {
        ticks.push(i);
    }
    return ticks;
}
const renderCustomizedLabel = (props) => {
    const { x, y, width, value } = props;
    const radius = 10;

    return (
        <g>
            <text x={x + width / 2} y={y - radius} fill="rgb(22 78 99 / var(--tw-text-opacity))" textAnchor="middle" className="font-serif text-sm font-md">
                {value + "€"}
            </text>
        </g>
    );
};
