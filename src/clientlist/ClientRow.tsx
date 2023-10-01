import {Link} from "react-router-dom";
import {DeleteOutlined, EditOutlined, PlayArrow} from "@mui/icons-material";
import Button from '@material-ui/core/Button';
import {format} from "date-fns";

export function ClientRow({client: {id, nickname, remarks, presentationDate, status}, setModalParams, triggerDeleteClient}) {
    return (
        <tr key={id} className="border h-[80px] shadow-sm ">
            <td className="font-mono font-bold">{format(new Date(presentationDate), "HH:mm")}</td>
            <td>{id}</td>
            <td>{nickname}</td>
            <td>{remarks}</td>
            <td>{status}</td>
            <td className="flex justify-between mt-3">
                <Button variant="contained" component={Link}
                        to={"/solarElecChart?pDate=" + format(new Date(presentationDate), 'yyyy-MM-dd') + "&clientId=" + id}
                        className="w-[115px]" color="inherit" startIcon={<PlayArrow/>} aria-label="present-client">
                    Present
                </Button>
                <Button variant="contained" color="inherit" startIcon={<EditOutlined/>} className="w-[115px]"
                        onClick={() => setModalParams({openModal: true, clientIdToEdit: id})} aria-label="edit-client">
                    Edit
                </Button>
                <Button variant="contained" color="inherit" startIcon={<DeleteOutlined/>} className="w-[115px]" aria-label="delete-client"
                        onClick={() => triggerDeleteClient(presentationDate, id)} autoFocus={false}>
                    Delete
                </Button>
            </td>
        </tr>
    );
}
