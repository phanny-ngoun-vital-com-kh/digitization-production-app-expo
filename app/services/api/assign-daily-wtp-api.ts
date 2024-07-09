/* eslint-disable lines-between-class-members */
import { BaseApi } from "./base-api"
import { DataResponse } from "./response-util"

type Activity = {
    action: string;
  };
  
  type Treatment = {
    machine: string;
  };
  
  type AssignmentParams = {
    shift: string;
    assign_to: string;
    remark: string;
    assign_date: string;
    activities: Activity[];
    treatmentlist: Treatment[];
  };

const ApiURL = {
  getPrewtpBydate: "get_pre_treatment_by_date_assign",
  postWTP: "post_daily_pre_water_treatment",
  assignTo:"assign_to_user"
}

export class AssignDailyWTP2Api extends BaseApi {

  async saveAssign(params: AssignmentParams): Promise<any> {
    try {
      const rs = await this.requestService.exec(ApiURL.assignTo, {
        ...params,
      })

      return DataResponse(rs)
    } catch (e: any) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}

export const assignDailywtp2Api = new AssignDailyWTP2Api()
