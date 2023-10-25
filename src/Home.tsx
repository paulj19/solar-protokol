import ClientList from "./clientlist/ClientList"
import React, {ReactElement} from "react";
import {useTheme} from "next-themes";

export default function Home(): ReactElement {
    const { setTheme } = useTheme();
    setTheme('home');
    return (
        <ClientList/>
    )
}
