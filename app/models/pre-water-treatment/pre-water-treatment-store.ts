import { GetActivities } from "./../../services/api/water-treatment.type"
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import {
  PreTreatmentListItemModel,
  PreWaterTreatmentListItem,
  PreWaterTreatmentModel,
} from "./pre-water-treatment-model"
import { prewaterTreatmentApi } from "app/services/api/pre-water-treatment-api"

/**
 * Model description here for TypeScript hints.
 */
export const PreWaterTreatmentStoreModel = types
  .model("PreWaterTreatmentStore")
  .props({
    preTreatments: types.maybeNull(types.array(PreWaterTreatmentModel)),
    pretreatmentlist: types.maybeNull(types.array(PreTreatmentListItemModel)),
  })
  .actions(withSetPropAction)
  .views((self) => {
    return {
      getListPreTreatment: async (assign_date: string, pre_treatment_type: string) => {
        const rs = await prewaterTreatmentApi.getPreWTPList({
          assign_date,
          pre_treatment_type,
        })
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      getListPreTreatmentByDate: async (assign_date: string) => {
        const rs = await prewaterTreatmentApi.getPreWTPListByDate({
          assign_date,
        })
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      getSelectedPretreatment: async (
        time :string,
        pre_treatment_id :string,
        pre_treatment_type :string,
      ) => {
        // console.log(assign_date, pre_treatment_type)
        const rs = await prewaterTreatmentApi.getPreWTPByDate({
          time,
          pre_treatment_id,
          pre_treatment_type,
        })
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      getActivitiesList: async (control_id: string | number, pre_treatment_type: string) => {
        const rs = await prewaterTreatmentApi.getControlActivities(control_id, pre_treatment_type)
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      assignMachine :async (
        id:number ,
        assign_to_user:string,
        pre_treatment_type:string
      ) =>{
        const rs = await prewaterTreatmentApi.saveAssign({
          id, assign_to_user,pre_treatment_type

        })
        if (rs.kind === "ok") {
          return rs.payload
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      }
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => {
    return {
      addPretreatments: (prewtp: PreWaterTreatmentListItem) => {
        self.pretreatmentlist?.push(prewtp)
        return prewtp
      },
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface PreWaterTreatmentStore extends Instance<typeof PreWaterTreatmentStoreModel> {}
export interface PreWaterTreatmentStoreSnapshotOut
  extends SnapshotOut<typeof PreWaterTreatmentStoreModel> {}
export interface PreWaterTreatmentStoreSnapshotIn
  extends SnapshotIn<typeof PreWaterTreatmentStoreModel> {}
export const createPreWaterTreatmentStoreDefaultModel = () =>
  types.optional(PreWaterTreatmentStoreModel, {})
