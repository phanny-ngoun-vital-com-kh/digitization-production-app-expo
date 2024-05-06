import { GeneralApiProblem } from "./apiProblem";
import { Page } from "./api.types";
import { InventoryTransferRequest } from "app/models/inventory-transfer-request/inventory-transfer-request-store";
import { Warehouse } from "app/models/warehouse/warehouse-model";
import { Bom, ItemList, Supplier } from "app/models/item/item-model";
import { MobileUser } from "app/models/auth/AuthStore";

export type GetInventoryTransferRequestResult = {kind:'ok', payload?:Page<InventoryTransferRequest>} | GeneralApiProblem;

export type GetWarehouseResult = {kind:'ok', payload?: Page<Warehouse>} | GeneralApiProblem;

export type GetItemResult = {kind:'ok', payload?: Page<ItemList>} | GeneralApiProblem;

export type GetMobileUserResult = {kind: 'ok',payload?:MobileUser} | GeneralApiProblem

export type GetBomResult = {kind:'ok', payload?: Page<Bom>} | GeneralApiProblem;

export type GetSupplierResult = {kind:'ok', payload?: Page<Supplier>} | GeneralApiProblem