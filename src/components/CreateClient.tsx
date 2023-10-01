import {Alert, Button, InputAdornment, InputLabel, MenuItem, Select, Snackbar, TextField} from "@mui/material";
import {StaticDateTimePicker} from "@mui/x-date-pickers";
import {Controller, useForm} from "react-hook-form";
import {
    useAddClientMutation,
    useGetHighestClientIdQuery,
    useUpdateHighestClientIdMutation
} from "@/src/context/RootApi";
import {addHours, format, setHours} from "date-fns";
import {useRef, useState} from "react";
import {Typography} from "@mui/joy";
import Loading from "@/src/components/Loading";
import ErrorScreen from "@/src/components/ErrorScreen";

export function CreateClient({selectedDate, clientToEdit, setModalParams}) {
    const {data, isLoading: isIdLoading, isFetching: isIdFetching, isError} = useGetHighestClientIdQuery("uid_1", {skip: Boolean(clientToEdit)});
    const prevPresentationDate = useRef<Date>();
    const defaultValues = {
        nickname: "",
        remarks: "",
        status: "open",
        basePrice: 10,
        unitPrice: 32,
        consumptionYearly: 3500,
        productionYearly: 7000,
    }
    const [updateHighestClientId] = useUpdateHighestClientIdMutation();
    const [addNewClient, result] = useAddClientMutation();
    const {control, reset, formState, handleSubmit} = useForm({
        values: clientToEdit ? {...clientToEdit, presentationDate: new Date(clientToEdit.presentationDate), unitPrice: clientToEdit.unitPrice * 100} : {
            ...defaultValues,
            presentationDate: prevPresentationDate.current ? addHours(prevPresentationDate.current, 1) : setHours(new Date(selectedDate), 10),
            id: data ? data.highestClientId + 1 : 0,
        }
    });
    const [snackData, setSnackData] = useState({open: false, severity: null, message: null});

    if (!clientToEdit) {
        if (isIdLoading) {
            return <Loading/>;
        }
        if (isError) {
            return <ErrorScreen/>
        }
    }

    const onSubmit = async (data) => {
        try {
            //todo presentationDate is duplicated, etc.
            if (!data.id || !data.presentationDate || !data.basePrice || !data.unitPrice || !data.consumptionYearly || !data.productionYearly) {
                setSnackData({open: true, severity: "error", message: "An error occurred, please refresh the page and try again."});
                return;
            }
            const unitPrice = data.unitPrice / 100;
            //todo check if presentationDate is in string
            const presentationDate = format(new Date(data.presentationDate), "yyyy-MM-dd");

            const client = {nickname: data.nickname, presentationDate: data.presentationDate.toString(), remarks: data.remarks, status: data.status, id: data.id, basePrice: data.basePrice, unitPrice: unitPrice, consumptionYearly: data.consumptionYearly, productionYearly: data.productionYearly}

            await addNewClient({pDate: presentationDate, data: {["uid_1/" + presentationDate + "/cid_" + client.id]: client}}).unwrap()

            if (!clientToEdit) {
                await updateHighestClientId({"uid_1": client.id}).unwrap().catch((e) => {
                    //todo delete client again
                });
                prevPresentationDate.current = data.presentationDate;
                setSnackData({open: true, severity: "success", message: "Client creation success!"});
            } else {
                setSnackData({open: true, severity: "success", message: "Client edit success!"});
                setTimeout(() => {
                    setModalParams({openModal: false, clientIdToEdit: null});
                }, 2000);
            }
        } catch (e) {
            console.error("error on add or edit client", e);
            setSnackData({open: true, severity: "error", message: "An error occurred, please refresh the page and try again."});
        }
    };

    const handleSnackClose = () => {
        setSnackData({open: false, severity: null, message: null});
    };

    return (
        <>
            <Typography
                component="h2"
                level="h2"
                textColor="inherit"
                fontWeight="sm"
                textAlign="center"
                pb={3}
            >
                Create New Client
            </Typography>
            <div className="flex justify-center items-center">
                <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset()}
                      className="grid grid-cols-2 gap-3 w-[70%]">
                    <div className="flex flex-col justify-between gap-3">
                        <Controller
                            name="nickname"
                            control={control}
                            render={({field}) => <TextField {...field} label="Nickname"
                                                            inputProps={{maxLength: 32, autoFocus: true}}/>}
                        />
                        <Controller
                            name="remarks"
                            control={control}
                            render={({field}) => <TextField {...field} label="Remarks" minRows={5} multiline
                                                            inputProps={{maxLength: 128}}/>}
                        />
                        <InputLabel id="select-label">Status</InputLabel>
                        <Controller
                            name="status"
                            control={control}
                            render={({field}) => (
                                <Select {...field}
                                        sx={{width: 150}}
                                >
                                    <MenuItem value="open">open</MenuItem>
                                    <MenuItem value="completed">completed</MenuItem>
                                </Select>
                            )}
                        />
                        <Controller
                            name="id"
                            control={control}
                            render={({field}) => <TextField {...field} label="client id" disabled/>}
                        />
                        <Controller
                            name="basePrice"
                            control={control}
                            render={({field}) => <TextField {...field} label="Base Price" InputProps={{
                                endAdornment: <InputAdornment
                                    position="start">€</InputAdornment>, type: 'number', required: true
                            }}/>}
                        />
                        <Controller
                            name="unitPrice"
                            control={control}
                            render={({field}) => <TextField {...field} label="Unit Price" InputProps={{
                                endAdornment: <InputAdornment position="start">Cents pro
                                    Kwh</InputAdornment>, type: 'number',
                            }} inputProps={{pattern: "[0-9]+"}}/>}
                        />
                        <Controller
                            name="consumptionYearly"
                            control={control}
                            render={({field}) => <TextField {...field} label="Consumption Yearly" InputProps={{
                                endAdornment: <InputAdornment position="start">Kwh</InputAdornment>, type: 'number',
                            }}/>}
                        />
                        <Controller
                            name="productionYearly"
                            control={control}
                            render={({field}) => <TextField {...field} label="Production Yearly" InputProps={{
                                endAdornment: <InputAdornment position="start">Kwh</InputAdornment>, type: 'number',
                            }}/>}
                        />
                    </div>
                    <Controller
                        name="presentationDate"
                        control={control}
                        render={({field}) =>
                            <div className="border border-gray-400 rounded-md p-3">
                                <InputLabel>Presentation Date</InputLabel>
                                <StaticDateTimePicker {...field} ampm={false} slotProps={{actionBar: {actions: []}}}/>
                            </div>
                        }
                    />
                    <Button variant="contained" color="inherit" type="submit">Save</Button>
                    <Button variant="contained" color="inherit" type="reset">Reset</Button>
                </form>
                <Snackbar open={snackData.open} autoHideDuration={3000} aria-label="clientCreate-snackbar"
                          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleSnackClose}>
                    <Alert severity={snackData.severity ?? "info"} sx={{width: '100%'}}>
                        {snackData.message}
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
}