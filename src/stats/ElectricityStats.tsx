import styles from '@/src/stats/stats.module.css'
import {PredictionParams} from '@/types/types';
import {calcElectricityCostMonthly, calcSolarCostMonthly} from '@/utils/ElectricityCostCalculator';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';


export function ElectricityStats(params: PredictionParams) {
    const totalCost = calcElectricityCostMonthly(params);

    return (
        // <fieldset className={styles.fieldset} data-testid="electricity-stats">
        //     <legend className={styles.headingLegend}>Ohne Enpal</legend>
        <div className="w-[450px] pt-[340px]" data-testid="electricity-stats">
            <div className="font-sans font-normal text-2xl pl-3 tracking-wide text-cyan-900">{`Ihre Strom kosten: ${totalCost}€`}</div>
            <AccordionGroup variant="plain">
                <Accordion>
                    <AccordionSummary>Details</AccordionSummary>
                    <AccordionDetails>
                        <ElectricityCosts {...{params, totalCost}} />
                    </AccordionDetails>
                </Accordion>
            </AccordionGroup>
        </div>
        // </fieldset>
    )
}

function ElectricityCosts({params, totalCost}: { params: PredictionParams, totalCost: number }) {
    return (
        <>
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
        </>
    )
}
