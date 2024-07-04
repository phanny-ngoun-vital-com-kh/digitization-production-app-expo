import { InventoryTransfer } from "app/models/inventory-transfer/inventory-transfer-model";
import { BaseApi } from "./base-api";
import { GetInvantoryTransferResult } from "./invantory-transfer.type";
import { DataResponse } from "./response-util";
import { Page } from "./api.types";


const ApiEndpoint = {
    fetchPagingTransfer:'fetch-paging-transfer',
    getReceive:'get-receive',
    fetchPagingTransferFg:'fetch-paging-transfer-fg',
    saveTransfer:'save-transfer',
    receiveStatusChange:'receive-status-change',
    closeSapTransfer:'close-sap-transfer'
}

export class InventoryTransferApi extends BaseApi{
    async getInvantoryTransfer(pageSize:number = 20,transfer_type:string,transfer_request?:string):Promise<GetInvantoryTransferResult>{
        try{
            const rs = await this.requestService.page<InventoryTransfer>(ApiEndpoint.fetchPagingTransfer,{
                advanceSearch: {transfer_type: transfer_type,transfer_request:transfer_request}
            },pageSize)
            return DataResponse<Page<InventoryTransfer>>(rs)
        }catch(e:any){
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }
    async getTrasfer(pageSize:number,transfer_type:string):Promise<GetInvantoryTransferResult>{
        try{
            const rs = await this.requestService.page<InventoryTransfer>(ApiEndpoint.fetchPagingTransferFg,{
                advanceSearch: {business_unit:'ALL',transfer_type: transfer_type}
            },pageSize)
            return DataResponse<Page<InventoryTransfer>>(rs)
        }catch(e:any){
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }
    async getReceiveData(item_code:string,transfer_request:number): Promise<any>{
        try{
            const rs = await this.requestService.list(ApiEndpoint.getReceive,{
                item_code,
                transfer_request
            })
            // console.log(rs)
            return DataResponse(rs)
        } catch (e:any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }
    
    async saveTransfer(transfer_type:string,business_unit:string,status:string,transfer_request:string,transfer_id:string,posting_date:string,due_date:string,from_warehouse:number,to_warehouse:number,line:string,shift:string,items:any): Promise<any>{
        try{
            const rs = await this.requestService.exec(ApiEndpoint.saveTransfer,{
                transfer_type,
                business_unit,
                status,
                transfer_request,
                transfer_id,
                posting_date,
                due_date,
                from_warehouse,
                to_warehouse,
                line,
                shift,
                items
            })
            
            return DataResponse(rs)
        }catch(e:any){
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }
    async receiveStatusChange(id:number,transfer_request:number):Promise<any>{
        try{
            const rs = await this.requestService.exec(ApiEndpoint.receiveStatusChange,{
                id,
                transfer_request
            })
            return DataResponse(rs)
        }catch(e:any){
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async closeTransfer(id:number,items:any,transfer_type:string,business_unit:string,transfer_request:number,posting_date:string,due_date:string,from_warehouse:number,to_warehouse:number,line:string,shift:string,status:string,statusChange:string,state:string,docEntry:number,activities_name:string,action:string,transfer_request_id:string,remark:string,):Promise<any>{
        try{
            const rs = await this.requestService.exec(ApiEndpoint.closeSapTransfer,{
                id,
                items,
                transfer_type,
                business_unit,
                transfer_request,
                posting_date,
                due_date,
                from_warehouse,
                to_warehouse,
                line,
                shift,
                status,
                statusChange,
                state,
                docEntry,
                activities_name,
                action,
                transfer_request_id,
                remark
            })
            return DataResponse(rs)
        }catch(e:any){
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

}

export const inventorytransferApi = new InventoryTransferApi()