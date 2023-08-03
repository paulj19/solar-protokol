export type PredictionParams = {
    priceBase: number;
    inflationRate: number;
    priceCurrentAvgKwh: number;
    priceEnpalMonthly: number;
}

export type EnergyCostPredictionProps = {
    year: number;
    userSpecificParams: UserSpecificParams;
    predictionParams: PredictionParams;
}

export type UserSpecificParams = {
    usageMonthly: number;
    surplus: number;
}