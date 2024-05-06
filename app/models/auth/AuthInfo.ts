import { Instance, SnapshotOut, types } from "mobx-state-tree";

export const RealmModel =  types.model("authInfo").props({
    roles: types.optional(types.array(types.string), [])
})

export const AuthInfoModel = types.model("authInfo").props({
    preferred_username: types.maybe(types.string),
    email: types.maybe(types.string),
    email_verified: types.optional(types.boolean, false),
    family_name: types.maybe(types.string),
    given_name: types.maybe(types.string),
    roles: types.optional(types.array(types.string), []),
    realm_access: types.maybeNull(RealmModel)
})

type AuthInfoType = Instance<typeof AuthInfoModel>
export interface AuthInfo extends AuthInfoType { }
type AuthInfoSnapshotType = SnapshotOut<typeof AuthInfoModel>
export interface AuthInfoSnapshot extends AuthInfoSnapshotType { }
// export const createAuthInfoDefaultModel = () => types.optional(AuthInfoModel, {})



export const HARD_RELOAD_ROLE = 'HARD_RELOAD_DELIVERY_APP_ROLE'