import {renderWithWrappers} from "@/src/mocks/CommonMocks";
import {screen} from "@testing-library/react";
import SolarElecStats from "@/src/stats/SolarElecStats";
import '@testing-library/jest-dom'

describe('SolarElecStats', () => {
    it('should render SolarElecStats', () => {
        renderWithWrappers(<SolarElecStats/>)
        expect(screen.getByTestId('electricity-stats')).toBeInTheDocument();
        expect(screen.getByTestId('comparisonStats-chart')).toBeInTheDocument();
        expect(screen.getByTestId('solar-stats')).toBeInTheDocument();
    });
});