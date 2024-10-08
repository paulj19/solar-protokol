import {Alert, Button, FormControlLabel, InputAdornment, Snackbar, TextField, ToggleButton} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {useGetGeneralParamsQuery, useUpdateGeneralParamsMutation} from "@/src/context/RootApi";
import {useState} from "react";
import {Typography} from "@mui/joy";
import Loading from "@/src/components/Loading";
import ErrorScreen from "@/src/components/ErrorScreen";
import {CLOSE_MODAL_DELAY, ERROR_TEXT} from "@/utils/CommonVars";
import {FormControl, FormLabel, Radio, RadioGroup} from "@material-ui/core";
import {useTheme} from "next-themes";

export function EditGeneralParams({setOpenModal}) {
    const { setTheme, theme } = useTheme();
    const {
        data: values,
        isLoading: isGeneralParamLoading,
        isError: isGeneralParamQueryError
    } = useGetGeneralParamsQuery(undefined);
    const [updateGeneralParams] = useUpdateGeneralParamsMutation();
    const [snackData, setSnackData] = useState({open: false, severity: null, message: null});
    const {control, reset, formState, handleSubmit} = useForm({
        values: {
            ...values,
            feedInPrice: values?.feedInPrice * 100,
        }
    });

    if (isGeneralParamLoading) {
        return <Loading/>;
    }
    if (isGeneralParamQueryError) {
        return <ErrorScreen/>
    }
    
    function handleThemeChange(event) {
        setTheme(event.target.value)
    }
    const onSubmit = async (data) => {
        try {
            // if (!data.feedInPrice || !data.rent || !data.inflationRate || !data.electricityIncreaseRate || !data.yearLimit) {
            //     setSnackData({open: true, severity: "error", message: ERROR_TEXT});
            //     return;
            // }
            //todo convert to watch
            if (data.rentDiscountAmount > data.rent) {
                setSnackData({open: true, severity: "error", message: "Rabatt darf nicht größer als PV-Rate sein"});
                return;
            }
            const feedInPrice = data.feedInPrice / 100;
            await updateGeneralParams({...data, feedInPrice}).unwrap()
            setSnackData({open: true, severity: "success", message: "Einstellungen gespeichert!"});
            setTimeout(() => setOpenModal(false), CLOSE_MODAL_DELAY);
        } catch (e) {
            console.error("error on edit general params", e);
            setSnackData({open: true, severity: "error", message: ERROR_TEXT});
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
                alignItems="center"
            >
                Einstellungen
            </Typography>
            <div className="flex justify-center align-top" data-testid="modal-editGeneralParams">
                <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset()}
                      className="grid grid-cols-2 gap-3">
                    <Controller
                        name="feedInPrice"
                        control={control}
                        render={({field}) => <TextField {...field} label="Einspeisevergütung" onChange={(e) => {
                            field.onChange(Number(e.target.value))
                        }} InputProps={{
                            endAdornment: <InputAdornment position="start">Cents</InputAdornment>, type: 'number',
                        }}/>}
                    />
                    <Controller
                        name="rent"
                        control={control}
                        render={({field}) => <TextField {...field} label="PV-Rate Enpal" onChange={(e) => {
                            field.onChange(Number(e.target.value))
                        }} InputProps={{
                            endAdornment: <InputAdornment position="start">€</InputAdornment>, type: 'number',
                        }}/>}
                    />
                    <Controller
                        name="inflationRate"
                        control={control}
                        render={({field}) => <TextField {...field} label="Inflation Rate" onChange={(e) => {
                            field.onChange(Number(e.target.value))
                        }} InputProps={{
                            endAdornment: <InputAdornment position="start">Prozent</InputAdornment>, type: 'number',
                        }}/>}
                    />
                    <Controller
                        name="electricityIncreaseRate"
                        control={control}
                        render={({field}) => <TextField {...field} label="Strompreissteigerung" onChange={(e) => {
                            field.onChange(Number(e.target.value))
                        }} InputProps={{
                            endAdornment: <InputAdornment position="start">Prozent</InputAdornment>, type: 'number'
                        }}/>}
                    />
                    <Controller
                        name="rentDiscountAmount"
                        control={control}
                        render={({field}) => <TextField {...field} label="Rabatt" onChange={(e) => {
                            field.onChange(Number(e.target.value))
                        }} InputProps={{
                            endAdornment: <InputAdornment position="start">€/monat</InputAdornment>, type: 'number',
                        }}/>}
                    />
                    <Controller
                        name="rentDiscountPeriod"
                        control={control}
                        render={({field}) => <TextField {...field} label="Rabatt Jahre" onChange={(e) => {
                            field.onChange(Number(e.target.value))
                        }} InputProps={{
                            endAdornment: <InputAdornment position="start">Jahre</InputAdornment>, type: 'number',
                        }}/>}
                    />
                    <Controller
                        name="yearLimitPrediction"
                        control={control}
                        render={({field}) => <TextField {...field} label="Anzahl der Jahre in Grafik" onChange={(e) => {
                            field.onChange(Number(e.target.value))
                        }} InputProps={{
                            endAdornment: <InputAdornment position="start">Jahre</InputAdornment>,
                            type: 'number',
                            required: true,
                            inputProps: {min: 0, max: 60}
                        }}
                        />}
                    />
                    <Controller
                        name="yearLimitRent"
                        control={control}
                        render={({field}) => <TextField {...field} label="Mietzahlungsdauer" onChange={(e) => {
                            field.onChange(Number(e.target.value))
                        }} InputProps={{
                            endAdornment: <InputAdornment position="start">Jahre</InputAdornment>, type: 'number',
                        }}/>}
                    />
                    <FormControl className="col-span-full">
                        <FormLabel id="select-theme">Theme</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="select-theme"
                            name="select-theme"
                            value={theme}
                            onChange={handleThemeChange}
                        >
                            <FormControlLabel value="light" control={<Radio />} label="Light"/>
                            <FormControlLabel value="dark" control={<Radio />} label="Dark"/>
                            <FormControlLabel value="combi2" control={<Radio />} label="combi2"/>
                            <FormControlLabel value="combi3" control={<Radio />} label="combi3"/>
                            <FormControlLabel value="combi4" control={<Radio />} label="combi4"/>
                            <FormControlLabel value="combi5" control={<Radio />} label="combi5"/>
                            <FormControlLabel value="combi6" control={<Radio />} label="combi6"/>
                            <FormControlLabel value="combi7" control={<Radio />} label="combi7"/>
                            <FormControlLabel value="combi8" control={<Radio />} label="combi8"/>
                        </RadioGroup>
                    </FormControl>
                    <Button variant="contained" color="inherit" type="submit">Speichern</Button>
                    <Button variant="contained" color="inherit" type="reset">Zurücksetzen</Button>
                </form>
                <Snackbar open={snackData.open} autoHideDuration={CLOSE_MODAL_DELAY}
                          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={handleSnackClose}>
                    <Alert severity={snackData.severity ?? "info"} sx={{width: '100%'}}>
                        {snackData.message}
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
}
