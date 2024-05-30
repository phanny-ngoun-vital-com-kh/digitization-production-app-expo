import { Page } from "./api.types";
import { GeneralApiProblem } from "./apiProblem";

export type GetAssignDailyWTP2 = {kind:'ok', payload?: Page<any>} | GeneralApiProblem;
