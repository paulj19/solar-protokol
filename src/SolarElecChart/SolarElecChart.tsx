import React, {useEffect, useState} from 'react';
import {
    Area, Bar,
    CartesianGrid, Cell,
    ComposedChart,
    Label,
    Legend,
    Line,
    ResponsiveContainer, Text,
    Tooltip as RechartToolTop,
    XAxis,
    YAxis
} from 'recharts';
import Tooltip from '@mui/material/Tooltip';
import {useGetClientQuery, useGetGeneralParamsQuery} from '@/src/context/RootApi';
import Loading from "@/src/components/Loading";
import ErrorScreen from "@/src/components/ErrorScreen";
import {calcPredictions, calcTotalSaved} from '@/utils/ElectricityCostCalculator';
import {CostPredictions} from '@/types/types';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Fab, FormControlLabel, FormGroup, MobileStepper, Switch} from "@mui/material";
import {ArrowForward, KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";
import {Mark} from "@mui/base";
import ElecBarChart from "@/src/SolarElecChart/ElecBarChart";
import {Typography} from "@mui/joy";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionSummary from "@mui/joy/AccordionSummary";
import AccordionDetails from "@mui/joy/AccordionDetails";
import {createTheme, styled, ThemeProvider} from "@mui/material/styles";
import Button from "@mui/material/Button";
import ColoredSlider from "@/src/components/ColoredSlider";
import {customLabel} from "@/src/stats/Stats";
import {withStyles} from "@mui/styles";
import Slider from "@mui/joy/Slider";

type Settings = {
    currentState: number
}

enum STATE {
    ELEC_BAR,
    ELEC_LINE,
    SOLAR_LINE,
    AREA
}

const STATES = [[STATE.ELEC_BAR], [STATE.ELEC_BAR, STATE.ELEC_LINE], [STATE.ELEC_LINE, STATE.SOLAR_LINE], [STATE.ELEC_LINE, STATE.SOLAR_LINE, STATE.AREA]]

export default function SolarElecChart() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get('clientId');
    const pDate = searchParams.get('pDate');
    // const clientId = "43"
    // const pDate = "2023-11-09"
    useEffect(() => {
        if (!clientId || !pDate) {
            navigate('/');
        }
    }, []);
    const [inflationRate, setInflationRate] = useState<number>(null)
    const [elecIncreaseRate, setElecIncreaseRate] = useState<number>(null)
    const [settings, changeSettings] = useState<Settings>({currentState: 0});
    const {data: clientParams, isLoading: isClientParamLoading, isError: isClientParamError} = useGetClientQuery({
        pDate,
        clientId
    });
    const {
        data: generalParams,
        isLoading: isGeneralParamLoading,
        isError: isGeneralParamsError
    } = useGetGeneralParamsQuery(undefined);
    const currentYear = new Date().getFullYear();
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
    const {totalElecCost, totalSolarCost} = calcTotalSaved({year: 25, clientParams, generalParams});

    function stateHasSolarLine() {
        return STATES[settings.currentState]?.includes(STATE.SOLAR_LINE);
    }

    return (
        <>
            <div className="flex flex-col w-full justify-center m-auto gap-3 pl-[200px]" data-testid="solar-elec-chart">
                <>
                    <h1 className="font-bold text-3xl font-sans text-gray-300 ml-[30%] pb-2">STROM SOLAR
                        VERGLEICH </h1>
                    <div className="flex gap-4 pt-4 min-h-[750px] w-full h-full">
                        <ResponsiveContainer >
                            <ComposedChart
                                data={comparisonDataWithRange}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                {/*<CartesianGrid stroke="#000000" strokeWidth={0.1} strokeOpacity={0.7}/>*/}
                                <XAxis dataKey="year" ticks={[0, 5, 10, 15, 20, 25]}
                                       tickFormatter={value => `${value + currentYear}`}
                                       tick={{fill: 'rgba(var(--color-axis), var(--alpha-axis))'}}
                                       tickSize={8} tickMargin={15} strokeWidth={0.7}
                                />
                                <YAxis
                                    ticks={getYAxisTicks(comparisonDataWithRange, STATES[settings.currentState]?.includes(STATE.SOLAR_LINE))}
                                    tickFormatter={formatYAxisTicks} strokeWidth={0.7}
                                    tick={{fill: 'rgba(var(--color-axis), var(--alpha-axis))'}} tickSize={8}
                                    tickMargin={15} width={80}
                                >
                                    <Label
                                        style={{
                                            textAnchor: "middle",
                                            fontSize: "1.4em",
                                            fill: "rgba(var(--color-legend), var(--alpha-legend))",
                                        }}
                                        dx={-50}
                                        angle={270}
                                        value={"PV-Miete pro Monat"}/>
                                </YAxis>
                                <RechartToolTop
                                    content={<CustomTooltip currentYear={currentYear}/>}
                                    // formatter={value => <span className="text-xl font-medium text-axis">{`Stromrechnung ${value} €`}</span>}
                                    // labelFormatter={label => <span className="text-xl font-medium text-axis">{`Im Jahr ${label + currentYear}`}</span>}
                                />
                                <defs>
                                    <linearGradient id='elec-bar' gradientTransform="rotate(90)" spreadMethod='reflect'>
                                        <stop offset='20%' stopColor={'rgb(var(--color-bar))'}/>
                                        <stop offset='90%' stopColor='rgb(var(--color-axis))'/>
                                    </linearGradient>
                                    <linearGradient id="splitColor">
                                        <stop offset="1" stopColor="rgba(var(--color-axis), 0.6)" stopOpacity={1}/>
                                    </linearGradient>
                                </defs>
                                {/*<defs>*/}
                                {/*    <linearGradient id="elecBar" x1="1" y1="1" x2="0" y2="0">*/}
                                {/*        <stop offset="50%" stopColor="#f7bd0080" stopOpacity={0.5} />*/}
                                {/*        <stop offset="35%" stopColor="#FFFFFF" stopOpacity={0.5} />*/}
                                {/*    </linearGradient>*/}
                                {/*</defs>*/}
                                <Legend layout="horizontal" verticalAlign="top" align="right"/>
                                <Line type="linear" dataKey="electricityCost" name="Ohne PV" stroke="#FF0000"
                                      strokeWidth={STATES[settings.currentState]?.includes(STATE.ELEC_BAR) ? 8.5 : 5.5}
                                      activeDot={{r: 6}} dot={<CustomizedDot/>}
                                      hide={!STATES[settings.currentState]?.includes(STATE.ELEC_LINE)}//todo util function here
                                />
                                <Line type="linear" dataKey="solarCost" name="Mit Enpal" stroke="#10ad3f"
                                      strokeWidth={5.5}
                                      dot={<CustomizedDot/>}
                                      hide={!STATES[settings.currentState]?.includes(STATE.SOLAR_LINE)}
                                />
                                <Area type="linear" dataKey="range" fill="url(#splitColor)"
                                      legendType='none' tooltipType='none'
                                      hide={!STATES[settings.currentState]?.includes(STATE.AREA)}
                                />
                                <Bar dataKey="electricityCost" fill="rgb(var(--color-bar))" barSize={30}
                                     legendType={STATES[settings.currentState]?.includes(STATE.ELEC_BAR) ? 'rect' : 'none'}
                                     hide={!STATES[settings.currentState]?.includes(STATE.ELEC_BAR)}>
                                    {comparisonDataWithRange.map((entry, index) => (
                                        <Cell key="elec-bar" fill={`url(#elec-bar)`}/>
                                    ))}
                                </Bar>
                            </ComposedChart>
                        </ResponsiveContainer>
                        <div className="text-gray-400 font-medium text-sm pt-2 tracking-wide gap-4 flex flex-col">
                            <div className="text-axis">{`INFLATION: ${inflationRate??generalParams.inflationRate}% | PREISSTEIGERUNG: ${elecIncreaseRate??generalParams.electricityIncreaseRate}%`}</div>
                            <h2>IHRE STROMKOSTEN IN DEN NÄCHSTEN 25 JAHREN</h2>
                            <p>{'OHNE SOLAR: '}{<span
                                className="text-lg">{formatEuroCurrency(totalElecCost)}</span>}</p>
                            {stateHasSolarLine() ? <p>{'MIT SOLAR: '}{<span
                                className="text-lg">{formatEuroCurrency(totalSolarCost)}</span>}</p> : null}
                        </div>
                        <MobileStepper
                            variant="progress"
                            steps={STATES.length}
                            activeStep={settings.currentState}
                            sx={{maxWidth: 400, flexGrow: 1, bgcolor: 'transparent', margin: 'auto'}}
                            nextButton={
                                <Button
                                    onClick={() => changeSettings({
                                        ...settings,
                                        currentState: settings.currentState + 1,
                                        // showSolar: STATES[settings.currentState + 1].includes(STATE.SOLAR_LINE),
                                        // showElecBarChart: STATES[settings.currentState + 1].includes(STATE.ELEC_BAR)
                                    })}
                                    disabled={settings.currentState === STATES.length - 1}
                                    sx={{
                                        ':hover': {
                                            bgcolor: 'primary.main', // theme.palette.primary.main
                                            color: 'white',
                                        },
                                        borderRadius: 25,
                                        border: "1px solid rgba(var(--color-axis), var(--alpha-axis))",
                                        fontSize: "1em",
                                        fontWeight: "bold",
                                    }}>
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowLeft/>
                                    ) : (
                                        <KeyboardArrowRight/>
                                    )}

                                </Button>
                            }
                            backButton={
                                <Button
                                    onClick={() => changeSettings({
                                        ...settings,
                                        currentState: settings.currentState - 1,
                                        // showSolar: STATES[settings.currentState + 1].includes(STATE.SOLAR_LINE),
                                        // showElecBarChart: STATES[settings.currentState + 1].includes(STATE.ELEC_BAR)
                                    })}
                                    disabled={settings.currentState === 0}
                                    sx={{
                                        ':hover': {
                                            bgcolor: 'primary.main', // theme.palette.primary.main
                                            color: 'white',
                                        },
                                        borderRadius: 25,
                                        border: "1px solid rgba(var(--color-axis), var(--alpha-axis))",
                                        fontSize: "1em",
                                        fontWeight: "bold",
                                    }}>
                                    {theme.direction === 'rtl' ? (
                                        <KeyboardArrowRight/>
                                    ) : (
                                        <KeyboardArrowLeft/>
                                    )}
                                </Button>
                            }
                        />
                    </div>
                    {/*<ThemeProvider theme={theme}>*/}
                    {/*    <FormGroup className="m-auto pt-3" data-testid="solar-toggle">*/}
                    {/*        <FormControlLabel control={*/}
                    {/*            <Switch*/}
                    {/*                onChange={(e) => changeSettings({...settings, showSolar: e.target.checked})}/>}*/}
                    {/*                          label={<span*/}
                    {/*                              className="font-sans font-normal text-lg tracking-wide text-[#B4AC02B5]">{settings.showSolar ? 'Mit Enpal' : 'Ohne Enpal'}</span>}/>*/}
                    {/*    </FormGroup>*/}
                    {/*</ThemeProvider>*/}
                </>
                {/*     : <ElecBarChart comparisonData={comparisonData}/>
                 } */}
            </div>
            <div className="bottom-24 left-8 absolute"
                 data-testid="settings">
                <AccordionGroup variant="plain">
                    <Accordion>
                        <AccordionSummary className="bg-gray-800"><span
                            className="text-legend"> Einstellung</span></AccordionSummary>
                        <AccordionDetails>
                            <div className="flex justify-center h-[240px] gap-2 pt-4">
                                <div className="flex flex-col justify-center gap-4">
                                    <ColoredSlider
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
                                    <Typography fontSize={14}
                                                textColor="rgba(var(--color-legend), var(--alpha-legend))">
                                        Inflation
                                    </Typography>
                                </div>
                                <div className="flex flex-col justify-center gap-4">
                                    <ColoredSlider
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
                                    <Typography fontSize={14}
                                                textColor="rgba(var(--color-legend), var(--alpha-legend))">
                                         Preissteigerung
                                    </Typography>
                                </div>
                            </div>
                            {/* <ThemeProvider theme={theme}>
                                <FormGroup className="m-auto pt-3">
                                    <FormControlLabel control={<Switch
                                        onChange={(event, checked) => changeSettings({ ...settings, showElecBarChart: checked })} />}
                                        label={<span
                                            className="text-legend">Strom</span>} />
                                </FormGroup>
                            </ThemeProvider> */}
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>
            </div>
            <div className="absolute bottom-7 right-7" data-testid="forward-fab">
                <Tooltip title="comparison stat" arrow>
                    <Fab variant="circular" sx={{backgroundColor: "#474747", color: "#878787de"}} component={Link}
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

