import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const HaccpMonitoringStoreModel = types
  .model("HaccpMonitoringStore")
  .props({})
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface HaccpMonitoringStore extends Instance<typeof HaccpMonitoringStoreModel> {}
export interface HaccpMonitoringStoreSnapshotOut extends SnapshotOut<typeof HaccpMonitoringStoreModel> {}
export interface HaccpMonitoringStoreSnapshotIn extends SnapshotIn<typeof HaccpMonitoringStoreModel> {}
export const createHaccpMonitoringStoreDefaultModel = () => types.optional(HaccpMonitoringStoreModel, {})
