import {Alert, Button, InputAdornment, InputLabel, MenuItem, Select, Snackbar, TextField} from "@mui/material";
import {StaticDateTimePicker} from "@mui/x-date-pickers";
import { Controller, useForm } from "react-hook-form";
import {
    useAddClientMutation,
    useGetHighestClientIdQuery,
    useUpdateHighestClientIdMutation
} from "@/context/RootApi";
import {format} from "date-fns";
import {useState} from "react";
import {Typography} from "@mui/joy";
import Loading from "@/app/components/Loading";
import {isError} from "@jest/expect-utils";

export function CreateClient({selectedDate, clientToEdit}: { selectedDate: string, clientToEdit?: any }) {
    const {data , isLoading, isFetching, isError} = useGetHighestClientIdQuery("uid_1", {skip: clientToEdit !== undefined});
    console.log("isFetching", isFetching, isLoading)
    console.log("highest", data?.highestClientId)
    const defaultValues =      {       nickname: "",
        remarks: "",
        status: "Open",
        id: data ? data.highestClientId + 1 : null,
        presentationDate: new Date(selectedDate).setHours(10, 0, 0, 0),
        basePrice: 10,
        unitPrice: 32,
        consumptionYearly: 3500,
        productionYearly: 7000,}

    const {control, reset, formState: {errors}, handleSubmit} = useForm({
        values: clientToEdit ?? {
            ...defaultValues,
            id: data ? data.highestClientId + 1 : null,
        }
    });
    const [updateHighestClientId] = useUpdateHighestClientIdMutation();
    const [addNewClient] = useAddClientMutation();
    const [openSuccessSnack, setOpenSuccessSnack] = useState(false);

    if (!clientToEdit) {
        if (isLoading ){
            return <Loading/>;
        }
        if (isError) {
            return <div>error, fix me</div>;
        }
    }

    const onSubmit = async (data) => {
        //todo sanity checks, e.g. if id is not null, presentationDate is duplicated, etc.
        const unitPrice = data.unitPrice / 100;
        const presentationDate = format(data.presentationDate, "yyyy-MM-dd");

        const newClient = {nickname: data.nickname, presentationDate: data.presentationDate, remarks: data.remarks, status: data.status, id: data.id, basePrice: data.basePrice, unitPrice: unitPrice, consumptionYearly: data.consumptionYearly, productionYearly: data.productionYearly}
        //edit => update and close

        await addNewClient({["uid_1/" + presentationDate + "/cid_" + newClient.id]: newClient});
        await updateHighestClientId({"uid_1": newClient.id});

        console.log("UPDATED")
        setOpenSuccessSnack(true);
    };

    const handleSnackClose = () => {
        setOpenSuccessSnack(false);
    };

    return (
        <>
            <Typography
                component="h2"
                level="h2"
                textColor="inherit"
                fontWeight="sm"
                textAlign="center"
                pb={6}
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
                        <Controller
                            name="status"
                            control={control}
                            render={({field}) => (
                                <div>
                                    <InputLabel id="select-label">Status</InputLabel>
                                    <Select {...field}
                                            value="Open"
                                            label="status"
                                            className="w-35">
                                        <MenuItem value="Open">Open</MenuItem>
                                        <MenuItem value="Done">Done</MenuItem>
                                    </Select>
                                </div>
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
                                <StaticDateTimePicker {...field} ampm={false} />
                            </div>
                        }
                    />
                    <Button variant="outlined" type="submit">Save</Button>
                    <Button variant="outlined" type="reset">Reset</Button>
                </form>
                <Snackbar open={openSuccessSnack} autoHideDuration={6000}
                          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleSnackClose}>
                    <Alert severity="success" sx={{width: '100%'}} onClose={handleSnackClose}>
                        Client created!
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
}