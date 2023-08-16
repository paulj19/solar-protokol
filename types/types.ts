export type GeneralParams = {
    feedInPrice: number;
    rent: number;
    inflationRate: number;
    electricityIncreaseRate: number;
}

export type ClientParams = {
    priceBase: number;
    unitPrice: number;
    consumpitonYearly: number;
    productionYearly: number;
}

export type PredictionParams = {
    year: number;
    clientParams: ClientParams;
    generalParams: GeneralParams;
}

export type CalculationParams = {
    days: number;
    electricityFactor: number;
    solarFactor: number;
}