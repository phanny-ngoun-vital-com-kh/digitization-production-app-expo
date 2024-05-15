import { GeneralApiProblem } from "./apiProblem";

export type GetWaterTreatmentResult = { kind: "ok"; result: any } | GeneralApiProblem
