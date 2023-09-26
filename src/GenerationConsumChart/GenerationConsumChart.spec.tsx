import '@testing-library/jest-dom'
import {screen} from "@testing-library/react";
import {renderWithWrappers} from "@/src/mocks/CommonMocks";
import GenerationConsumChart from "@/src/GenerationConsumChart/GenerationConsumChart";

describe('GenerationConsumChart', () => {
    it('should render GenerationConsumChart', () => {
        renderWithWrappers(<GenerationConsumChart/>)
        expect(screen.getByTestId('generationConsum-chart')).toBeInTheDocument();
        expect(screen.getByTestId('fab-backward')).toBeInTheDocument();
        expect(screen.getByTestId('fab-forward')).toBeInTheDocument();
    });
});
