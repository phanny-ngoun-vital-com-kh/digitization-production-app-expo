
import { WaterTreatment } from "app/models/water-treatment/water-treatment-model";
import { GeneralApiProblem } from "./apiProblem"
export type GetPreWTPResult = { kind: "ok"; payload: WaterTreatment[] } | GeneralApiProblem
export type GetDailyResult = { kind: "ok"; payload: WaterTreatment[] } | GeneralApiProblem
export type GetHaccpLineResult = { kind: "ok"; payload: any[] } | GeneralApiProblem


