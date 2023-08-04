'use client'

import { createContext, useEffect, useMemo, useReducer } from "react"
import { fetchPredictionParams, fetchUserParams } from "@/api/comparisonParam";
import { getPredictedMonthlyTotalCost, getPredictedMonthlyUsageCost } from "@/utils/EnergyCostCalculator";
import { getTotalSolarCost } from "@/utils/SolarCostCalculator";
import { ExternPredictionParams, PredictionParamState, PredictionParams, UserSpecificParams } from '@/types/types';

// export const ComparisonContext = createContext<PredictionParamState | undefined>(undefined);
export const ComparisonContext = createContext(undefined);

export default function ComparisonProvider({ children }) {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "INIT_PREDICTION_PARAMS":
                return {
                    ...action.payload
                }
        }
    }, {
        year: 0,
        userSpecificParams: {
            usageMonthly: 300,
            surplus: 10,
        },
        externPredictionParams: {
            priceBase: 10,
            inflationRate: 0.05,
            priceCurrentAvgKwh: 0.40,
            priceEnpalMonthly: 150,
        }
    } as PredictionParams)

    const comparisonContext = useMemo(() => ({
        initContext: (params) => dispatch({ type: "INIT_PREDICTION_PARAMS", payload: params })
    }), [])

    return (
        <ComparisonContext.Provider value={{ state, comparisonContext }}>{children}</ComparisonContext.Provider>
    );
}
