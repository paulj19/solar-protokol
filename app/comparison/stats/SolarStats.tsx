import styles from '@/app/comparison/stats/stats.module.css'

export default function SolarStats(params) {
    return (
        <fieldset className={styles.fieldset}>
            <legend className={styles.headingLegend}>Mit Enpal</legend>
            <ElectricityCosts {...params} />
            <div className={styles.costMonthly}>
                <div className={styles.costSolar}>{"Enpal monatlich"}</div>
                <div className={styles.costNumber}>{params.year < 20 ? params.externParams.priceEnpalMonthly + "€" : "0€"}</div>
            </div>

        </fieldset>
    )
}

function ElectricityCosts({ year, costPredicted, externParams: { priceBase }, clientParams: { surplus } }) {
    const costSolarTotal = costPredicted[year].solarCostTotal;

    return (
        <div className={styles.costGrid}>
            <div className={styles.costHeading}>{"Ihre Neu Strom kosten:"}</div>
            <div className={styles.costSum}>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Grundgebühr"}</div>
                    <div className={styles.costNumber}>{priceBase + "€"}</div>
                </div>
                <div className={styles.costAddition}>{"+"}</div>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Überschuss"}</div>
                    <div className={styles.costNumber}>{surplus + "€"}</div>
                </div>
                <div className={styles.costAddition}>{"="}</div>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Summe"}</div>
                    <div className={styles.costNumber}>{costSolarTotal + "€"}</div>
                </div>
            </div>
        </div>
    )
}

