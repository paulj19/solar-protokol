import {useDeleteClientMutation, useGetClientListByPDateQuery} from "../context/RootApi";
import {ClientRow} from "./ClientRow";
import {useState} from "react";
import {DateChooser} from "../components/DateChooser";
import Modal from "@mui/joy/Modal";
import {CreateClient} from "@/src/components/CreateClient";
import Add from '@mui/icons-material/Add';
import {ModalClose, ModalDialog} from "@mui/joy";
import Loading from "@/src/components/Loading";
import ErrorScreen from "@/src/components/ErrorScreen";
import Button from "@material-ui/core/Button";
import {format, startOfToday} from "date-fns";
import {Client} from "@/types/types";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import {Alert, Snackbar} from "@mui/material";

export default function ClientList() {
    const [modalParams, setModalParams] = useState<{ openModal: boolean, clientIdToEdit: string }>({openModal: false, clientIdToEdit: null});
    const [selectedDate, setSelectedDate] = useState<string>(format(startOfToday(), 'yyyy-MM-dd'))
    const [deleteData, setDeleteData] = useState({openDeleteDialog: false, pDate: null, clientId: null});
    const [snackData, setSnackData] = useState({open: false, severity: null, message: null});
    const {data: clientList, isLoading: isClientListLoading, isError: isClientListError} = useGetClientListByPDateQuery({startDate: selectedDate, endDate: selectedDate});
    const [deleteClient] = useDeleteClientMutation();

    if (isClientListLoading) {
        return <Loading/>;
    }
    if (isClientListError) {
        return <ErrorScreen/>
    }

    function onDeleteClientClose() {
        setDeleteData({openDeleteDialog: false, pDate: null, clientId: null});
    }
    const handleSnackClose = () => {
        setSnackData({open: false, severity: null, message: null});
    };

    async function triggerDeleteClient(pDate, clientId) {
        setDeleteData({openDeleteDialog: true, pDate: pDate, clientId: clientId});
    }

    async function handleDeleteClient() {
        try {
            await deleteClient({pDate: format(new Date(deleteData.pDate), "yyyy-MM-dd"), clientId: "cid_" + deleteData.clientId}).unwrap();
            setSnackData({open: true, severity: "success", message: "Client deleted successfully."});
        } catch (e) {
            setSnackData({open: true, severity: "error", message: "An error occurred, please refresh the page and try again."});
            console.error("error deleting client", e)
        }
        onDeleteClientClose();
    }

    return (
        <div className="flex flex-col items-center justify-around w-full">
            <DateChooser selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
            {
                clientList?.length ?
                    <table className="w-full table-auto font-sans text-sm my-5 text-left"
                           data-testid="client-list-table">
                        <thead>
                        <tr className="border h-[50px] bg-gray-500 shadow-lg text-gray-200 font-mono">
                            <th>Termin Zeit</th>
                            <th>ID</th>
                            <th className="w-[20%]">Nickname</th>
                            <th className="w-[35%]">Bemerkungen</th>
                            <th>Status</th>
                            <th className="w-[22%]"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            clientList.map((client: Client) => {
                                return (
                                    <ClientRow key={client.id} {...{client, setModalParams, triggerDeleteClient}} />
                                )
                            })
                        }
                        </tbody>
                    </table> : <p className="p-5" data-testid="no-client-msg">no entries yet, add new</p>

            }
            <Button
                variant="outlined"
                color="inherit"
                startIcon={<Add/>}
                size="medium"
                aria-label="add-client"
                autoFocus={false}
                onClick={() => setModalParams({openModal: true, clientIdToEdit: null})}
            >
                New Client
            </Button>
            <Modal open={modalParams.openModal}
                   onClose={() => setModalParams({openModal: false, clientIdToEdit: null})}
                   aria-label="create-client-modal"
            >
                <ModalDialog
                    color="neutral"
                    variant="outlined"
                    className="h-fit w-[70%] justify-center"
                >
                    <ModalClose aria-label="modal-close"/>
                    <CreateClient selectedDate={selectedDate} setModalParams={setModalParams}
                                  clientToEdit={modalParams.clientIdToEdit ? clientList.find((client) => client.id === modalParams.clientIdToEdit) : null}/>
                </ModalDialog>
            </Modal>
            <Dialog
                open={deleteData.openDeleteDialog}
                onClose={onDeleteClientClose}
                aria-labelledby="delete-client-dialog"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Client"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this client?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDeleteClientClose}>Cancel</Button>
                    <Button onClick={handleDeleteClient} aria-label="deleteClient-confirm">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackData.open} autoHideDuration={3000}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleSnackClose}  aria-label="deleteClient-snackbar">
                <Alert severity={snackData.severity ?? "info"} sx={{width: '100%'}}>
                    {snackData.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
