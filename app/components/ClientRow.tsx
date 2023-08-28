import { Link } from "react-router-dom";

export function ClientRow({ id, nickname, remarks, presentationDate }) {
    return (
        <tr>
            <th scope="row">{presentationDate}</th>
            <td>{id}</td>
            <td>{nickname}</td>
            <TruncatedRemark remarks={remarks} />
            <td><Link to={'/comparisonChart/123'}> PRESENT </Link></td>
            <td><Link to={'/#'}> EDIT </Link></td>
        </tr>
    )
}

const TruncatedRemark = ({ remarks }: any) => {
    const maxLength = 30;
    if (remarks?.length > maxLength) {
        // If the text is longer than the maxLength, truncate it and add ellipsis
        const truncatedText = remarks.substring(0, maxLength) + '...';
        return <span>{truncatedText}</span>;
    }

    return <td>{remarks}</td>;
};
