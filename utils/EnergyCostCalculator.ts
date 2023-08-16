import { PredictionPoints } from "@/app/Constants";
import { GeneralParams, PredictionParams } from "../types/types";

export function getPredictedMonthlyTotalCost(predictionProps: PredictionParams, predictedMontlyUsageCost: number): number {
    return predictionProps.externPredictionParams.priceBase + predictedMontlyUsageCost;
}

export function getPredictedMonthlyUsageCost({ year, clientParams: { usageMonthly }, externPredictionParams: { inflationRate, priceCurrentKwh } }: PredictionParams): number {
    const pricePredictedKwh: number = priceCurrentKwh * (1 + inflationRate) ** year;
    const costMonthlyPredicted: number = Math.ceil(usageMonthly * pricePredictedKwh);
    return costMonthlyPredicted;
}

export function getPredictionCostsAllYears(params) {
    let costPredictedAllYears = {};
    PredictionPoints.forEach((i) => {
        const [energyCostUsage, energyCostTotal, solarCostTotal] = getPredictedCosts({ year: i, ...params });
        costPredictedAllYears = Object.assign({ [i]: { energyCostUsage, energyCostTotal, solarCostTotal } }, costPredictedAllYears);
    });
    return costPredictedAllYears;
}

export function getTotalSolarCost(predictionProps: PredictionParams) {
    const priceEnpalMonthly = predictionProps.externPredictionParams.priceEnpalMonthly;
    const priceBase = predictionProps.externPredictionParams.priceBase;
    const surplus = predictionProps.clientParams.surplus;
    const year = predictionProps.year;
    const inflationRate = predictionProps.externPredictionParams.inflationRate;

    const fixedInitial = year < 13 ? priceEnpalMonthly : 0;
    const totalCost = Math.ceil(fixedInitial - surplus + priceBase * (1 + inflationRate) ** year);

    return totalCost;
}

export function getComparisonData(params) {
    let comparisonData = [];
    PredictionPoints.forEach((i) => {
        const [energyCostUsage, energyCostTotal, solarCostTotal] = getPredictedCosts({ year: i, ...params });
        comparisonData.push({ year: i + 2013, Ohne_PV: energyCostTotal, Mit_Enpal: solarCostTotal })
    });
    return comparisonData;
}


function getPredictedCosts(params) {
    const predictedMonthlyUsageCost = getPredictedMonthlyUsageCost(params);
    const predictedMonthlyTotalCost = getPredictedMonthlyTotalCost(params, predictedMonthlyUsageCost);
    const solarCostTotal = getTotalSolarCost(params);
    return [predictedMonthlyUsageCost, predictedMonthlyTotalCost, solarCostTotal];
}
