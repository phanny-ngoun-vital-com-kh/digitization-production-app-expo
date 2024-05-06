import { ApiResponse } from "apisauce";
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem";



export const DataResponse = <T>(response: ApiResponse<T>): { kind: "ok"; payload?: T } | GeneralApiProblem => {
    if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
    }
    return { kind: "ok", payload: response.data }
}

export const DataResponseList = <T>(response: ApiResponse<T[]>): { kind: "ok"; payload: T[] } | GeneralApiProblem => {
    if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
    }
    return { kind: "ok", payload: response.data || [] }
}