function getYAxisTicks(comparisonDataWithRange, showSolar): Array<number> {
    const highestYValue = comparisonDataWithRange[comparisonDataWithRange.length - 1].electricityCost;
    let lowestYValue = 0;
    if (showSolar) {
        const lowestSolarCost = Math.min(...comparisonDataWithRange.map(item => item.solarCost));
        lowestYValue = Math.floor(lowestSolarCost / 100) * 100;
    }
    const ticks = []
    for (let i = lowestYValue; (i - 100) <= highestYValue; i += 100) {
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
    return value + ' €';
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

function getSliderMarks(currentRate: number): Array<Mark> {
    const marks = [];
    for (let i = currentRate; i <= currentRate + 5; i++) {
        marks.push({value: i, label: <span className="text-axis">{i}</span>});
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
                        color: "rgba(9,153,255,0.71)"
                    }
                },
                track: {
                    // Controls default (unchecked) color for the track
                    backgroundColor: "gray",
                    ".Mui-checked.Mui-checked + &": {
                        // Controls checked color for the track
                        backgroundColor: "rgba(9,153,255,0.71)"
                    }
                }
            }
        }
    }
});

function formatEuroCurrency(totalSaved) {
    if (totalSaved < 0) {
        return "0€";
    }

    // Format the number as Euro currency with German formatting
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(totalSaved);

}

const CustomTooltip = ({active, payload, label, currentYear}) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-300 p-2 border rounded-sm opacity-95">
                <div className="text-xl font-medium text-axis">{`Im Jahr ${label + currentYear}`}</div>
                <div className="text-xl font-medium text-axis">{`Stromrechnung ${payload[0].value} €`}</div>
            </div>
        );
    }

    return null;
};


const StepButton = styled(Button)(({ theme }) => ({
    root: {
        backgroundColor: '#3c52b2',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#fff',
            color: '#3c52b2',
        },
        borderRadius: 25,
        border: "1px solid rgba(var(--color-axis), var(--alpha-axis))",
        fontSize: "1em",
        fontWeight: "bold",
    },
}))

