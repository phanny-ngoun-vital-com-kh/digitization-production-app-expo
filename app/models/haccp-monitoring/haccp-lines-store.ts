import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { HaccpActionModel, HaccpListModel, LinesItem, LinesItemModel } from "./haccp-lines-model"
import { haccpMonitorApi } from "app/services/api/haccp-monitor-api"

/**
 * Model description here for TypeScript hints.
 */

const HaccpMonitoringModel = types.model("HaccpMonitoring", {
  id: types.identifierNumber,
  haccp_id: types.maybeNull(types.string),
  haccplist: types.array(HaccpListModel),
  assign_to: types.maybeNull(types.string),
  line: types.maybeNull(types.string),
  assign_date: types.maybeNull(types.string),
  remark: types.maybeNull(types.string),
  createdBy: types.maybeNull(types.string),
  createdDate: types.maybeNull(types.string),
  lastModifiedBy: types.maybeNull(types.string),
  lastModifiedDate: types.maybeNull(types.string),
})

export const HaccpMonitoringStoreModel = types
  .model("HaccpMonitoringStore")
  .props({
    haccpMonitoringList: types.maybeNull(types.array(HaccpMonitoringModel)),
    haccpLinesList: types.maybeNull(types.array(LinesItemModel)),
    activitiesList: types.maybeNull(types.array(HaccpActionModel)),
  })
  .actions(withSetPropAction)
  .views((self) => {
    return {
      getHaccpLineDate: async (date: Date | string) => {
        const rs = await haccpMonitorApi.getHaccpMonitoring(date)
        if (rs.kind === "ok") {
          return rs?.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },

      getLinesById: async (params: { assign_date: string; line: string; haccp_id: string }) => {
        const rs = await haccpMonitorApi.getHaccpLine(params)

        if (rs.kind === "ok") {
          return rs?.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      getActivitiesLog: async (haccp_id: string, line_id?: string) => {
        const rs = await haccpMonitorApi.getActivities(haccp_id, line_id)

        if (rs.kind === "ok") {
          return rs?.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      saveSelfEnroll: async (
        id: string,
        haccp_id: string,
        line: string,
        activities: {
          action: string
        }[],
      ) => {
        const rs = await haccpMonitorApi.saveEnrollment({ id, haccp_id, line, activities })

        if (rs.kind === "ok") {
          console.log("Success")
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => {
    return {
      addHaccpLines: (payload: LinesItem) => {
        self.haccpLinesList?.push(payload)
        return payload
      },
      addActivities: () => {
        return self
      },
      addMonitoringList: () => {
        return self
      },
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

type HaccpLinesType = Instance<typeof HaccpMonitoringModel>
export interface HaccpLines extends HaccpLinesType {}

export interface HaccpMonitoringModelStore extends Instance<typeof HaccpMonitoringStoreModel> {}
export interface HaccpMonitoringModelStoreSnapshotOut
  extends SnapshotOut<typeof HaccpMonitoringStoreModel> {}
export interface HaccpMonitoringModelStoreSnapshotIn
  extends SnapshotIn<typeof HaccpMonitoringStoreModel> {}
export const createHaccpMonitoringModelStoreDefaultModel = () =>
  types.optional(HaccpMonitoringStoreModel, {})
