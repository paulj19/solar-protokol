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

export type CostPredictions = {
    year: number;
    electricityCost: number;
    solarCost: number;
}
//create type Client with all corresponding fields
export type Client = {
    id: string;
    nickname: string;
    remarks: string;
    presentationDate: string;
    status: string;
}
