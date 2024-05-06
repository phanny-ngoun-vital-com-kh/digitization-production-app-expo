import { inventorytransferrequestApi } from "app/services/api/inventory-transfer-request-api"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const ItemModel = types
    .model("ItemModel")
    .props({
        id: types.maybeNull(types.number),
        item_code: types.maybeNull(types.string),
        item_name: types.maybeNull(types.string),
        quantity: types.maybeNull(types.string),
        received: types.maybeNull(types.string),
        remark: types.maybeNull(types.string),
        transfer_request: types.maybeNull(types.string),
        uom: types.maybeNull(types.string),
        supplier: types.maybeNull(types.string)
    })
    .views((self)=>{
        return{
            addsupplier: async()=>{
                const rs = await inventorytransferrequestApi.addSupplier(
                    self.supplier,
                    self.transfer_request,
                    self.item_code,
                    self.remark
                )
                if (rs.kind === 'ok')
                    console.log('Success')
                else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            }
        }
    })

type ItemType = Instance<typeof ItemModel>
export interface Item extends ItemType { }
type ItemSnapshotType = SnapshotOut<typeof ItemModel>
export interface ItemSnapshot extends ItemSnapshotType { }

export const SAPItemModel = types
    .model("SAPItemModel")
    .props({
        itemCode: types.string,
        itemName: types.string,
        quantity: types.string,
        remark: types.string,
        fromWarehouse: types.string,
        toWarehouse: types.string,
    })

type SAPItemType = Instance<typeof ItemModel>
export interface SAPItem extends SAPItemType { }
type SAPItemSnapshotType = SnapshotOut<typeof ItemModel>
export interface SAPItemSnapshot extends SAPItemSnapshotType { }

export const ActivitiesModel = types
    .model("ActivitiesModel")
    .props({
        action: types.string,
        activities_name: types.string,
        remark: types.maybeNull(types.string),
        transfer_request: types.maybeNull(types.string),
        actionBy: types.maybeNull(types.string),
        actionDate: types.maybeNull(types.string),
        id: types.maybeNull(types.number),
        item: types.array(ItemModel)

    })

    .views((self) => {
        return {
            addactivities: async () => {
                const rs = await inventorytransferrequestApi.saveActivities(
                    self.action,
                    self.activities_name,
                    self.remark,
                    self.transfer_request
                )
                if (rs.kind === 'ok')
                    console.log('Success')
                else {
                    console.log('Error')
                    console.log('hi')
                    throw Error(rs.kind)

                }
            },
            // additem:async()=>{
            //     const rs = await inventorytransferrequestApi.saveItem(
            //         self.item,
            //     )
            // }
        }
    })

type ActivitiesModelType = Instance<typeof ActivitiesModel>
export interface Activities extends ActivitiesModelType { }
type ActivitiesModelSnapshotType = SnapshotOut<typeof ActivitiesModel>
export interface ActivitiesModelSnapshot extends ActivitiesModelSnapshotType { }