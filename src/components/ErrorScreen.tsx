import {ReactElement} from "react";

export default function ErrorScreen({errorText}: {errorText?: string}): ReactElement {
    console.error("Error screen")
    return (
        <div className="flex m-auto text-lg text-gray-300">{errorText ?? "Ein Fehler ist aufgetreten, bitte nochmal versuchen."}</div>
    )
}