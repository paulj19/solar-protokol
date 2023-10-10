import React, {ReactElement, useEffect, useState} from "react";
import {useGetClientQuery, useUpdateClientStatusMutation} from "@/src/context/RootApi";
import {GenerationConsumParam, getGenerationConsumParam} from "@/utils/ElectricityCostCalculator";
import {
    Bar,
    CartesianGrid,
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
import {Alert, Fab, Snackbar, Tooltip as MuiToolTip} from "@mui/material";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {ArrowBack} from "@mui/icons-material";
import Loading from "@/src/components/Loading";
import ErrorScreen from "@/src/components/ErrorScreen";

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
    const [updateClientStatus] = useUpdateClientStatusMutation()
    const [snackOpen, setSnackOpen] = useState(false);
    const {data: clientParams, isLoading: isClientParamLoading, isError: isClientParamError} = useGetClientQuery({
        pDate,
        clientId
    });
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
            <h1 className="font-bold text-3xl font-sans text-cyan-900 m-auto pb-2">ERTRAGSPROGNOSE</h1>
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
                        <CartesianGrid stroke="#000000" vertical={false} strokeWidth={0.1} strokeOpacity={1}/>
                        <XAxis dataKey="month" tick={{fill: 'rgb(22 78 99 / var(--tw-text-opacity))'}} />
                        <YAxis axisLine={false} tick={{fill: 'rgb(22 78 99 / var(--tw-text-opacity))'}} tickLine={false} tickMargin={15} ticks={getYAxisTicks(generationConsumParams)}/>
                        <Tooltip/>
                        <Legend layout="centric" verticalAlign="top" align="right" iconSize={30}
                                formatter={(value) => LegendFormatter(value, clientParams.productionYearly, clientParams.consumptionYearly)}/>
                        {/*<Legend layout="horizontal" verticalAlign="top" align="left" iconSize={30} />*/}
                        {/*<Legend layout="radial" verticalAlign="top" align="right" content={XXX}/>*/}
                        {/*<Legend iconType="circle" wrapperStyle={{ top: 300 }} content={CusomizedLegend} />*/}
                        <Bar dataKey="generation" barSize={30} fill="rgb(22, 101, 52)" label={renderCustomizedLabel} />
                        <Line type="monotone" strokeWidth={2.5} dataKey="consumption" stroke="#ff7300"/>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <div className="absolute bottom-7 left-7" data-testid="backward-fab">
                <MuiToolTip title="comparison stat" arrow>
                    <Fab variant="circular" color="inherit" component={Link}
                         to={`/stats?pDate=${pDate}&clientId=${clientId}`}
                         aria-label="add">
                        <ArrowBack/>
                    </Fab>
                </MuiToolTip>
            </div>
            <div className="absolute bottom-7 right-7" data-testid="end-fab">
                <MuiToolTip title="back to home" arrow>
                    <Fab variant="extended" color="inherit" component={Link} to='/'
                         onClick={() => handleUpdateClientStatus()} aria-label="add">
                        END
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
    console.log(payload)
    return (
        <div className="flex flex-row gap-2 align-middle">
            {payload.map(item => {
                console.log(item)
                return (<><Surface width={10} height={10}>
                        <Symbols cx={5} cy={5} type="" size={190}/>
                    </Surface>
                        <span>{item.value}</span></>
                )
            })}
        </div>
    )
}

function LegendFormatter(value, productionYearly, consumptionYearly) {
    if (value === "generation") {
        return (
            <span>
            <div className="inline-flex flex-col">
                <div className="text-green-800 font-sans text-md font-medium">STROMPRODUKTION</div>
                <div
                    className="text-green-800 font-sans text-md font-medium text-start">{productionYearly + "KwH pro Jahr"}</div>
            </div>
        </span>)
    } else if (value === "consumption") {
        return (
            <span>
            <div className="inline-flex flex-col">
                <div className="text-[#ff7300] font-sans text-md font-medium">STROMVERBRAUCH</div>
                <div
                    className="text-[#ff7300] font-sans text-md font-medium text-start">{consumptionYearly + " KwH pro Jahr"}</div>
            </div>
        </span>)
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
    const { x, y, width, value } = props;
    const radius = 10;

    return (
        <g>
            <text x={x + width / 2} y={y - radius} fill="rgb(22 78 99 / var(--tw-text-opacity))" textAnchor="middle" className="font-serif text-sm font-md">
                {value + "€"}
            </text>
        </g>
    );
};
