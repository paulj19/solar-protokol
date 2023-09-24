import styles from '@/src/stats/stats.module.css'
import { PredictionParams } from '@/types/types';
import { calcPredictions, calcTotalSaved } from '@/utils/ElectricityCostCalculator';

export default function TotalCostSavings(params: PredictionParams) {
    const totalSaved = calcTotalSaved(params);

    return (
        <div className={styles.totalCostSavings}>
            <span style={{ fontWeight: 300, fontSize: "x-large", margin: "0 auto" }}>Sie Sparen</span>
            <EuroCurrencyFormat value={totalSaved} />
        </div >
    );
}

function EuroCurrencyFormat(props) {
    const { value } = props;

    // Format the number as Euro currency with German formatting
    const formattedValue = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(value);

    return <span className={styles.savedAmount}>{formattedValue}</span>;
}
