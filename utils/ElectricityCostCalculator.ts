import {CostPredictions, NormalizationParams, PredictionParams} from "@/types/types";

export const calculationMetrics: Record<string, NormalizationParams> = {
    "JANUARY": {days: 31, electricityFactor: 1.16, solarFactor: 0.055},
    "FEBRUARY": {days: 28, electricityFactor: 1.10, solarFactor: 0.065},
    "MARCH": {days: 31, electricityFactor: 1.10, solarFactor: 0.088},
    "APRIL": {days: 30, electricityFactor: 0.98, solarFactor: 0.1},
    "MAY": {days: 31, electricityFactor: 0.90, solarFactor: 0.098},
    "JUNE": {days: 30, electricityFactor: 0.88, solarFactor: 0.112},
    "JULY": {days: 31, electricityFactor: 0.89, solarFactor: 0.115},
    "AUGUST": {days: 31, electricityFactor: 0.91, solarFactor: 0.1},
    "SEPTEMBER": {days: 30, electricityFactor: 0.97, solarFactor: 0.087},
    "OCTOBER": {days: 31, electricityFactor: 0.99, solarFactor: 0.08},
    "NOVEMBER": {days: 30, electricityFactor: 1.05, solarFactor: 0.055},
    "DECEMBER": {days: 31, electricityFactor: 1.07, solarFactor: 0.045},
};

export type GenerationConsumParam = {
    month: string,
    generation: number,
    consumption: number,
}

export function getGenerationConsumParam(productionYearly: number, consumptionYearly: number): Array<GenerationConsumParam> {
    const generationMonthly = getGenerationMonthly(productionYearly);
    const consumptionMonthly = getConsumptionMonthly(consumptionYearly);

    return Object.keys(calculationMetrics).map((month, index) => {
        return {
            month: month.charAt(0) + month.substring(1).toLowerCase(),
            generation: generationMonthly[index],
            consumption: consumptionMonthly[index],
        };
    });
}

export function calcPredictions(params: PredictionParams): Array<CostPredictions> {
    let costPredictions: Array<CostPredictions> = [];
    let electricityCost;
    let solarCost;
    for (let i = 0; i <= 25; i += 1) {
        electricityCost = calcElectricityCostMonthly({...params, year: i});
        solarCost = calcSolarCostMonthly({...params, year: i}).solarCost;
        costPredictions.push({
            year: i, electricityCost, solarCost: solarCost > 0 ? solarCost : 0
        });
    }
    return costPredictions;
}

export function calcTotalSaved(params: PredictionParams): number {
    const predictedCosts = calcPredictions(params);

    let totalSaved = 0;
    for (let i = 0; i <= params.year; i++) {
        totalSaved += (predictedCosts[i].electricityCost - predictedCosts[i].solarCost) * 12;
    }
    return totalSaved;
}

export function calcElectricityCostMonthly(params: PredictionParams): number {
    return calcConsumptionCostMonthly(params) + calcBasePrice(params);
}

export function calcSolarCostMonthly(params: PredictionParams) {
    const rent = calcRent(params);
    const residualConsumptionCostMonthly = calcResidualConsumptionCostMonthly(params);
    const feedInTariffMonthly = calcFeedInTariffMonthly(params);
    const basePrice = calcBasePrice(params);
    const solarCost = rent + residualConsumptionCostMonthly + basePrice - feedInTariffMonthly;
    return {rent, residualConsumptionCostMonthly, basePrice, feedInTariffMonthly, solarCost};
}

export function calcFeedInTariffMonthly(params: PredictionParams): number {
    const feedInGenerationYearly = getFeedInGeneration(params).reduce((sum, feedInGeneration) => sum + feedInGeneration, 0);
    return round((feedInGenerationYearly / 12) * calcFeedInPrice(params));
}

export function calcResidualConsumptionCostMonthly(params: PredictionParams): number {
    const residualConsumptionYearly = calcResidualConsumption(params).reduce((sum, residualConsumption) => sum + residualConsumption, 0);
    return round((residualConsumptionYearly / 12) * calcUnitPrice(params));
}

export function calcConsumptionCostMonthly(params: PredictionParams): number {
    return round((params.clientParams.consumptionYearly / 12) * calcUnitPrice(params));
}

export function calcResidualConsumption({clientParams: {consumptionYearly, productionYearly}}): Array<number> {
    return Object.keys(calculationMetrics).reduce((residualConsumption_, month) => {
        const residualConsumption = normalizedMonthlyConsumption(consumptionYearly, calculationMetrics[month].electricityFactor, calculationMetrics[month].days) - normalizedMonthlyProduction(productionYearly, calculationMetrics[month].solarFactor)
        if (residualConsumption > 0) {
            residualConsumption_.push(residualConsumption);
        }
        return residualConsumption_;
    }, []);
}

export function getFeedInGeneration({clientParams: {productionYearly, consumptionYearly}}: PredictionParams): Array<number> {
    return Object.keys(calculationMetrics).reduce((surplusArray, month) => {
        const surplus = normalizedMonthlyProduction(productionYearly, calculationMetrics[month].solarFactor) - normalizedMonthlyConsumption(consumptionYearly, calculationMetrics[month].electricityFactor, calculationMetrics[month].days)
        if (surplus > 0) {
            surplusArray.push(surplus);
        }
        return surplusArray;
    }, []);
}

export function getGenerationMonthly(productionYearly: number): Array<number> {
    return Object.keys(calculationMetrics).reduce((generationArray, month) => {
        generationArray.push(round(normalizedMonthlyProduction(productionYearly, calculationMetrics[month].solarFactor)));
        return generationArray;
    }, []);
}

export function getConsumptionMonthly(consumptionYearly: number): Array<number> {
    return Object.keys(calculationMetrics).reduce((consumptionArray, month) => {
        consumptionArray.push(round(normalizedMonthlyConsumption(consumptionYearly, calculationMetrics[month].electricityFactor, calculationMetrics[month].days)));
        return consumptionArray;
    }, []);
}

function calcBasePrice({year, clientParams: {basePrice}, generalParams: {inflationRate, electricityIncreaseRate}}: PredictionParams): number {
    return round(priceIncrease(basePrice, inflationRate + electricityIncreaseRate, year));
}

function calcUnitPrice({year, clientParams: {unitPrice}, generalParams: {inflationRate, electricityIncreaseRate}}: PredictionParams): number {
    return priceIncrease(unitPrice, inflationRate + electricityIncreaseRate, year);
}

function calcFeedInPrice({year, generalParams: {feedInPrice, inflationRate, electricityIncreaseRate}}: PredictionParams): number {
    return priceIncrease(feedInPrice, inflationRate + electricityIncreaseRate, year);
}

function calcRent({year, generalParams: {rent, rentDiscountPeriod, rentDiscountAmount}}: PredictionParams): number {
    if (year > 20) {
        return 0;
    }
    if (year < rentDiscountPeriod) {
        return round(rent - rentDiscountAmount);
    }
    return rent;
}

function priceIncrease(price, rate, year) {
    return price * (1 + rate * 0.01) ** year;
}

export function normalizedMonthlyConsumption(consumptionYearly: number, electricityFactor: number, days: number) {
    return (consumptionYearly / 365) * electricityFactor * days;
}

export function normalizedMonthlyProduction(productionYearly: number, solarFactor: number) {
    return productionYearly * solarFactor;
}

export function round(number) {
    const decimalPart = number - Math.floor(number);
    if (decimalPart > 0.5) {
        return Math.ceil(number);
    }
    return Math.floor(number);
}
