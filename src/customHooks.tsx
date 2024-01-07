import { SessionContext, signIn, useSession } from "next-auth/react";
import Loading from "./src/components/Loading";
import { DefaultSession } from "next-auth";
import React, { ReactElement } from "react";
import { useGetClientQuery } from "@/src/context/RootApi";
import { BaseQueryResult } from "@reduxjs/toolkit/dist/query/baseQueryTypes";

export function useGetClient(pDate, clientId) {
    const { data: session, status } = useSession({
      required: false,
      //todo test this.
      onUnauthenticated() {
        signIn('okta');
      },
    })

    // console.log("status", status, session)
    if (status === "loading") {
      // return {isError: true} 
        throw Error('error loading session')
    }
    // console.log("useGetClient", session)

    return useGetClientQuery({
        pDate,
        clientId,
        userId: session?.user?.user_id
    });
}

