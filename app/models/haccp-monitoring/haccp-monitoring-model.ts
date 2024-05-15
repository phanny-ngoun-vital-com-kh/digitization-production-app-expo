import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const HaccpMonitoringModel = types
  .model("HaccpMonitoring")
  .props({})
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface HaccpMonitoring extends Instance<typeof HaccpMonitoringModel> {}
export interface HaccpMonitoringSnapshotOut extends SnapshotOut<typeof HaccpMonitoringModel> {}
export interface HaccpMonitoringSnapshotIn extends SnapshotIn<typeof HaccpMonitoringModel> {}
export const createHaccpMonitoringDefaultModel = () => types.optional(HaccpMonitoringModel, {})
