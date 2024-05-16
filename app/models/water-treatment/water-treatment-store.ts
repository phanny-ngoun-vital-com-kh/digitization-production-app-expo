import {
  Treatment,
  TreatmentModel,
  WaterTreatmentModel,
} from "app/models/water-treatment/water-treatment-model"
import { Shift } from "app/screens/water-treatment-plan/type"
import { Instance, SnapshotIn, SnapshotOut, detach, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { WaterTreatment } from "./water-treatment-model"
import { watertreatmentApi } from "app/services/api/water-treatment-api"

/**
 * Model description here for TypeScript hints.
 */
export const ShiftModel = types.model("Shift").props({
  shift: types.number,
  time: types.string,
  type: types.enumeration("ShiftType", ["A", "B", "C", "D"]),
  tsd_ppm: types.maybeNull(types.number),
  ph_level: types.maybeNull(types.number),
  temperature: types.maybeNull(types.number),
  pressure: types.maybeNull(types.number),
  air_release: types.maybeNull(types.boolean),
  other: types.maybeNull(types.string),
  press_inlet: types.maybeNull(types.number),
  press_treat: types.maybeNull(types.number),
  press_drain: types.maybeNull(types.number),
  odor: types.maybeNull(types.boolean),
  taste: types.maybeNull(types.boolean),
  checked_by: types.maybeNull(types.string),
  machines: types.maybeNull(types.string),
  inspection_status: types.maybeNull(types.boolean),
})

export const WaterTreatmentStoreModel = types
  .model("WaterTreatmentStore")
  .props({
    treatments: types.optional(types.array(TreatmentModel), []),
  })
  .actions((self) => {
    return {
      createWtpRequest: (wtp: Treatment) => {
        self.treatments.push(wtp)
        return (wtp)
      },
    }
  })
  .views((self) => {
    return {
      getWtpSchedules: async (assign_date = "2024-05-15", shift = "S1 (7:00)") => {
        console.log(assign_date, shift)
        const rs = await watertreatmentApi.getWtp2List({
          assign_date,
          shift,
        })
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
    }
  })

export interface WaterTreatmentStore extends Instance<typeof WaterTreatmentStoreModel> {}
export interface WaterTreatmentStoreSnapshotOut
  extends SnapshotOut<typeof WaterTreatmentStoreModel> {}
export interface WaterTreatmentStoreSnapshotIn
  extends SnapshotIn<typeof WaterTreatmentStoreModel> {}
export const createWaterTreatmentStoreDefaultModel = () =>
  types.optional(WaterTreatmentStoreModel, {})
