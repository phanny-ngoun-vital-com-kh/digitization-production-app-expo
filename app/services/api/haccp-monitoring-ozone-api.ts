import { BaseApi } from "./base-api";
import { DataResponse } from "./response-util";

const ApiEndpoint = {
    getOzoneSystem: 'get-ozone-system',
    getOzoneDaily: 'get-ozone-daily',
    postHaccpMonitoringOzoneList: "post-haccp-monitoring-ozone-list",
    assignSelfOzone: "assign-self-ozone"
}

export class HACCPMonitoringOzoneApi extends BaseApi {
    async getListOzoneSystem(): Promise<any> {
        try {
            const rs = await this.requestService.list(ApiEndpoint.getOzoneSystem)
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async getListOzoneDaily(assign_date: string, haccp_ozone_type: string): Promise<any> {
        try {
            const rs = await this.requestService.list(ApiEndpoint.getOzoneDaily, {
                assign_date,
                haccp_ozone_type
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async assignSelf(id: number| null, haccp_ozone_id: string| null, action: string| null): Promise<any> {
        try {
            const rs = await this.requestService.exec(ApiEndpoint.assignSelfOzone, {
                id,
                haccp_ozone_id,
                action
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }

    async saveHaccpMonitoringOzoneList(
        id: number | null,
        feed_array1: string | null,
        feed_array2: string | null,
        concentrate: string | null,
        array1: string | null,
        array2: string | null,
        feed_ro: string | null,
        recycle: string | null,
        permeate: string | null,
        feed: string | null,
        um1_filter: string | null,
        ro_buffer_tank: string | null,
        uv1: string | null,
        uv2: string | null,
        um022_filter: string | null,
        uv3: string | null,
        uv4: string | null,
        cartridge_um3: string | null,
        cartridge_um08: string | null,
        feed_pht133: string | null,
        blending: string | null,
        feed_ft102: string | null,
        ft171_ft192: string | null,
        adjustment_ft382: string | null,
        ca384: string | null,
        ca181: string | null,
        mixed_tank: string | null,
        o3_mixed_tank: string | null,
        air_supply_ps002: string | null,
        mixed_pipe: string | null,
        chiller_tt302: string | null,
        controller: string | null,
        o3_a143: string | null,
        uv5: string | null,
        uv6: string | null,
        status: string | null,
        remark: string | null,
        action: string | null,
        haccp_ozone_id: string | null,
        warning_count: number | null): Promise<any> {
        try {
            const rs = await this.requestService.exec(ApiEndpoint.postHaccpMonitoringOzoneList, {
                id,
                feed_array1,
                feed_array2,
                concentrate,
                array1,
                array2,
                feed_ro,
                recycle,
                permeate,
                feed,
                um1_filter,
                ro_buffer_tank,
                uv1,
                uv2,
                um022_filter,
                uv3,
                uv4,
                cartridge_um3,
                cartridge_um08,
                feed_pht133,
                blending,
                feed_ft102,
                ft171_ft192,
                adjustment_ft382,
                ca384,
                ca181,
                mixed_tank,
                o3_mixed_tank,
                air_supply_ps002,
                mixed_pipe,
                chiller_tt302,
                controller,
                o3_a143,
                uv5,
                uv6,
                status,
                remark,
                action,
                haccp_ozone_id,
                warning_count
            })
            return DataResponse(rs)
        } catch (e: any) {
            __DEV__ && console.tron.log(e.message)
            return { kind: "bad-data" }
        }
    }
}
export const haccpmonitoringozoneApi = new HACCPMonitoringOzoneApi()