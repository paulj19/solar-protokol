import React, {ReactElement, useState} from "react";
import {useSelector} from "react-redux";
import {
    selectClientById,
    useGetClientQuery,
    useGetGeneralParamsQuery,
    useUpdateClientStatsMutation
} from "@/context/RootApi";
import {GenerationConsumParam, getGenerationConsumParam} from "@/utils/ElectricityCostCalculator";
import {
    Area,
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer, Scatter,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {Alert, Fab, Snackbar} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import {Tooltip as MuiToolTip} from '@mui/material';
import {format} from "date-fns";
import Loading from "@/src/components/Loading";

export default function GenerationConsumChart(): ReactElement {
    const {clientId, pDate} = useParams();
    const navigate = useNavigate();
    if (!clientId || !pDate) {
        navigate('/');
    }
    const [updateClientStatus] = useUpdateClientStatsMutation()
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
        return <div>no data, fix me</div>
    }

    const generationConsumParams: Array<GenerationConsumParam> = getGenerationConsumParam(clientParams.productionYearly, clientParams.consumptionYearly);

    async function handleUpdateClientStatus() {
        try {
            if (clientParams.status !== "completed") {
                await updateClientStatus({[`/uid_1/${pDate}/cid_${clientId}/status`]:
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
            <ResponsiveContainer width="80%" height="90%">
                <ComposedChart
                    data={generationConsumParams}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    <CartesianGrid stroke="#f5f5f5"/>
                    <XAxis dataKey="month"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="consumption" barSize={30} fill="#413ea0"/>
                    <Line type="monotone" strokeWidth={2.5} dataKey="generation" stroke="#ff7300"/>
                </ComposedChart>
            </ResponsiveContainer>
            <div className="absolute bottom-7 left-7">
                <MuiToolTip title="comparison stat" arrow>
                    <Fab variant="circular" color="inherit" component={Link} to={`/solarElecStats/${pDate}/${clientId}`}
                         aria-label="add">
                        <ArrowBack/>
                    </Fab>
                </MuiToolTip>
            </div>
            <div className="absolute bottom-7 right-7">
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
                    {"Error while updating client status, update in home page."}
                </Alert>
            </Snackbar>
        </>
    )
}
