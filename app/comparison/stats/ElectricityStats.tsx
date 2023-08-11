import styles from '@/app/comparison/stats/stats.module.css'

export function ElectricityStats(params) {

    return (
        <fieldset className={styles.fieldset}>
            <legend className={styles.headingLegend}>Ohne Enpal</legend>
            <ElectricityCosts {...params} />
        </fieldset>
    )
}

function ElectricityCosts({ year, costPredicted, externParams: { priceBase } }) {
    const costMonthly = costPredicted[year].energyCostUsage;
    const costTotal = costPredicted[year].energyCostTotal;
    return (
        <div className={styles.costGrid}>
            <div className={styles.costHeading}>{"Ihre Strom kosten:"}</div>
            <div className={styles.costSum}>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Grundgebühr"}</div>
                    <div className={styles.costNumber}>{priceBase + "€"}</div>
                </div>
                <div className={styles.costAddition}>{"+"}</div>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Stromverbrauch"}</div>
                    <div className={styles.costNumber}>{costMonthly + "€"}</div>
                </div>
                <div className={styles.costAddition}>{"="}</div>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Summe"}</div>
                    <div className={styles.costNumber}>{costTotal + "€"}</div>
                </div>
            </div>
        </div>
    )
}
