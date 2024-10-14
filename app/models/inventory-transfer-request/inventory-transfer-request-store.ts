import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Activities, ActivitiesModel, Item, ItemModel, ProvidedList, ProvidedListModel, SAPItemModel } from "./inventory-transfer-request-model"
import { inventorytransferrequestApi } from "../../services/api/inventory-transfer-request-api"
import { WarehouseModel } from "../warehouse/warehouse-model"
// import { Item } from "../inventory-transfer/inventory-transfer-model"

export const InventoryTransferRequestModel = types.model("InventoryTransferRequest", {
    id: types.maybeNull(types.number),
    business_unit: types.maybeNull(types.string),
    createdBy: types.maybeNull(types.string),
    createdDate: types.maybeNull(types.Date),
    due_date: types.maybeNull(types.Date),
    lastModifiedBy: types.maybeNull(types.string),
    lastModifiedDate: types.maybeNull(types.Date),
    from_warehouse: types.maybeNull(WarehouseModel),
    item: types.maybeNull(ItemModel),
    line: types.maybeNull(types.string),
    posting_date: types.maybeNull(types.Date),
    remark: types.maybeNull(types.string),
    shift: types.maybeNull(types.string),
    state: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    to_warehouse: types.maybeNull(WarehouseModel),
    transfer_id: types.maybeNull(types.string),
    transfer_type: types.maybeNull(types.string),
    item_count: types.maybeNull(types.number),
    statusChange: types.maybeNull(types.string),
    docEntry: types.maybeNull(types.number),
    transfer_request: types.maybeNull(types.string),
    activities_name: types.maybeNull(types.string),
    action: types.maybeNull(types.string),
})
    .views((self) => {
        return {
            approverequest: async () => {
                const rs = await inventorytransferrequestApi.approveRequest(
                    self.id,
                    self.remark,
                    self.state,
                    self.statusChange
                )
                if (rs.kind === 'ok'){
                    console.log('Success')
                    return ('Success')
                }
                else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            closerequest: async () => {
                const rs = await inventorytransferrequestApi.closeRequest(
                    self.id,
                    self.remark,
                    self.state,
                    self.statusChange,
                    self.docEntry,
                    self.transfer_request,
                    self.activities_name,
                    self.action,
                )
                if (rs.kind === 'ok'){
                    console.log('Success')
                    return ('Success')
                }
                else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            }
        }
    })

type InventoryTransferRequestType = Instance<typeof InventoryTransferRequestModel>
export interface InventoryTransferRequest extends InventoryTransferRequestType { }
type InventoryTransferRequestSnapshotType = SnapshotOut<typeof InventoryTransferRequestModel>
export interface InventoryTransferRequestSnapshot extends InventoryTransferRequestSnapshotType { }

export const TransferItemModel = types
    .model('TransferItemModel')
    .props({
        itemCode: types.string,
        itemId: types.string,
        itemName: types.string,
        key: types.number,
        quantity: types.string,
        remark: types.string,
        uom: types.string,
    })


type TransferItemType = Instance<typeof TransferItemModel>
export interface TransferItem extends TransferItemType { }
type TransferItemSnapshotType = SnapshotOut<typeof TransferItemModel>
export interface TransferItemSnapshot extends TransferItemSnapshotType { }

export const TransferRequestModel = types
    .model('TransferRequestModel')
    .props({
        business_unit: types.string,
        docDueDate: types.string,
        from_warehouse: types.number,
        item_count: types.number,
        line: types.string,
        postingDate: types.string,
        remark: types.string,
        shift: types.string,
        to_warehouse: types.number,
        transfer_type: types.string,
        // taxDate:types.string,
        // fromWarehouse: types.string,
        // toWarehouse: types.string,
        // apiReferenceNo: types.string,
        // vendorCode: types.string,
        // vendorName: types.string,
        // productionOfficer: types.string,
        // comments: types.string,
        items: types.array(TransferItemModel),
        activities: types.array(ActivitiesModel),
        // transferRequestDetails: types.array(SAPItemModel)

    })
    .views((self) => {
        return {
            savetransferrequest: async () => {
                const rs = await inventorytransferrequestApi.saveTransferRequest(
                    self.business_unit,
                    self.docDueDate,
                    self.from_warehouse,
                    self.item_count,
                    self.line,
                    self.postingDate,
                    self.remark,
                    self.shift,
                    self.to_warehouse,
                    self.transfer_type,
                    self.activities,
                    self.items,
                )
                if (rs.kind === 'ok'){
                    console.log('Success')
                    return ('Success')
                }
                else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            }
        }
    })

type TransferRequestModelType = Instance<typeof TransferRequestModel>
export interface TransferRequestModel extends TransferRequestModelType { }
type TransferRequestModelSnapshotType = SnapshotOut<typeof TransferRequestModel>
export interface TransferRequestModelSnapshot extends TransferRequestModelSnapshotType { }

export const SAPTransferRequestModel = types
    .model('TransferRequestModel')
    .props({
        id: types.maybeNull(types.number),
        postingDate: types.maybeNull(types.string),
        docDueDate: types.maybeNull(types.string),
        taxDate: types.maybeNull(types.string),
        vendorCode: types.maybeNull(types.string),
        vendorName: types.maybeNull(types.string),
        fromWarehouse: types.maybeNull(types.string),
        toWarehouse: types.maybeNull(types.string),
        apiReferenceNo: types.maybeNull(types.string),
        comments: types.maybeNull(types.string),
        remark: types.maybeNull(types.string),
        statusChange: types.maybeNull(types.string),
        state: types.maybeNull(types.string),
        activities_name: types.maybeNull(types.string),
        action: types.maybeNull(types.string),
        transfer_request: types.maybeNull(types.string),
        transferRequestDetails: types.array(SAPItemModel)

    })
    .views((self) => {
        return {
            savetosap: async () => {
                const rs = await inventorytransferrequestApi.save_to_sap(
                    self.id,
                    self.postingDate,
                    self.docDueDate,
                    self.taxDate,
                    self.vendorCode,
                    self.vendorName,
                    self.fromWarehouse,
                    self.toWarehouse,
                    self.apiReferenceNo,
                    self.comments,
                    self.remark,
                    self.statusChange,
                    self.state,
                    self.activities_name,
                    self.action,
                    self.transfer_request,
                    self.transferRequestDetails
                )
                if (rs.kind === 'ok') {
                    console.log('Success')
                    return ('Success')
                }
                else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            }
        }
    })

type SAPTransferRequestModelType = Instance<typeof SAPTransferRequestModel>
export interface SAPTransferRequestModel extends SAPTransferRequestModelType { }
type SAPTransferRequestModelSnapshotType = SnapshotOut<typeof TransferRequestModel>
export interface TransferRequestModelSnapshot extends SAPTransferRequestModelSnapshotType { }

export const ProvidedItemModel = types
    .model('ProvidedItemModel')
    .props({
        item_code: types.maybeNull(types.string),
        item_name: types.maybeNull(types.string),
        uom: types.maybeNull(types.string),
        quantity: types.maybeNull(types.string),
        remark: types.maybeNull(types.string),
        received: types.maybeNull(types.string),
        provided: types.maybeNull(types.string),
        is_receive: types.maybeNull(types.string),
        total: types.maybeNull(types.string),
        supplier: types.maybeNull(types.string),
        itemReceive: types.maybeNull(types.number),
    })


type ProvidedItemType = Instance<typeof ProvidedItemModel>
export interface ProvidedItem extends ProvidedItemType { }
type ProvidedItemSnapshotType = SnapshotOut<typeof ProvidedItemModel>
export interface ProvidedItemSnapshot extends ProvidedItemSnapshotType { }

export const ProvidedModel = types
    .model('ProvideModel')
    .props({
        item: types.array(ProvidedItemModel),
        status: (types.string),
        transfer_request_id: (types.number),
        transfer_request: types.maybeNull(types.string),
        activities_name: types.maybeNull(types.string),
        action: types.maybeNull(types.string)
    })
    .views((self) => {
        return {
            saveprovided: async () => {
                const rs = await inventorytransferrequestApi.saveProvided(
                    self.item,
                    self.status,
                    self.transfer_request_id,
                    self.transfer_request,
                    self.activities_name,
                    self.action
                )
                if (rs.kind === 'ok'){
                    console.log('Success')
                    return ('Success')
                }
                else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            }
        }
    })

type ProvidedModelType = Instance<typeof ProvidedModel>
export interface ProvidedModel extends ProvidedModelType { }
type ProvidedModelSnapshotType = SnapshotOut<typeof ProvidedModel>
export interface ProvidedModelSnapshot extends ProvidedModelSnapshotType { }

export const AuthoritiesModel = types
    .model('AuthoritiesModel')
    .props({
        id: types.number,
        user_id: types.string,
        authority_name: types.string,
    })


type AuthoritiesType = Instance<typeof AuthoritiesModel>
export interface Authorities extends AuthoritiesType { }
type AuthoritiesSnapshotType = SnapshotOut<typeof AuthoritiesModel>
export interface AuthoritiesSnapshot extends AuthoritiesSnapshotType { }

export const MobileUserModel = types
    .model('MobileUserModel')
    .props({
        user_id: types.string,
        login: types.string,
        createdBy: types.string,
        createdDate: types.string,
        lastModifiedBy: types.string,
        lastModifiedDate: types.string,
        authorities: types.maybeNull(AuthoritiesModel),
    })


type MobileUserType = Instance<typeof MobileUserModel>
export interface MobileUser extends MobileUserType { }
type MobileUserSnapshotType = SnapshotOut<typeof MobileUserModel>
export interface MobileUserSnapshot extends MobileUserSnapshotType { }


export const TransferRequestStore = types
    .model('TransferRequestStore')
    .props({
        transferRequest: types.optional(types.array(TransferRequestModel), []),
        approve: types.optional(types.array(InventoryTransferRequestModel), []),
        activities: types.optional(types.array(ActivitiesModel), []),
        item: types.optional(types.array(ItemModel), []),
        sap_tr: types.optional(types.array(SAPTransferRequestModel), []),
        provided: types.optional(types.array(ProvidedModel), []),
        provide_list: types.optional(types.array(ProvidedListModel), [])
    })
    .actions((self) => {
        return {
            addTransferRequest: (tran: TransferRequestModel) => {
                self.transferRequest.push(tran)
                return (tran)
            },
            approveReq: (app: InventoryTransferRequest) => {
                self.approve.push(app)
                return (app)
            },
            addActivites: (ac: Activities) => {
                self.activities.push(ac)
                return (ac)
            },
            addSupp: (sup: Item) => {
                self.item.push(sup)
                return (sup)
            },
            addSapTr: (tr: SAPTransferRequestModel) => {
                self.sap_tr.push(tr)
                return (tr)
            },
            addProvided: (pro: ProvidedModel) => {
                self.provided.push(pro)
                return (pro)
            },
            upstatus: (li: ProvidedList) => {
                self.provide_list.push(li)
                return (li)
            },
        }
    })
    .views((self) => {
        return {
            getTransferRequestList: async (state: string) => {
                const rs = await inventorytransferrequestApi.getInventoryTransfterRequest(20, state)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            getWarehouseList: async (tendency: string = 'ALL', searchValue?: string) => {
                const rs = await inventorytransferrequestApi.getWarehouse(100, tendency, searchValue)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            getItemList: async (tendency: string, searchValue?: string) => {
                const rs = await inventorytransferrequestApi.getItem(10, tendency, searchValue)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            getBomList: async (searchValue?: string, tendency?: string) => {
                const rs = await inventorytransferrequestApi.getBom(30, searchValue, tendency)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            getWarehouseTransferRequestList: async (state: string) => {
                const rs = await inventorytransferrequestApi.getWarehouseTransferRequest(20, state)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            getMobileUserList: async () => {
                const rs = await inventorytransferrequestApi.getListMobileUser()
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            getline: async () => {
                const rs = await inventorytransferrequestApi.getLine()
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },

            getListSubBom: async (father: string, tendency: string) => {
                const rs = await inventorytransferrequestApi.getListSubItem(father, tendency)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },

            getSupplierList: async (tendency: string, searchValue?: string) => {
                const rs = await inventorytransferrequestApi.getSuppiler(10, tendency, searchValue)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },

            getdetail: async (id: number) => {
                const rs = await inventorytransferrequestApi.getDetail(id)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            getprovidelist: async (transfer_request_id: number) => {
                const rs = await inventorytransferrequestApi.getProvideList(transfer_request_id)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            getprovided: async (provided: string) => {
                const rs = await inventorytransferrequestApi.getProvided(provided)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            gettotalprovided: async (item_code: string, transfer_request_id: number) => {
                const rs = await inventorytransferrequestApi.getTotalProvided(item_code, transfer_request_id)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            getprovideitemforclose: async (transfer_request_id: number, status: string, item_code: string) => {
                const rs = await inventorytransferrequestApi.getProvideItemForClose(transfer_request_id, status, item_code)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            findsaprequest: async (docEntry: number) => {
                const rs = await inventorytransferrequestApi.findSAPRequest(docEntry)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            }
        }
    })