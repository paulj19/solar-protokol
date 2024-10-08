import {Link} from "react-router-dom";
import {DeleteOutlined, EditOutlined, PlayArrow} from "@mui/icons-material";
import Button from '@material-ui/core/Button';
import {format} from "date-fns";
import de from 'date-fns/locale/de'
import {STATUS_COMPLETED, STATUS_OPEN} from "@/utils/CommonVars";
import styles from '@/src/stats/stats.module.css'

export function ClientRow({
                              client: {id, nickname, remarks, presentationDate, status, isPurchase},
                              setModalParams,
                              triggerDeleteClient,
                              searchView
                          }) {
    return (
        <tr key={id} className="border h-[80px] shadow-sm ">
            {searchView ?
                <td>
                    <div>{format(presentationDate, "dd MMM", {locale: de})}</div>
                    <div className="font-serif text-gray-600 text-xs">{format(presentationDate, "HH:mm", {locale: de})}</div>
                </td> :
                <td className="font-mono font-bold">{format(presentationDate, "HH:mm")}</td>}
            <td>{id}</td>
            <td dangerouslySetInnerHTML={{__html: nickname}}/>
            <td>{remarks}</td>
            <td>{status == "open" ? STATUS_OPEN : STATUS_COMPLETED}</td>
            <td className="flex justify-between mt-3">
                <Button variant="contained" component={Link}
                        to={(isPurchase ? "/payoffChart" : "/solarElecChart") + "?pDate=" + format(new Date(presentationDate), 'yyyy-MM-dd') + "&clientId=" + id}
                        className="w-[155px]" color="inherit" startIcon={<PlayArrow/>} aria-label="present-client">
                    Präsentieren
                </Button>
                <Button variant="contained" color="inherit" startIcon={<EditOutlined/>} className="w-[155px]"
                        onClick={() => setModalParams({openModal: true, clientIdToEdit: id})} aria-label="edit-client">
                    Bearbeiten
                </Button>
                <Button variant="contained" color="inherit" startIcon={<DeleteOutlined/>} className="w-[155px]"
                        aria-label="delete-client"
                        onClick={() => triggerDeleteClient(presentationDate, id)} autoFocus={false}>
                    Löschen
                </Button>
            </td>
        </tr>
    );
}
