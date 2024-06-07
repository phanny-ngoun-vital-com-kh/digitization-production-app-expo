import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { prewaterTreatmentApi } from "app/services/api/pre-water-treatment-api"

/**
 * Model description here for TypeScript hints.
 */

export const PreTreatmentListItemModel = types
  .model("PreTreatmentListItem", {
    id: types.identifierNumber,
    control: types.maybeNull(types.string),
    pre_treatment_id: types.maybeNull(types.string),
    pre_treatment_type: types.maybeNull(types.string),
    action: types.maybeNull(types.string),
    check_by: types.maybeNull(types.string),
    sf: types.maybeNull(types.string),
    acf: types.maybeNull(types.string),
    resin: types.maybeNull(types.string),
    um5: types.maybeNull(types.string),
    sf1: types.maybeNull(types.string),
    sf2: types.maybeNull(types.string),
    acf1: types.maybeNull(types.string),
    acf2: types.maybeNull(types.string),
    um101: types.maybeNull(types.string),
    um102: types.maybeNull(types.string),
    raw_water: types.maybeNull(types.string),
    buffer_st002: types.maybeNull(types.string),
    status: types.string,
    warning_count: types.number,
    assign_to_user: types.maybeNull(types.string),
    remark: types.maybeNull(types.string),
    createdBy: types.maybeNull(types.string),
    createdDate: types.maybeNull(types.string),
    lastModifiedBy: types.maybeNull(types.string),
    lastModifiedDate: types.maybeNull(types.string),
  })
  .views((self) => {
    return {
      savePreWtp: async () => {
        // console.log("Saving remark", self.remark)
        const rs = await prewaterTreatmentApi.savePreWTP({
          sf: self.sf ?? "",
          acf: self.acf ?? "",
          remark: self.remark ?? "",
          um5: self.um5 ?? "",
          resin: self.resin ?? "",
          status: self.status,
          warning_count: self.warning_count,
          action: self.action ?? "",
          pre_treatment_id: self.pre_treatment_id ?? "",
          id: self.id,
          raw_water: self.raw_water ?? null,
          assign_to_user: self.assign_to_user ?? null,
          pre_treatment_type: self.pre_treatment_type ?? "",
        })
        if (rs.kind === "ok") {
          console.log("Successfully saved")
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },

      savePreWtp4: async () => {
        // console.log(assign_date, pre_treatment_type)

        const rs = await prewaterTreatmentApi.savePreWTP4({
          sf1: self.sf1 ?? "",
          sf2: self.sf2 ?? "",
          acf1: self.acf1 ?? "",
          acf2: self.acf2 ?? "",
          remark: self.remark,
          um101: self.um101,
          buffer_st002: self.buffer_st002 ?? "",
          um102: self.um102,
          status: self.status,
          warning_count: self.warning_count,
          action: self.action ?? "",
          pre_treatment_id: self.pre_treatment_id ?? "",
          id: self.id,
          raw_water: self.raw_water ?? null,
          pre_treatment_type: self.pre_treatment_type ?? "",
        })
        if (rs.kind === "ok") {
          console.log("Successfully saved")
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
    }
  })

export const PreWaterTreatmentModel = types
  .model("PreWaterTreatment")
  .props({
    assign_to: types.string,
    time: types.string,
    assign_date: types.string,
    pre_treatment_id: types.string,
    pre_treatment_type: types.string,
    remark: types.string,
    createdBy: types.string,
    createdDate: types.string,
    lastModifiedBy: types.maybeNull(types.string),
    lastModifiedDate: types.maybeNull(types.string),
    pretreatmentlist: types.array(PreTreatmentListItemModel),
  })
  .actions(withSetPropAction)
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface PreWaterTreatment extends Instance<typeof PreWaterTreatmentModel> {}
export interface PreWaterTreatmentListItem extends Instance<typeof PreTreatmentListItemModel> {}
export interface PreWaterTreatmentSnapshotOut extends SnapshotOut<typeof PreWaterTreatmentModel> {}
export interface PreWaterTreatmentSnapshotIn extends SnapshotIn<typeof PreWaterTreatmentModel> {}
export const createPreWaterTreatmentDefaultModel = () => types.optional(PreWaterTreatmentModel, {})
