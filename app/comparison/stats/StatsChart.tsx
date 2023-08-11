import styles from '@/app/comparison/stats/stats.module.css'
import { XAxis, BarChart, Bar, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    const radius = 10;
    console.log("PROPS", props)

    return (
        <g>
            <text x={x + width / 2} y={y - radius} fill="#000" textAnchor="middle" style={{ fontWeight: 500 }}>
                {value + "€"}
            </text>
        </g>
    );
};
export default function ComparisonstatsChart({ year, costPredicted }) {
    const energyCost = costPredicted[year].energyCostTotal;
    const solarCost = costPredicted[year].solarCostTotal;
    return (
        <div className={styles.statsChart}>
            <ResponsiveContainer >
                <BarChart
                    data={[{ energyCost, solarCost }]}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis ticks={["Strom", "Solar"]} />
                    {/* <YAxis ticks={[0, 50, 100, 150, 200, 250, 300, 350]} /> */}
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="energyCost" name={"ohne enpal"} fill="#7ad3ff" label={renderCustomizedLabel} />
                    <Bar dataKey="solarCost" name={"mit enpal"} fill="#82ca9d" label={renderCustomizedLabel} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
