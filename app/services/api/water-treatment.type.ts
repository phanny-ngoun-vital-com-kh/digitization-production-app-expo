import { Activities, WaterTreatment } from "app/models/water-treatment/water-treatment-model";
import { Page } from "./api.types";
import { GeneralApiProblem } from "./apiProblem";

export type GetWtp2Result = {kind:'ok', payload?: Page<WaterTreatment>} | GeneralApiProblem;
export type GetActivities = {kind:'ok', payload?: Page<Activities>} | GeneralApiProblem