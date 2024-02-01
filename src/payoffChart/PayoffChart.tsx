import React, {ReactElement, useEffect} from "react";
import {useGetClientQuery, useGetGeneralParamsQuery} from "@/src/context/RootApi";
import {calcCumulativeSaved} from "@/utils/ElectricityCostCalculator";
import {Bar, CartesianGrid, Cell, ComposedChart, Label, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {Fab, Tooltip as MuiToolTip} from "@mui/material";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {ArrowForward} from "@mui/icons-material";
import Loading from "@/src/components/Loading";
import ErrorScreen from "@/src/components/ErrorScreen";
import {useTheme} from "next-themes";
import {getFormattedCost} from "@/src/stats/Stats";

export type PayOffParam = {
    year: number
    saved: number
}

export default function PayoffChart(): ReactElement {
    const { setTheme } = useTheme();
    setTheme('gray-bg');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get('clientId');
    const pDate = searchParams.get('pDate');
    // const clientId = "901"
    // const pDate = "2024-10-22"
    useEffect(() => {
        if (!clientId || !pDate) {
            navigate('/');
        }
    }, []);
    const {data: clientParams, isLoading: isClientParamLoading, isError: isClientParamError} = useGetClientQuery({
        pDate,
        clientId
    });
    const {
        data: generalParams,
        isLoading: isGeneralParamLoading,
        isError: isGeneralParamsError
    } = useGetGeneralParamsQuery(undefined);

    if (isClientParamLoading || isGeneralParamLoading) {
        return <Loading/>;
    }
    //todo why undef rendered twice
    if (isClientParamError || isGeneralParamsError) {
        return <ErrorScreen/>
    }

    if (!clientParams.isPurchase || !clientParams.purchasePrice) {
        return <ErrorScreen errorText={"Nicht als Kauf markiert wärend der Kundenerstellung"}/>
    }
    const payOffParams: Array<PayOffParam> = calcCumulativeSaved({
        year: undefined,
        clientParams,
        generalParams
    })
    const currentYear = new Date().getFullYear();

    return (
        <>
            <h1 className="font-bold text-3xl font-sans text-h1 m-auto pb-2">AUSZAHLUNG</h1>
            <div data-testid="generationConsum-chart" className="w-[80%] h-[90%] ">
                <ResponsiveContainer>
                    <ComposedChart
                        data={payOffParams}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid stroke="#fff" vertical={false} strokeWidth={0.3} strokeOpacity={1}/>
                        <XAxis dataKey="year" tick={{fill: 'rgb(var(--color-axis) , var(--alpha-axis))'}}
                               tickFormatter={(value, index) => XAxisTickFormatter(value, index, currentYear)}
                               tickLine={false}
                        />
                        <YAxis axisLine={false} tick={{fill: 'rgb(var(--color-axis) , var(--alpha-axis))'}}
                               tickLine={false} width={110}
                               tickMargin={15} tickCount={10} tickFormatter={(value, index) => `${getFormattedCost(value)}`}>
                            <Label
                                style={{
                                    textAnchor: "middle",
                                    fontSize: "1.4em",
                                    fill: "rgba(var(--payoff-label))",
                                }}
                                dx={-60}
                                angle={270}
                                value={"Kumulierte jährliche Einsparung durch Sonnenenergie"}/>
                        </YAxis>
                        {/*<Tooltip/>*/}
                        <defs>
                            <linearGradient id='payoff-positive' gradientTransform="rotate(90)" spreadMethod='reflect'>
                                <stop offset='20%' stopColor='#ff9100'/>
                                <stop offset='90%' stopColor='#ffc261'/>
                            </linearGradient>
                            <linearGradient id='payoff-negative' gradientTransform="rotate(90)" spreadMethod='reflect'>
                                <stop offset='20%' stopColor="rgb(var(--stats-bar-elecShade))"/>
                                <stop offset='90%' stopColor="rgb(var(--stats-bar-elec))"/>
                            </linearGradient>
                        </defs>
                        <Bar dataKey='saved' fill="rgb(var(--color-bar))" barSize={35}>
                            {payOffParams.map((entry, index) => (
                                entry.saved < 0 ? <Cell key={`payoff-bar-${index}`} fill={`url(#payoff-negative)`}/> :
                                    <Cell key={`payoff-bar-${index}`} fill={`url(#payoff-positive)`}/>
                            ))}
                        </Bar>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <div className="absolute bottom-7 right-7" data-testid="forward-fab">
                <MuiToolTip title="stats chart" arrow>
                    <Fab variant="circular" sx={{backgroundColor: "#474747", color: "#878787de"}} component={Link}
                         to={`/generationConsumChart?pDate=${pDate}&clientId=${clientId}`}
                         aria-label="add">
                        <ArrowForward/>
                    </Fab>
                </MuiToolTip>
            </div>
            {/*<div className="absolute bottom-7 right-7" data-testid="end-fab">*/}
            {/*    <MuiToolTip title="back to home" arrow>*/}
            {/*        <Fab variant="extended" color="inherit" component={Link} to='/'*/}
            {/*             onClick={() => handleUpdateClientStatus()} aria-label="add">*/}
            {/*            END*/}
            {/*        </Fab>*/}
            {/*    </MuiToolTip>*/}
            {/*</div>*/}
            {/*<Snackbar open={snackOpen} autoHideDuration={3000}*/}
            {/*          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} onClose={() => handleSnackClose()}>*/}
            {/*    <Alert severity={"error"} sx={{width: '100%'}}>*/}
            {/*        {"ErrorScreen while updating client status, update in home page."}*/}
            {/*    </Alert>*/}
            {/*</Snackbar>*/}
        </>
    )
}

const renderCustomizedLabel = (props) => {
    const {x, y, width, value} = props;
    const radius = 10;

    return (
        <g>
            <text x={x + width / 2} y={y - radius} fill="rgb(var(--color-title),0.7 )" textAnchor="middle"
                  className="font-serif text-md font-medium">
                {value}
            </text>
        </g>
    );
};

function XAxisTickFormatter(value, index, currentYear) {
    return (index % 2 === 0) ? value + currentYear : ""
}
