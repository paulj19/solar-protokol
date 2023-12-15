export type GeneralParams = {
    rent: number;
    rentDiscountPeriod: number;
    rentDiscountAmount: number;
    feedInPrice: number;
    inflationRate: number;
    electricityIncreaseRate: number;
    yearLimitPrediction: number;
    yearLimitRent: number;
}

export type ClientParams = {
    basePrice: number;
    unitPrice: number;
    unitPriceSolar: number;
    consumptionYearly: number;
    productionYearly: number;
    isPurchase: boolean;
    purchasePrice: number | undefined;
    transportCost: number;
    heatingCost: number;
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
    transportCost: number;
    heatingCost: number;
    totalElecCost: number;
}
//create type Client with all corresponding fields
export type Client = {
    id: string;
    nickname: string;
    remarks: string;
    presentationDate: string;
    status: string;
}
