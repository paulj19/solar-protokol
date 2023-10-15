import React, {useEffect, useState} from 'react';
import {
    Area,
    CartesianGrid,
    ComposedChart,
    Label,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip as RechartToolTop,
    XAxis,
    YAxis
} from 'recharts';
import Tooltip from '@mui/material/Tooltip';
import {useGetClientQuery, useGetGeneralParamsQuery} from '@/src/context/RootApi';
import Loading from "@/src/components/Loading";
import ErrorScreen from "@/src/components/ErrorScreen";
import {calcPredictions} from '@/utils/ElectricityCostCalculator';
import {CostPredictions} from '@/types/types';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Fab, FormControlLabel, FormGroup, Switch} from "@mui/material";
import {ArrowForward} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import {Mark} from "@mui/base";
import Slider from "@mui/joy/Slider";
import ElecBarChart from "@/src/SolarElecChart/ElecBarChart";
import {Typography} from "@mui/joy";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionSummary from "@mui/joy/AccordionSummary";
import AccordionDetails from "@mui/joy/AccordionDetails";
import {createTheme, ThemeProvider} from "@mui/material/styles";

type Settings = {
    showSolar: boolean,
    showElecBarChart: boolean,
}

export default function SolarElecChart() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get('clientId');
    const pDate = searchParams.get('pDate');
    // const clientId = "873"
    // const pDate = "2021-10-03"
    useEffect(() => {
        if (!clientId || !pDate) {
            navigate('/');
        }
    }, []);
    const [inflationRate, setInflationRate] = useState<number>(null)
    const [elecIncreaseRate, setElecIncreaseRate] = useState<number>(null)
    const [settings, changeSettings] = useState<Settings>({showSolar: false, showElecBarChart: false});
    const {data: clientParams, isLoading: isClientParamLoading, isError: isClientParamError} = useGetClientQuery({
        pDate,
        clientId
    });
    const {
        data: generalParams,
        isLoading: isGeneralParamLoading,
        isError: isGeneralParamsError
    } = useGetGeneralParamsQuery(undefined);
    // const clientParams = useSelector(state => selectClientById(state, "cid_1"));
    if (isClientParamLoading || isGeneralParamLoading) {
        return <Loading/>;
    }
    //todo why undef rendered twice
    if (isClientParamError || isGeneralParamsError) {
        return <ErrorScreen/>
    }
    //todo no direct url calls with cid, then have to handle loading and error conditions of query

    const comparisonData: Array<CostPredictions> = calcPredictions({
        year: undefined,
        clientParams: {...clientParams},
        generalParams: {
            ...generalParams,
            inflationRate: inflationRate ?? generalParams.inflationRate,
            electricityIncreaseRate: elecIncreaseRate ?? generalParams.electricityIncreaseRate
        }
    });
    let xx = false;
    const comparisonDataWithRange = comparisonData.reduce((acc, item, i, array) => {
        // if (i % 5 !== 0) {
        //     return acc;
        // }
        if (item.electricityCost >= item.solarCost) {
            if (i >= 1 && xx === false) {
                const intersectionResut = intersect(array[i - 1].year, array[i - 1].solarCost, item.year, item.solarCost, array[i - 1].year, array[i - 1].electricityCost, item.year, item.electricityCost);
                if (intersectionResut) {
                    const {x, y}: any = intersectionResut;
                    const intersection = {year: Math.floor(x), electricityCost: y, solarCost: y, range: [y, y]}
                    acc = acc.concat(intersection);
                    xx = true;
                }
            }
            const range = item.electricityCost !== undefined && item.solarCost !== undefined
                ? [item.electricityCost - 1, item.solarCost + 1]
                : [];
            item['range'] = range;
        }
        return acc.concat(item);
    }, []);

    return (
        <>
            <div className="flex flex-col w-[80%]  justify-center m-auto gap-3" data-testid="solar-elec-chart">
                {!settings.showElecBarChart ?
                    <>
                        <h1 className="font-bold text-3xl font-sans text-cyan-900 m-auto pb-2">STROM SOLAR
                            VERGLEICH </h1>
                        <div>
                            <ResponsiveContainer className="h-full w-full min-h-[750px]">
                                <ComposedChart
                                    data={comparisonDataWithRange}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid stroke="#000000" strokeWidth={0.1} strokeOpacity={0.7}/>
                                    <XAxis dataKey="year" ticks={[0, 5, 10, 15, 20, 25]}
                                           tickFormatter={formatXAxisTicks}
                                           tick={{fill: 'green'}} tickSize={8} tickMargin={15} strokeWidth={0.7}/>
                                    <YAxis ticks={getYAxisTicks(comparisonDataWithRange)}
                                           tickFormatter={formatYAxisTicks}
                                           tick={{fill: 'green'}} tickSize={8} tickMargin={15} width={80}
                                           strokeWidth={0.7}>
                                        <Label
                                            style={{
                                                textAnchor: "middle",
                                                fontSize: "1.4em",
                                                fill: "#072543",
                                            }}
                                            dx={-50}
                                            angle={270}
                                            value={"Miete Pro Monat"}/>
                                    </YAxis>
                                    <RechartToolTop/>
                                    <defs>
                                        <linearGradient id="splitColor">
                                            <stop offset="1" stopColor="#bff593" stopOpacity={1}/>
                                        </linearGradient>
                                    </defs>
                                    <Legend layout="horizontal" verticalAlign="top" align="right"/>
                                    <Line type="linear" dataKey="electricityCost" name="Ohne PV" stroke="#FF0000"
                                          strokeWidth={3.5} activeDot={{r: 8}} dot={<CustomizedDot/>}/>
                                    <Line type="linear" dataKey="solarCost" name="Mit Enpal" stroke="#072543"
                                          strokeWidth={3.5}
                                          hide={!settings.showSolar} dot={<CustomizedDot/>}/>
                                    <Area type="linear" dataKey="range" fill="url(#splitColor)"
                                          hide={!settings.showSolar}
                                          legendType='none' tooltipType='none'/>
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                        <ThemeProvider theme={theme}>
                            <FormGroup className="m-auto pt-3">
                                <FormControlLabel control={
                                    <Switch
                                        onChange={(e) => changeSettings({...settings, showSolar: e.target.checked})}/>}
                                                  label={<span
                                                      className="font-sans font-normal text-lg tracking-wide text-cyan-900">{settings.showSolar ? 'Mit Enpal' : 'Ohne Enpal'}</span>}/>
                            </FormGroup>
                        </ThemeProvider>
                    </>
                    : <ElecBarChart comparisonData={comparisonData}/>
                }
            </div>
            <div className="top-44 right-8 absolute"
                 data-testid="settings">
                <AccordionGroup variant="plain">
                    <Accordion>
                        <AccordionSummary>Einstellung</AccordionSummary>
                        <AccordionDetails>
                            <div className="flex justify-center h-[240px] gap-2 pt-4">
                                <div className="flex flex-col justify-center gap-4">
                                    <Slider
                                        orientation="vertical"
                                        color="neutral"
                                        aria-label="inflationRate-slider"
                                        defaultValue={generalParams.inflationRate}
                                        min={generalParams.inflationRate}
                                        max={generalParams.inflationRate + 5}
                                        step={1}
                                        marks={getSliderMarks(generalParams.inflationRate)}
                                        valueLabelDisplay="off"
                                        onChange={(e, value) => setInflationRate(Number(value))}
                                    />
                                    <Typography fontSize={14}>
                                        Inflation Rate
                                    </Typography>
                                </div>
                                <div className="flex flex-col justify-center gap-4">
                                    <Slider
                                        orientation="vertical"
                                        color="neutral"
                                        aria-label="elecIncreaseRate-slider"
                                        defaultValue={generalParams.electricityIncreaseRate}
                                        min={generalParams.electricityIncreaseRate}
                                        max={generalParams.electricityIncreaseRate + 5}
                                        step={1}
                                        marks={getSliderMarks(generalParams.electricityIncreaseRate)}
                                        valueLabelDisplay="off"
                                        onChange={(e, value) => setElecIncreaseRate(Number(value))}
                                    />
                                    <Typography fontSize={14}>
                                        Preiserhöhung
                                    </Typography>
                                </div>
                            </div>
                            <ThemeProvider theme={theme}>
                                <FormGroup className="m-auto pt-3">
                                    <FormControlLabel control={<Switch
                                        onChange={(event, checked) => changeSettings({...settings, showElecBarChart: checked})}/>}
                                                      label="Strom"/>
                                </FormGroup>
                            </ThemeProvider>
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>
            </div>
            <div className="absolute bottom-7 right-7" data-testid="forward-fab">
                <Tooltip title="comparison stat" arrow>
                    <Fab variant="circular" color="inherit" component={Link}
                         to={`/stats?pDate=${pDate}&clientId=${clientId}`}
                         aria-label="add">
                        <ArrowForward/>
                    </Fab>
                </Tooltip>
            </div>
        </>
    )
        ;
}

