import Config from "app/config"
import { generalApiExHandler, generalApiRsHandler, getGeneralApiProblem } from "./apiProblem"
import qs from "qs"
import { GetLoginResult, GetLogoutResult } from "./auth.types"
import { DeviceInfo } from "app/models/auth/DeviceInfo"
import { ApiResponse } from "apisauce"
import { Login } from "app/models/auth/LoginModel"
import { BaseApi } from "./base-api"
import { loadString } from "app/utils/storage"
import { DataResponse } from "./response-util"

const ApiURL = {
    login: "/api/login",
    account: "api/account",
    logout: "/api/logout",
    loginAsQuest: "/api/login-guest",
    saveMobileUser:"save-mobile-user",
    setFirebaseToken: "/api/firebase-token",
}

export class AuthApi extends BaseApi {

    async getUser(): Promise<any> {
        try {
            return this.requestService.api.apisauce.get(ApiURL.account)
        } catch (e) {
            return generalApiExHandler(e)
        }
    }

    async saveUser(user_id:string,login:string,fcm_token:string,authorities:any):Promise<any>{
        try{
            const rs = await this.requestService.exec(ApiURL.saveMobileUser,{
                user_id,
                login,
                fcm_token,
                authorities
            })
            return DataResponse(rs)
        }catch(e){
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async login(
        username: string,
        password: string,
        fcmToken: string,
        deviceInfo?: DeviceInfo,
    ): Promise<GetLoginResult> {
        this.requestService.api.waiting?.(true)
        try {
            const data = qs.stringify({
                ...deviceInfo,
                fcmToken: fcmToken,
                grant_type: "password",
                client_id: Config.KEYCLOAK_CLIENT_ID,
                scope: 'offline_access',
                username: username.trim(),
                password: password,
            })

            return await this.doLogin(data)
        } finally {
            this.requestService.api.waiting?.(false)
        }
    }

    async doLogin(data: any): Promise<GetLoginResult> {
  
        try {
            this.requestService.api.waiting?.(true)
            const response = await this.requestService.api.apisauce.post<Login>(ApiURL.login, data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })

   

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return problem
            }

            const login = response.data

            if (login)
                return { kind: "ok", login }
            else return generalApiRsHandler("Nothing return")
        } catch (e) {
            return generalApiExHandler(e)
        } finally {
            this.requestService.api.waiting?.(true)
        }

    }


    async logout(): Promise<GetLogoutResult> {
        const refreshToken = await loadString("refresh_token")
        const data = qs.stringify({
            grant_type: "refresh_token",
            client_id: Config.KEYCLOAK_CLIENT_ID,
            refresh_token: refreshToken,
        })
        // console.log(data)
        try {
            const response: ApiResponse<void> = await this.requestService.api.apisauce.post(ApiURL.logout, data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })

            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                console.log(problem)
                if (problem) return problem
            }
            return { kind: "ok" }
        } catch (e) {
            return generalApiExHandler(e)
        }
    }

}

export const authApi = new AuthApi()