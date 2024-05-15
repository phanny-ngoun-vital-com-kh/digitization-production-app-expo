import { generalApiExHandler } from "./apiProblem"
import { BaseApi } from "./base-api"


const ApiURL = {
    haccpMonitorApi: "/api/haccp-monitor",

}

export class HaccpMonitoringApi extends BaseApi {

    async getHaccpMonitoring(): Promise<any> {
        try {
            return this.requestService.api.apisauce.get(ApiURL.haccpMonitorApi)
        } catch (e) {
            return generalApiExHandler(e)
        }
    }

  
}

export const haccpMonitorApi = new HaccpMonitoringApi()