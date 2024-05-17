import { MACHINE_STATE } from "app/components/v2/WaterTreatment/type"
import { BaseApi } from "./base-api"
import { DataResponse } from "./response-util"

const ApiURL = {
  getWtpByShift: "get_treatment_by_date_assign",
  saveWtp2: "post_daily_water_treatment",
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

  async saveWtp2(params: {
    tds: string | null
    ph: string | null
    temperature: string | null
    other: string | null
    air_release: string | null
    machine: string | null
    status: string
    id: number | string
    press_inlet: string | null
    press_treat: string | null
    press_drain: string | null
    odor: string | null
    taste: string | null
    pressure: string | null
  }): Promise<any> {
    try {
      const rs = await this.requestService.exec(ApiURL.saveWtp2, {
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
