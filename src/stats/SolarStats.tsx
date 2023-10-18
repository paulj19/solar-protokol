import styles from '@/src/stats/stats.module.css'
import { PredictionParams } from '@/types/types';
import { calcSolarCostMonthly } from '@/utils/ElectricityCostCalculator';
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionSummary from "@mui/joy/AccordionSummary";
import AccordionDetails from "@mui/joy/AccordionDetails";
import { className } from "postcss-selector-parser";
import { ReactElement } from "react";
import { PriceHeading } from './Stats';

export default function SolarStats(params: PredictionParams) {
    const solarCostParams = calcSolarCostMonthly(params);
    return (
        // <fieldset className="border-black border-2 rounded-sm" data-testid="solar-stats">
        //     <legend className={styles.headingLegend}>Mit Enpal</legend>
        <div className="w-[450px] pt-[340px] space-y-2" data-testid="solar-stats">
            <PriceHeading text={`STROM-RECHNUNG MIT PV : ${solarCostParams.solarCost}€`} />
            <AccordionGroup variant="plain">
                <Accordion>
                    {/* <AccordionSummary><span className='text-legend'> PV Rate</span></AccordionSummary> */}
                    <AccordionDetails>
                        <SolarCosts {...{ params, solarCostParams }} />
                    </AccordionDetails>
                </Accordion>
            </AccordionGroup>
        </div>

        // </fieldset>
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

// <div>
{/* <div className="flex flex-col justify-around pt-6 items-start gap-1"> */ }
{/* <AccordionGroup variant="plain">
                    <Accordion>
                        <AccordionSummary>Strom Details</AccordionSummary>
                        <AccordionDetails>
                            <div className="flex flex-row gap-4 rounded-md p-3">
                                <div className={styles.costElements}>
                                    <div className={styles.costLabel}>{"Grundpreis"}</div>
                                    <Cost cost={basePrice} />
                                </div>
                                <div className="self-center text-lg">+</div>
                                <div className={styles.costElements}>
                                    <div className={styles.costLabel}>{"Reststromkosten"}</div>
                                    <Cost cost={residualConsumptionCostMonthly} />
                                </div>
                                <div className="self-center pl-5">=</div>
                                <div className={styles.costElements}>
                                    <div className={styles.costLabel}>{"Summe"}</div>
                                    <Cost cost={basePrice + residualConsumptionCostMonthly} />
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup> */}
// <AccordionGroup variant="plain">
//     <Accordion>
//         <AccordionSummary><span className='text-legend'> PV Rate</span></AccordionSummary>
//         <AccordionDetails>
//         </AccordionDetails>
//     </Accordion>
// </AccordionGroup>
{/*<div className="flex justify-center p-5 gap-3 border-gray-300 border-2 rounded-md h-fit items-center">*/ }
{/*    <div>=</div>*/ }
{/*    <div>*/ }
{/*        <div className={styles.costLabel}>{"Summe"}</div>*/ }
{/*        <div className={styles.costNumber}>{solarCost + "€"}</div>*/ }
{/*    </div>*/ }
{/*</div>*/ }
{/* </div> */ }
// </div>