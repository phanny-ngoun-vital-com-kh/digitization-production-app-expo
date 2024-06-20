import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { PretreatmentModel, TreatmentModel, HaccpLineModel } from "./dashboard-model"
import { dashboardApi } from "app/services/api/dashboard-api"

/**
 * Model description here for TypeScript hints.
 */
export const DashboardStoreModel = types
  .model("DashboardStore")
  .props({
    wtp_charts_list: types.maybeNull(types.array(TreatmentModel)),
    pre_charts_list: types.maybeNull(types.array(PretreatmentModel)),
    haccp_cahrts_list: types.maybeNull(types.array(HaccpLineModel)),
  })
  .actions(withSetPropAction)
  .views((self) => {
    return {
      getWtp: async (period_type: Date | string, period: string) => {
        const rs = await dashboardApi.getWTPChart(period_type, period)
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      getPre: async (period_type: Date | string, period: string) => {
        const rs = await dashboardApi.getPreChart(period_type, period)
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      getLine: async (period_type: Date | string, period: string) => {
        const rs = await dashboardApi.getLinesChart(period_type, period)
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      getCustomDateWtp: async (params: { start_date: string; end_date: string }) => {
        const rs = await dashboardApi.getCustomDailyWtp(params)
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      getCustomDatePreWtp: async (params: { start_date: string; end_date: string }) => {
        const rs = await dashboardApi.getCustomPreDailyWtp(params)
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      getCustomDateLinesWtp: async (params: { start_date: string; end_date: string }) => {
        const rs = await dashboardApi.getCustomLines(params)
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface DashboardStore extends Instance<typeof DashboardStoreModel> {}
export interface DashboardStoreSnapshotOut extends SnapshotOut<typeof DashboardStoreModel> {}
export interface DashboardStoreSnapshotIn extends SnapshotIn<typeof DashboardStoreModel> {}
export const createDashboardStoreDefaultModel = () => types.optional(DashboardStoreModel, {})
