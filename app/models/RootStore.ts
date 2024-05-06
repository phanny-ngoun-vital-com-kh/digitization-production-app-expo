import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { EpisodeStoreModel } from "./EpisodeStore"
import { AuthStoreModel } from "./auth/AuthStore"
import { TransferRequestStore } from "./inventory-transfer-request/inventory-transfer-request-store"
import { TransferStore } from "./inventory-transfer/inventory-transfer-store"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
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
