import { BaseApi } from "./base-api"
import { DataResponse } from "./response-util"

const ApiURL = {
  getWtpByShift: "get_treatment_by_date_assign",
}

export class WaterTreatmentApi extends BaseApi {
  async getWtp2List(params: { assign_date: string; shift: string }): Promise<any> {
    try {
      const rs = await this.requestService.list(ApiURL.getWtpByShift, {
        ...params,
      })
      return DataResponse(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}

export const watertreatmentApi = new WaterTreatmentApi()
