import styles from '@/src/stats/stats.module.css'
import { PredictionParams } from '@/types/types';
import { calcPredictions, calcTotalSaved } from '@/utils/ElectricityCostCalculator';

export default function TotalCostSavings(params: PredictionParams) {
    const {totalSaved, totalElecCost, totalSolarCost} = calcTotalSaved(params);

    return (
        <>
            <span className="font-sans font-normal text-2xl tracking-wide text-cyan-900 m-auto p-2">Sie Sparen</span>
            <EuroCurrencyFormat value={totalSaved} />
        </ >
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
