import { ExternPredictionParams, ClientParams } from "@/types/types";
import { URL_EXTERN_PREDICTION_PARAMS, URL_ENERGY_USAGE } from "@/utils/Urls";
import axios from "axios";

export function fetchPredictionParams(): Promise<ExternPredictionParams> {
    return axios.get(URL_EXTERN_PREDICTION_PARAMS).then((response) => response.data).catch((e) => console.error("error fetching energy cost prediction params", e));
}

export function fetchUserParams(userId: number): Promise<ClientParams> {
    return axios.get(URL_ENERGY_USAGE.replace(":userId", userId.toString())).then((response) => response.data).catch((e) => console.error("error fetching energy usage", e));
}
