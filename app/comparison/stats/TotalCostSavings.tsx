import styles from '@/app/comparison/stats/stats.module.css'

export default function TotalCostSavings({ year }) {
    const savings = 102.345 + year * 17;
    return (
        <div className={styles.totalCostSavings}>
            <span style={{ fontWeight: 300, fontSize: "x-large", margin: "0 auto" }}>Sie Sparen</span>
            <span className={styles.savedAmount}>{savings}€</span>
        </div >
    );
}