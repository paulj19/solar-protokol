import styles from '@/src/stats/stats.module.css'
import {PredictionParams} from '@/types/types';
import {calcSolarCostMonthly} from '@/utils/ElectricityCostCalculator';

export default function SolarStats(params: PredictionParams) {
    return (
        <fieldset className="border-black border-2 rounded-sm">
            <legend className={styles.headingLegend}>Mit Enpal</legend>
            <ElectricityCosts {...params} />
            {/* <div className={styles.costMonthly}>
                <div className={styles.costSolar}>{"Enpal monatlich"}</div>
                <div className={styles.costNumber}>{params.year < 20 ? params.externParams.priceEnpalMonthly + "€" : "0€"}</div>
            </div> */}

        </fieldset>
    )
}

function ElectricityCosts(params: PredictionParams) {
    const {
        rent,
        residualConsumptionCostMonthly,
        basePrice,
        feedInTariffMonthly,
        solarCost
    } = calcSolarCostMonthly(params);
    return (
        <div>
            <div className={styles.costHeading}>{"Ihre Neu Strom kosten:"}</div>
            <div className="flex justify-around pt-6 items-center">
                <div className="flex flex-col gap-4 border-gray-300 border-2 rounded-md p-3">
                    <div className={styles.costElements}>
                        <div className={styles.costLabel}>{"Grundpreis"}</div>
                        <div className={styles.costNumber}>{basePrice + "€"}</div>
                    </div>
                    <div className="pl-[30%] text-lg">+</div>
                    <div className={styles.costElements}>
                        <div className={styles.costLabel}>{"Reststromkosten"}</div>
                        <div className={styles.costNumber}>{residualConsumptionCostMonthly + "€"}</div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 border-gray-300 border-2 rounded-md p-3">
                    {/*<div className={styles.costAddition}>{"+"}</div>*/}
                    <div className={styles.costElements}>
                        <div className={styles.costLabel}>{"Enpal Miete"}</div>
                        <div className={styles.costNumber}>{rent + "€"}</div>
                    </div>
                    <div className="pl-[30%] text-lg">-</div>
                    <div className={styles.costElements}>
                        <div className={styles.costLabel}>{"Einspeisevergütung"}</div>
                        <div className={styles.costNumber}>{feedInTariffMonthly + "€"}</div>
                    </div>
                </div>
                <div className="flex justify-center p-5 gap-3 border-gray-300 border-2 rounded-md h-fit items-center">
                    <div>=</div>
                    <div>
                        <div className={styles.costLabel}>{"Summe"}</div>
                        <div className={styles.costNumber}>{solarCost + "€"}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
