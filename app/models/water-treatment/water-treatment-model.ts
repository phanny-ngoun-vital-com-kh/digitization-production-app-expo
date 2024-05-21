import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { watertreatmentApi } from "app/services/api/water-treatment-api"

/**
 * Model description here for TypeScript hints.
 */
export const TreatmentModel = types
  .model("TreatmentModel", {
    id: types.identifierNumber,
    action: types.string,
    warning_count: types.maybeNull(types.string),
    machine: types.string,
    treatment_id: types.maybeNull(types.string),
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
    createdBy: types.maybeNull(types.string),
    createdDate: types.maybeNull(types.string),
    lastModifiedBy: types.maybeNull(types.string),
    lastModifiedDate: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => {
    return {
      saveWtp2: async () => {
        const rs = await watertreatmentApi.saveWtp2({
          tds: self.tds ?? null,
          ph: self.ph ?? null,
          temperature: self.temperature ?? null,
          other: self.other,
          air_release: self.air_release ?? null,
          machine: self.machine,
          status: self.status ?? "pending",
          id: self.id,
          action: self.action ?? "N / A",
          warning_count: self.warning_count ?? null,
          press_inlet: self.press_inlet ?? null,
          press_treat: self.press_treat ?? null,
          press_drain: self.press_drain ?? null,
          odor: self.odor,
          taste: self.taste,
          treatment_id: self.treatment_id ?? null,
          pressure: self.pressure,
        })
        if (rs.kind === "ok") console.log("Success")
        else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
    }
  })

export const ActivitiesLogModel = types
  .model("ActivityModel", {
    id: types.identifierNumber,
    action: types.string,
    actionBy: types.string,
    actionDate: types.Date,
    machine_id: types.number,
    treatment_id: types.string,
  })
  .actions(withSetPropAction)
  .views((self) => {
    return {
      savelogByMachine: async () => {
        console.log("save log")
      },
      savelogByTreatment: async () => {
        console.log("save log")
      },
      saveLogAll: async () => {
        console.log("save all log")
      },
    }
  })
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

export interface Treatment extends Instance<typeof TreatmentModel> {}
export interface Activities extends Instance<typeof ActivitiesLogModel> {}

export interface WaterTreatmentSnapshotOut extends SnapshotOut<typeof WaterTreatmentModel> {}
export interface WaterTreatmentSnapshotIn extends SnapshotIn<typeof WaterTreatmentModel> {}
export const createWaterTreatmentDefaultModel = () => types.optional(WaterTreatmentModel, {})
