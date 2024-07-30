import { inventorytransferApi } from "../../services/api/invantory-transfer-api";
import { Instance, SnapshotOut, types } from "mobx-state-tree";

export const ItemTranderModel = types
    .model("ItemTranderModel")
    .props({
        id: types.maybeNull(types.number),
        item_code: types.maybeNull(types.string),
        item_name: types.maybeNull(types.string),
        quantity: types.maybeNull(types.string),
        received: types.maybeNull(types.string),
        itemReceive:types.maybeNull(types.number),
        remark: types.maybeNull(types.string),
        total: types.maybeNull(types.string),
        // transfer_request: types.string,
        uom: types.maybeNull(types.string),
        is_receive: types.maybeNull(types.string),
        supplier: types.maybeNull(types.string)
    })

type ItemTranderType = Instance<typeof ItemTranderModel>
export interface ItemTrander extends ItemTranderType { }
type ItemTranderSnapshotType = SnapshotOut<typeof ItemTranderModel>
export interface ItemTranderSnapshot extends ItemTranderSnapshotType { }

export const TransferModel = types
    .model('TransferModel')
    .props({
        transfer_type: types.maybeNull(types.string),
        business_unit: types.maybeNull(types.string),
        status: types.maybeNull(types.string),
        transfer_request: types.maybeNull(types.string),
        transfer_id: types.maybeNull(types.string),
        posting_date: types.maybeNull(types.string),
        due_date: types.maybeNull(types.string),
        from_warehouse: types.maybeNull(types.number),
        to_warehouse: types.maybeNull(types.number),
        line: types.maybeNull(types.string),
        shift: types.maybeNull(types.string),
        items: types.array(ItemTranderModel)
    })
    .views((self) => {
        return {
            savetransfer: async () => {
                const rs = await inventorytransferApi.saveTransfer(
                    self.transfer_type,
                    self.business_unit,
                    self.status,
                    self.transfer_request,
                    self.transfer_id,
                    self.posting_date,
                    self.due_date,
                    self.from_warehouse,
                    self.to_warehouse,
                    self.line,
                    self.shift,
                    self.items
                )
                if (rs.kind === 'ok') {
                    console.log('Success')
                }
                else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            }
        }
    })

type TransferModelType = Instance<typeof TransferModel>
export interface TransferModel extends TransferModelType { }
type TransferModelSnapshotType = SnapshotOut<typeof TransferModel>
export interface TransferModelSnapshot extends TransferModelSnapshotType { }

export const ReceiveStatusChangeModel = types
    .model("ReceiveStatusChangeModel")
    .props({
        id:types.number,
        transfer_request: types.number,
    })
    .views((self) => {
        return {
            receivestatuschange: async () => {
                const rs = await inventorytransferApi.receiveStatusChange(
                    self.id,
                    self.transfer_request
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

type ReceiveStatusChangeModelType = Instance<typeof ReceiveStatusChangeModel>
export interface ReceiveStatusChangeModel extends ReceiveStatusChangeModelType { }
type ReceiveStatusChangeModelSnapshotType = SnapshotOut<typeof ReceiveStatusChangeModel>
export interface ReceiveStatusChangeModelSnapshot extends ReceiveStatusChangeModelSnapshotType { }

export const CloseTransfer = types
    .model('CloseTransfer')
    .props({
        id:types.maybeNull(types.number),
        items:types.array(ItemTranderModel),
        transfer_type:types.maybeNull(types.string),
        business_unit:types.maybeNull(types.string),
        transfer_request:types.maybeNull(types.number),
        posting_date:types.maybeNull(types.string),
        due_date:types.maybeNull(types.string),
        from_warehouse:types.maybeNull(types.number),
        to_warehouse:types.maybeNull(types.number),
        line:types.maybeNull(types.string),
        shift:types.maybeNull(types.string),
        status:types.maybeNull(types.string),
        statusChange:types.maybeNull(types.string),
        state:types.maybeNull(types.string),
        docEntry: types.maybeNull(types.number),
        activities_name:types.maybeNull(types.string),
        action:types.maybeNull(types.string),
        transfer_request_id:types.maybeNull(types.string),
        remark:types.maybeNull(types.string),
    })
    .views((self)=>{
        return{
            closetransfer:async()=>{
                const rs = await inventorytransferApi.closeTransfer(
                    self.id,
                    self.items,
                    self.transfer_type,
                    self.business_unit,
                    self.transfer_request,
                    self.posting_date,
                    self.due_date,
                    self.from_warehouse,
                    self.to_warehouse,
                    self.line,
                    self.shift,
                    self.status,
                    self.statusChange,
                    self.state,
                    self.docEntry,
                    self.activities_name,
                    self.action,
                    self.transfer_request_id,
                    self.remark,

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

type CloseTransferType = Instance<typeof CloseTransfer>
export interface CloseTransfer extends CloseTransferType { }
type CloseTransferSnapshotType = SnapshotOut<typeof CloseTransfer>
export interface CloseTransferSnapshot extends CloseTransferSnapshotType { }
    
export const TransferStore = types
    .model('TransferStore')
    .props({
        transfer: types.optional(types.array(TransferModel), []),
        receivechange: types.optional(types.array(ReceiveStatusChangeModel), []),
        closeTran: types.optional(types.array(CloseTransfer),[])
    })
    .actions((self) => {
        return {
            addTransfer: (data: TransferModel) => {
                self.transfer.push(data)
                return (data)
            },
            addReceiveChange: (data: ReceiveStatusChangeModel) => {
                self.receivechange.push(data)
                return (data)
            },
            addCloseTran:(data:CloseTransfer)=>{
                self.closeTran.push(data)
                return (data)
            }
        }
    })
    .views((self) => {
        return {
            getTransferList: async (transfer_type: string, transfer_request?: string) => {
                const rs = await inventorytransferApi.getInvantoryTransfer(10, transfer_type, transfer_request)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            getInvantoryTransferFinalList: async (transfer_type: string, transfer_request?: string) => {
                const rs = await inventorytransferApi.getInvantoryTransferFinal(10, transfer_type, transfer_request)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            gettransfer: async (transfer_type: string) => {
                const rs = await inventorytransferApi.getTrasfer(20, transfer_type)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            getreceivedata: async (item_code: string, transfer_request: number) => {
                const rs = await inventorytransferApi.getReceiveData(item_code, transfer_request)
                if (rs.kind === 'ok') {
                    return rs.payload
                } else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
        }
    })