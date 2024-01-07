import {ReactElement} from "react";
import {ERROR_TEXT} from "@/utils/CommonVars";

export default function ErrorScreen({errorText}: {errorText?: string}): ReactElement {
    return (
        <div className="text-lg text-gray-300 mt-[25%] ml-[30%]">{errorText ?? ERROR_TEXT}</div>
    )
}
