import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const ItemGroupModel = types
    .model('ItemGroupModel')
    .props({
        id: types.number,
        itemGroupName: types.string,
    })

type ItemGroupType = Instance<typeof ItemGroupModel>
export interface ItemGroup extends ItemGroupType { }
type ItemGroupSnapshotType = SnapshotOut<typeof ItemGroupModel>
export interface ItemGroupSnapshot extends ItemGroupSnapshotType { }

export const ChildItemModel = types
    .model('ChildItemModel')
    .props({
        id: types.number,
        active: types.string,
        child_num: types.number,
        code: types.string,
        father: types.number,
        quantity: types.string,
    })

type ChildItemType = Instance<typeof ChildItemModel>
export interface ChildItem extends ChildItemType { }
type ChildItemSnapshotType = SnapshotOut<typeof ChildItemModel>
export interface ChildItemSnapshot extends ChildItemSnapshotType { }

export const ItemListModel = types
    .model("ItemListModel")
    .props({
        id: types.number,
        active: types.string,
        inventoryUoM: types.string,
        itemCode: types.string,
        itemName: types.string,
        item_group_id: types.number,
        tendency: types.string,
        item_group: types.array(ItemGroupModel),
        childItem:types.array(ChildItemModel),
    })

type ItemListType = Instance<typeof ItemListModel>
export interface ItemList extends ItemListType { }
type ItemListSnapshotType = SnapshotOut<typeof ItemListModel>
export interface ItemListSnapshot extends ItemListSnapshotType { }

export const BomModel = types
    .model("BomModel")
    .props({
        active: types.string,
        product_code: types.number,
        product_name: types.string,
        tendency: types.string,
    })

type BomType = Instance<typeof BomModel>
export interface Bom extends BomType { }
type BomSnapshotType = SnapshotOut<typeof BomModel>
export interface BomSnapshot extends BomSnapshotType { }

export const SupplierModel = types
    .model("SupplierModel")
    .props({
        active: types.string,
        card_code: types.string,
        card_name: types.string,
        tendency: types.string,
    })

type SupplierType = Instance<typeof SupplierModel>
export interface Supplier extends SupplierType { }
type SupplierSnapshotType = SnapshotOut<typeof SupplierModel>
export interface SupplierSnapshot extends SupplierSnapshotType { }