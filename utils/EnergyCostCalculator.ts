import { ExternPredictionParams, PredictionParams } from "../types/types";

export function getPredictedMonthlyTotalCost(predictionProps: PredictionParams, predictedMontlyUsageCost: number): number {
    return predictionProps.externPredictionParams.priceBase + predictedMontlyUsageCost;
}

export function getPredictedMonthlyUsageCost({ year, clientParams: { usageMonthly }, externPredictionParams: { inflationRate, priceCurrentKwh } }: PredictionParams): number {
    const pricePredictedKwh: number = priceCurrentKwh * (1 + inflationRate) ** year;
    const costMonthlyPredicted: number = Math.ceil(usageMonthly * pricePredictedKwh);
    return costMonthlyPredicted;
}