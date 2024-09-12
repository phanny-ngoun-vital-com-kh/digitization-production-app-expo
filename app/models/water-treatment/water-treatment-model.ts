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
    warning_count: types.maybeNull(types.number),
    machine: types.string,
    treatment_id: types.maybeNull(types.string),
    tds: types.maybeNull(types.string),
    ph: types.maybeNull(types.string),
    temperature: types.maybeNull(types.string),
    pressure: types.maybeNull(types.string),
    air_release: types.maybeNull(types.number),
    press_inlet: types.maybeNull(types.string),
    press_treat: types.maybeNull(types.string),
    press_drain: types.maybeNull(types.string),
    check_by: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    odor: types.maybeNull(types.number),
    taste: types.maybeNull(types.number),
    other: types.maybeNull(types.string),
    createdBy: types.maybeNull(types.string),
    assign_to_user: types.maybeNull(types.string),
    createdDate: types.maybeNull(types.string),
    lastModifiedBy: types.maybeNull(types.string),
    lastModifiedDate: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => {
    return {
      saveWtp2: async () => {
        const rs = await watertreatmentApi.saveWtp2({
          tds: self.tds,
          ph: self.ph,
          temperature: self.temperature,
          other: self.other,
          air_release: self.air_release,
          machine: self.machine,
          status: self.status ,
          id: self.id,
          action: self.action,
          warning_count: self.warning_count,
          press_inlet: self.press_inlet,
          press_treat: self.press_treat,
          press_drain: self.press_drain,
          odor: self.odor,
          taste: self.taste,
          assign_to_user: self.assign_to_user,
          treatment_id: self.treatment_id,
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
    assign_date: types.maybeNull(types.string),
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
