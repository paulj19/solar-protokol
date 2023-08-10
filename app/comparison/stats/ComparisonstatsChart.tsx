import { useContext } from "react";
import { XAxis, BarChart, Bar, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ComparisonstatsChart({ year, costPredicted }) {
    const energyCost = costPredicted[year].energyCostTotal;
    const solarCost = costPredicted[year].solarCostTotal;
    return (
        <div className="price-comparison-bar-chart">
            <ResponsiveContainer width="100%" height="100%">

                <BarChart
                    width={500}
                    height={300}
                    data={[{ energyCost, solarCost }]}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis ticks={["Strom", "Solar"]} />
                    <YAxis ticks={[0, 50, 100, 150, 200, 250, 300, 350]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="energyCost" name={"ohne enpal"} fill="#7ad3ff" />
                    <Bar dataKey="solarCost" name={"mit enpal"} fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
