import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthInfoModel } from "./AuthInfo"
import { LoginModel } from "./LoginModel"
import { authApi } from "../../services/api/auth-api"
import { getRootStore } from "../helpers/getRootStore"

export const AuthoritiesModel = types.model("AuthoritiesModel").props({
  user_id: types.string,
  authority_name: types.string,
})

type AuthoritiesType = Instance<typeof AuthoritiesModel>
export interface Authorities extends AuthoritiesType {}
type AuthoritiesSnapshotType = SnapshotOut<typeof AuthoritiesModel>
export interface AuthoritiesSnapshot extends AuthoritiesSnapshotType {}

export const MobileUserModel = types
  .model("MobileUserModel")
  .props({
    user_id: types.string,
    login: types.string,
    fcm_token: types.string,
    authorities: types.array(AuthoritiesModel),
  })
  .views((self) => {
    return {
      saveMobileUser: async () => {
        const rs = await authApi.saveUser(
          self.user_id,
          self.login,
          self.fcm_token,
          self.authorities,
        )
        if (rs.kind === "ok") {
          console.log("Success")
        } else {
          console.log("Error")
          throw Error(rs.kind)
        }
      },
    }
  })

type MobileUserType = Instance<typeof MobileUserModel>
export interface MobileUser extends MobileUserType {}
type MobileUserSnapshotType = SnapshotOut<typeof MobileUserModel>
export interface MobileUserSnapshot extends MobileUserSnapshotType {}

export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    isAuthenticated: types.optional(types.boolean, false),
    isQuest: types.optional(types.maybe(types.boolean), undefined),
    authInfo: types.optional(types.maybe(AuthInfoModel), undefined),
    login: types.optional(types.maybe(LoginModel), undefined),
    userLogin: types.maybeNull(types.string),
    saveuser: types.optional(types.array(MobileUserModel), []),
    unauthorized: types.optional(types.number, 0),
  })
  .actions((self) => {
    return {
      saveUser: (data: MobileUser) => {
        self.saveuser.push(data)
        return data
      },
      saveCurrentInfo: (user: string) => {
        self.userLogin = user
        return
      },
      clearLogout:async ()=>{
        self.userLogin = null
        return 

      },
    }
  })
  .views((self) => {
    return {
      doLogin: async (useName: string, password: string) => {
        const rs = await authApi.login(useName, password, "")
        if (rs.kind === "ok") {
          // const rs = await authApi.login(useName, password, fcmToken, {
          //   ipAddress: await Network.getIpAddressAsync(),
          //   apiLevel: Device.platformApiLevel,
          //   appName: App.applicationName?.toString(),
          //   appVersion: App.nativeBuildVersion?.toString(),
          //   brand: Device.brand?.toString(),
          //   buildId: Device.osBuildId?.toString(),
          //   codeName: Device.designName?.toString(),
          //   deviceId: Device.modelId,
          //   deviceName: Device.deviceName || undefined,
          //   deviceUniqueId: App.applicationId?.toString(),
          //   model: Device.modelName?.toString(),
          //   os: Device.osName
          // })

          // api.setToken(rs.login.access_token)
          const rootStore = getRootStore(self)
          // await rootStore.appStore.loadAppDataInfo(true, true)
          const user = await authApi.getUser()


          // console.log(JSON.stringify(data.data))
          // console.log(data.data)
          rootStore.authenticationStore.setAuthToken(rs.login.access_token)
        } else {
          // Alert.alert(

          //   translate('loginScreen.failedLogin'),
          //   translate('loginScreen.failedLoginMessage'),
          //   [
          //     {
          //       text: "បាទ",
          //       onPress: () => console.log("Cancel Pressed"),
          //       style: "cancel"
          //     },
          //   ]
          // );

          // Dialog.show({
          //   type: ALERT_TYPE.DANGER,
          //   title: translate('loginScreen.failedLogin'),
          //   textBody: translate('loginScreen.failedLoginMessage'),
          //   button: 'បិទ',
          // })
          throw Error(rs.kind)
        }
      },
    
      getUserInfo: async () => {
        const user = await authApi.getUser()

        return user
      },
    }
  })

type AuthStoreType = Instance<typeof AuthStoreModel>
export interface AuthStore extends AuthStoreType {}
type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>
export interface AuthStoreSnapshot extends AuthStoreSnapshotType {}

export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {})
