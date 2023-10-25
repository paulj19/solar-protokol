import {ReactElement} from "react";
import {ERROR_TEXT} from "@/utils/CommonVars";

export default function ErrorScreen({errorText}: {errorText?: string}): ReactElement {
    console.error("Error screen")
    return (
        <div className="flex m-auto text-lg text-gray-300">{errorText ?? ERROR_TEXT}</div>
    )
}