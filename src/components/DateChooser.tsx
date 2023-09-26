import {Button, ButtonGroup} from "@mui/material";
import {format, startOfToday, startOfTomorrow} from "date-fns";
import {DatePicker} from "@mui/x-date-pickers";

export function DateChooser({ selectedDate, setSelectedDate }) {
    const dateToday = format(startOfToday(), 'yyyy-MM-dd');
    const dateTomorrow = format(startOfTomorrow(), 'yyyy-MM-dd');
    const buttonStyle = { fontSize: "1.1em", color: "#000" }
    const buttonStyleSelected = { fontSize: "1.1em", color: "#f2f2ed", background: "gray" }

    return (
        <ButtonGroup variant="outlined" aria-label="client-list-dateChooser" className="text-sm">
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
