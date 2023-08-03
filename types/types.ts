export type ExternPredictionParams = {
    priceBase: number;
    inflationRate: number;
    priceCurrentAvgKwh: number;
    priceEnpalMonthly: number;
}

export type UserSpecificParams = {
    usageMonthly: number;
    surplus: number;
}

export type PredictionParams = {
    year: number;
    userSpecificParams: UserSpecificParams;
    externPredictionParams: ExternPredictionParams;
}
