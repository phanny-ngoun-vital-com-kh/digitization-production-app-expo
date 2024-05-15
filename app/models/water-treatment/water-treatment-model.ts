import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { ShiftModel } from "./water-treatment-store"

/**
 * Model description here for TypeScript hints.
 */

export const WaterTreatmentModel = types
  .model("WaterTreatment")
  .props({
    check_id: types.identifierNumber,
    waterplant_type: types.string,
    shifts: types.maybeNull(types.array(ShiftModel)),
    check_date: types.string,
  })
  .actions(withSetPropAction)
  // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars

export interface WaterTreatment extends Instance<typeof WaterTreatmentModel> {}
export interface WaterTreatmentSnapshotOut extends SnapshotOut<typeof WaterTreatmentModel> {}
export interface WaterTreatmentSnapshotIn extends SnapshotIn<typeof WaterTreatmentModel> {}
export const createWaterTreatmentDefaultModel = () => types.optional(WaterTreatmentModel, {})
