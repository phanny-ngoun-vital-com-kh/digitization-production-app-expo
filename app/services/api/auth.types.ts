import { Login } from "app/models/auth/LoginModel";
import { GeneralApiProblem } from "./apiProblem";


export type GetLoginResult = { kind: "ok"; login: Login } | GeneralApiProblem

export type GetLogoutResult = { kind: "ok" } | GeneralApiProblem