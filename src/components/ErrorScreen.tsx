import {ReactElement} from "react";

export default function ErrorScreen(): ReactElement {
    console.error("error screen")
    console.trace()
    return (
        <div className="flex m-auto text-lg">An error occurred, please refresh and try again.</div>
    )
}