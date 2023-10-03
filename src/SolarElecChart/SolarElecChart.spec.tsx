import {screen} from "@testing-library/react";
import {renderWithWrappers} from "@/src/mocks/CommonMocks";
import SolarElecChart from "@/src/SolarElecChart/SolarElecChart";
import '@testing-library/jest-dom'

describe('SolarElecChart', () => {
    it('should render SolarElecChart', () => {
        renderWithWrappers(<SolarElecChart/>)
        expect(screen.getByTestId('solar-elec-chart')).toBeInTheDocument();
        expect(screen.getByTestId('solar-toggle')).toBeInTheDocument();
        expect(screen.getByTestId('inflation-elec-slider')).toBeInTheDocument();
        expect(screen.getByTestId('forward-fab')).toBeInTheDocument();
    });
});