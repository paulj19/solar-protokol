import {Alert, Button, InputAdornment, Snackbar, TextField} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {useGetGeneralParamsQuery, useUpdateGeneralParamsMutation} from "@/context/RootApi";
import {useState} from "react";
import {Typography} from "@mui/joy";
import Loading from "@/src/components/Loading";
import Error from "@/src/components/Error";

export function EditGeneralParams({setOpenModal}) {
    const {data: values, isLoading: isGeneralParamLoading, isError: isGeneralParamQueryError} = useGetGeneralParamsQuery(undefined);
    const [updateGeneralParams] = useUpdateGeneralParamsMutation();
    const {control, reset, formState, handleSubmit} = useForm({values: {...values, feedInPrice: values.feedInPrice * 100,}});
    const [snackData, setSnackData] = useState({open: false, severity: null, message: null});

    if (isGeneralParamLoading) {
        return <Loading/>;
    }
    if (isGeneralParamQueryError) {
        return <Error/>
    }

    const onSubmit = async (data) => {
        try {
            if (!data.feedInPrice || !data.rent || !data.inflationRate || !data.electricityIncreaseRate || !data.rentDiscountRate || !data.rentDiscountPeriod || !data.yearLimit) {
                setSnackData({open: true, severity: "error", message: "An error occurred, please refresh the page and try again."});
                return;
            }
            const feedInPrice = data.feedInPrice / 100;
            const generalParams = {
                feedInPrice: feedInPrice, rent: parseInt(data.rent),
                inflationRate: parseInt(data.inflationRate), electricityIncreaseRate: parseInt(data.electricityIncreaseRate),
                rentDiscountRate: parseInt(data.rentDiscountRate), rentDiscountPeriod: parseInt(data.rentDiscountPeriod),
                yearLimit: parseInt(data.yearLimit)
            };
            await updateGeneralParams(generalParams).unwrap()
            setSnackData({open: true, severity: "success", message: "General Params edit success!"});
            setTimeout(() => setOpenModal(false), 1500);
        } catch (e) {
            setSnackData({open: true, severity: "error", message: "An error occurred, please refresh the page and try again."});
            console.error("error on edit general params", e);
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
                pb={6}
            >
                Edit General Params
            </Typography>
            <div className="flex justify-center items-center">
                <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset()}
                      className="grid grid-cols-2 gap-3 w-[70%]">
                    <Controller
                        name="feedInPrice"
                        control={control}

                        render={({field}) => <TextField {...field} label="FeedIn Price" InputProps={{
                            endAdornment: <InputAdornment position="start">Cents</InputAdornment>, type: 'number',
                        }}/>}
                    />
                    <Controller
                        name="rent"
                        control={control}
                        render={({field}) => <TextField {...field} label="Rent" InputProps={{
                            endAdornment: <InputAdornment position="start">Euros</InputAdornment>, type: 'number',
                        }}/>}
                    />
                    <Controller
                        name="inflationRate"
                        control={control}
                        render={({field}) => <TextField {...field} label="Inflation Rate" InputProps={{
                            endAdornment: <InputAdornment position="start">Percent</InputAdornment>, type: 'number',
                        }}/>}
                    />
                    <Controller
                        name="electricityIncreaseRate"
                        control={control}
                        render={({field}) => <TextField {...field} label="Electricity Increase Rate" InputProps={{
                            endAdornment: <InputAdornment position="start">Percent</InputAdornment>, type: 'number',
                        }}/>}
                    />
                    <div className="flex justify-between col-span-2 gap-2">
                        <Controller
                            name="rentDiscountRate"
                            control={control}
                            render={({field}) => <TextField {...field} label="Rent Discount Rate" InputProps={{
                                endAdornment: <InputAdornment position="start">Percent</InputAdornment>, type: 'number',
                            }}/>}
                        />
                        <Controller
                            name="rentDiscountPeriod"
                            control={control}
                            render={({field}) => <TextField {...field} label="Rent Discount Period" InputProps={{
                                endAdornment: <InputAdornment position="start">Years</InputAdornment>, type: 'number',
                            }}/>}
                        />
                        <Controller
                            name="yearLimit"
                            control={control}
                            render={({field}) => <TextField {...field} label="Year Limit" InputProps={{
                                endAdornment: <InputAdornment position="start">Years</InputAdornment>, type: 'number',
                            }}/>}
                        />
                    </div>
                    <Button variant="contained" color="inherit" type="submit">Save</Button>
                    <Button variant="contained" color="inherit" type="reset">Reset</Button>
                </form>
                <Snackbar open={snackData.open} autoHideDuration={3000}
                          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleSnackClose}>
                    <Alert severity={snackData.severity ?? "info"} sx={{width: '100%'}}>
                        {snackData.message}
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
}
