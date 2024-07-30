import { Page } from "./api.types";
import { IRequestService, RequestService } from "./request-util"
import { Api } from "./api"
import { DataResponse, DataResponseList } from "./response-util"
import { GetBomResult, GetInventoryTransferRequestResult, GetItemResult, GetMobileUserResult, GetSupplierResult, GetWarehouseResult } from "./inventory-transfer-request.type";
import { InventoryTransferRequest } from "app/models/inventory-transfer-request/inventory-transfer-request-store";
import { BaseApi } from "./base-api";
import { Warehouse } from "app/models/warehouse/warehouse-model";
import { Bom, ItemList, Supplier } from "app/models/item/item-model";
import { MobileUser } from "app/models/auth/AuthStore";

const ApiEndpoint = {
    fetchPagingTransferRequest: 'fetch-paging-transfer-request',
    fetchWarehouseList: 'fetch-warehouse-list',
    fetchPagingItem: 'fetch-paging-item',
    saveTransferRequest: 'save-transfer-request',
    transferRequestStatusChange: 'transfer-request-status-change',
    saveActivities: 'save-activities',
    pageWarehouseRequest: 'page_warehouse_request',
    saveProvided: 'save-provided',
    getListMobileUser: 'get-list-mobile-user',
    fetchPagingBomItem: 'fetch-paging-bom-item',
    listSubItem: 'list-sub-item',
    fetchPagingSupplier: 'fetch-paging-supplier',
    addSupplier: 'add-supplier',
    saveTransferToSap: 'save-transfer-to-sap',
    detailTransferRequest: 'detail-transfer-request',
    getProvideList: 'get-provide-list',
    getProvide: 'get-provide',
    getTotalProvide: 'get-total-provide',
    getProvideItemForClose: 'get-provide-item-for-close',
    updateProvideStatus: 'update-provide-status',
    detailSapTransfer: 'detail-sap-transfer',
    closeTransfer: 'close-transfer',
    getLine: 'get-line'
}

export class InventoryTransferRequestApi extends BaseApi {

