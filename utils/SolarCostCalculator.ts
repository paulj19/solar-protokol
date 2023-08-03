import { PredictionParams } from "../types/types";

export function getTotalSolarCost(predictionProps: PredictionParams) {
    const priceEnpalMonthly = predictionProps.externPredictionParams.priceEnpalMonthly;
    const priceBase = predictionProps.externPredictionParams.priceBase;
    const surplus = predictionProps.userSpecificParams.surplus;
    const year = predictionProps.year;
    const inflationRate = predictionProps.externPredictionParams.inflationRate;

    const fixedInitial = year < 13 ? priceEnpalMonthly : 0;
    const totalCost = Math.ceil(fixedInitial - surplus + priceBase * (1 + inflationRate) ** year);

    return totalCost;
}