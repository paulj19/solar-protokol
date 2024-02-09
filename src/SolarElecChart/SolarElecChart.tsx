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
import Slider from "@mui/joy/Slider";

type Settings = {
    currentState: number
}

enum STATE {
    ELEC_BAR,
    ENERGY_BAR,
    ELEC_LINE,
    SOLAR_LINE,
    SOLAR_TEXT,
    AREA
}

const STATES = [[STATE.ELEC_BAR], [STATE.ENERGY_BAR], [STATE.ENERGY_BAR, STATE.ELEC_LINE], [STATE.ELEC_LINE], [STATE.ELEC_LINE, STATE.SOLAR_LINE], [STATE.ELEC_LINE, STATE.SOLAR_LINE, STATE.SOLAR_TEXT], [STATE.ELEC_LINE, STATE.SOLAR_LINE, STATE.AREA, STATE.SOLAR_TEXT]]

export default function SolarElecChart() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get('clientId');
    const pDate = searchParams.get('pDate');
    // const clientId = "54"
    // const pDate = "2024-01-26"
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
                    const intersection = {...item, year: Math.floor(x), electricityCost: y, solarCost: y, range: [y, y]}
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
    // const {totalElecCost, totalSolarCost, totalTransportCost, totalHeatingCost} = calcTotalSaved({year: 30, clientParams, generalParams: {...generalParams, inflationRate, elecIncreaseRate}});
    const {totalSaved, totalElecCost, totalSolarCost, totalTransportCost, totalHeatingCost} = calcTotalSaved({year: generalParams.yearLimitPrediction, clientParams, generalParams: {...generalParams, inflationRate: inflationRate ?? generalParams.inflationRate, electricityIncreaseRate: elecIncreaseRate ?? generalParams.electricityIncreaseRate}});

    function stateHasSolarLine() {
        return STATES[settings.currentState]?.includes(STATE.SOLAR_LINE);
    }

    function stateHasElecBar() {
        return STATES[settings.currentState]?.includes(STATE.ELEC_BAR) || STATES[settings.currentState]?.includes(STATE.ENERGY_BAR);
    }

    return (
        <>
            <div className="flex flex-col w-full justify-center m-auto gap-3 pl-[200px]" data-testid="solar-elec-chart">
                <>
                    <h1 className="font-bold text-3xl font-sans text-h1 ml-[14%] pb-2">IHRE MONATLICHEN
                        ENERGIEKOSTEN IN DER ZUKUNFT</h1>
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
                                       tick={{fill: 'rgba(var(--color-axis))'}}
                                       tickSize={8} tickMargin={15} strokeWidth={0.7}
                                />
                                <YAxis
                                    ticks={getYAxisTicks(comparisonDataWithRange, STATES[settings.currentState]?.includes(STATE.SOLAR_LINE), !stateHasElecBar())}
                                    tickFormatter={formatYAxisTicks} strokeWidth={0.7}
                                    tick={{fill: 'rgba(var(--color-axis))'}} tickSize={8}
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
                                        value={"MONATL. ENERGIE-KOSTEN"}/>
                                </YAxis>
                                <RechartToolTop
                                    content={<CustomTooltip currentYear={currentYear}
                                                            currentState={settings.currentState}/>}
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
                                        <stop offset="30%" stopColor="rgb(var(--saved-area-start))"/>
                                        <stop offset="90%" stopColor="rgb(var(--saved-area-stop))"/>
                                    </linearGradient>
                                </defs>
                                {/*<defs>*/}
                                {/*    <linearGradient id="elecBar" x1="1" y1="1" x2="0" y2="0">*/}
                                {/*        <stop offset="50%" stopColor="#f7bd0080" stopOpacity={0.5} />*/}
                                {/*        <stop offset="35%" stopColor="#FGFFFFF" stopOpacity={0.5} />*/}
                                {/*    </linearGradient>*/}
                                {/*</defs>*/}
                                <Legend layout="centric" verticalAlign="top" align="right"
                                        wrapperStyle={{
                                            paddingRight: "70px"
                                        }}
                                        formatter={(value) => LegendFormatter(value, inflationRate ?? generalParams.inflationRate, elecIncreaseRate ?? generalParams.electricityIncreaseRate, settings.currentState)}/>
                                {/*<Legend layout="horizontal" verticalAlign="bottom" align="left"*/}
                                {/*        wrapperStyle={{*/}
                                {/*            paddingRight: "50px"*/}
                                {/*        }}*/}
                                {/*        payload={[{value: `INSGESAMT ${formatEuroCurrency(totalSaved)}`}]}*/}
                                {/*        />*/}
                                <Area type="linear" dataKey="range" fill="url(#saved-enpal)"
                                      legendType='none' tooltipType='none'
                                      hide={!STATES[settings.currentState]?.includes(STATE.AREA)}
                                />
                                <Bar dataKey="electricityCost" fill="rgba(var(--elec-bar))" barSize={30}
                                     name="STROM"
                                     label='none'
                                     aria-label="bar-electricityCost"
                                     legendType={stateHasElecBar() && settings.currentState !== 1 && settings.currentState !== 2 ? 'rect' : 'none'}
                                     // legendType='none'
                                     hide={!stateHasElecBar()}
                                     stackId="a"
                                />
                                <Bar dataKey="heatingCost" fill="rgb(var(--heating-bar))" barSize={30}
                                     name="WÄRME"
                                     label='none'
                                     aria-label="bar-heatingCost"
                                     // legendType={STATES[settings.currentState]?.includes(STATE.ENERGY_BAR) && clientParams.heatingCost ? 'rect' : 'none'}
                                     legendType='none'
                                     hide={!STATES[settings.currentState]?.includes(STATE.ENERGY_BAR)}
                                     stackId="a"
                                />
                                <Bar dataKey="transportCost" fill="rgb(var(--transport-bar))" barSize={30}
                                     name="BENZIN"
                                     label='none'
                                     aria-label="bar-transportCost"
                                     legendType={STATES[settings.currentState]?.includes(STATE.ENERGY_BAR) && clientParams.transportCost ? 'rect' : 'none'}
                                     // legendType='none'
                                     hide={!STATES[settings.currentState]?.includes(STATE.ENERGY_BAR)}
                                     stackId="a"
                                />
                                <Line type="linear" dataKey="electricityCost" name="STROM PREISENTWICKLUNG"
                                      stroke="rgb(var(--elec-line))"
                                      legendType={STATES[settings.currentState]?.includes(STATE.ELEC_LINE) ? 'line' : 'none'}
                                      strokeWidth={STATES[settings.currentState]?.includes(STATE.ENERGY_BAR) ? 8.5 : 5.5}
                                      activeDot={{r: 6}} dot={<CustomizedDot/>}
                                      hide={!STATES[settings.currentState]?.includes(STATE.ELEC_LINE)}//todo util function here

                                />
                                <Line type="linear" dataKey="solarCost" name="MIT ENPAL" stroke="rgb(var(--solar-line))"
                                      legendType={STATES[settings.currentState]?.includes(STATE.SOLAR_LINE) ? 'line' : 'none'}
                                      strokeWidth={5.5}
                                      dot={<CustomizedDot/>}
                                      hide={!STATES[settings.currentState]?.includes(STATE.SOLAR_LINE)}
                                />
                                {/*{comparisonDataWithRange.map((entry, index) => (*/}
                                {/*    <Cell key="elec-bar" fill={`url(#elec-bar)`}/>*/}
                                {/*))}*/}
                                {/*</Bar>*/}
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
                            className="text-h1 text-font-medium text-sm pt-2 tracking-wide gap-4 flex flex-col w-[20%]">
                            <h2 className="text-2xl font-bold">{`IHRE ENERGIEKOSTEN IN DEN NÄCHSTEN ${generalParams.yearLimitPrediction} JAHREN`}</h2>
                            <p className="text-3xl text-transportBar font-bold">{'BENZIN/TANKEN'}{<p
                                className="text-5xl text-transportBar font-bold">{formatEuroCurrency(totalTransportCost)}</p>}</p>
                            <p className="text-3xl text-heatingBar font-bold">{'WÄRME/HEIZEN'}{<p
                                className="text-5xl text-heatingBar font-bold">{formatEuroCurrency(totalHeatingCost)}</p>}</p>
                            <p className="text-3xl text-elecBar font-bold">{'STROM'}{<p
                                className="text-5xl text-elecBar font-bold">{formatEuroCurrency(totalElecCost)}</p>}</p>
                            <p className="text-3xl text-totalCost font-bold">{'INSGESAMT'}{<p
                                className="text-5xl text-totalCost font-bold">{formatEuroCurrency(totalElecCost + totalTransportCost + totalHeatingCost)}</p>}</p>
                            {stateHasSolarLine() && STATES[settings.currentState]?.includes(STATE.SOLAR_TEXT) ?
                                <>
                                   {
                                        <p className="text-3xl text-solarLine font-bold leading-6 pt-8">{'MIT SOLAR'}
                                            {<p className="text-5xl font-bold">{formatEuroCurrency(totalSolarCost)}</p>}
                                        </p>}
                                    {((totalElecCost + totalTransportCost + totalHeatingCost) - totalSolarCost) > 0 && STATES[settings.currentState]?.includes(STATE.AREA) ?
                                        <p className="text-3xl font-bold text-solarLine leading-6 pt-8">{'ERSPARNIS'}
                                            {
                                                <p className="text-5xl ">{formatEuroCurrency((totalElecCost + totalTransportCost + totalHeatingCost) - totalSolarCost)}</p>}
                                        </p> : null}
                                </> : null}
                        </div> : null}
                        <CustomMobileStepper
                            variant="progress"
                            aria-label="state-stepper"
                            steps={STATES.length}
                            activeStep={settings.currentState}

                            sx={{maxWidth: 400, flexGrow: 1, bgcolor: 'transparent', margin: 'auto', borderColor:"red", color:"red", [`& .MuiMobileStepper-progress`]: {
                                    borderColor: 'red',
                                },}}
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
                                            bgcolor: 'rgb(var(--color-axis))', // theme.palette.primary.main
                                            color: 'white',
                                        },
                                        borderRadius: 25,
                                        border: "1px solid rgb(var(--color-axis))",
                                        fontSize: "1em",
                                        fontWeight: "bold",
                                    }}>
                                    <KeyboardArrowRight className="text-axis hover:text-white"/>
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
                                            bgcolor: 'rgb(var(--color-axis))', // theme.palette.primary.main
                                            color: 'white',
                                        },
                                        borderRadius: 25,
                                        border: "1px solid rgb(var(--color-axis))",
                                        fontSize: "1em",
                                        fontWeight: "bold",
                                    }}>
                                    {  <KeyboardArrowLeft className="text-axis hover:text-white"/>
                                    }
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
                        <AccordionSummary className="bg-solarElecSettings rounded-xl"><span
                            className="text-h1"> Einstellung</span></AccordionSummary>
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
                                                textColor="rgba(var(--color-axis), var(--alpha-axis))">
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
                                                textColor="rgba(var(--color-axis), var(--alpha-axis))">
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
                    <Fab variant="circular" sx={{backgroundColor: "rgb(var(--fab-bg))", color: "rgb(var(--fab-arrow))"}} component={Link}
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

