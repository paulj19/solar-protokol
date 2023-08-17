import { GeneralParams, ClientParams } from "@/types/types";
import { URL_GENERAL_PARAMS, URL_CLIENT_PARAMS } from "@/utils/Urls";
import axios from "axios";

export function fetchPredictionParams(): Promise<GeneralParams> {
    return axios.get(URL_GENERAL_PARAMS).then((response) => response.data).catch((e) => console.error("error fetching energy cost prediction params", e));
}

export function fetchUserParams(userId: number): Promise<ClientParams> {
    return axios.get(URL_CLIENT_PARAMS.replace(":userId", userId.toString())).then((response) => response.data).catch((e) => console.error("error fetching energy usage", e));
}
