import React, {ReactElement, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {
    selectClientById,
    useGetClientQuery,
    useGetGeneralParamsQuery,
    useUpdateClientStatusMutation
} from "@/src/context/RootApi";
import {GenerationConsumParam, getGenerationConsumParam} from "@/utils/ElectricityCostCalculator";
import {
    Area,
    Bar, CartesianAxis,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer, Scatter, Surface, Symbols,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {Alert, Fab, Snackbar} from "@mui/material";
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import {Tooltip as MuiToolTip} from '@mui/material';
import {format} from "date-fns";
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
                        <XAxis dataKey="month"/>
                        <YAxis axisLine={false}  tick={{fill: 'green'}} tickLine={false} tickMargin={15}/>
                        <Tooltip/>
                        <Legend layout="radial" verticalAlign="top" align="center" content={XXX}/>
                        {/*<Legend iconType="circle" wrapperStyle={{ top: 300 }} content={CusomizedLegend} />*/}
                        <Bar dataKey="generation" barSize={30} fill="#413ea0"/>
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
function getYAxisTicks(generationConsumParams): Array<number> {
    const maxValue = Math.min(...comparisonDataWithRange.map(item => item.solarCost));
    const roundedToLowerHundreds = Math.floor(lowestYValue / 100) * 100;
    const ticks = []
    for (let i = roundedToLowerHundreds; (i - 100) <= highestYValue; i += 100) {
        ticks.push(i);
    }
    return ticks;
}

const CusomizedLegend = (props) => {
    const { payload } = props
    return (
        <div className="pt-20 m-auto">
            {
                payload.map((entry) => {
                    const { dataKey, color } = entry
                    let style = {}
                    // if (dataKey == this.state.active) {
                    //     style = { backgroundColor: color , color: '#fff'}
                    // }
                    return (
                        // <OverlayTrigger
                        //     onClick={this.handleClick}
                        //     key={`overlay-${dataKey}`}
                        //     trigger={["hover", "focus"]}
                        //     placement="top"
                        //     overlay={this.renderPopoverTop(dataKey)}
                        // >
                <span className="legend-item"  style={style}>
                  <Surface width={10} height={10} viewBox="0 0 10 10" >
                    <Symbols cx={5} cy={5} type="square" size={50} fill={color}  />
                  </Surface>
                  <span >{dataKey}</span>
                </span>
                        // </OverlayTrigger>
                    )
                })
            }
        </div>
    )
}

function XXX(props) {
    const { payload } = props
    console.log(payload)
    return (<span className="legend-item">

                  <Surface width={10} height={10} viewBox="0 0 10 10" >
                    <Symbols cx={5} cy={5} type="square" size={50} fill={"red"}  />
                  </Surface>
                  <span >XXX</span>
                </span>)
}