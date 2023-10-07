import {describe} from "node:test";
import {
    calcConsumptionCostMonthly,
    calcElectricityCostMonthly,
    calcFeedInTariffMonthly,
    calcPredictions,
    calcResidualConsumption,
    calcResidualConsumptionCostMonthly,
    calcSolarCostMonthly,
    calcTotalSaved,
    calculationMetrics, getConsumptionMonthly,
    getFeedInGeneration,
    getGenerationMonthly,
    normalizedMonthlyConsumption,
    normalizedMonthlyProduction, GenerationConsumParam,
    round, getGenerationConsumParam
} from "@/utils/ElectricityCostCalculator";
import {PredictionParams} from "@/types/types";

describe("ElectricityCostCalculator", () => {
    it("should caluculate exact electricity cost", () => {
        const consumpitonYearly = 3500;
        const electricityConsumption = [345, 295, 327, 282, 268, 253, 265, 271, 279, 294, 302, 318]
        electricityConsumption.forEach((result, index) => {
            const caluculatedResult = normalizedMonthlyConsumption(consumpitonYearly, calculationMetrics[Object.keys(calculationMetrics)[index]].electricityFactor, calculationMetrics[Object.keys(calculationMetrics)[index]].days);
            expect(round(caluculatedResult)).toBe(result);
        });
    });

    it("should calculate solar generation", () => {
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
        expect(resultResidualConsumption).toEqual(expectedResidualConsumption);
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
        expect(resultConsumption).toEqual(expectedConsumption);
    });

    it("should calculate electricity cost monthly", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192 }, generalParams: { rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedElectricityCost = 103;
        const resultElectricityCost = calcElectricityCostMonthly(params);
        expect(resultElectricityCost).toEqual(expectedElectricityCost);
    });

    it("should calculate solar cost monthly", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192 }, generalParams: { rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedSolarCost = 102;
        const { solarCost } = calcSolarCostMonthly(params);
        expect(solarCost).toEqual(expectedSolarCost);
    });

    it("should calculate electricity cost monthly for 25 years", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192 }, generalParams: { rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedElectricityCost = [103, 107, 112, 116, 121, 126, 131, 136, 142, 147, 153, 159, 165, 172, 179, 186, 194, 201, 209, 218, 227, 236, 245, 255, 265];
        for (let i = 0; i < 25; i++) {
            const resultElectricityCost = calcElectricityCostMonthly({ ...params, year: i });
            expect(resultElectricityCost).toEqual(expectedElectricityCost[i]);
        }
    });

    it("should calculate solar cost for 25 years", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192 }, generalParams: { rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedSolarCost = [102, 101, 116, 115, 115, 114, 114, 113, 112, 111, 111, 109, 109, 108, 106, 106, 105, 103, 102, 101, 100, -33, -34, -36, -37];
        let solarCost_ = [];
        for (let i = 0; i < 25; i++) {
            const { solarCost } = calcSolarCostMonthly({ ...params, year: i });
            solarCost_.push(solarCost);
        }
        expect(solarCost_).toEqual(expectedSolarCost);
    });

    it("should calculate predictions for 25 years", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192 }, generalParams: { rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedFeedInTarrif = [
            { year: 0, electricityCost: 103, solarCost: 102 },
            { year: 1, electricityCost: 107, solarCost: 101 },
            { year: 2, electricityCost: 112, solarCost: 116 },
            { year: 3, electricityCost: 116, solarCost: 115 },
            { year: 4, electricityCost: 121, solarCost: 115 },
            { year: 5, electricityCost: 126, solarCost: 114 },
            { year: 6, electricityCost: 131, solarCost: 114 },
            { year: 7, electricityCost: 136, solarCost: 113 },
            { year: 8, electricityCost: 142, solarCost: 112 },
            { year: 9, electricityCost: 147, solarCost: 111 },
            { year: 10, electricityCost: 153, solarCost: 111 },
            { year: 11, electricityCost: 159, solarCost: 109 },
            { year: 12, electricityCost: 165, solarCost: 109 },
            { year: 13, electricityCost: 172, solarCost: 108 },
            { year: 14, electricityCost: 179, solarCost: 106 },
            { year: 15, electricityCost: 186, solarCost: 106 },
            { year: 16, electricityCost: 194, solarCost: 105 },
            { year: 17, electricityCost: 201, solarCost: 103 },
            { year: 18, electricityCost: 209, solarCost: 102 },
            { year: 19, electricityCost: 218, solarCost: 101 },
            { year: 20, electricityCost: 227, solarCost: 100 },
            { year: 21, electricityCost: 236, solarCost: -33 },
            { year: 22, electricityCost: 245, solarCost: -34 },
            { year: 23, electricityCost: 255, solarCost: -36 },
            { year: 24, electricityCost: 265, solarCost: -37 },
            { year: 25, electricityCost: 276, solarCost: -39 }
        ]
        const resultFeedInTariff = calcPredictions(params);
        expect(resultFeedInTariff).toEqual(expectedFeedInTarrif);
    });

    it("should calculate total saved for 1 year", () => {
        const params: PredictionParams = { year: 0, clientParams: { consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192 }, generalParams: { rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedTotalSaved = 12;
        const expectedElecTotalSaved = 103;
        const expectedSolarTotalSaved = 102;
        const {totalSaved, totalElecCost, totalSolarCost} = calcTotalSaved(params);
        expect(totalSaved).toEqual(expectedTotalSaved);
        expect(totalElecCost).toEqual(expectedElecTotalSaved );
        expect(totalSolarCost).toEqual(expectedSolarTotalSaved );
    });

    it("should calculate total saved for 25 year", () => {
        const params: PredictionParams = { year: 25, clientParams: { consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192 }, generalParams: { rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1 } };
        const expectedTotalSaved = 29844;
        const expectedElecTotalSaved = 4581;
        const expectedSolarTotalSaved = 2094;
        const {totalSaved, totalElecCost, totalSolarCost} = calcTotalSaved(params);
        expect(totalSaved).toEqual(expectedTotalSaved);
        expect(totalElecCost).toEqual(expectedElecTotalSaved );
        expect(totalSolarCost).toEqual(expectedSolarTotalSaved );
    });

    it('should calculate generation monthly', () => {
        const productionYearly = 7192;
        const expectedGeneration = [396, 467, 633, 719, 705, 806, 827, 719, 626, 575, 396, 324];
        const resultGeneration = getGenerationMonthly(productionYearly);
        expect(resultGeneration).toEqual(expectedGeneration);
    });

    it('should calculate consumption monthly', () => {
        const consumptionYearly = 3500;
        const expectedConsumption = [345, 295, 327, 282, 268, 253, 265, 271, 279, 294, 302, 318];
        const resultConsumption = getConsumptionMonthly(consumptionYearly);
        expect(resultConsumption).toEqual(expectedConsumption);
    });
    it('should calculate GenerationConsumParam', () => {
        const consumptionYearly = 3500;
        const productionYearly = 7192;
        const expectedGenerationConsumption: Array<GenerationConsumParam> = [
            {month: "January", generation: 396, consumption: 345 },
            {month: "February", generation: 467, consumption: 295 },
            {month: "March", generation: 633, consumption: 327 },
            {month: "April", generation: 719, consumption: 282 },
            {month: "May", generation: 705, consumption: 268 },
            {month: "June", generation: 806, consumption: 253 },
            {month: "July", generation: 827, consumption: 265 },
            {month: "August", generation: 719, consumption: 271 },
            {month: "September", generation: 626, consumption: 279 },
            {month: "October", generation: 575, consumption: 294 },
            {month: "November", generation: 396, consumption: 302 },
            {month: "December", generation: 324, consumption: 318 },
        ];
        const resultGenerationConsumption = getGenerationConsumParam(productionYearly, consumptionYearly);
        expect(resultGenerationConsumption).toEqual(expectedGenerationConsumption);
    });
});