import { Instance, SnapshotOut, types } from "mobx-state-tree";

export const LoginModel = types.model("Login").props({
    access_token: types.maybe(types.string),
    expires_in: types.maybe(types.number),
    refresh_expires_in: types.maybe(types.number),
    refresh_token: types.maybe(types.string),
    session_state: types.maybe(types.string),
    scope: types.maybe(types.string),
    token_type: types.maybe(types.string),
})

type LoginType = Instance<typeof LoginModel>
export interface Login extends LoginType {}
type LoginSnapshotType = SnapshotOut<typeof LoginModel>
export interface LoginSnapshot extends LoginSnapshotType {}
export const createLoginDefaultModel = () => types.optional(LoginModel, {})
