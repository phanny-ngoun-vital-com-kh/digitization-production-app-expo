import Config from "app/config"
import { generalApiExHandler } from "./apiProblem"
import { BaseApi } from "./base-api"


const ApiURL = {
    waterTreatments: "/api/water-treatments",

}

export class WaterTreatmentApi extends BaseApi {

    async getWaterTreatments(): Promise<any> {
        try {
            return this.requestService.api.apisauce.get(ApiURL.waterTreatments)
            
        } catch (e) {
            return generalApiExHandler(e)
        }
    }

  
}

export const watertreatmentApi = new WaterTreatmentApi()