function getYAxisTicks(comparisonDataWithRange, showSolar, shrinkValues): Array<number> {
    let highestYValue;
    if (shrinkValues) {
        highestYValue = comparisonDataWithRange[comparisonDataWithRange.length - 1].electricityCost;
    } else {
        highestYValue = comparisonDataWithRange[comparisonDataWithRange.length - 1].totalElecCost;
    }
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
                    color: "rgba(var(--title-axis))"
                },
                colorPrimary: {
                    "&.Mui-checked": {
                        // Controls checked color for the thumb
                        color: "rgba(var(--title-axis))"
                    }
                },
                track: {
                    // Controls default (unchecked) color for the track
                    backgroundColor: "rgba(var(--title-axis))",
                    ".Mui-checked.Mui-checked + &": {
                        // Controls checked color for the track
                        backgroundColor: "rgba(var(--title-axis))"
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

const CustomTooltip = ({active, payload, label, currentYear, currentState}) => {
    const getTooltipColor = (dataKey): string => {
        switch (dataKey) {
            case "electricityCost":
                return "text-elecBar";
            case "heatingCost":
                return "text-heatingBar";
            case "transportCost":
                return "text-transportBar";
            case "solarCost":
                return "text-solarLine";
            case "totalElecCost":
                return "text-totalCost";
            default:
                return "";
        }
    }

    if (active && payload && payload.length) {
        return (
            <div className="bg-tooltip p-2 border rounded-sm opacity-95">
                <div className="text-xl font-medium pb-2 text-h1">{`JAHR ${label + currentYear}`}</div>
                {payload.map(v => (<div key={v.dataKey}
                                        className={"text-xl font-medium " + getTooltipColor(v.dataKey)}>{((v.dataKey === "electricityCost" && currentState === 2 && v.name === "STROM PREISENTWICKLUNG") || v.dataKey === "range") ? null : `${getTooltipDescription(v.dataKey) + " " + v.value} €`}</div>))}
            </div>
        );
    }
    return null;
};

function getTooltipDescription(dataKey: string) {
    switch (dataKey) {
        case "electricityCost":
            return "STROM";
        case "heatingCost":
            return "WÄRME";
        case "transportCost":
            return "BENZIN";
        case "solarCost":
            return "SOLAR";
        case "totalElecCost":
            return "STROM"
        default:
            return "";
    }
}

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

function LegendFormatter(value, inflationRate, elecIncreaseRate, currentState) {
    const outerDiv = "inline-flex flex-col gap-2";
    const innerTitle = "font-sans text-2xl font-bold tracking-wide";
    const innerSum = "font-sans text-2xl font-bold text-start";
    // const margins = getInflationMargins(currentState)
    return (
        <span>
          {value === 'BENZIN' && (currentState === 1 || currentState === 2)? <>
          <span className="mr-1 ml-[-2px]">BENZIN</span>
          <svg className="inline mb-[3px]" height="10" width="15"><rect width="30" height="10" fill="rgb(var(--heating-bar))"/></svg>
          <span className="text-heatingBar">{` WÄRME `}</span>
          <svg className="inline mb-[3px]" height="10" width="15"><rect width="30" height="10" fill="rgb(var(--elec-bar))"/></svg>
          <span className="text-elecBar mx-1">STROM</span></> :
                <span>{value}</span>}
            {value === 'MIT ENPAL' || value === 'BENZIN' || (value === 'STROM PREISENTWICKLUNG' && currentState === 3)|| (value === 'STROM' && currentState === 0) ?
                <div className="text-h1 whitespace-pre-line">{` INFLATION: ${inflationRate}% \nPREISSTEIGERUNG: ${elecIncreaseRate}%`}</div> : null}
            </span>)
}

function getInflationMargins(currentState) {
  switch(currentState) {
    case 0:
      return [-780, -35]
    case 2:
      return [-780, -40]
    case 3:
      return [-780, -60]
    default:
      return [-780, -50]
  }
}

function CustomLegend(props): ReactElement {
    const {payload} = props;
    return <div>
        {payload.map((item, index) => {
            return (
                <div key={`legend-${index}`} className="flex gap-2">
                    <span className="text-h1">{item.value}</span>
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

function SmallRect() {
  return (<svg width="400" height="110">
    <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
  </svg>)
}
const CustomMobileStepper = styled(MobileStepper)(({ theme }) => ({
    // color: "#072543", //color of the slider between thumbs

    // "& .MuiSlider-thumb": {
    //     backgroundColor: "rgba(var(--slider-thumb))" //color of thumbs
    // },
    // "& .MuiSlider-rail": {
    //     // backgroundColor: "rgba(var(--slider-thumb), 0.05)"
    // },
    // "& .MuiSlider-track": {
    //     backgroundColor: "rgba(var(--slider-thumb), 0.85)"
    // },
    // '& input[type="range"]': {
    //     WebkitAppearance: 'slider-vertical',
    // },
    // "& .MuiMobileStepper-positionStatic": {
    //     backgroundColor: "rgb(var(--color-axis))"
    // },
    "& .css-5xe99f-MuiLinearProgress-bar1 ": {
        backgroundColor: "rgb(var(--color-axis))"
    },
    "& .css-1be5mm1-MuiLinearProgress-root-MuiMobileStepper-progress": {
        backgroundColor: "#d6d6d6"
    },
    // "& .MuiMobileStepper-progress": {
    //     backgroundColor: "rgb(var(--color-axis))"
    // },
}));
