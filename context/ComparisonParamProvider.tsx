'use client'

import { createContext, useEffect, useMemo, useReducer } from "react"
import { fetchPredictionParams, fetchUserParams } from "@/api/comparisonParam";
import { getPredictedMonthlyTotalCost, getPredictedMonthlyUsageCost } from "@/utils/EnergyCostCalculator";
import { getTotalSolarCost } from "@/utils/SolarCostCalculator";

export const ComparisonContext = createContext({});

export default function ComparisonProvider({ children }) {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "INIT_PREDICTION_PARAMS":
                return {
                    ...action.payload
                }
        }
    }, null)
    const comparisonContext = useMemo(() => ({
        initContext: (params) => dispatch({ type: "INIT_PREDICTION_PARAMS", payload: params })
    }), [])

    return (
        <ComparisonContext.Provider value={{ state, comparisonContext }}>{children}</ComparisonContext.Provider>
    );
}
