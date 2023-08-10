import styles from '@/app/comparison/stats/stats.module.css'

export default function TotalCostSavings({ year }) {
    const savings = 102.345 + year * 17;
    return (
        <div className={styles.totalCostSavings}>
            <span style={{ fontWeight: 300, fontSize: "x-large", }}>Sie Sparen:</span>
            <span style={{ fontWeight: 500, fontSize: "xx-large", padding: 5 }}>{savings}€</span>
        </div >
    );
}