    async getInventoryTransfterRequest(pageSize: number = 20, state: string): Promise<GetInventoryTransferRequestResult> {
        try {
            const rs = await this.requestService.page<InventoryTransferRequest>(ApiEndpoint.fetchPagingTransferRequest, {
                advanceSearch: { business_unit: 'ALL', state: state }
            }, pageSize)
            return DataResponse<Page<InventoryTransferRequest>>(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }
    async getWarehouse(pageSize: number = 10, tendency: string = 'ALL', searchValue?: string): Promise<GetWarehouseResult> {
        try {
            const rs = await this.requestService.page<Warehouse>(ApiEndpoint.fetchWarehouseList, {
                advanceSearch: { tendency: tendency }, searchValue
            }, pageSize)
            return DataResponse<Page<Warehouse>>(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }
    async getItem(pageSize: number = 10, tendency: string, searchValue?: string): Promise<GetItemResult> {
        try {
            const rs = await this.requestService.page<ItemList>(ApiEndpoint.fetchPagingItem, {
                advanceSearch: { tendency: tendency }, searchValue
            }, pageSize)
            return DataResponse<Page<ItemList>>(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async getBom(pageSize: number = 10, searchValue?: string, tendency?: string): Promise<GetBomResult> {
        try {
            const rs = await this.requestService.page<Bom>(ApiEndpoint.fetchPagingBomItem, {
                advanceSearch: { tendency: tendency }, searchValue
            }, pageSize)
            return DataResponse<Page<Bom>>(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async getWarehouseTransferRequest(pageSize: number = 20, state: string): Promise<GetInventoryTransferRequestResult> {
        try {
            const rs = await this.requestService.page<InventoryTransferRequest>(ApiEndpoint.pageWarehouseRequest, {
                advanceSearch: { business_unit: 'ALL', state: state }
            }, pageSize)
            return DataResponse<Page<InventoryTransferRequest>>(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async getListMobileUser(): Promise<any> {
        try {
            const rs = await this.requestService.list(ApiEndpoint.getListMobileUser)
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async getLine(): Promise<any> {
        try {
            const rs = await this.requestService.list(ApiEndpoint.getLine)
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async getListSubItem(father: string, tendency: string): Promise<any> {
        try {
            const rs = await this.requestService.list(ApiEndpoint.listSubItem, {
                father,
                tendency
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async saveTransferRequest(business_unit: string, docDueDate: string, from_warehouse: number, item_count: number, line: string, postingDate: string, remark: string, shift: string, to_warehouse: number, transfer_type: string, activities: any, items: any): Promise<any> {
        try {
            const rs = await this.requestService.exec(ApiEndpoint.saveTransferRequest, {
                business_unit,
                docDueDate,
                from_warehouse,
                item_count,
                line,
                postingDate,
                remark,
                shift,
                to_warehouse,
                items,
                transfer_type,
                activities,
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }
    async approveRequest(id: number, remark: string, state: string, statusChange: string): Promise<any> {
        try {
            const rs = await this.requestService.exec(ApiEndpoint.transferRequestStatusChange, {
                id,
                remark,
                state,
                statusChange
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }
    async saveActivities(action: string, activities_name: string, remark: string, transfer_request: string): Promise<any> {
        try {
            const rs = await this.requestService.exec(ApiEndpoint.saveActivities, {
                action,
                activities_name,
                remark,
                transfer_request
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async getSuppiler(pageSize: number = 10, tendency: string, searchValue?: string): Promise<GetSupplierResult> {
        try {
            const rs = await this.requestService.page<Supplier>(ApiEndpoint.fetchPagingSupplier, {
                advanceSearch: { tendency: tendency }, searchValue
            }, pageSize)
            return DataResponse<Page<Supplier>>(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async addSupplier(supplier: string, transfer_request: string, item_code: string, remark?: string): Promise<any> {
        try {
            const rs = await this.requestService.exec(ApiEndpoint.addSupplier, {
                supplier,
                transfer_request,
                item_code,
                remark
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async save_to_sap(id: number, postingDate: string, docDueDate: string, taxDate: string, vendorCode: string, vendorName: string, fromWarehouse: string, toWarehouse: string, apiReferenceNo: string, comments: string, remark: string, statusChange: string, state: string, activities_name: string, action: string, transfer_request: string, transferRequestDetails: any): Promise<any> {
        try {
            const rs = await this.requestService.exec(ApiEndpoint.saveTransferToSap, {
                id,
                postingDate,
                docDueDate,
                taxDate,
                vendorCode,
                vendorName,
                fromWarehouse,
                toWarehouse,
                apiReferenceNo,
                comments,
                remark,
                statusChange,
                state,
                activities_name,
                action,
                transfer_request,
                transferRequestDetails
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async getDetail(id: number): Promise<any> {
        try {
            const rs = await this.requestService.fetch(ApiEndpoint.detailTransferRequest, {
                id
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }
    async getProvideList(transfer_request_id: number): Promise<any> {
        try {
            const rs = await this.requestService.list(ApiEndpoint.getProvideList, {
                transfer_request_id
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }
    async getProvided(provided: string): Promise<any> {
        try {
            const rs = await this.requestService.list(ApiEndpoint.getProvide, {
                provided
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }
    async getTotalProvided(item_code: string, transfer_request_id: number): Promise<any> {
        try {
            const rs = await this.requestService.list(ApiEndpoint.getTotalProvide, {
                item_code,
                transfer_request_id
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async getProvideItemForClose(transfer_request_id: number, status: string, item_code: string): Promise<any> {
        try {
            const rs = await this.requestService.list(ApiEndpoint.getProvideItemForClose, {
                transfer_request_id,
                status,
                item_code
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async findSAPRequest(docEntry: number): Promise<any> {
        try {
            const rs = await this.requestService.fetch(ApiEndpoint.detailSapTransfer, {
                docEntry
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async saveProvided(item: any, status: string, transfer_request_id: number, transfer_request?: string, activities_name?: string, action?: string): Promise<any> {
        try {
            const rs = await this.requestService.exec(ApiEndpoint.saveProvided, {
                item,
                status,
                transfer_request_id,
                transfer_request,
                activities_name,
                action
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async updateProvided(provided: string, remark: string, status: string,transfer_request:string,activities_name:string,action:string): Promise<any> {
        try {
            const rs = await this.requestService.exec(ApiEndpoint.updateProvideStatus, {
                provided,
                remark,
                status,
                transfer_request,
                activities_name,
                action
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async closeRequest(id: number, remark: string, state: string, statusChange: string, docEntry: number, transfer_request?: string, activities_name?: string, action?: string): Promise<any> {
        try {
            const rs = await this.requestService.exec(ApiEndpoint.closeTransfer, {
                id,
                remark,
                state,
                statusChange,
                docEntry,
                transfer_request,
                activities_name,
                action
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

}

export const inventorytransferrequestApi = new InventoryTransferRequestApi()