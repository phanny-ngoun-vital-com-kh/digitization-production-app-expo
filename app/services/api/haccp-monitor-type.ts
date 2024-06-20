import { HaccpLines as HaccpLineStore } from "app/models/haccp-monitoring/haccp-lines-store"
import {HaccpAction, HaccpLines}  from "app/models/haccp-monitoring/haccp-lines-model"
import { Page } from "./api.types"
import { GeneralApiProblem } from "./apiProblem"
export type GetHaccpLineResult = { kind: "ok"; payload: HaccpAction[] } | GeneralApiProblem
export type GetHaccpActivityLine = { kind: "ok"; payload: HaccpLines[] } | GeneralApiProblem
export type ExceResult = { kind: "ok"; payload: any } | GeneralApiProblem
export type GetHaccpMonitoringResult = { kind: "ok"; payload: HaccpLineStore[] } | GeneralApiProblem
