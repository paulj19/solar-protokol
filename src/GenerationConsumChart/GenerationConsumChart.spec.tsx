import '@testing-library/jest-dom'
import {screen} from "@testing-library/react";
import {renderWithWrappers} from "@/src/mocks/CommonMocks";
import GenerationConsumChart from "@/src/GenerationConsumChart/GenerationConsumChart";

describe('GenerationConsumChart', () => {
    it('should render GenerationConsumChart', () => {
        renderWithWrappers(<GenerationConsumChart/>)
        expect(screen.getByTestId('generationConsum-chart')).toBeInTheDocument();
        expect(screen.getByTestId('backward-fab')).toBeInTheDocument();
        expect(screen.getByTestId('end-fab')).toBeInTheDocument();
    });
});
