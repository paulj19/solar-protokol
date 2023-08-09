'use client'

import { createContext, useReducer } from "react"
import { ExternPredictionParams } from '@/types/types';

// export const ComparisonContext = createContext<PredictionParamState | undefined>(undefined);
export const ExternParamContext = createContext(undefined);

export default function ExternPredictionParamsProvider({ externPredictionParams, children }) {
    const initState: ExternPredictionParams = externPredictionParams ?? {
        externPredictionParams: {
            priceBase: 10,
            inflationRate: 0.05,
            priceCurrentAvgKwh: 0.40,
            priceEnpalMonthly: 150,
        }
    }

    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "INIT_PREDICTION_PARAMS":
                return {
                    ...action.payload
                }
        }
    }, initState)

    return (
        <ExternParamContext.Provider value={{ state }}>{children}</ExternParamContext.Provider >
    );
}
