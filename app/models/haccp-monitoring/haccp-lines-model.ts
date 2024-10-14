import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { haccpMonitorApi } from "app/services/api/haccp-monitor-api"

/**
 * Model description here for TypeScript hints.
 */

// Define the HaccpListModel first
export const HaccpListModel = types.model("HaccpList", {
  id: types.identifierNumber,
  haccp_id: types.string,
  other: types.maybeNull(types.string),
  side_wall: types.maybeNull(types.string),
  air_pressure: types.maybeNull(types.string),
  temperature_preform: types.maybeNull(types.string),
  treated_water_pressure: types.maybeNull(types.string),
  warning_count: types.maybeNull(types.number),
  time: types.maybeNull(types.string),
  status: types.maybeNull(types.string),
  water_pressure: types.maybeNull(types.string),
  nozzles_rinser: types.maybeNull(types.string),
  fg: types.maybeNull(types.string),
  smell: types.maybeNull(types.number),
  activity_control: types.maybeNull(types.number),
  take_action: types.maybeNull(types.string),
  done_by: types.maybeNull(types.string),
  createdBy: types.maybeNull(types.string),
  createdDate: types.maybeNull(types.string),
  lastModifiedBy: types.maybeNull(types.string),
  lastModifiedDate: types.maybeNull(types.string),
  opo: types.maybeNull(types.string),
  uv_lamp: types.maybeNull(types.string),
  temperature: types.maybeNull(types.string),
})
type HaccpListItemType = Instance<typeof HaccpListModel>
export interface HaccpListType extends HaccpListItemType { }
// Define the HaccpMonitoringModel

export const HaccpLinesModel = types

  .model("HaccpLines", {
    id: types.identifierNumber,
    haccp_id: types.string,
    haccplist: types.array(HaccpListModel),
    assign_to: types.string,
    line: types.string,
    assign_date: types.string,
    remark: types.maybeNull(types.string),
    createdBy: types.string,
    createdDate: types.string,
    lastModifiedBy: types.maybeNull(types.string),
    lastModifiedDate: types.maybeNull(types.string),
  })
  .props({})
  .actions(withSetPropAction)
  .views((self) => {
    return {}
  }) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

const HaccpActivityModel = types.model("HaccpActivity", {
  action: types.string,
})

export const LinesItemModel = types
  .model("LinesItemModel")
  .props({
    line: types.string,
    id: types.maybeNull(types.number),
    water_pressure: types.maybeNull(types.string),
    nozzles_rinser: types.maybeNull(types.number),
    side_wall: types.maybeNull(types.string),
    air_pressure: types.maybeNull(types.string),
    temperature_preform: types.maybeNull(types.string),
    treated_water_pressure: types.maybeNull(types.string),
    fg: types.maybeNull(types.string),
    smell: types.maybeNull(types.number),
    activity_control: types.string,
    take_action: types.maybeNull(types.string),
    other: types.maybeNull(types.string),
    warning_count: types.maybeNull(types.number),
    status: types.maybeNull(types.string),
    done_by: types.maybeNull(types.string),
    haccp_id: types.maybeNull(types.string),
    activities: types.array(HaccpActivityModel),
    opo: types.maybeNull(types.string),
    uv_lamp: types.maybeNull(types.string),
    temperature: types.maybeNull(types.string),
  })
  .props({})
  .actions(withSetPropAction)
  .views((self) => {
    return {
      saveHaccpLine23: async () => {
        const rs = await haccpMonitorApi.saveLines({
          id: self.id,
          line: self.line,
          activities: self.activities,
          activity_control: self.activity_control,
          done_by: self.done_by,
          fg: self.fg,
          other: self.other,
          smell: self.smell,
          haccp_id: self.haccp_id,
          nozzles_rinser: self.nozzles_rinser,
          take_action: self.take_action,
          status: self.status,
          warning_count: Number(self.warning_count),
          water_pressure: self.water_pressure,
          opo: self.opo,
          uv_lamp: self.uv_lamp,
          temperature: self.temperature
        })
        if (rs.kind === "ok") {
          console.log("Success")
          return ('Success')
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
      saveHaccpLine456: async () => {

        const rs = await haccpMonitorApi.saveLines456({
          id: self.id,
          line: self.line,
          activities: self.activities,
          activity_control: Number(self?.activity_control),
          done_by: self.done_by,
          fg: self.fg,
          haccp_id: self.haccp_id,
          side_wall: self.side_wall,
          treated_water_pressure: self.treated_water_pressure,
          temperature_preform: self.temperature_preform,
          take_action: self.take_action,
          status: self.status,
          warning_count: Number(self.warning_count),
          air_pressure: self.air_pressure,
          other: self.other,
        })
        if (rs.kind === "ok") {
          console.log("Success")
          return ('Success')
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
    }
  }) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

type LinesItemModelType = Instance<typeof LinesItemModel>
export interface LinesItem extends LinesItemModelType { }
export interface ListItemModel extends Instance<typeof LinesItemModel> { }

export const HaccpActionModel = types.model("HaccpAction", {
  id: types.identifierNumber,
  action: types.string,
  actionBy: types.string,
  actionDate: types.string,
  haccp_id: types.string,
  line: types.string,
})

export interface HaccpActions extends Instance<typeof HaccpActionModel> { }
export type HaccpActionType = Instance<typeof HaccpActionModel>
export interface HaccpAction extends HaccpActionType { }

// Define the HaccpDetailModel

export interface HaccpLines extends Instance<typeof HaccpLinesModel> { }
export interface HaccpLinesSnapshotOut extends SnapshotOut<typeof HaccpLinesModel> { }
export interface HaccpLinesSnapshotIn extends SnapshotIn<typeof HaccpLinesModel> { }
export const createHaccpLinesDefaultModel = () => types.optional(HaccpLinesModel, {})
