export type GeneralParams = {
    rent: number;
    rentDiscountPeriod: number;
    rentDiscountRate: number;
    feedInPrice: number;
    inflationRate: number;
    electricityIncreaseRate: number;
}

export type ClientParams = {
    basePrice: number;
    unitPrice: number;
    consumptionYearly: number;
    productionYearly: number;
}

export type PredictionParams = {
    year: number;
    clientParams: ClientParams;
    generalParams: GeneralParams;
}

export type NormalizationParams = {
    days: number;
    electricityFactor: number;
    solarFactor: number;
}