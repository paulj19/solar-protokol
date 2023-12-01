import {Button, ButtonGroup} from "@mui/material";
import {format, startOfToday} from "date-fns";
import {DatePicker} from "@mui/x-date-pickers";
import {styled} from "@mui/material/styles";

export function DateChooser({selectedDate, setSelectedDate}) {
    const dateToday = format(startOfToday(), 'yyyy-MM-dd');
    // const dateTomorrow = format(startOfTomorrow(), 'yyyy-MM-dd');
    const buttonStyle = {fontSize: "1em", width: "100px", height: "40px", color: "#000"}
    const buttonStyleSelected = {fontSize: "1em", width: "100px", height: "40px", color: "#f2f2ed", background: "gray"}

    return (
        <ButtonGroup variant="outlined" aria-label="client-list-dateChooser" className="text-sm ">
            <Button style={dateToday === selectedDate ? {...buttonStyleSelected} : {...buttonStyle}}
                    onClick={() => setSelectedDate(dateToday)}>Heute</Button>
            {/*<Button style={dateTomorrow === selectedDate ? {...buttonStyleSelected} : {...buttonStyle}}*/}
            {/*        onClick={() => setSelectedDate(dateTomorrow)}>Morgen</Button>*/}
            <div data-testid="clientList-datePicker" className="w-[160px]">
                <StyledDatePicker
                    slotProps={{textField: {size: 'small'}}}
                    // label="Datum auswählen"
                    onChange={(date) => setSelectedDate(format(date, 'yyyy-MM-dd'))}
                    value={new Date(selectedDate)}
                    format={"dd.MM.yyyy"}
                />
            </div>
        </ButtonGroup>
    );
}
const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
    "& .MuiInputBase-root": {
        borderRadius: "0px",
        height: "40px",
        marginTop: "1px"
    },
}));
