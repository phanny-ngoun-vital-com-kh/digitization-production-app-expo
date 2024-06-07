import { Instance, SnapshotIn, SnapshotOut, applySnapshot, types } from "mobx-state-tree";
import { withSetPropAction } from "../helpers/withSetPropAction";

// Define the nested models for activityControl, bottleCapRinsing, and fillingCap
const ActivityControlModel = types.model({
  over_control: types.maybeNull(types.boolean),
  under_control: types.maybeNull(types.boolean),
});

const BottleCapRinsingModel = types.model({
  water_pressure: types.maybeNull(types.number),
  nozzies_rinser: types.maybeNull(types.number),
});

const FillingCapModel = types.model({
  FG: types.maybeNull(types.number),
  smell: types.maybeNull(types.boolean),
  over_control: types.maybeNull(types.boolean),
  under_control: types.maybeNull(types.boolean),
});

// Define the LinesItem model
export const LinesItemModel = types
  .model({
    id: types.identifierNumber,
    line: types.string,
    time: types.string,
    created_at: types.string,
    side_wall: types.maybeNull(types.number),
    air_pressure: types.maybeNull(types.number),
    temp_preform: types.maybeNull(types.number),
    tw_pressure: types.maybeNull(types.number),
    FG: types.maybeNull(types.number),
    activity_control: ActivityControlModel,
    bottle_cap_rinsing: BottleCapRinsingModel,
    filling_cap: FillingCapModel,
    smell: types.maybeNull(types.boolean),
    under_control: types.maybeNull(types.boolean),
    over_control: types.maybeNull(types.boolean),
    status: types.maybeNull(types.string),
    warning_count: types.maybeNull(types.number),
    assign_to: types.maybeNull(types.string),
    instruction: types.maybeNull(types.string),
    other: types.maybeNull(types.string),
  })
  .actions((self) => ({
    reset() {
      applySnapshot(self, createLinesItemDefaultModel());
    },
  }));

export const createLinesItemDefaultModel = () => ({
  id: Date.now(),
  line: "",
  time: "",
  created_at: new Date().toISOString(),
  side_wall: null,
  air_pressure: null,
  temp_preform: null,
  tw_pressure: null,
  FG: null,
  activity_control: {
    over_control: null,
    under_control: null,
  },
  bottle_cap_rinsing: {
    water_pressure: null,
    nozzies_rinser: null,
  },
  filling_cap: {
    FG: null,
    smell: null,
    over_control: null,
    under_control: null,
  },
  smell: null,
  under_control: null,
  over_control: null,
  status: null,
  warning_count: null,
  assign_to: null,
  instruction: null,
  other: null,
});

// Define the main HaccpMonitoringModel
export const HaccpMonitoringModel = types
  .model("HaccpMonitoring", {
    id: types.maybeNull(types.identifierNumber),
    name: types.string,
    date: types.string,
    lines: types.array(LinesItemModel),
  })
  .actions((self) => ({
    addLine(lineData:LinesItemList) {
      self.lines.push(lineData);
    },
    updateLine(id: number, updatedData: Partial<SnapshotIn<typeof LinesItemModel>>) {
      const line = self.lines.find((line) => line.id === id);
      if (line) {
        applySnapshot(line, { ...line, ...updatedData });
      }
    },
  }));

export interface HaccpMonitoring extends Instance<typeof HaccpMonitoringModel> {}
export interface HaccpMonitoringSnapshotOut extends SnapshotOut<typeof HaccpMonitoringModel> {}
export interface LinesItemList extends SnapshotOut<typeof LinesItemModel> {}
export interface HaccpMonitoringSnapshotIn extends SnapshotIn<typeof HaccpMonitoringModel> {}
export const createHaccpMonitoringDefaultModel = () => types.optional(HaccpMonitoringModel, {
  
});
