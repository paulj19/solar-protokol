import {renderWithWrappers} from "@/src/mocks/CommonMocks";
import {screen} from "@testing-library/react";
import Stats from "@/src/stats/Stats";
import '@testing-library/jest-dom'

describe('Stats', () => {
    it('should render Stats', () => {
        renderWithWrappers(<Stats/>)
        expect(screen.getByTestId('electricity-stats')).toBeInTheDocument();
        expect(screen.getByTestId('comparisonStats-chart')).toBeInTheDocument();
        expect(screen.getByTestId('solar-stats')).toBeInTheDocument();
    });
});