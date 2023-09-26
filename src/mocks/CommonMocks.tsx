import {render} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import ClientList from "@/src/clientlist/ClientList";
import {ReactElement} from "react";
import {Provider} from "react-redux";

const mockStore = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
    [Symbol.observable]: jest.fn(),
}
export const renderWithWrappers = (Component: ReactElement) => {
    render(
        <Provider store={mockStore}>
            <BrowserRouter>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {Component}
                </LocalizationProvider>
            </BrowserRouter>
        </Provider>
    )
}


