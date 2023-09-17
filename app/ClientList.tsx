import {useGetClientListByPDateQuery, useGetGeneralParamsQuery} from "@/context/RootApi";
import { ClientRow } from "./components/ClientRow";
import { useState } from "react";
import { DateChooser } from "./components/DateChooser";
import Modal from "@mui/joy/Modal";
import {CreateClient} from "@/app/CreateClient";
import Add from '@mui/icons-material/Add';
import {ModalClose, ModalDialog} from "@mui/joy";
import Loading from "@/app/components/Loading";
import Button from "@material-ui/core/Button";
import {format, startOfDay, startOfToday} from "date-fns";
import {Client} from "@/types/types";

export default function ClientList() {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string>(format(startOfToday(), 'yyyy-MM-dd'))
    const { data: clientList, isLoading: isClientListLoading, isError: isClientListError } = useGetClientListByPDateQuery({ startDate: selectedDate, endDate: selectedDate });
    const { data: generalParams, isLoading: isGeneralParamLoading, isError: isGeneralParamsError } = useGetGeneralParamsQuery(undefined);

    if (isGeneralParamLoading && isClientListLoading) {
        return <Loading />;
    }
    if (isClientListError && isGeneralParamsError) {
        return <div>error, fix me</div>;
    }

    return (
        <div className="flex flex-col items-center justify-around">
            <DateChooser selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
            {
                clientList?.[selectedDate] ?
                    <table className="w-full table-fixed font-sans text-base my-5">
                        <thead>
                        <tr className="border h-[50px] bg-gray-500 shadow-lg text-gray-200 font-mono">
                            <th className="w-[15%] ">Termin Zeit</th>
                            <th className="w-[5%]">ID</th>
                            <th className="w-[15%]">Nickname</th>
                            <th className="w-[35%]">Bemerkungen</th>
                            <th className="w-[10%]">Status</th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            // Array.from(clientList[selectedDate]).map((value) => {
                            //     return (
                            //         <>
                            //             {
                            Object.values(clientList[selectedDate]).map((client: Client) => {
                                return (
                                    <ClientRow key={client.id} {...client} />
                                )
                            })
                            //             }
                            //         </>
                            //     )
                            // }
                            // )
                        }
                        </tbody>
                    </table> : <p className="p-[50vw]">no entries yet, add new</p>

            }
            <Button
                variant="outlined"
                color="inherit"
                startIcon={<Add/>}
                size="medium"
                onClick={() => setOpenModal(true)}
            >
                New Client
            </Button>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <ModalDialog
                    color="neutral"
                    variant="outlined"
                    className="h-[75%] w-[80%] justify-center"
                >
                    <ModalClose/>
                    <CreateClient selectedDate={selectedDate}/>
                </ModalDialog>
            </Modal>
        </div>
    );

}
