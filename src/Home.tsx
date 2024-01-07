import ClientList from "./clientlist/ClientList"
import React, {ReactElement} from "react";
import {useTheme} from "next-themes";
import {Button} from "@mui/material";
import {SessionContext, signIn, useSession} from "next-auth/react";
import Loading from "@/src/components/Loading";

export default function Home(): ReactElement {
    const {setTheme} = useTheme();
    setTheme('home');

    return (
        <div>
            <ClientList/>
        </div>
    )
}
