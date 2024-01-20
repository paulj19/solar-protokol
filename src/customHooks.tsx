import { SessionContext, signIn, useSession } from "next-auth/react";
import { useGetClientQuery, useGetGeneralParamsQuery } from "@/src/context/RootApi";
import { useEffect } from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export function useGetClientAndGeneralParams(queryParams) {
    const {session, skip} = useGetSession();

    const {data: generalParams,isLoading: isGeneralParamLoading,isError: isGeneralParamsError} = useGetGeneralParamsQuery(undefined, skip);
    const {data: clientParams, isLoading: isClientParamLoading, isError: isClientParamError, isUninitialized: isClientParamUninit} = useGetClientQuery({
        ...queryParams,
        userId: session?.user?.user_id
    }, {skip});

    if (isClientParamLoading || isGeneralParamLoading || isClientParamUninit) {
        return {isLoading: true}
    }
    if (isClientParamError || isGeneralParamsError) {
        throw Error('error loading clientParams or generalParams')
    }

    return {clientParams, generalParams}
}

export function useGetSession() {
    const { data: session, status } = useSession({
      required: true,
      onUnauthenticated() {
        signIn('okta');
      },
    })

    useEffect(() => {
      if (session?.error === "RefreshAccessTokenError") {
        signIn('okta');
      }
    }, [session]);

    return {session, skip: status === 'loading' || session?.error}
}

export function useGetQueryParams () {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get('clientId');
    const pDate = searchParams.get('pDate');
    // const clientId = "43"
    // const pDate = "2023-11-09"
    useEffect(() => {
        if (!clientId || !pDate) {
            navigate('/');
        }
    }, []);
    return {clientId, pDate}
}

