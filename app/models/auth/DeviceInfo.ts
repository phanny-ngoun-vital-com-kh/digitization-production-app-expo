import { Instance, types } from "mobx-state-tree";

export const DeviceInfoModel = types.model("DeviceInfo").props({
    deviceUniqueId: types.maybe(types.string),
    deviceId: types.maybe(types.string),
    buildId: types.maybe(types.string),
    brand: types.maybe(types.string),
    model: types.maybe(types.string),
    codeName: types.maybe(types.string),
    deviceName: types.maybe(types.string),
    apiLevel: types.maybe(types.number),
    os: types.maybeNull(types.string),
    appVersion: types.maybe(types.string),
    appName: types.maybe(types.string),
    ipAddress: types.maybe(types.string),
})

type DeviceInfoType = Instance<typeof DeviceInfoModel>
export interface DeviceInfo extends DeviceInfoType { }