import { describe } from "node:test";
import { calculationMetrics, normalizedMonthlyConsumption, normalizedMonthlyProduction, calcResidualConsumption, calcResidualConsumptionCostMonthly, getFeedInGeneration, getFeedInTariffMonthly } from "@/utils/ElectricityCostCalculator";

describe("ElectricityCostCalculator", () => {
    it("should caluculate exact electricity cost", () => {
        const consumpitonYearly = 3500;
        const electricityConsumption = [345, 295, 327, 282, 268, 253, 265, 271, 279, 294, 302, 318]
        electricityConsumption.forEach((result, index) => {
            const caluculatedResult = normalizedMonthlyConsumption(consumpitonYearly, calculationMetrics[Object.keys(calculationMetrics)[index]].electricityFactor, calculationMetrics[Object.keys(calculationMetrics)[index]].days);
            expect(caluculatedResult).toBe(result);
        });
    });

    it("should calculate solar production", () => {
        const productionYearly = 7192;
        const solarProduction = [396, 467, 633, 719, 705, 806, 827, 719, 626, 575, 396, 324]
        solarProduction.forEach((result, index) => {
            const caluculatedResult = normalizedMonthlyProduction(productionYearly, calculationMetrics[Object.keys(calculationMetrics)[index]].solarFactor);
            expect(caluculatedResult).toBe(result);
        });
    });

    it("should calculate residual consumption", () => {
        const params: any = { clientParams: { consumptionYearly: 6500, productionYearly: 7192 } };
        const expectedResidualConsumption = [244, 81, 165, 267];
        const resultResiducalConsumption = calcResidualConsumption(params);
        expect(resultResiducalConsumption).toEqual(expectedResidualConsumption);
    });

    it("should calculate residual consumption cost monthly", () => {
        const params = { clientParams: { consumptionYearly: 6500, productionYearly: 7192, unitPrice: 0.32 } };
        const expectedResidualConsumption = 20;
        const resultResidualConsumption = calcResidualConsumptionCostMonthly(params);
        expect(resultResidualConsumption).toEqual(expectedResidualConsumption);
    });

    it("should calculate feedIn generation", () => {
        const params: any = { clientParams: { consumptionYearly: 3500, productionYearly: 7192 } };
        const expectedFeedInGeneration = [51, 172, 306, 437, 437, 553, 562, 448, 347, 281, 94, 6];
        const resultFeedInGeneration = getFeedInGeneration(params);
        expect(resultFeedInGeneration).toEqual(expectedFeedInGeneration);
    });

    it("should calculate feedInTariff monthly", () => {
        const params = { clientParams: { consumptionYearly: 3500, productionYearly: 7192 }, generalParams: { feedInPrice: 0.08 } };
        const expectedFeedInTariff = 25;
        const resultFeedInTariff = getFeedInTariffMonthly(params);
        expect(resultFeedInTariff).toEqual(expectedFeedInTariff);
    });
});