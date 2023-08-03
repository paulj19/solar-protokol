import { EnergyCostPredictionProps } from "../types/types";

export function getPredictedMonthlyTotalCost(predictionProps: EnergyCostPredictionProps, predictedMontlyUsageCost: number): number {
    return predictionProps.predictionParams.priceBase + predictedMontlyUsageCost;
}

export function getPredictedMonthlyUsageCost({ year, userSpecificParams: { usageMonthly }, predictionParams: { inflationRate, priceCurrentAvgKwh } }: EnergyCostPredictionProps): number {
    const pricePredictedKwh: number = priceCurrentAvgKwh * (1 + inflationRate) ** year;
    const costMonthlyPredicted: number = Math.ceil(usageMonthly * pricePredictedKwh);
    return costMonthlyPredicted;
}