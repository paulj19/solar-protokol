import styles from '@/src/stats/stats.module.css'
import { PredictionParams } from '@/types/types';
import { calcPredictions, calcTotalSaved } from '@/utils/ElectricityCostCalculator';
import {getFormattedCost} from "@/src/stats/Stats";

export default function TotalCostSavings(params: PredictionParams) {
    const { totalSaved, totalElecCost, totalSolarCost } = calcTotalSaved(params);

    return (
        <>
            <span className="font-sans font-normal text-2xl tracking-wide text-cyan-900 m-auto p-3 text-title">ERSPARNIS INSGESAMT</span>
            <EuroCurrencyFormat totalSaved={totalSaved} />
        </ >
    );
}

function EuroCurrencyFormat({ totalSaved }) {
    if (totalSaved < 0) {
        return <span className={styles.savedAmount}>0€</span>;
    }

    return <span className={styles.savedAmount}>{getFormattedCost(totalSaved)}</span>;
}
