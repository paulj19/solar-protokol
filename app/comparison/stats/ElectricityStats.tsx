import styles from '@/app/comparison/stats/stats.module.css'
import { PredictionParams } from '@/types/types';
import { calcElectricityCostMonthly, calcSolarCostMonthly } from '@/utils/ElectricityCostCalculator';

export function ElectricityStats(params: PredictionParams) {

    return (
        <fieldset className={styles.fieldset}>
            <legend className={styles.headingLegend}>Ohne Enpal</legend>
            <ElectricityCosts {...params} />
        </fieldset>
    )
}

function ElectricityCosts(params: PredictionParams) {
    const totalCost = calcElectricityCostMonthly(params);

    return (
        <div className={styles.costGrid}>
            <div className={styles.costHeading}>{"Ihre Strom kosten:"}</div>
            <div className={styles.costSum}>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Grundpreis"}</div>
                    <div className={styles.costNumber}>{params.clientParams.basePrice + "€"}</div>
                </div>
                <div className={styles.costAddition}>{"+"}</div>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Stromverbrauch"}</div>
                    <div className={styles.costNumber}>{totalCost - params.clientParams.basePrice + "€"}</div>
                </div>
                <div className={styles.costAddition}>{"="}</div>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Summe"}</div>
                    <div className={styles.costNumber}>{totalCost + "€"}</div>
                </div>
            </div>
        </div>
    )
}
