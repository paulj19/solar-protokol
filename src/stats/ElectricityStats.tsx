import styles from '@/src/stats/stats.module.css'
import { PredictionParams } from '@/types/types';
import { calcElectricityCostMonthly, calcSolarCostMonthly } from '@/utils/ElectricityCostCalculator';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import { PriceHeading } from './Stats';
import { ReactElement } from 'react';



export function ElectricityStats(params: PredictionParams) {
    const totalCost = calcElectricityCostMonthly(params);
    const solarCostParams = calcSolarCostMonthly(params);

    return (
        <div className="w-[400px] flex flex-col" data-testid="electricity-stats">
            <div className="pt-10 pb-10">
                <PriceHeading text={`STROM-RECHNUNG ALT : ${totalCost}€`} />
                <AccordionGroup variant="plain">
                    <Accordion>
                        <AccordionSummary><span className='text-legend'>Strom Rate</span></AccordionSummary>
                        {/* <AccordionSummary><span className='text-legend'> PV Rate</span></AccordionSummary> */}
                        <AccordionDetails>
                            <ElectricityCosts {...{ params, totalCost }} />
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>
            </div>
            <PriceHeading text={`STROM-RECHNUNG MIT PV : ${solarCostParams.solarCost}€`} />
            <AccordionGroup variant="plain">
                <Accordion>
                    <AccordionSummary><span className='text-legend'> PV Rate</span></AccordionSummary>
                    <AccordionDetails>
                        <SolarCosts {...{ params, solarCostParams }} />
                    </AccordionDetails>
                </Accordion>
            </AccordionGroup>
        </div>
    )
}

function ElectricityCosts({ params, totalCost }: { params: PredictionParams, totalCost: number }) {
    return (
        <>
            <div className="flex justify-around pt-4 text-title">
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
function SolarCosts({
    params, solarCostParams: {
        rent,
        residualConsumptionCostMonthly,
        basePrice,
        feedInTariffMonthly,
        solarCost
    }
}) {

    const Cost = ({ cost }): ReactElement => {
        return (
            <div
                className="flex justify-center align-middle text-2xl w-[78px]">{cost + "€"}</div>
        )
    }
    return (
        <div className="flex flex-row gap-4 p-3 text-title">
            <div>
                <div className={styles.costLabel}>{"Enpal Miete"}</div>
                <Cost cost={rent} />
            </div>
            <div className="self-center text-lg">-</div>
            <div className={styles.costElements}>
                <div className={styles.costLabel}>{"Einspeisevergütung"}</div>
                <Cost cost={feedInTariffMonthly} />
            </div>
            <div className="self-center">=</div>
            <div className={styles.costElements}>
                <div className={styles.costLabel}>{"Summe"}</div>
                <Cost cost={rent - feedInTariffMonthly} />
            </div>
        </div>
    )
}
