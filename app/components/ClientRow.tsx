import {Link} from "react-router-dom";
import {DeleteOutlined, EditOutlined, PlayArrow} from "@mui/icons-material";
import Button from '@material-ui/core/Button';

export function ClientRow({client:{ id, nickname, remarks, presentationDate, status }, setModalParams,triggerDeleteClient}) {
    return (
        <tr key={id} className="border h-[80px] shadow-sm">
            <th className="font-mono">{extractLocalTime(presentationDate)}</th>
            <td>{id}</td>
            <td>{nickname}</td>
            <td>{remarks}</td>
            <td>{status}</td>
            <td className="flex justify-between">
                <Button variant="contained" component={Link} to="/comparisonChart/123" className="w-[115px]" color="inherit" startIcon={<PlayArrow/>}>
                    Present
                </Button>
                <Button variant="contained" color="inherit" startIcon={<EditOutlined/>} className="w-[115px]" onClick={() => setModalParams({openModal: true,  clientIdToEdit: id})}>
                    Edit
                </Button>
                <Button variant="contained" color="inherit" startIcon={<DeleteOutlined/>} className="w-[115px]" onClick={() => triggerDeleteClient(presentationDate, id)}>
                    Delete
                </Button>
            </td>
        </tr>
    );
}

const TruncatedRemark = ({ remarks }: any) => {
    const maxLength = 60;
    if (remarks?.length > maxLength) {
        // If the text is longer than the maxLength, truncate it and add ellipsis
        const truncatedText = remarks.substring(0, maxLength) + '...';
        return <td>{truncatedText}</td>;
    }
    return <td>{remarks}</td>;
};

function extractLocalTime(utcTimestamp) {
    //todo date-fns
    const date = new Date(utcTimestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}