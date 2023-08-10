import styles from '@/app/comparison/stats/stats.module.css'

export default function SolarStats({ year, costPredicted, externParams: { priceBase, priceEnpalMonthly }, clientParams: { surplus } }) {
    console.log("solar", costPredicted)
    const costSolarTotal = costPredicted[year].solarCostTotal;

    return (
        <div className="">
            <h1>Mit Enpal</h1>
            <div className=""><h2>{year < 20 ? priceEnpalMonthly + "€" : "0€"}</h2></div>
            <div className={styles.costSum}>
                <div className="cost-elements">
                    <p>Grundgebühr</p>
                    <p>{priceBase + "€"}</p>
                </div>
                <div className="cost-elements">
                    <p>Überschuss</p>
                    <p>{surplus + "€"}</p>
                </div>
                <div className="cost-elements">
                    <p>Summe</p>
                    <p>{costSolarTotal + "€"}</p>
                </div>
            </div>
        </div>
    )
}
