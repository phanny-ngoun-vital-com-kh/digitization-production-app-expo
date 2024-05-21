/* eslint-disable lines-between-class-members */
import { MACHINE_STATE } from "app/components/v2/WaterTreatment/type"
import { BaseApi } from "./base-api"
import { DataResponse } from "./response-util"
import { GetActivities } from "./water-treatment.type"
import { Activities } from "app/models/water-treatment/water-treatment-model"
import { Page } from "./api.types"

const ApiURL = {
  getWtpByShift: "get_treatment_by_date_assign",
  fetchShiftTreatment: "fetch-paging-shift-activities",
  fetchActivitiesByMachine : "fetch-paging-machine-activities",
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
    action: string | null
    warning_count: string | null
    treatment_id: string | null
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
  async getActivitiesByTreatment(pageSize: number, treatment_id: string): Promise<GetActivities> {
    try {
      const rs = await this.requestService.page<Activities>(
        ApiURL.fetchShiftTreatment,
        {
          treatment_id,
        },
        pageSize,
      )
      return DataResponse<Page<Activities>>(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getActivitiesByMachine(pageSize: number, machine_id: string): Promise<GetActivities> {
    try {
      const rs = await this.requestService.page<Activities>(
        ApiURL.fetchActivitiesByMachine,
        {
          machine_id,
        },
        pageSize,
      )
      return DataResponse<Page<Activities>>(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}

export const watertreatmentApi = new WaterTreatmentApi()
