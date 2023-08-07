import { ComparisonContext } from "@/context/ComparisonParamProvider";
import { useContext } from "react";

export function ElectricityStats({ year }) {
    const { state }: any = useContext(ComparisonContext);
    const priceBase = state.priceBase;
    const costMonthly = state.costPredicted[year].energyCostUsage;
    const costTotal = state.costPredicted[year].energyCostTotal;
    return (
        <div className="energy-price-prediction">
            <div className=""><h1>{year === 1 ? `Ihre akutall Stromkosten` : `Ihre Strom kosten nach ${year} jahr: `}</h1></div>
            <div className="cost-sum">
                <div className="cost-elements">
                    <p>Grundgebühr</p>
                    <p>{priceBase + "€"}</p>
                </div>
                <div className="cost-elements">
                    <p>Stromverbrauch</p>
                    <p>{costMonthly + "€"}</p>
                </div>
                <div className="cost-elements">
                    <p>Summe</p>
                    <p>{costTotal + "€"}</p>
                </div>
            </div>
        </div>
    )
}
