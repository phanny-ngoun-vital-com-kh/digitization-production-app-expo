import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

const HaccpListModel = types.model("HaccpList", {
  id: types.identifierNumber,
  haccp_id: types.string,
  other: types.maybeNull(types.string),
  warning_count: types.number,
  time: types.string,
  status: types.enumeration("Status", ["warning", "normal"]),
  water_pressure: types.string,
  nozzles_rinser: types.string,
  fg: types.string,
  smell: types.number,
  activity_control: types.number,
  take_action: types.string,
  done_by: types.string,
  createdBy: types.string,
  createdDate: types.string,
  lastModifiedBy: types.maybeNull(types.string),
  lastModifiedDate: types.maybeNull(types.string),
})

// HaccpLine model
export const HaccpLineModel = types.model("HaccpLine", {
  id: types.identifierNumber,
  assign_to: types.string,
  remark: types.maybeNull(types.string),
  assign_date: types.string,
  line: types.string,
  haccp_id: types.string,
  createdBy: types.string,
  createdDate: types.string,
  lastModifiedBy: types.maybeNull(types.string),
  lastModifiedDate: types.maybeNull(types.string),
  haccplist: types.array(HaccpListModel),
})

/**
 * HaccpLine model type definitions
 */
export type HaccpLineType = Instance<typeof HaccpLineModel>
export interface HaccpLine extends HaccpLineType {}
export type HaccpLineSnapshotType = SnapshotOut<typeof HaccpLineModel>
export interface HaccpLineSnapshot extends HaccpLineSnapshotType {}

/**
 * TreatmentList model
 */
const TreatmentListModel = types.model("TreatmentList", {
  id: types.identifierNumber,
  machine: types.string,
  treatment_id: types.string,
  tds: types.maybeNull(types.number),
  ph: types.maybeNull(types.number),
  temperature: types.maybeNull(types.number),
  pressure: types.maybeNull(types.number),
  air_release: types.maybeNull(types.number),
  press_inlet: types.maybeNull(types.number),
  press_treat: types.maybeNull(types.number),
  press_drain: types.maybeNull(types.number),
  check_by: types.maybeNull(types.string),
  status: types.string,
  warning_count: types.number,
  odor: types.maybeNull(types.string),
  taste: types.maybeNull(types.string),
  other: types.maybeNull(types.string),
  assign_to_user: types.string,
  createdBy: types.string,
  createdDate: types.string,
  lastModifiedBy: types.maybeNull(types.string),
  lastModifiedDate: types.maybeNull(types.string),
})

/**
 * Treatment model
 */
export const TreatmentModel = types.model("Treatment", {
  assign_to: types.string,
  shift: types.string,
  treatment_id: types.identifier,
  remark: types.string,
  createdBy: types.string,
  createdDate: types.string,
  lastModifiedBy: types.maybeNull(types.string),
  lastModifiedDate: types.maybeNull(types.string),
  assign_date: types.string,
  treatmentlist: types.array(TreatmentListModel),
})

type TreatmentType = Instance<typeof TreatmentModel>
export interface Treatment extends TreatmentType {}
type TreatmentSnapshotType = SnapshotOut<typeof TreatmentModel>
export interface TreatmentSnapshot extends TreatmentSnapshotType {}

const PretreatmentListModel = types.model("PretreatmentList", {
  id: types.identifierNumber,
  control: types.string,
  pre_treatment_id: types.string,
  check_by: types.maybeNull(types.string),
  sf: types.maybeNull(types.string),
  acf: types.maybeNull(types.string),
  resin: types.maybeNull(types.string),
  um5: types.maybeNull(types.string),
  raw_water: types.maybeNull(types.string),
  status: types.enumeration("Status", ["pending", "completed"]),
  warning_count: types.number,
  remark: types.maybeNull(types.string),
  assign_to_user: types.maybeNull(types.string),
  createdBy: types.string,
  createdDate: types.string,
  lastModifiedBy: types.maybeNull(types.string),
  lastModifiedDate: types.maybeNull(types.string),
})

export const PretreatmentModel = types.model("Pretreatment", {
  id: types.identifierNumber,
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
  pretreatmentlist: types.array(PretreatmentListModel),
})

type PretreatmentType = Instance<typeof PretreatmentModel>
export interface Pretreatment extends PretreatmentType {}
type PretreatmentSnapshotType = SnapshotOut<typeof PretreatmentModel>
export interface PretreatmentSnapshot extends PretreatmentSnapshotType {}
/**
 * Dashboard model
 */
export const DashboardModel = types
  .model("Dashboard", {
    treatments: types.array(TreatmentModel),
    pretreatments: types.array(PretreatmentModel),
    haccpLines: types.array(HaccpLineModel),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export const createDashboardDefaultModel = () => types.optional(DashboardModel, {})

export interface Dashboard extends Instance<typeof DashboardModel> {}
export interface DashboardSnapshotOut extends SnapshotOut<typeof DashboardModel> {}
export interface DashboardSnapshotIn extends SnapshotIn<typeof DashboardModel> {}
