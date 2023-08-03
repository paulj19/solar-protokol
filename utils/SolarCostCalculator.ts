import { EnergyCostPredictionProps } from "../types/types";

export function getTotalSolarCost(predictionProps: EnergyCostPredictionProps) {
    const priceEnpalMonthly = predictionProps.predictionParams.priceEnpalMonthly;
    const priceBase = predictionProps.predictionParams.priceBase;
    const surplus = predictionProps.userSpecificParams.surplus;
    const year = predictionProps.year;
    const inflationRate = predictionProps.predictionParams.inflationRate;

    const fixedInitial = year < 13 ? priceEnpalMonthly : 0;
    const totalCost = Math.ceil(fixedInitial - surplus + priceBase * (1 + inflationRate) ** year);

    return totalCost;
}