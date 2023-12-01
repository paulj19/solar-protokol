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
    round, getGenerationConsumParam, calcCumulativeSaved
} from "@/utils/ElectricityCostCalculator";
import {PredictionParams} from "@/types/types";
import {PayOffParam} from "@/src/payoffChart/PayoffChart";

describe("ElectricityCostCalculator", () => {
    it("should caluculate exact electricity cost", () => {
        const consumpitonYearly = 3500;
        const electricityConsumption = [327, 295, 297, 282, 268, 259, 265, 271, 279, 294, 302, 318]
        electricityConsumption.forEach((result, index) => {
            const caluculatedResult = normalizedMonthlyConsumption(consumpitonYearly, calculationMetrics[Object.keys(calculationMetrics)[index]].electricityFactor, calculationMetrics[Object.keys(calculationMetrics)[index]].days);
            expect(round(caluculatedResult)).toBe(result);
        });
    });

    it("should calculate solar generation", () => {
        const productionYearly = 7192;
        const solarProduction = [360, 424, 633, 662, 705, 806, 863, 791, 626, 539, 410, 374]
        solarProduction.forEach((result, index) => {
            const caluculatedResult = normalizedMonthlyProduction(productionYearly, calculationMetrics[Object.keys(calculationMetrics)[index]].solarFactor);
            expect(round(caluculatedResult)).toBe(result);
        });
    });

    it("should calculate residual consumption", () => {
        const params: any = {clientParams: {consumptionYearly: 6500, productionYearly: 7192}};
        const expectedResidualConsumption = [248, 124, 7, 151, 217];
        const resultResiducalConsumption = calcResidualConsumption(params);
        resultResiducalConsumption.forEach((result, index) => {
            expect(round(result)).toBe(expectedResidualConsumption[index]);
        });
    });

    it("should calculate residual consumption as empty", () => {
        const params: any = {clientParams: {consumptionYearly: 3500, productionYearly: 7192}};
        const expectedResidualConsumption = [];
        const resultResiducalConsumption = calcResidualConsumption(params);
        expect(resultResiducalConsumption).toEqual(expectedResidualConsumption);
    });

    it("should calculate residual consumption cost monthly", () => {
        const params: PredictionParams = {year: 0, clientParams: {consumptionYearly: 6500, productionYearly: 7192, unitPrice: 0.32}, generalParams: {feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1}};
        const expectedResidualConsumption = 20;
        const resultResidualConsumption = calcResidualConsumptionCostMonthly(params);
        expect(resultResidualConsumption).toEqual(expectedResidualConsumption);
    });

    it("should calculate residual consumption cost monthly as 0", () => {
        const params: PredictionParams = {year: 0, clientParams: {consumptionYearly: 3500, productionYearly: 7192, unitPrice: 0.32}, generalParams: {feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1}};
        const expectedResidualConsumption = 0;
        const resultResidualConsumption = calcResidualConsumptionCostMonthly(params);
        expect(resultResidualConsumption).toEqual(expectedResidualConsumption);
    });

    it("should calculate feedIn generation", () => {
        const params: any = {clientParams: {consumptionYearly: 3500, productionYearly: 7192}};
        const expectedFeedInGeneration = [33, 129, 336, 380, 437, 547, 598, 521, 347, 245, 108,  56];
        const resultFeedInGeneration = getFeedInGeneration(params);
        resultFeedInGeneration.forEach((result, index) => {
            expect(round(result)).toBe(expectedFeedInGeneration[index]);
        });
    });

    it("should calculate feedInTariff monthly", () => {
        const params: PredictionParams = {year: 0, clientParams: {consumptionYearly: 3500, productionYearly: 7192}, generalParams: {feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1}};
        const expectedFeedInTariff = 25;
        const resultFeedInTariff = calcFeedInTariffMonthly(params);
        expect(round(resultFeedInTariff)).toEqual(expectedFeedInTariff);
    });

    it("should calculate consumption monthly", () => {
        const params: PredictionParams = {year: 0, clientParams: {consumptionYearly: 3500, unitPrice: 0.32}, generalParams: {inflationRate: 3, electricityIncreaseRate: 1}};
        const expectedConsumption = 93;
        const resultConsumption = calcConsumptionCostMonthly(params);
        expect(resultConsumption).toEqual(expectedConsumption);
    });

    it("should calculate electricity cost monthly", () => {
        const params: PredictionParams = {year: 0, clientParams: {consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192}, generalParams: {rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1}};
        const expectedElectricityCost = 103;
        const resultElectricityCost = calcElectricityCostMonthly(params);
        expect(resultElectricityCost).toEqual(expectedElectricityCost);
    });

    it("should calculate solar cost monthly", () => {
        const params: PredictionParams = {year: 0, clientParams: {consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192}, generalParams: {rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1}};
        const expectedSolarCost = 102;
        const {solarCost} = calcSolarCostMonthly(params);
        expect(solarCost).toEqual(expectedSolarCost);
    });

    it("should calculate electricity cost monthly for 25 years", () => {
        const params: PredictionParams = {year: 0, clientParams: {consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192}, generalParams: {rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1}};
        const expectedElectricityCost = [103, 107, 112, 116, 121, 126, 131, 136, 142, 147, 153, 159, 165, 172, 179, 186, 194, 201, 209, 218, 227, 236, 245, 255, 265];
        for (let i = 0; i < 25; i++) {
            const resultElectricityCost = calcElectricityCostMonthly({...params, year: i});
            expect(resultElectricityCost).toEqual(expectedElectricityCost[i]);
        }
    });

    it("should calculate solar cost for 25 years", () => {
        const params: PredictionParams = {year: 0, clientParams: {consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192}, generalParams: {rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1}};
        const expectedSolarCost = [102, 102, 118, 118, 119, 119, 120, 120, 121, 121, 122, 122, 123, 124, 124, 125, 126, 126, 127, 128, 129, -2, -1, 0, 1];
        let solarCost_ = [];
        for (let i = 0; i < 25; i++) {
            const {solarCost} = calcSolarCostMonthly({...params, year: i});
            solarCost_.push(solarCost);
        }
        expect(solarCost_).toEqual(expectedSolarCost);
    });

    it("should calculate predictions for 25 years", () => {
        const params: PredictionParams = {year: 0, clientParams: {consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192}, generalParams: {rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1}};
        const expectedFeedInTarrif = [
            { year: 0, electricityCost: 103, solarCost: 102 },
            { year: 1, electricityCost: 107, solarCost: 102 },
            { year: 2, electricityCost: 112, solarCost: 118 },
            { year: 3, electricityCost: 116, solarCost: 118 },
            { year: 4, electricityCost: 121, solarCost: 119 },
            { year: 5, electricityCost: 126, solarCost: 119 },
            { year: 6, electricityCost: 131, solarCost: 120 },
            { year: 7, electricityCost: 136, solarCost: 120 },
            { year: 8, electricityCost: 142, solarCost: 121 },
            { year: 9, electricityCost: 147, solarCost: 121 },
            { year: 10, electricityCost: 153, solarCost: 122 },
            { year: 11, electricityCost: 159, solarCost: 122 },
            { year: 12, electricityCost: 165, solarCost: 123 },
            { year: 13, electricityCost: 172, solarCost: 124 },
            { year: 14, electricityCost: 179, solarCost: 124 },
            { year: 15, electricityCost: 186, solarCost: 125 },
            { year: 16, electricityCost: 194, solarCost: 126 },
            { year: 17, electricityCost: 201, solarCost: 126 },
            { year: 18, electricityCost: 209, solarCost: 127 },
            { year: 19, electricityCost: 218, solarCost: 128 },
            { year: 20, electricityCost: 227, solarCost: 129 },
            { year: 21, electricityCost: 236, solarCost: -2 },
            { year: 22, electricityCost: 245, solarCost: -1 },
            { year: 23, electricityCost: 255, solarCost: 0 },
            { year: 24, electricityCost: 265, solarCost: 1 },
            { year: 25, electricityCost: 276, solarCost: 2 }
        ]
        const resultFeedInTariff = calcPredictions(params);
        expect(resultFeedInTariff).toEqual(expectedFeedInTarrif);
    });

    it("should calculate total saved for 1 year", () => {
        const params: PredictionParams = {year: 0, clientParams: {consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192}, generalParams: {rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1}};
        const expectedTotalSaved = 12;
        const expectedElecTotalSaved = 1236;
        const expectedSolarTotalSaved = 1224;
        const {totalSaved, totalElecCost, totalSolarCost} = calcTotalSaved(params);
        expect(totalSaved).toEqual(expectedTotalSaved);
        expect(totalElecCost).toEqual(expectedElecTotalSaved);
        expect(totalSolarCost).toEqual(expectedSolarTotalSaved);
    });

    it("should calculate total saved for 25 year", () => {
        const params: PredictionParams = {year: 25, clientParams: {consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192}, generalParams: {rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1}};
        const expectedTotalSaved = 24540;
        const expectedElecTotalSaved = 54972;
        const expectedSolarTotalSaved = 30432;
        const {totalSaved, totalElecCost, totalSolarCost} = calcTotalSaved(params);
        expect(totalSaved).toEqual(expectedTotalSaved);
        expect(totalElecCost).toEqual(expectedElecTotalSaved);
        expect(totalSolarCost).toEqual(expectedSolarTotalSaved);
    });

    it('should calculate generation monthly', () => {
        const productionYearly = 7192;
        const expectedGeneration = [360, 424, 633, 662, 705, 806, 863, 791, 626, 539, 410, 374];
        const resultGeneration = getGenerationMonthly(productionYearly);
        expect(resultGeneration).toEqual(expectedGeneration);
    });

    it('should calculate consumption monthly', () => {
        const consumptionYearly = 3500;
        const expectedConsumption = [327, 295, 297, 282, 268, 259, 265, 271, 279, 294, 302, 318];
        const resultConsumption = getConsumptionMonthly(consumptionYearly);
        expect(resultConsumption).toEqual(expectedConsumption);
    });
    it('should calculate GenerationConsumParam', () => {
        const consumptionYearly = 3500;
        const productionYearly = 7192;
        const expectedGenerationConsumption: Array<GenerationConsumParam> = [
            { month: 'Januar', generation: 360, consumption: 327 },
            { month: 'Februar', generation: 424, consumption: 295 },
            { month: 'Maerz', generation: 633, consumption: 297 },
            { month: 'April', generation: 662, consumption: 282 },
            { month: 'Mai', generation: 705, consumption: 268 },
            { month: 'Juni', generation: 806, consumption: 259 },
            { month: 'Juli', generation: 863, consumption: 265 },
            { month: 'August', generation: 791, consumption: 271 },
            { month: 'September', generation: 626, consumption: 279 },
            { month: 'Oktober', generation: 539, consumption: 294 },
            { month: 'November', generation: 410, consumption: 302 },
            { month: 'Dezember', generation: 374, consumption: 318 }
        ];
        const resultGenerationConsumption = getGenerationConsumParam(productionYearly, consumptionYearly);
        expect(resultGenerationConsumption).toEqual(expectedGenerationConsumption);
    });
    //it('should calculate cumulative saved', () => {
    //    const params: PredictionParams = {year: 0, clientParams: {consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192, isPurchase: true, purchasePrice: 20000}, generalParams: {rent: 132, rentDiscountPeriod: 2, rentDiscountAmount: 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1}};
    //    const expectedCumlativeSaved: Array<PayOffParam> = [{ year: 0, saved: -19897 }, { year: 1, saved: -18612 }, { year: 2, saved: -17269 }, { year: 3, saved: -15877 }, { year: 4, saved: -14423 }, { year: 5, saved: -12916 }, { year: 6, saved: -11343 }, { year: 7, saved: -9713 }, { year: 8, saved: -8012 }, { year: 9, saved: -6250 }, { year: 10, saved: -4412 }, { year: 11, saved: -2508 }, { year: 12, saved: -523 }, { year: 13, saved: 1546 }, { year: 14, saved: 3689 }, { year: 15, saved: 5922 }, { year: 16, saved: 8248 }, { year: 17, saved: 10658 }, { year: 18, saved: 13167 }, { year: 19, saved: 15779 }, { year: 20, saved: 18497 }, { year: 21, saved: 21325 }, { year: 22, saved: 24267 }, { year: 23, saved: 27327 }, { year: 24, saved: 30510 }, { year: 25, saved: 33820 }];
    //    const cumulativeSaved: Array<PayOffParam> = calcCumulativeSaved(params);
    //    expect(cumulativeSaved).toEqual(expectedCumlativeSaved);
    //});
});
