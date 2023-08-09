import { Dispatch, SetStateAction } from "react";

export type ExternPredictionParams = {
    priceBase: number;
    inflationRate: number;
    priceCurrentKwh: number;
    priceEnpalMonthly: number;
}

export type ClientParams = {
    usageMonthly: number;
    surplus: number;
}

export type PredictionParams = {
    year: number;
    clientParams: ClientParams;
    externPredictionParams: ExternPredictionParams;
}