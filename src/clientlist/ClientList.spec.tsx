import {act, screen} from "@testing-library/react";
import ClientList from "@/src/clientlist/ClientList";
import {renderWithWrappers} from "@/src/mocks/CommonMocks";
import "@/src/mocks/CommonMocks";
import {mockData} from "@/src/setupTests";
import '@testing-library/jest-dom'


describe('ClientList', () => {
    it('should render ClientList', () => {
        renderWithWrappers(<ClientList/>)
        expect(screen.getByLabelText('client-list-dateChooser')).toBeInTheDocument();
        expect(screen.getByTestId('client-list-table')).toBeInTheDocument();
        expect(screen.getAllByRole('columnheader')).toHaveLength(6);
        expect(screen.getAllByRole('row')).toHaveLength(mockData.length + 1);
        expect(screen.getAllByRole('cell')).toHaveLength(6 * mockData.length);
        expect(screen.getByLabelText('add-client-button')).toBeInTheDocument();
    });
    it('should render open create client modal', () => {
        renderWithWrappers(<ClientList/>)
        expect(screen.getByLabelText('add-client-button')).toBeInTheDocument();
        act(() => {
            screen.getByLabelText('add-client-button').click();
        });
        expect(screen.getByLabelText('create-client-modal')).toBeInTheDocument();
    });
    // it('should render open delete client dialog', () => {
    //     renderWithWrappers(<ClientList/>)
    //     expect(screen.getAllByLabelText('delete-client-button')).toHaveLength(mockData.length);
    //     act(() => {
    //         screen.getAllByLabelText('delete-client-button')[0].click();
    //     });
    //     expect(screen.getByLabelText('delete-client-dialog')).toBeInTheDocument();
    // });
});

