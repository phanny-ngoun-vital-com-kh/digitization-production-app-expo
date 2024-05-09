import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    username: types.maybe(types.string),
    password: types.maybe(types.string),
    timeout: types.maybe(types.boolean),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationError() {
      if (store.username?.length === 0) return "can't be blank"
      if (store.username?.length < 3) return "must be at least 3 characters"
      // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
      //   return "must be a valid email address"
      return ""
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setUsername(value: string) {
      store.username = value.replace(/ /g, "")
    },
    logout() {
      store.authToken = undefined
      store.username = ""
      
      // store.isAuthenticated = false
      // storage.remove("token")
      // store.authInfo = undefined
      
      // store.login = undefined
    },
    setTimeout(timeout: boolean) {
      store.timeout = timeout
    }
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> { }
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> { }
