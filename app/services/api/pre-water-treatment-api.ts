/* eslint-disable lines-between-class-members */
import { BaseApi } from "./base-api"
import { DataResponse } from "./response-util"

const ApiURL = {
  getPrewtpBydate: "get_pre_treatment_by_date_assign",
  postWTP: "post_daily_pre_water_treatment",
  getWtpbyDate: "get_pre_treatment_by_date_time",
  getCtlActivity: "get-control-activities",
}

export class PreWaterTreatmentApi extends BaseApi {
  async getPreWTPList(params: { assign_date: string; pre_treatment_type: string }): Promise<any> {
    try {
      const rs = await this.requestService.list(ApiURL.getPrewtpBydate, {
        ...params,
      })

      return DataResponse(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
  async getPreWTPByDate(params: {
    time: string
    pre_treatment_id: string
    pre_treatment_type: string
  }): Promise<any> {
    try {
      const rs = await this.requestService.list(ApiURL.getWtpbyDate, {
        ...params,
      })

      return DataResponse(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
  async savePreWTP(params: {
    sf: string
    acf: string
    resin: string
    remark: string
    um5: string
    status: string
    warning_count: number | string
    action: string
    pre_treatment_id: string
    id: string | number
    raw_water: string | null
    pre_treatment_type: string
  }): Promise<any> {
    try {
      const rs = await this.requestService.exec(ApiURL.postWTP, {
        ...params,
      })

      return DataResponse(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
  async savePreWTP4(params: {
    sf1: number | string
    sf2: number | string
    acf1: number | string
    acf2: number | string
    um101: string | null
    um102: string | null
    remark: string
    buffer_st002: number | string
    status: string
    warning_count: number | string
    action: string
    pre_treatment_id: string
    id: string | number
    raw_water: string | null
    pre_treatment_type: string
  }): Promise<any> {
    try {
      console.log("params is", params)
      const rs = await this.requestService.exec(ApiURL.postWTP, {
        ...params,
      })

      // console.log(rs)

      return DataResponse(rs?.data)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
  async getControlActivities(control_id: number | string, pre_treatment_type: string) {
    try {
      const rs = await this.requestService.list(ApiURL.getCtlActivity, {
        control_id,
        pre_treatment_type,
      })

      return DataResponse(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
  // async saveActivityes() {
  //   return
  // }
}

export const prewaterTreatmentApi = new PreWaterTreatmentApi()
