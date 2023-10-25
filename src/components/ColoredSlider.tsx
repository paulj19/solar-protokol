import { styled } from "@mui/material/styles";
import Slider from "@mui/joy/Slider";

const ColoredSlider = styled(Slider)(({ theme }) => ({
    color: "#072543", //color of the slider between thumbs
    "& .MuiSlider-thumb": {
        backgroundColor: "rgba(var(--slider-thumb))" //color of thumbs
    },
    "& .MuiSlider-rail": {
        // backgroundColor: "rgba(var(--slider-thumb), 0.05)"
    },
    "& .MuiSlider-track": {
        backgroundColor: "rgba(var(--slider-thumb), 0.85)"
    },
    '& input[type="range"]': {
        WebkitAppearance: 'slider-vertical',
    },
}));

export default ColoredSlider;