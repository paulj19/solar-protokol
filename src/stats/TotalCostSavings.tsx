import styles from '@/src/stats/stats.module.css'
import { PredictionParams } from '@/types/types';
import { calcPredictions, calcTotalSaved } from '@/utils/ElectricityCostCalculator';
import {getFormattedCost} from "@/src/stats/Stats";

export default function TotalCostSavings(params: PredictionParams) {
    const { totalSaved, totalElecCost, totalSolarCost } = calcTotalSaved(params);
    // text-[#c7c7c7]
    return (
        <>
            <span className="font-sans font-normal text-[1.6em] tracking-wide m-auto pl-10 text-costSavings">ERSPARNIS INSGESAMT</span>
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
