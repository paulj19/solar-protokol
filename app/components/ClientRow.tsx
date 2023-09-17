import { Link } from "react-router-dom";
import {EditAttributesOutlined, EditOutlined, PlayArrow, PlayArrowOutlined} from "@mui/icons-material";
import Button from '@material-ui/core/Button';
import {Client} from "@/types/types";
export function ClientRow({ id, nickname, remarks, presentationDate, status }: Client) {
    return (
        <tr key={id} className="border h-[80px] shadow-sm">
            <th className="font-mono">{extractLocalTime(presentationDate)}</th>
            <td>{id}</td>
            <td>{nickname}</td>
            <td>{remarks}</td>
            {/* <TruncatedRemark remarks={remarks} /> */}
            <td>{status}</td>
            <td>
                <Button variant="outlined" component={Link} to="/comparisonChart/123" color="inherit" startIcon={<PlayArrow/>}>
                    Present
                </Button>
            </td>
            <td>
                <Button variant="outlined" component={Link} to="/#" color="inherit" startIcon={<EditOutlined/>}>
                    Edit
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
    const date = new Date(utcTimestamp);
    const localTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return localTime;
}