function getYAxisTicks(comparisonDataWithRange): Array<number> {
    const highestYValue = comparisonDataWithRange[comparisonDataWithRange.length - 1].electricityCost;
    const lowestYValue = Math.min(...comparisonDataWithRange.map(item => item.solarCost));
    const roundedToLowerHundreds = Math.floor(lowestYValue / 100) * 100;
    const ticks = []
    for (let i = roundedToLowerHundreds; (i - 100) <= highestYValue; i += 100) {
        ticks.push(i);
    }
    return ticks;
}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false;
    }

    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
        return false;
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    const line1isHigher = y1 > y3;
    const line1isHigherNext = y2 > y4;

    return {x, y, line1isHigher, line1isHigherNext};
}

function LineLabel({x, y, stroke, value}) {
    return (
        <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} className='custom-label' textAnchor="middle">
            {value + "€"}
        </text>
    );
}

function formatYAxisTicks(value) {
    return value + '€';
}

function formatXAxisTicks(value) {
    return value + 2013;
}

const CustomizedDot = (props) => {
    const {cx, cy, stroke, payload, value} = props;

    if (payload.year % 5 === 0) {
        return (
            <svg x={cx - 4} y={cy - 4} width={8} height={8} fill="white">
                <g transform="translate(4 4)">
                    <circle r="4" fill={stroke}/>
                    <circle r="2" fill="white"/>
                </g>
            </svg>
        );
    }

    return null;
};

const CustomSlider = styled(Slider)(({theme}) => ({
    color: "#072543", //color of the slider between thumbs
    "& .MuiSlider-thumb": {
        backgroundColor: "#072543" //color of thumbs
    },
    "& .MuiSlider-rail": {
        color: "#595959" ////color of the slider outside  teh area between thumbs
    },
    '& input[type="range"]': {
        WebkitAppearance: 'slider-vertical',
    },
}));

function getSliderMarks(currentRate: number): Array<Mark> {
    const marks = [];
    for (let i = currentRate; i <= currentRate + 5; i++) {
        marks.push({value: i, label: i.toString()});
    }
    return marks;
}

const theme = createTheme({
    components: {
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    // Controls default (unchecked) color for the thumb
                    color: "gray"
                },
                colorPrimary: {
                    "&.Mui-checked": {
                        // Controls checked color for the thumb
                        color: "rgb(22 78 99 / var(--tw-text-opacity))"
                    }
                },
                track: {
                    // Controls default (unchecked) color for the track
                    backgroundColor: "gray",
                    ".Mui-checked.Mui-checked + &": {
                        // Controls checked color for the track
                        backgroundColor: "#071730"
                    }
                }
            }
        }
    }
});