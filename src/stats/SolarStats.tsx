import styles from '@/src/stats/stats.module.css'
import { PredictionParams } from '@/types/types';
import { calcSolarCostMonthly } from '@/utils/ElectricityCostCalculator';

export default function SolarStats(params: PredictionParams) {
    return (
        <fieldset className={styles.fieldset}>
            <legend className={styles.headingLegend}>Mit Enpal</legend>
            <ElectricityCosts {...params} />
            {/* <div className={styles.costMonthly}>
                <div className={styles.costSolar}>{"Enpal monatlich"}</div>
                <div className={styles.costNumber}>{params.year < 20 ? params.externParams.priceEnpalMonthly + "€" : "0€"}</div>
            </div> */}

        </fieldset>
    )
}

function ElectricityCosts(params: PredictionParams) {
    const { rent, residualConsumptionCostMonthly, basePrice, feedInTariffMonthly, solarCost } = calcSolarCostMonthly(params);
    return (
        <div className={styles.costGrid}>
            <div className={styles.costHeading}>{"Ihre Neu Strom kosten:"}</div>
            <div className={styles.costSum}>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Grundpreis"}</div>
                    <div className={styles.costNumber}>{basePrice + "€"}</div>
                </div>
                <div className={styles.costAddition}>{"+"}</div>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Reststromkosten"}</div>
                    <div className={styles.costNumber}>{residualConsumptionCostMonthly + "€"}</div>
                </div>
                <div className={styles.costAddition}>{"+"}</div>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Enpal Miete"}</div>
                    <div className={styles.costNumber}>{rent + "€"}</div>
                </div>
                <div className={styles.costAddition}>{"-"}</div>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Einspeisevergütung"}</div>
                    <div className={styles.costNumber}>{feedInTariffMonthly + "€"}</div>
                </div>
                <div className={styles.costAddition}>{"="}</div>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Summe"}</div>
                    <div className={styles.costNumber}>{solarCost + "€"}</div>
                </div>
            </div>
        </div>
    )
}
