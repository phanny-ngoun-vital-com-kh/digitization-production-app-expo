import { Instance, SnapshotIn, SnapshotOut, applySnapshot, types } from "mobx-state-tree"
import {
  HaccpMonitoring,
  HaccpMonitoringModel,
  LinesItemList,
  LinesItemModel,
} from "./haccp-monitoring-model"

/**
 * Model description here for TypeScript hints.
 */
export const LinesItemStoreModel = types
  .model("HaccpLinesStoreModel")
  .props({
    id: types.identifierNumber,
    name: types.string,
    date: types.string,
    lines: types.maybeNull(types.array(LinesItemModel)),
  })
  .actions((self) => {
    return {
      add: (id: number, line: string, date: string, data: LinesItemList) => {
        self.id = id
        self.name = line
        self.date = date
        self.lines?.push(data)
        return data
      },
    }
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({}))
export const HaccpMonitoringStoreModel = types
  .model("HaccpMonitoringStore")
  .props({
    haccpMonitoringList: types.optional(types.array(HaccpMonitoringModel), []),
  })
  .actions((self) => {
    return {
      add: (data: HaccpMonitoring) => {
        self.haccpMonitoringList?.push(data)
        return data
      },
      removeLines: () => {
        self.haccpMonitoringList?.pop()
        return self.haccpMonitoringList?.clear()
      },
    }
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

// eslint-disable-line

export interface HaccpMonitoringStore extends Instance<typeof HaccpMonitoringStoreModel> {}
export interface LinesStore extends Instance<typeof LinesItemStoreModel> {}

export interface HaccpMonitoringStoreSnapshotOut
  extends SnapshotOut<typeof HaccpMonitoringStoreModel> {}
export interface HaccpMonitoringStoreSnapshotIn
  extends SnapshotIn<typeof HaccpMonitoringStoreModel> {}
