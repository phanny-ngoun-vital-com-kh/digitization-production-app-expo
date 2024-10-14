import { haccpmonitoringozoneApi } from "app/services/api/haccp-monitoring-ozone-api"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const HACCPMonitoringOzoneSystemModel = types
    .model("HACCPMonitoringOzoneSystemModel")
    .props({
        id: types.maybeNull(types.number),
        ozone: types.maybeNull(types.string),
    })

type HACCPMonitoringOzoneSystemType = Instance<typeof HACCPMonitoringOzoneSystemModel>
export interface HACCPMonitoringOzoneSystem extends HACCPMonitoringOzoneSystemType { }
type HACCPMonitoringOzoneSystemSnapshotType = SnapshotOut<typeof HACCPMonitoringOzoneSystemModel>
export interface HACCPMonitoringOzoneSystemSnapshot extends HACCPMonitoringOzoneSystemSnapshotType { }

export const HACCPMonitoringOzoneControlModel = types
    .model("HACCPMonitoringOzoneControlModel")
    .props({
        id: types.maybeNull(types.number),
        control: types.maybeNull(types.string),
        ozone_id: types.maybeNull(types.number),
    })

type HACCPMonitoringOzoneControlType = Instance<typeof HACCPMonitoringOzoneControlModel>
export interface HACCPMonitoringOzoneControl extends HACCPMonitoringOzoneControlType { }
type HACCPMonitoringOzoneControlSnapshotType = SnapshotOut<typeof HACCPMonitoringOzoneControlModel>
export interface HACCPMonitoringOzoneControlSnapshot extends HACCPMonitoringOzoneControlSnapshotType { }


export const HACCPMonitoringOzoneListModel = types
    .model("HACCPMonitoringOzoneListModel")
    .props({
        id: types.maybeNull(types.number),
        warning_count: types.maybeNull(types.number),
        lastModifiedDate: types.maybeNull(types.string),
        haccp_ozone_id: types.maybeNull(types.string),
        control: types.maybeNull(types.string),
        check_by: types.maybeNull(types.string),
        feed_array1: types.maybeNull(types.string),
        feed_array2: types.maybeNull(types.string),
        concentrate: types.maybeNull(types.string),
        array1: types.maybeNull(types.string),
        array2: types.maybeNull(types.string),
        feed_ro: types.maybeNull(types.string),
        recycle: types.maybeNull(types.string),
        permeate: types.maybeNull(types.string),
        feed: types.maybeNull(types.string),
        um1_filter: types.maybeNull(types.string),
        ro_buffer_tank: types.maybeNull(types.string),
        uv1: types.maybeNull(types.string),
        uv2: types.maybeNull(types.string),
        um022_filter: types.maybeNull(types.string),
        uv3: types.maybeNull(types.string),
        uv4: types.maybeNull(types.string),
        cartridge_um3: types.maybeNull(types.string),
        cartridge_um08: types.maybeNull(types.string),
        feed_pht133: types.maybeNull(types.string),
        blending: types.maybeNull(types.string),
        feed_ft102: types.maybeNull(types.string),
        ft171_ft192: types.maybeNull(types.string),
        adjustment_ft382: types.maybeNull(types.string),
        ca384: types.maybeNull(types.string),
        ca181: types.maybeNull(types.string),
        mixed_tank: types.maybeNull(types.string),
        o3_mixed_tank: types.maybeNull(types.string),
        air_supply_ps002: types.maybeNull(types.string),
        mixed_pipe: types.maybeNull(types.string),
        chiller_tt302: types.maybeNull(types.string),
        controller: types.maybeNull(types.string),
        o3_a143: types.maybeNull(types.string),
        uv5: types.maybeNull(types.string),
        uv6: types.maybeNull(types.string),
        status: types.maybeNull(types.string),
        assign_to_user: types.maybeNull(types.string),
        createdBy: types.maybeNull(types.string),
        createdDate: types.maybeNull(types.string),
        remark: types.maybeNull(types.string),
        action: types.maybeNull(types.string),

    })
    .views((self) => {
        return {
            saveHaccpList: async () => {
                const rs = await haccpmonitoringozoneApi.saveHaccpMonitoringOzoneList(
                    self.id,
                    self.feed_array1,
                    self.feed_array2,
                    self.concentrate,
                    self.array1,
                    self.array2,
                    self.feed_ro,
                    self.recycle,
                    self.permeate,
                    self.feed,
                    self.um1_filter,
                    self.ro_buffer_tank,
                    self.uv1,
                    self.uv2,
                    self.um022_filter,
                    self.uv3,
                    self.uv4,
                    self.cartridge_um3,
                    self.cartridge_um08,
                    self.feed_pht133,
                    self.blending,
                    self.feed_ft102,
                    self.ft171_ft192,
                    self.adjustment_ft382,
                    self.ca384,
                    self.ca181,
                    self.mixed_tank,
                    self.o3_mixed_tank,
                    self.air_supply_ps002,
                    self.mixed_pipe,
                    self.chiller_tt302,
                    self.controller,
                    self.o3_a143,
                    self.uv5,
                    self.uv6,
                    self.status,
                    self.remark,
                    self.action,
                    self.haccp_ozone_id,
                    self.warning_count
                )
                if (rs.kind === 'ok'){
                    console.log('Success')
                    return('Success')
                }
                    
                else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            },
            assignself: async () => {
                const rs = await haccpmonitoringozoneApi.assignSelf(
                    self.id,
                    self.haccp_ozone_id,
                    self.action
                )
                if (rs.kind === 'ok')
                    console.log('Success')
                else {
                    console.log('Error')
                    throw Error(rs.kind)
                }
            }
        }
    })

type HACCPMonitoringOzoneListType = Instance<typeof HACCPMonitoringOzoneListModel>
export interface HACCPMonitoringOzoneList extends HACCPMonitoringOzoneListType { }
type HACCPMonitoringOzoneListSnapshotType = SnapshotOut<typeof HACCPMonitoringOzoneListModel>
export interface HACCPMonitoringOzoneListSnapshot extends HACCPMonitoringOzoneListSnapshotType { }

export const HACCPMonitoringOzoneModel = types
    .model("HACCPMonitoringOzoneModel")
    .props({
        id: types.maybeNull(types.number),
        assign_to: types.maybeNull(types.string),
        time: types.maybeNull(types.string),
        assign_date: types.maybeNull(types.string),
        haccp_monitoring_id: types.maybeNull(types.string),
        haccp_monitoring_type: types.maybeNull(types.string),
        remark: types.maybeNull(types.string),
        createdBy: types.maybeNull(types.string),
        createdDate: types.maybeNull(types.string),
        lastModifiedBy: types.maybeNull(types.string),
        lastModifiedDate: types.maybeNull(types.string),
        haccp_ozone_id: types.maybeNull(types.string),
        haccp_ozone_type: types.maybeNull(types.string),
        ozonelist: types.array(HACCPMonitoringOzoneListModel),
    })

type HACCPMonitoringOzoneType = Instance<typeof HACCPMonitoringOzoneModel>
export interface HACCPMonitoringOzone extends HACCPMonitoringOzoneType { }
type HACCPMonitoringOzoneSnapshotType = SnapshotOut<typeof HACCPMonitoringOzoneModel>
export interface HACCPMonitoringOzoneSnapshot extends HACCPMonitoringOzoneSnapshotType { }
