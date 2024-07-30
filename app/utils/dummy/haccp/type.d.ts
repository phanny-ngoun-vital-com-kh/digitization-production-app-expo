interface ActivityControl {
    over_control: boolean | null;
    under_control: boolean | null;
  }
  
  interface BottleCapRinsing {
    water_pressure: number;
    nozzies_rinser: number;
  }
  
  interface FillingCap {
    FG: number;
    smell: boolean;
    over_control: boolean;
    under_control: boolean;
  }
  
  interface WaterTreatmentLine {
    id: number;
    line: number;
    time: string;
    created_at: string;
    side_wall: number | null;
    air_pressure: number | null;
    temp_preform: number | null;
    tw_pressure: number | null;
    FG: number | null;
    activity_control: ActivityControl;
    bottle_cap_rinsing: BottleCapRinsing;
    filling_cap: FillingCap;
    smell: boolean;
    under_control: boolean;
    over_control: boolean;
    status: string;
    warning_count: number;
    assign_to: string;
    instruction: string;
    other: string;
  }
  
  interface ListWTPLines {
    id: number;
    name: string;
    date: string;
    lines: WaterTreatmentLine[];
  }
  