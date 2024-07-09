import { Activities } from "app/models/water-treatment/water-treatment-model";
import { Page } from "./api.types";
import { GeneralApiProblem } from "./apiProblem";
import { PreWaterTreatment } from "app/models/pre-water-treatment/pre-water-treatment-model";

export type GetPreWaterResult = {kind:'ok', payload?: Page<PreWaterTreatment>} | GeneralApiProblem;
export type GetActivities = {kind:'ok', payload?: Page<Activities>} | GeneralApiProblem