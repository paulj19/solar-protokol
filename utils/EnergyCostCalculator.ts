import { PredictionParams } from "../types/types";

export function getPredictedMonthlyTotalCost(predictionProps: PredictionParams, predictedMontlyUsageCost: number): number {
    return predictionProps.externPredictionParams.priceBase + predictedMontlyUsageCost;
}

export function getPredictedMonthlyUsageCost({ year, userSpecificParams: { usageMonthly }, externPredictionParams: { inflationRate, priceCurrentAvgKwh } }: PredictionParams): number {
    const pricePredictedKwh: number = priceCurrentAvgKwh * (1 + inflationRate) ** year;
    const costMonthlyPredicted: number = Math.ceil(usageMonthly * pricePredictedKwh);
    return costMonthlyPredicted;
}