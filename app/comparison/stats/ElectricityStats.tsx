import { getPredictionCostsAllYears } from "@/utils/EnergyCostCalculator";
import styles from '@/app/comparison/stats/stats.module.css'

export function ElectricityStats({ year, costPredicted, externParams: { priceBase } }) {
    const costMonthly = costPredicted[year].energyCostUsage;
    const costTotal = costPredicted[year].energyCostTotal;

    console.log("elecSTATS", costPredicted)
    return (
        <div>
            <div className=""><h1>{year === 1 ? `Ihre akutall Stromkosten` : `Ihre Strom kosten nach ${year} jahr: `}</h1></div>
            <div className={styles.costSum}>
                <div className={styles.costElements}>
                    <p>Grundgebühr</p>
                    <p>{priceBase + "€"}</p>
                </div>
                <div className={styles.costElements}>
                    <p>Stromverbrauch</p>
                    <p>{costMonthly + "€"}</p>
                </div>
                <div className={styles.costElements}>
                    <p>Summe</p>
                    <p>{costTotal + "€"}</p>
                </div>
            </div>
        </div>
    )
}
