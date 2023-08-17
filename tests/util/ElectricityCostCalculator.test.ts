import { describe } from "node:test";
import { calculationMetrics, normalizedMonthlyConsumption, normalizedMonthlyProduction, calcResidualConsumption, calcResidualConsumptionCostMonthly, getFeedInGeneration, calcFeedInTariffMonthly, calcConsumptionCostMonthly, calcElectricityCostMonthly, calcSolarCostMonthly, round, calcPredictions } from "@/utils/ElectricityCostCalculator";
import { PredictionParams } from "@/types/types";

describe("ElectricityCostCalculator", () => {
    it("should caluculate exact electricity cost", () => {
        const consumpitonYearly = 3500;
        const electricityConsumption = [345, 295, 327, 282, 268, 253, 265, 271, 279, 294, 302, 318]
        electricityConsumption.forEach((result, index) => {
            const caluculatedResult = normalizedMonthlyConsumption(consumpitonYearly, calculationMetrics[Object.keys(calculationMetrics)[index]].electricityFactor, calculationMetrics[Object.keys(calculationMetrics)[index]].days);
            expect(round(caluculatedResult)).toBe(result);
        });
    });

    it("should calculate solar production", () => {
        const productionYearly = 7192;
        const solarProduction = [396, 467, 633, 719, 705, 806, 827, 719, 626, 575, 396, 324]
        solarProduction.forEach((result, index) => {
            const caluculatedResult = normalizedMonthlyProduction(productionYearly, calculationMetrics[Object.keys(calculationMetrics)[index]].solarFactor);
            expect(round(caluculatedResult)).toBe(result);
        });
    });

    it("should calculate residual consumption", () => {
        const params: any = { clientParams: { consumptionYearly: 6500, productionYearly: 7192 } };
        const expectedResidualConsumption = [245, 81, 165, 267];
        const resultResiducalConsumption = calcResidualConsumption(params);
        resultResiducalConsumption.forEach((result, index) => {
            expect(round(result)).toBe(expectedResidualConsumption[index]);
        });
    });

    it("should calculate residual consumption as empty", () => {
        const params: any = { clientParams: { consumptionYearly: 3500, productionYearly: 7192 } };
        const expectedResidualConsumption = [];
        const resultResiducalConsumption = calcResidualConsumption(params);
        expect(resultResiducalConsumption).toEqual(expectedResidualConsumption);
    });

    it("should calculate residual consumption cost monthly", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 6500, productionYearly: 7192, unitPrice: 0.32 }, generalParams: { feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedResidualConsumption = 20;
        const resultResidualConsumption = calcResidualConsumptionCostMonthly(params);
        expect(round(resultResidualConsumption)).toEqual(expectedResidualConsumption);
    });

    it("should calculate residual consumption cost monthly as 0", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, productionYearly: 7192, unitPrice: 0.32 }, generalParams: { feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedResidualConsumption = 0;
        const resultResidualConsumption = calcResidualConsumptionCostMonthly(params);
        expect(resultResidualConsumption).toEqual(expectedResidualConsumption);
    });

    it("should calculate feedIn generation", () => {
        const params: any = { clientParams: { consumptionYearly: 3500, productionYearly: 7192 } };
        const expectedFeedInGeneration = [51, 172, 306, 437, 437, 552, 563, 449, 347, 281, 94, 6];
        const resultFeedInGeneration = getFeedInGeneration(params);
        resultFeedInGeneration.forEach((result, index) => {
            expect(round(result)).toBe(expectedFeedInGeneration[index]);
        });
    });

    it("should calculate feedInTariff monthly", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, productionYearly: 7192 }, generalParams: { feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedFeedInTariff = 25;
        const resultFeedInTariff = calcFeedInTariffMonthly(params);
        expect(round(resultFeedInTariff)).toEqual(expectedFeedInTariff);
    });

    it("should calculate consumption monthly", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, unitPrice: 0.32 }, generalParams: { inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedConsumption = 93;
        const resultConsumption = calcConsumptionCostMonthly(params);
        expect(round(resultConsumption)).toEqual(expectedConsumption);
    });

    it("should calculate electricity cost monthly", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192 }, generalParams: { rent: 132, rentDiscountPeriod: 2, rentDiscountRate: 11.36, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedElectricityCost = 103;
        const resultElectricityCost = calcElectricityCostMonthly(params);
        expect(round(resultElectricityCost)).toEqual(expectedElectricityCost);
    });

    it("should calculate solar cost monthly", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192 }, generalParams: { rent: 132, rentDiscountPeriod: 2, rentDiscountRate: 11.36, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedSolarCost = 102;
        const result = calcSolarCostMonthly(params);
        expect(round(result)).toEqual(expectedSolarCost);
    });

    it("should calculate electricity cost monthly for 25 years", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192 }, generalParams: { rent: 132, rentDiscountPeriod: 2, rentDiscountRate: 11.36, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedElectricityCost = [103, 107, 112, 116, 121, 126, 131, 136, 141, 147, 153, 159, 165, 172, 179, 186, 194, 201, 209, 218, 226, 235, 245, 255, 265];
        for (let i = 0; i < 25; i++) {
            const resultElectricityCost = calcElectricityCostMonthly({ ...params, year: i });
            expect(resultElectricityCost).toEqual(expectedElectricityCost[i]);
        }
    });

    it("should calculate feedIn tariff for 25 years", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192 }, generalParams: { rent: 132, rentDiscountPeriod: 2, rentDiscountRate: 11.36, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedFeedInTarrif = [102, 102, 116, 116, 115, 114, 113, 113, 112, 111, 110, 109, 109, 108, 107, 106, 105, 104, 102, 101, 100, -33, -35, -36, -37];
        for (let i = 0; i < 25; i++) {
            const resultFeedInTariff = calcSolarCostMonthly({ ...params, year: i });
            expect(resultFeedInTariff).toEqual(expectedFeedInTarrif[i]);
        }
    });

    it("should calculate predictions for 25 years", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192 }, generalParams: { rent: 132, rentDiscountPeriod: 2, rentDiscountRate: 11.36, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedFeedInTarrif = [
            { year: 0, electricityCost: 103, solarCost: 102 },
            { year: 1, electricityCost: 107, solarCost: 102 },
            { year: 2, electricityCost: 112, solarCost: 116 },
            { year: 3, electricityCost: 116, solarCost: 116 },
            { year: 4, electricityCost: 121, solarCost: 115 },
            { year: 5, electricityCost: 126, solarCost: 114 },
            { year: 6, electricityCost: 131, solarCost: 113 },
            { year: 7, electricityCost: 136, solarCost: 113 },
            { year: 8, electricityCost: 141, solarCost: 112 },
            { year: 9, electricityCost: 147, solarCost: 111 },
            { year: 10, electricityCost: 153, solarCost: 110 },
            { year: 11, electricityCost: 159, solarCost: 109 },
            { year: 12, electricityCost: 165, solarCost: 109 },
            { year: 13, electricityCost: 172, solarCost: 108 },
            { year: 14, electricityCost: 179, solarCost: 107 },
            { year: 15, electricityCost: 186, solarCost: 106 },
            { year: 16, electricityCost: 194, solarCost: 105 },
            { year: 17, electricityCost: 201, solarCost: 104 },
            { year: 18, electricityCost: 209, solarCost: 102 },
            { year: 19, electricityCost: 218, solarCost: 101 },
            { year: 20, electricityCost: 226, solarCost: 100 },
            { year: 21, electricityCost: 235, solarCost: 0 },
            { year: 22, electricityCost: 245, solarCost: 0 },
            { year: 23, electricityCost: 255, solarCost: 0 },
            { year: 24, electricityCost: 265, solarCost: 0 }
        ];
        const resultFeedInTariff = calcPredictions(25, params);
        expect(resultFeedInTariff).toEqual(expectedFeedInTarrif);
    });
});