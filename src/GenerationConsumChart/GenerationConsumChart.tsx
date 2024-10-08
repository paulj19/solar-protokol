import React, {ReactElement, useEffect, useState} from "react";
import {useGetClientQuery, useUpdateClientStatusMutation} from "@/src/context/RootApi";
import {GenerationConsumParam, getGenerationConsumParam} from "@/utils/ElectricityCostCalculator";
import {
    Bar,
    CartesianGrid,
    Cell,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Surface,
    Symbols,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {Alert, Fab, FormControlLabel, FormGroup, Snackbar, Switch, Tooltip as MuiToolTip} from "@mui/material";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {ArrowBack} from "@mui/icons-material";
import Loading from "@/src/components/Loading";
import ErrorScreen from "@/src/components/ErrorScreen";
import {createTheme, ThemeProvider} from "@mui/material/styles";

export default function GenerationConsumChart(): ReactElement {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get('clientId');
    const pDate = searchParams.get('pDate');
    useEffect(() => {
        if (!clientId || !pDate) {
            navigate('/');
        }
    }, []);
    // const clientId = "54"
    // const pDate = "2024-01-26"
    const [updateClientStatus] = useUpdateClientStatusMutation()
    const [snackOpen, setSnackOpen] = useState(false);
    const {data: clientParams, isLoading: isClientParamLoading, isError: isClientParamError} = useGetClientQuery({
        pDate,
        clientId
    });
    const [showConsumption, setShowConsumption] = useState<boolean>(false);
    if (isClientParamLoading) {
        return <Loading/>;
    }
    //todo why undef rendered twice
    if (isClientParamError) {
        return <ErrorScreen/>
    }

    const generationConsumParams: Array<GenerationConsumParam> = getGenerationConsumParam(clientParams.productionYearly, clientParams.consumptionYearly);

    async function handleUpdateClientStatus() {
        try {
            if (clientParams.status !== "completed") {
                await updateClientStatus({
                    [`/uid_1/${pDate}/cid_${clientId}/status`]:
                        "completed"
                }).unwrap();
            }
            navigate("/");
        } catch (e) {
            setSnackOpen(true);
        }
    }

    function handleSnackClose() {
        setSnackOpen(false);
        navigate("/");
    }

    return (
        <>
            <h1 className="font-bold text-3xl font-sans text-h1 m-auto pb-2">{`ERTRAGSPROGNOSE ${clientParams?.nickname?.toUpperCase()}`}</h1>
            <div data-testid="generationConsum-chart" className="w-[80%] h-[90%] ">
                <ResponsiveContainer>
                    <ComposedChart
                        data={generationConsumParams}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid stroke="rgb(var(--genCon-carGrid))" vertical={false} strokeWidth={0.3} strokeOpacity={1}/>
                        <XAxis dataKey="month" tick={{fill: 'rgb(var(--genCon-xTicks))'}} angle={320}
                               tickMargin={15} dx={-20}/>
                        <YAxis axisLine={false} tick={{fill: 'rgb(var(--genCon-xTicks))'}}
                               tickLine={false} tickMargin={15} ticks={getYAxisTicks(generationConsumParams)}/>
                        <Tooltip
                            content={<CustomTooltip />}
                        />
                        <Legend layout="centric" verticalAlign="top" align="right" iconSize={30}
                                formatter={(value) => LegendFormatter(value, clientParams.productionYearly, clientParams.consumptionYearly, showConsumption)}/>
                        {/*<Legend layout="horizontal" verticalAlign="top" align="left" iconSize={30} />*/}
                        {/*<Legend layout="radial" verticalAlign="top" align="right" content={XXX}/>*/}
                        {/*<Legend iconType="circle" wrapperStyle={{ top: 300 }} content={CusomizedLegend} />*/}
                        {/*<Bar dataKey="generation" barSize={30} fill="rgb(var(--color-bar))" label={renderCustomizedLabel} />*/}
                        <defs>
                            <linearGradient id='gen-bar' gradientTransform="rotate(90)" spreadMethod='reflect'>
                                <stop offset='20%' stopColor='rgb(var(--genCon-bar))'/>
                                <stop offset='90%' stopColor='rgb(var(--genCon-bar2))'/>
                            </linearGradient>
                        </defs>
                        <Bar dataKey='generation' fill={`url(#gen-bar)`} barSize={70}
                             label={renderCustomizedLabel}>
                            {generationConsumParams.map((entry, index) => (
                                <Cell key="generation-bar" fill={`url(#gen-bar)`}/>
                            ))}
                        </Bar>
                        <Line type="monotone" strokeWidth={7.5} dataKey="consumption" stroke="rgb(var(--color-line))" dot={false}
                              hide={!showConsumption}/>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <ThemeProvider theme={theme}>
                <FormGroup className="m-auto pt-9" data-testid="solar-toggle">
                    <FormControlLabel control={
                        <Switch
                            onChange={(e) => setShowConsumption(e.target.checked)}/>}
                                      label={<span
                                          className="font-sans font-normal text-genConSwitch">Stromverbrauch</span>}/>
                </FormGroup>
            </ThemeProvider>
            <div className="absolute bottom-7 left-7" data-testid="backward-fab">
                <MuiToolTip title="comparison stat" arrow>
                    <Fab variant="circular" sx={{backgroundColor: "rgb(var(--fab-bg))", color: "rgb(var(--fab-arrow))"}} component={Link}
                         to={`/stats?pDate=${pDate}&clientId=${clientId}`}
                         aria-label="add">
                        <ArrowBack/>
                    </Fab>
                </MuiToolTip>
            </div>
            <div className="absolute bottom-7 right-7" data-testid="end-fab">
                <MuiToolTip title="back to home" arrow>
                    <Fab variant="extended" sx={{backgroundColor: "rgb(var(--fab-bg))", color: "rgb(var(--fab-arrow))"}} component={Link} to='/'
                         onClick={() => handleUpdateClientStatus()} aria-label="add">
                        BEENDEN
                    </Fab>
                </MuiToolTip>
            </div>
            <Snackbar open={snackOpen} autoHideDuration={3000}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={() => handleSnackClose()}>
                <Alert severity={"error"} sx={{width: '100%'}}>
                    {"ErrorScreen while updating client status, update in home page."}
                </Alert>
            </Snackbar>
        </>
    )
}

function XXX(props) {
    const {payload} = props
    return (
        <div className="flex flex-row gap-2 align-middle">
            {payload.map(item => {
                return (<><Surface width={10} height={10}>
                        <Symbols cx={5} cy={5} type="" size={190}/>
                    </Surface>
                        <span>{item.value}</span></>
                )
            })}
        </div>
    )
}

function LegendFormatter(value, productionYearly, consumptionYearly, showConsumption) {
    const outerDiv = "inline-flex flex-col gap-2";
    const innerTitle = "font-sans text-2xl font-bold tracking-wide";
    const innerSum = "font-sans text-2xl font-bold text-start";
    if (value === "generation") {
        return (
            <div className={outerDiv + " text-genConBar"}>
                <div className={innerTitle}>STROMPRODUKTION</div>
                <div
                    className={innerSum}>{productionYearly + " kWh PRO JAHR"}</div>
            </div>)
    } else if (value === "consumption" && showConsumption) {
        return (
            <div className={outerDiv + " pt-3"}>
                <div className={innerTitle}>STROMVERBRAUCH</div>
                <div
                    className={innerSum}>{consumptionYearly + " kWh PRO JAHR"}</div>
            </div>)
    }
}

function getYAxisTicks(generationConsumParams: Array<GenerationConsumParam>): Array<number> {
    const highestYValue = Math.max(...generationConsumParams.map(item => item.generation), ...generationConsumParams.map(item => item.consumption));
    const ticks = []
    for (let i = 0; (i - 100) < highestYValue; i += 100) {
        ticks.push(i);
    }
    return ticks;
}

const renderCustomizedLabel = (props) => {
    const {x, y, width, value} = props;
    const radius = 10;

    return (
        <g>
            <text x={x + width / 2} y={y - radius} fill="rgb(var(--genCon-bar-label))" textAnchor="middle"
                  className="text-md font-bold">
                {value}
            </text>
        </g>
    );
};
const theme = createTheme({
    components: {
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    // Controls default (unchecked) color for the thumb
                    color: "rgba(var(--genCon-switchBase))"
                },
                colorPrimary: {
                    "&.Mui-checked": {
                        // Controls checked color for the thumb
                        color: "rgba(var(--genCon-switchPrimary))"
                    }
                },
                track: {
                    // Controls default (unchecked) color for the track
                    backgroundColor: "rgba(var(--genCon-switchBase))",
                    ".Mui-checked.Mui-checked + &": {
                        // Controls checked color for the track
                        backgroundColor: "rgba(var(--genCon-switchPrimary))"
                    }
                }
            }
        }
    }
});

const CustomTooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-tooltip p-2 border rounded-sm opacity-95 text-h1">
                <div className="text-xl font-medium">{`Im ${label}`}</div>
                <div className="text-xl font-medium">{`STROMPRODUKTION: ${payload[0].value} KwH`}</div>
            </div>
        );
    }

    return null;
};

