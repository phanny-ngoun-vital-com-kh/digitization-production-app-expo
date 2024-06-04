import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { PreWaterTreatmentStoreModel } from "./pre-water-treatment/pre-water-treatment-store"
import { WaterTreatmentFormStoreModel } from "./water-treatment-form/water-treatment-form-store"
import { HaccpMonitoringStoreModel, LinesItemStoreModel } from "./haccp-monitoring/haccp-monitoring-store"
import { WaterTreatmentStoreModel } from "./water-treatment/water-treatment-store"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { EpisodeStoreModel } from "./EpisodeStore"
import { AuthStoreModel } from "./auth/AuthStore"
import { TransferRequestStore } from "./inventory-transfer-request/inventory-transfer-request-store"
import { TransferStore } from "./inventory-transfer/inventory-transfer-store"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  preWaterTreatmentStore: types.optional(PreWaterTreatmentStoreModel, {} as any),
  waterTreatmentFormStore: types.optional(WaterTreatmentFormStoreModel, {} as any),
  haccpMonitoringStore: types.optional(HaccpMonitoringStoreModel, {} as any),
  linesStore: types.optional(LinesItemStoreModel, {} as any),
  waterTreatmentStore: types.optional(WaterTreatmentStoreModel, {} as any),
  authStore: types.optional(AuthStoreModel, {}),
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  inventoryRequestStore: types.optional(TransferRequestStore, {}),
  episodeStore: types.optional(EpisodeStoreModel, {}),
  inventoryTransferStore: types.optional(TransferStore, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
