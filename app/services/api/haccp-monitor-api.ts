import { HaccpAction } from "./../../models/haccp-monitoring/haccp-lines-model"
import { HaccpLines as HaccpLineStore } from "app/models/haccp-monitoring/haccp-lines-store"
import { HaccpLines } from "app/models/haccp-monitoring/haccp-lines-model"
import { BaseApi } from "./base-api"
import {GetHaccpLineResult, GetHaccpMonitoringResult } from "./haccp-monitor-type"
import { DataResponse, DataResponseList } from "./response-util"


const ApiURL = {
  haccpAssignExce: "assign-haccp",
  haccpExce: "post-haccp-monitoring-list",
  haccpListByDate: "get-haccp-by-date",
  haccpListByDateAndLine: "get-haccp-by-date-and-line",
  haccpActivitiesList: "get-haccp-activities",
  haccpSelfAssign: "assign-self-haccp",
  haccpActivitiesByTime: "get-haccp-activities-by-time",
  getInstruction:"get-instruction"
}

export class HaccpMonitoringApi extends BaseApi {
  async getHaccpMonitoring(date: Date | string): Promise<GetHaccpMonitoringResult> {
    try {
      const rs = await this.requestService.list<HaccpLineStore>(ApiURL.haccpListByDate, {
        assign_date: date,
      })
      return DataResponseList(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getHaccpLine(params: {
    assign_date: string
    line: string
    haccp_id: string
  }): Promise<GetHaccpLineResult> {
    try {
      const rs = await this.requestService.list<HaccpLines>(ApiURL.haccpListByDateAndLine, {
        ...params,
      })

      return DataResponseList(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async saveEnrollment(params: {
    id: string
    haccp_id: string
    line?: string
    activities: {
      action: string
    }[]
  }) : Promise<any> {
    try {
      const rs = await this.requestService.exec(ApiURL.haccpSelfAssign, {
        ...params,
      })

      return DataResponse(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getActivities(haccp_id: string, line_id?: string): Promise<GetHaccpLineResult> {
    try {
      const rs = await this.requestService.list<HaccpAction>(ApiURL.haccpActivitiesByTime, {
        haccp_id,
        line_id,
      })

      return DataResponseList(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getLineActivities(haccp_id: string): Promise<GetHaccpLineResult> {
    try {
      const rs = await this.requestService.list<HaccpAction>(ApiURL.haccpActivitiesList, {
        haccp_id,
      })

      return DataResponseList(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async saveLines(params: {
    id: number
    line: string
    activities: {
      action: string
    }[]
    other: string
    smell: number
    activity_control: number
    done_by: string
    fg: string
    haccp_id: string
    nozzles_rinser: string
    take_action: string
    status: string
    warning_count: number
    water_pressure: string
    opo:string
    uv_lamp: string
    temperature: string
  }): Promise<any> {
    try {
      const rs = await this.requestService.exec(ApiURL.haccpExce, {
        ...params,
      })

      return DataResponse(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async saveLines456(params: {
    id: string
    line: string
    activities: {
      action: string
    }[]
    activity_control: string
    done_by: string
    side_wall: string
    air_pressure: string
    temperature_preform: string
    treated_water_pressure: string
    fg: string
    haccp_id: string
    take_action: string
    status: string
    warning_count: number
  }): Promise<any> {
    try {
      const rs = await this.requestService.exec(ApiURL.haccpExce, {
        ...params,
      })

      return DataResponse(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getInstruction(group_line: string): Promise<any> {
    try {
      const rs = await this.requestService.list(ApiURL.getInstruction, {
        group_line: group_line,
      })
      return DataResponseList(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

}

export const haccpMonitorApi = new HaccpMonitoringApi()
