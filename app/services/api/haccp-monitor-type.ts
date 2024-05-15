import { GeneralApiProblem } from "./apiProblem";

export type GetHaccpMonitoringResult = { kind: "ok"; result: any } | GeneralApiProblem
