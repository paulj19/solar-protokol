import { useSelector } from "react-redux";
import ComparisonChart from "./comparison/chart/ComparisonChart";
import { useGetClientListByPDateQuery, useGetGeneralParamsQuery } from "@/context/RootApi";
import store from "./store";
import Loading from "./Loading";
import { ClientRow } from "./components/ClientRow";

export default function ClientList() {
    const dateToday = new Date("2023-08-22").toISOString().slice(0, 10);
    const { data: clientList, isLoading: isClientListLoading, isError: isClientListError } = useGetClientListByPDateQuery({ startDate: dateToday, endDate: dateToday });
    const { data: generalParams, isLoading: isGeneralParamLoading, isError: isGeneralParamsError } = useGetGeneralParamsQuery(undefined);
    if (isGeneralParamLoading && isClientListLoading) {
        return <Loading />;
    }
    if (isClientListError && isGeneralParamsError) {
        return <div>error, fix me</div>;
    }
    return (<table>
        <thead>
            <tr>
                <th>Presentation Time</th>
                <th>ID</th>
                <th>Nickname</th>
                <th>Remarks</th>
            </tr>
        </thead>
        <tbody>
            {
                Object.entries(clientList).map(([key, value]) => {
                    return (
                        <>
                            {
                                Object.values(value).map((client) => {
                                    return (
                                        <ClientRow key={client.id} {...client} />
                                    )
                                })}
                        </>
                    )
                }
                )
            }
        </tbody>
    </table>);
}