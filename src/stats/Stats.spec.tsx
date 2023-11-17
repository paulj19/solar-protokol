import {renderWithWrappers} from "@/src/mocks/CommonMocks";
import {screen} from "@testing-library/react";
import Stats from "@/src/stats/Stats";
import '@testing-library/jest-dom'

describe('Stats', () => {
    it('should render Stats', () => {
        renderWithWrappers(<Stats/>)
        expect(screen.getByTestId('electricity-stats')).toBeInTheDocument();
        expect(screen.getByTestId('stats-chart')).toBeInTheDocument();
        expect(screen.getByTestId('stats-chart')).toBeInTheDocument();
        expect(screen.getByTestId('cum-chart')).toBeInTheDocument();
        expect(screen.getByTestId('electricity-stats')).toBeInTheDocument();
    });
});