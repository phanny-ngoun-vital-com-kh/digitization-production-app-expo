import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { ShiftModel } from "./water-treatment-store"

/**
 * Model description here for TypeScript hints.
 */
export const TreatmentModel = types
  .model("TreatmentModel", {
    id: types.identifierNumber,
    machine: types.string,
    treatment_id: types.string,
    tds: types.maybeNull(types.string),
    ph: types.maybeNull(types.string),
    temperature: types.maybeNull(types.string),
    pressure: types.maybeNull(types.string),
    air_release: types.maybeNull(types.string),
    press_inlet: types.maybeNull(types.string),
    press_treat: types.maybeNull(types.string),
    press_drain: types.maybeNull(types.string),
    check_by: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    odor: types.maybeNull(types.string),
    taste: types.maybeNull(types.string),
    other: types.maybeNull(types.string),
    createdBy: types.string,
    createdDate: types.string,
    lastModifiedBy: types.string,
    lastModifiedDate: types.string,
  })
  .actions(withSetPropAction)
export const WaterTreatmentModel = types
  .model("WaterTreatmentModel", {
    assign_to: types.maybeNull(types.string),
    shift: types.maybeNull(types.string),
    treatment_id: types.maybeNull(types.string),
    remark: types.maybeNull(types.string),
    createdBy: types.string,
    createdDate: types.string,
    lastModifiedBy: types.maybeNull(types.string),
    lastModifiedDate: types.maybeNull(types.string),
    treatmentlist: types.optional(types.array(TreatmentModel), []),
  })
  .actions(withSetPropAction)
// eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars

export interface WaterTreatment extends Instance<typeof WaterTreatmentModel> {}
export interface WaterTreatmentSnapshotOut extends SnapshotOut<typeof WaterTreatmentModel> {}
export interface WaterTreatmentSnapshotIn extends SnapshotIn<typeof WaterTreatmentModel> {}
export const createWaterTreatmentDefaultModel = () => types.optional(WaterTreatmentModel, {})
