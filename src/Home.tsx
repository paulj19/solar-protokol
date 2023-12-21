import ClientList from "./clientlist/ClientList"
import React, {ReactElement} from "react";
import {useTheme} from "next-themes";
import {Button} from "@mui/material";
import {signIn, useSession} from "next-auth/react";
import Loading from "@/src/components/Loading";

export default function Home(): ReactElement {
    const {setTheme} = useTheme();
    setTheme('home');
    // const {data: session, status} = useSession()
    // if (status === 'loading') return <Loading/>
    // if (!session) {
    //     signIn('okta');
    //     return
    // }
    // console.log("session", session)

    return (
        <div>
            <ClientList/>
        </div>
    )
}
