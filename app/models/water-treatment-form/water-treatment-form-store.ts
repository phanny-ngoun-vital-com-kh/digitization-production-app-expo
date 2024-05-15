import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const WaterTreatmentFormStoreModel = types
  .model("WaterTreatmentFormStore")
  .props({})
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface WaterTreatmentFormStore extends Instance<typeof WaterTreatmentFormStoreModel> {}
export interface WaterTreatmentFormStoreSnapshotOut extends SnapshotOut<typeof WaterTreatmentFormStoreModel> {}
export interface WaterTreatmentFormStoreSnapshotIn extends SnapshotIn<typeof WaterTreatmentFormStoreModel> {}
export const createWaterTreatmentFormStoreDefaultModel = () => types.optional(WaterTreatmentFormStoreModel, {})
