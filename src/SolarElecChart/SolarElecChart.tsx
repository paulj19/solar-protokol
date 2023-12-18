import React, {ReactElement, useEffect, useState} from 'react';
import {
    Area,
    Bar, CartesianGrid,
    Cell,
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
import {calcPredictions, calcTotalSaved} from '@/utils/ElectricityCostCalculator';
import {CostPredictions} from '@/types/types';
import {Fab, MobileStepper} from "@mui/material";
import {ArrowForward, KeyboardArrowLeft, KeyboardArrowRight} from "@mui/icons-material";
import {Mark} from "@mui/base";
import {Typography} from "@mui/joy";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionSummary from "@mui/joy/AccordionSummary";
import AccordionDetails from "@mui/joy/AccordionDetails";
import {createTheme, styled} from "@mui/material/styles";
import Button from "@mui/material/Button";
import ColoredSlider from "@/src/components/ColoredSlider";
import {useTheme} from "next-themes";
import {Link, useNavigate, useSearchParams} from "react-router-dom";

type Settings = {
    currentState: number
}

enum STATE {
    ELEC_BAR,
    ELEC_LINE,
    SOLAR_LINE,
    SOLAR_TEXT,
    AREA
}

const STATES = [[STATE.ELEC_BAR], [STATE.ELEC_BAR, STATE.ELEC_LINE], [STATE.ELEC_LINE], [STATE.ELEC_LINE, STATE.SOLAR_LINE], [STATE.ELEC_LINE, STATE.SOLAR_LINE, STATE.SOLAR_TEXT], [STATE.ELEC_LINE, STATE.SOLAR_LINE, STATE.AREA, STATE.SOLAR_TEXT]]

export default function SolarElecChart() {
    const {setTheme} = useTheme();
    setTheme('gray-bg');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get('clientId');
    const pDate = searchParams.get('pDate');
    // const clientId = "1042"
    // const pDate = "2023-12-11"
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
        if (item.totalElecCost >= item.solarCost) {
            if (i >= 1 && xx === false) {
                const intersectionResut = intersect(array[i - 1].year, array[i - 1].solarCost, item.year, item.solarCost, array[i - 1].year, array[i - 1].totalElecCost, item.year, item.totalElecCost);
                if (intersectionResut) {
                    const {x, y}: any = intersectionResut;
                    const intersection = {year: Math.floor(x), electricityCost: y, solarCost: y, range: [y, y], transportCost: item.transportCost, heatingCost: item.heatingCost, totalElecCost: item.totalElecCost}
                    acc = acc.concat(intersection);
                    xx = true;
                }
            }
            const range = item.totalElecCost !== undefined && item.solarCost !== undefined
                ? [item.totalElecCost - 1, item.solarCost + 1]
                : [];
            item['range'] = range;
        }
        return acc.concat(item);
    }, []);
    // const {totalElecCost, totalSolarCost, totalTransportCost, totalHeatingCost} = calcTotalSaved({year: 30, clientParams, generalParams: {...generalParams, inflationRate, elecIncreaseRate}});
    const {totalSaved, totalElecCost, totalSolarCost, totalTransportCost, totalHeatingCost} = calcTotalSaved({year: generalParams.yearLimitPrediction, clientParams, generalParams: {...generalParams, inflationRate: inflationRate ?? generalParams.inflationRate, electricityIncreaseRate: elecIncreaseRate ?? generalParams.electricityIncreaseRate}});

    function stateHasSolarLine() {
        return STATES[settings.currentState]?.includes(STATE.SOLAR_LINE);
    }

    return (
        <>
            <div className="flex flex-col w-full justify-center m-auto gap-3 pl-[200px]" data-testid="solar-elec-chart">
                <>
                    <h1 className="font-bold text-3xl font-sans text-gray-300 ml-[14%] pb-2">IHRE MONATLICHE
                        STROMRECHNUNG IN DER ZUKUNFT</h1>
                    <div className="flex gap-1 pt-4 min-h-[750px] w-full h-full">
                        <ResponsiveContainer className="max-w-[80%]">
                            <ComposedChart
                                data={comparisonDataWithRange}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                {/*<CartesianGrid stroke="#000000" strokeWidth={1} horizontalPoints={[10]} hori vertical={false}/>*/}
                                <XAxis dataKey="year" ticks={getXAxisMarks(generalParams.yearLimitPrediction)}
                                       aria-label="x-axis"
                                       tickFormatter={value => `${value + currentYear}`}
                                       tick={{fill: 'rgba(var(--color-axis), var(--alpha-axis))'}}
                                       tickSize={8} tickMargin={15} strokeWidth={0.7}
                                />
                                <YAxis
                                    ticks={getYAxisTicks(comparisonDataWithRange, STATES[settings.currentState]?.includes(STATE.SOLAR_LINE))}
                                    tickFormatter={formatYAxisTicks} strokeWidth={0.7}
                                    tick={{fill: 'rgba(var(--color-axis), var(--alpha-axis))'}} tickSize={8}
                                    tickMargin={15} width={80}
                                    domain={["dataMin", "dataMax"]}
                                >
                                    <Label
                                        style={{
                                            textAnchor: "middle",
                                            fontSize: "1.4em",
                                            fill: "rgba(var(--color-legend), var(--alpha-legend))",
                                        }}
                                        dx={-50}
                                        angle={270}
                                        value={"MONATL.STROMRECHNUNG"}/>
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
                                    <linearGradient id='saved-enpal' gradientTransform="rotate(90)"
                                                    spreadMethod='reflect'>
                                        <stop offset="30%" stopColor="#0aff33"/>
                                        <stop offset="90%" stopColor="#026112"/>
                                    </linearGradient>
                                </defs>
                                {/*<defs>*/}
                                {/*    <linearGradient id="elecBar" x1="1" y1="1" x2="0" y2="0">*/}
                                {/*        <stop offset="50%" stopColor="#f7bd0080" stopOpacity={0.5} />*/}
                                {/*        <stop offset="35%" stopColor="#FGFFFFF" stopOpacity={0.5} />*/}
                                {/*    </linearGradient>*/}
                                {/*</defs>*/}
                                <Legend layout="centric" verticalAlign="top" align="right"
                                        formatter={(value) => LegendFormatter(value, inflationRate ?? generalParams.inflationRate, elecIncreaseRate ?? generalParams.electricityIncreaseRate)}/>
                                <Line type="linear" dataKey="totalElecCost" name="PREISENTWICKLUNG OHNE SOLAR"
                                      stroke="#FF0000"
                                      legendType={STATES[settings.currentState]?.includes(STATE.ELEC_LINE) ? 'line' : 'none'}
                                      strokeWidth={STATES[settings.currentState]?.includes(STATE.ELEC_BAR) ? 8.5 : 5.5}
                                      activeDot={{r: 6}} dot={<CustomizedDot/>}
                                      hide={!STATES[settings.currentState]?.includes(STATE.ELEC_LINE)}//todo util function here
                                />
                                <Line type="linear" dataKey="solarCost" name="MIT ENPAL" stroke="#10ad3f"
                                      legendType={STATES[settings.currentState]?.includes(STATE.SOLAR_LINE) ? 'line' : 'none'}
                                      strokeWidth={5.5}
                                      dot={<CustomizedDot/>}
                                      hide={!STATES[settings.currentState]?.includes(STATE.SOLAR_LINE)}
                                />
                                <Area type="linear" dataKey="range" fill="url(#saved-enpal)"
                                      legendType='none' tooltipType='none'
                                      hide={!STATES[settings.currentState]?.includes(STATE.AREA)}
                                />
                                <Bar dataKey="transportCost" fill="brown" barSize={30}
                                     name="MOBILITÄT"
                                     label='none'
                                     aria-label="bar-transportCost"
                                     legendType={STATES[settings.currentState]?.includes(STATE.ELEC_BAR) && clientParams.transportCost ? 'rect' : 'none'}
                                     hide={!STATES[settings.currentState]?.includes(STATE.ELEC_BAR)}
                                     stackId="a"
                                     order="2"
                                />
                                {/*{comparisonDataWithRange.map((entry, index) => (*/}
                                {/*    <Cell key="elec-bar" fill={`url(#elec-bar)`}/>*/}
                                {/*))}*/}
                                {/*</Bar>*/}
                                <Bar dataKey="heatingCost" fill="yellow" barSize={30}
                                     name="WÄRME"
                                     label='none'
                                     aria-label="bar-heatingCost"
                                     legendType={STATES[settings.currentState]?.includes(STATE.ELEC_BAR) && clientParams.heatingCost ? 'rect' : 'none'}
                                     hide={!STATES[settings.currentState]?.includes(STATE.ELEC_BAR)}
                                     stackId="a"
                                     order="0"
                                />
                                <Bar dataKey="electricityCost" fill="red" barSize={30}
                                     name="STROMRECHNUNG PRO MONAT"
                                     label='none'
                                     aria-label="bar-electricityCost"
                                     legendType={STATES[settings.currentState]?.includes(STATE.ELEC_BAR) ? 'rect' : 'none'}
                                     hide={!STATES[settings.currentState]?.includes(STATE.ELEC_BAR)}
                                     stackId="a"
                                     order="1"
                                />
                                {/*{comparisonDataWithRange.map((entry, index) => (*/}
                                {/*    <Cell key="elec-bar" fill={`url(#elec-bar)`}/>*/}
                                {/*))}*/}
                                {/*</Bar>*/}
                                {/*{comparisonDataWithRange.map((entry, index) => (*/}
                                {/*    <Cell key="elec-bar" fill={`url(#elec-bar)`}/>*/}
                                {/*))}*/}
                                {/*</Bar>*/}
                            </ComposedChart>
                        </ResponsiveContainer>
                        {settings.currentState !== 0 ? <div
                            className="text-gray-300 text-font-medium text-sm pt-2 tracking-wide gap-4 flex flex-col w-[20%]">
                            <h2 className="text-2xl font-bold">{`IHRE STROMKOSTEN IN DEN NÄCHSTEN ${generalParams.yearLimitPrediction} JAHREN`}</h2>
                            <p className="text-3xl text-red-600 font-bold">{'STROM'}{<p
                                className="text-5xl text-red-600 font-bold">{formatEuroCurrency(totalElecCost)}</p>}</p>
                            <p className="text-3xl text-[#FFFF00] font-bold">{'WÄRME'}{<p
                                className="text-5xl text-[#FFFF00] font-bold">{formatEuroCurrency(totalHeatingCost)}</p>}</p>
                            <p className="text-3xl text-[#f59e42] font-bold">{'MOBILITÄT'}{<p
                                className="text-5xl text-[#f59e42] font-bold">{formatEuroCurrency(totalTransportCost)}</p>}</p>
                            <p className="text-3xl text-red-600 font-bold">{'INSGESAMT'}{<p
                                className="text-5xl text-red-600 font-bold">{formatEuroCurrency(totalElecCost + totalTransportCost + totalHeatingCost)}</p>}</p>
                            {stateHasSolarLine() && STATES[settings.currentState]?.includes(STATE.SOLAR_TEXT) ?
                                <>
                                    {
                                        <p className="text-3xl text-green-600 font-bold leading-6 pt-8">{'MIT SOLAR'}
                                            {<p className="text-5xl font-bold">{formatEuroCurrency(totalSolarCost)}</p>}
                                        </p>}
                                    {((totalElecCost + totalTransportCost + totalHeatingCost) - totalSolarCost) > 0 && STATES[settings.currentState]?.includes(STATE.AREA) ?
                                        <p className="text-3xl font-bold text-green-600 leading-6 pt-8">{'ERSPARNIS'}
                                            {
                                                <p className="text-5xl ">{formatEuroCurrency((totalElecCost + totalTransportCost + totalHeatingCost) - totalSolarCost)}</p>}
                                        </p> : null}
                                </> : null}
                        </div> : null}
                        <MobileStepper
                            variant="progress"
                            aria-label="state-stepper"
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
    const highestYValue = comparisonDataWithRange[comparisonDataWithRange.length - 1].totalElecCost;
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
    console.log("payload", payload)
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700 p-2 border rounded-sm opacity-95 text-[rgb(var(--color-bar))]">
                <div className="text-xl font-medium">{`JAHR ${label + currentYear}`}</div>
                <div className="text-xl font-medium">{`MONATL.KOSTEN ${payload[0].value} €`}</div>
            </div>
        );
    }

    return null;
};


const StepButton = styled(Button)(({theme}) => ({
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

function LegendFormatter(value, inflationRate, elecIncreaseRate) {
    const outerDiv = "inline-flex flex-col gap-2";
    const innerTitle = "font-sans text-2xl font-bold tracking-wide";
    const innerSum = "font-sans text-2xl font-bold text-start";
    return (
        <span>
                <span>{value}</span>
            {value === 'MIT ENPAL' || value === 'STROMRECHNUNG PRO MONAT' ? <div
                className="text-gray-300 pl-5">{` INFLATION: ${inflationRate}% | PREISSTEIGERUNG: ${elecIncreaseRate}%`}</div> : null}
            </span>)
}

function CustomLegend(props): ReactElement {
    const {payload} = props;
    return <div>
        {payload.map((item, index) => {
            return (
                <div key={`legend-${index}`} className="flex gap-2">
                    <span className="text-gray-300">{item.value}</span>
                </div>
            );
        })}

    </div>

}
function getXAxisMarks(tickLimit: number): Array<number> {
    const marks = [];
    for (let i = 0; i < tickLimit; i += 5) {
        marks.push(i);
    }
    marks.push(tickLimit)
    return marks;
}
