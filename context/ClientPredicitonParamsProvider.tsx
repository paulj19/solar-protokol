'use client'

import { createContext, useReducer } from "react"
import { ClientPredictionParams } from '@/types/types';

// export const ComparisonContext = createContext<PredictionParamState | undefined>(undefined);
export const ClientParamContext = createContext(undefined);

export default function ClientPredictionParamsProvider({ clientPredictionParams, children }) {
    const initState: ClientPredictionParams = clientPredictionParams ?? {
        clientPredictionParams: {
            usageMonthly: 250,
            surplus: 7,
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
        <ClientParamContext.Provider value={{ state }}>{children}</ClientParamContext.Provider >
    );
}
