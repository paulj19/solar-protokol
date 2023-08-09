import { Dispatch, SetStateAction } from "react";

export type ExternPredictionParams = {
    priceBase: number;
    inflationRate: number;
    priceCurrentAvgKwh: number;
    priceEnpalMonthly: number;
}

export type ClientPredictionParams = {
    usageMonthly: number;
    surplus: number;
}

export type PredictionParams = {
    year: number;
    userSpecificParams: ClientPredictionParams;
    externPredictionParams: ExternPredictionParams;
}