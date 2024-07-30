import { Treatment, WaterTreatment } from "./../../models/water-treatment/water-treatment-model"
import { HaccpLines as HaccpLineStore } from "app/models/haccp-monitoring/haccp-lines-store"
import { BaseApi } from "./base-api"
import { GetHaccpLineResult, GetHaccpMonitoringResult } from "./haccp-monitor-type"
import { DataResponseList } from "./response-util"
import { GetDailyResult } from "./dashboard-type"

const ApiURL = {
  wtpChartList: "get-treatment-chart-day",
  wtpCustomChartList: "get-treatment-chart-custom",
  preChartList: "get-pre-treatment-day",
  preCustomChartList: "get-pre-treatment-custom",
  lineChartList: "get-haccp-chart-day",
  lineCustomChartList: "get-haccp-chart-custom",
}

export class DashboardApi extends BaseApi {
  async getWTPChart(period_type: Date | string, period: string): Promise<GetDailyResult> {
    try {
      const rs = await this.requestService.list<WaterTreatment>(ApiURL.wtpChartList, {
        period_type,
        period,
      })

      return DataResponseList(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
  async getPreChart(period_type: Date | string, period: string): Promise<GetHaccpMonitoringResult> {
    try {
      const rs = await this.requestService.list<HaccpLineStore>(ApiURL.preChartList, {
        period_type,
        period,
      })

      return DataResponseList(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
  async getLinesChart(
    period_type: Date | string,
    period: string,
  ): Promise<GetHaccpMonitoringResult> {
    try {
      const rs = await this.requestService.list<HaccpLineStore>(ApiURL.lineChartList, {
        period_type,
        period,
      })

      return DataResponseList(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
  async getCustomDailyWtp(params: {
    start_date: string
    end_date: string
  }): Promise<GetDailyResult> {
    try {
      console.log("params", params.start_date, params.end_date)
      const rs = await this.requestService.list<WaterTreatment>(ApiURL.wtpCustomChartList, {
        start_date: params?.start_date,
        end_date: params?.end_date,
      })

      return DataResponseList(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
  async getCustomPreDailyWtp(params: {
    start_date: string
    end_date: string
  }): Promise<GetHaccpLineResult> {
    try {
      const rs = await this.requestService.list<any>(ApiURL.preCustomChartList, {
        ...params,
      })

      return DataResponseList(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
  async getCustomLines(params: {
    start_date: string
    end_date: string
  }): Promise<GetHaccpLineResult> {
    try {
      const rs = await this.requestService.list<any>(ApiURL.lineCustomChartList, {
        ...params,
      })

      return DataResponseList(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}

export const dashboardApi = new DashboardApi()
