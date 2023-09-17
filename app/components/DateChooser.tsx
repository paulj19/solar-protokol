import { Button, ButtonGroup } from "@mui/material";
import { makeStyles } from '@mui/styles';
import {addDays, format, isToday, isTomorrow, startOfToday, startOfTomorrow} from "date-fns";
import {DatePicker, DateTimePicker} from "@mui/x-date-pickers";

const useStyles = makeStyles((theme) => ({
    customButtonGroup: {
        '& .MuiButton-root': {
            borderColor: '#bbbdbb', // Change the border color to your desired color
        },
    },
}));
export function DateChooser({ selectedDate, setSelectedDate }) {
    const classes = useStyles();
    const dateToday = format(startOfToday(), 'yyyy-MM-dd');
    const dateTomorrow = format(startOfTomorrow(), 'yyyy-MM-dd');
    const buttonStyle = { fontSize: "1.1em", color: "#000" }
    const buttonStyleSelected = { fontSize: "1.1em", color: "#f2f2ed", background: "gray" }

    return (
        <ButtonGroup variant="outlined" aria-label="outlined button group" className={classes.customButtonGroup}>
            <Button style={dateToday === selectedDate ? {...buttonStyleSelected} : {...buttonStyle}}
                    onClick={() => setSelectedDate(dateToday)}>Heute</Button>
            <Button style={dateTomorrow === selectedDate ? {...buttonStyleSelected} : {...buttonStyle}}
                    onClick={() => setSelectedDate(dateTomorrow)}>Morgen</Button>
            <DatePicker
                className="w-[180px]"
                label="Datum auswählen"
                onChange={(date) => setSelectedDate(format(date, 'yyyy-MM-dd'))}
                value={new Date(selectedDate)}
                format={"dd.MM.yyyy"}
            />
        </ButtonGroup>
    );
}
