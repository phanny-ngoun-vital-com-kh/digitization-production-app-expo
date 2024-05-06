import { Instance, SnapshotOut, types } from "mobx-state-tree"
// import { ItemModel } from "../inventory-transfer-request/inventory-transfer-request-model"
import { WarehouseModel } from "../warehouse/warehouse-model"

export const ItemModel = types
    .model("ItemModel")
    .props({
        id: types.number,
        item_code: types.string,
        item_name: types.string,
        quantity: types.string,
        received: types.string,
        remark: types.string,
        transfer_request: types.string,
        transfer: types.string,
        uom: types.string,
        total:types.string,
        supplier:types.maybeNull(types.string)
    })

type ItemType = Instance<typeof ItemModel>
export interface Item extends ItemType { }
type ItemSnapshotType = SnapshotOut<typeof ItemModel>
export interface ItemSnapshot extends ItemSnapshotType { }

export const InventoryTransferModel = types.model("InventoryTransfer", {
    id: types.maybeNull(types.number),
    business_unit: types.maybeNull(types.string),
    createdBy: types.maybeNull(types.string),
    createdDate: types.maybeNull(types.Date),
    due_date: types.maybeNull(types.Date),
    lastModifiedBy: types.maybeNull(types.string),
    lastModifiedDate: types.maybeNull(types.Date),
    from_warehouse: types.array(WarehouseModel),
    item: types.array(ItemModel),
    line: types.maybeNull(types.string),
    posting_date: types.maybeNull(types.Date),
    remark: types.maybeNull(types.string),
    shift: types.maybeNull(types.string),
    // state: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    to_warehouse: types.array(WarehouseModel),
    transfer_id: types.maybeNull(types.string),
    transfer_type: types.maybeNull(types.string),
    transfer_request: types.maybeNull(types.string),
    sapDocEntry:types.maybeNull(types.number),
    sapDocNo:types.maybeNull(types.number)
    // item_count: types.maybeNull(types.number),
})

type InventoryTransferType = Instance<typeof InventoryTransferModel>
export interface InventoryTransfer extends InventoryTransferType { }
type InventoryTransferSnapshotType = SnapshotOut<typeof InventoryTransferModel>
export interface InventoryTransferSnapshot extends InventoryTransferSnapshotType { }