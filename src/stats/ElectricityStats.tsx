import styles from '@/src/stats/stats.module.css'
import { PredictionParams } from '@/types/types';
import { calcElectricityCostMonthly, calcSolarCostMonthly } from '@/utils/ElectricityCostCalculator';

export function ElectricityStats(params: PredictionParams) {

    return (
        <fieldset className={styles.fieldset} data-testid="electricity-stats">
            <legend className={styles.headingLegend}>Ohne Enpal</legend>
            <ElectricityCosts {...params} />
        </fieldset>
    )
}

function ElectricityCosts(params: PredictionParams) {
    const totalCost = calcElectricityCostMonthly(params);

    // return (
    //     <div className={styles.costGrid}>
    //         <div className={styles.costHeading}>{"Ihre Strom kosten:"}</div>
    //         <div className="flex justify-center pt-6 items-center gap-3">
    //             <div className="flex flex-col gap-4 border-gray-300 border-2 rounded-md p-3 w-fit">
    //                 <div className={styles.costElements}>
    //                     <div className={styles.costLabel}>{"Grundpreis"}</div>
    //                     <div className={styles.costNumber}>{params.clientParams.basePrice + "€"}</div>
    //                 </div>
    //                 <div className="pl-[30%] text-lg">+</div>
    //                 <div className={styles.costElements}>
    //                     <div className={styles.costLabel}>{"Stromverbrauch"}</div>
    //                     <div className={styles.costNumber}>{totalCost - params.clientParams.basePrice + "€"}</div>
    //                 </div>
    //             </div>
    //             <div
    //                 className="flex justify-center p-5 gap-3 border-gray-300 border-2 rounded-md h-fit items-center">
    //                 <div>=</div>
    //                 <div>
    //                     <div className={styles.costLabel}>{"Summe"}</div>
    //                     <div className={styles.costNumber}>{totalCost + "€"}</div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )
    return (
        <div className={styles.costGrid}>
            <div className={styles.costHeading}>{"Ihre Strom kosten:"}</div>
            <div className="flex justify-around pt-4">
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Grundpreis"}</div>
                    <div className={styles.costNumber}>{params.clientParams.basePrice + "€"}</div>
                </div>
                <div className="self-center">+</div>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Stromverbrauch"}</div>
                    <div className={styles.costNumber}>{totalCost - params.clientParams.basePrice + "€"}</div>
                </div>
                <div className="self-center">=</div>
                <div className={styles.costElements}>
                    <div className={styles.costLabel}>{"Summe"}</div>
                    <div className={styles.costNumber}>{totalCost + "€"}</div>
                </div>
            </div>
        </div>
    )
}
