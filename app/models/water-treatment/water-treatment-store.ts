import { Shift } from "app/screens/water-treatment-plan/type"
import { Instance, SnapshotIn, SnapshotOut, detach, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { WaterTreatment, WaterTreatmentModel } from "./water-treatment-model"

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
    wtp2: types.optional(types.array(WaterTreatmentModel), []),
    // wtp3: types.optional(types.array(FoodModel), []),
    // wtp4: types.optional(types.array(FoodModel), []),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    getAll: () => {
      return self.wtp2
    },
    getIndex: (checkId: number) => {
      return self.wtp2.findIndex((item) => item.check_id === checkId)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => {
    return {
      addAll: (wtp: WaterTreatment) => {
        self.wtp2.push(wtp)
        return wtp
      },
      add: (wtp: WaterTreatment) => {
        self.wtp2.push(wtp)
        return wtp
      },

      removeAll: () => {
        self.wtp2.clear()
      },

      updateItem(index: any, wtp: WaterTreatment) {
        // self.wtp2[index].shifts = null
        // self.wtp2.splice(index, 1)'
        self.wtp2[index]?.shifts?.forEach((existingShift) => {
          detach(existingShift)
        })
        self.wtp2[index] = wtp // Directly mutate the array by replacing an item at the specified index
      },
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface WaterTreatmentStore extends Instance<typeof WaterTreatmentStoreModel> {}
export interface WaterTreatmentStoreSnapshotOut
  extends SnapshotOut<typeof WaterTreatmentStoreModel> {}
export interface WaterTreatmentStoreSnapshotIn
  extends SnapshotIn<typeof WaterTreatmentStoreModel> {}
export const createWaterTreatmentStoreDefaultModel = () =>
  types.optional(WaterTreatmentStoreModel, {})
