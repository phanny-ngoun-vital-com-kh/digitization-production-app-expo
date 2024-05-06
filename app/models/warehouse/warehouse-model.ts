import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const WarehouseModel = types
    .model("WarehouseModel")
    .props({
        id: types.number,
        active: types.string,
        building: types.string,
        tendency: types.string,
        whsCode: types.string,
        whsName: types.string,
    })

type WarehouseType = Instance<typeof WarehouseModel>
export interface Warehouse extends WarehouseType { }
type WarehouseSnapshotType = SnapshotOut<typeof WarehouseModel>
export interface WarehouseSnapshot extends WarehouseSnapshotType { }
