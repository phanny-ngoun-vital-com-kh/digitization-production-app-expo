export interface RouteParams {
    invalidDate:boolean
    isValidShift:boolean
    onReturn:any
    item: {
      assign_date: string;
      assign_to: string;
      haccp_ozone_type:string
      // Other fields of item...
    };
    subItem: {
        id: number,
        warning_count:number,
        lastModifiedDate:string,
        haccp_ozone_id:string,
        control:string,
        check_by:string,
        feed_array1:string,
        feed_array2:string,
        concentrate:string,
        array1:string,
        array2:string,
        feed_ro:string,
        recycle:string,
        permeate:string,
        feed:string,
        um1_filter:string,
        ro_buffer_tank:string,
        uv1:number,
        uv2:number,
        um022_filter:string,
        uv3:number,
        uv4:number,
        cartridge_um3:string,
        cartridge_um08:string,
        feed_pht133:string,
        blending:string,
        feed_ft102:string,
        ft171_ft192:string,
        adjustment_ft382:string,
        ca384:string,
        ca181:string,
        mixed_tank:string,
        o3_mixed_tank:string,
        air_supply_ps002:string,
        mixed_pipe:string,
        chiller_tt302:string,
        controller:string,
        o3_a143:string,
        uv5:number,
        uv6:number,
        status:string,
        assign_to_user:string,
        createdBy:string,
        createdDate:string,
        remark:string,
    };
  }