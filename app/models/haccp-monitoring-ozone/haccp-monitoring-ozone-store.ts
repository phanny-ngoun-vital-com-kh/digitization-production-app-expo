import { haccpmonitoringozoneApi } from "app/services/api/haccp-monitoring-ozone-api";
import { types } from "mobx-state-tree";
import { HACCPMonitoringOzoneList, HACCPMonitoringOzoneListModel } from "./haccp-monitoring-ozone-model";

export const HACCPMonitoringOzoneStore = types
    .model('HACCPMonitoringOzoneStore')
    .props({
        haccpList:types.optional(types.array(HACCPMonitoringOzoneListModel),[])
    })
    .actions((self)=>{
        return{
            addHACCPList:(list:HACCPMonitoringOzoneList)=>{
                self.haccpList.push(list)
                return (list)
            }
        }
    })
    .views((self)=>{
        return{
            getOzoneSystemList: async()=>{
                const rs = await haccpmonitoringozoneApi.getListOzoneSystem()
                if(rs.kind==='ok'){
                    return rs.payload
                }else{
                    console.log('Error')
                    throw Error(rs.kind)
                }
                    
            },

            getOzoneDailyList: async(assign_date: string,haccp_ozone_type: string)=>{
                const rs = await haccpmonitoringozoneApi.getListOzoneDaily(assign_date,haccp_ozone_type)
                if(rs.kind==='ok'){
                    return rs.payload
                }else{
                    console.log('Error')
                    throw Error(rs.kind)
                }
            }
        }
    })