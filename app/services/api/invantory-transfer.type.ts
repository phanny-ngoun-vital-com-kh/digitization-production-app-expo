import { InventoryTransfer } from "app/models/inventory-transfer/inventory-transfer-model";
import { GeneralApiProblem } from "./apiProblem";
import { Page } from "./api.types";


export type GetInvantoryTransferResult = {kind:'ok', payload?:Page<InventoryTransfer>} | GeneralApiProblem