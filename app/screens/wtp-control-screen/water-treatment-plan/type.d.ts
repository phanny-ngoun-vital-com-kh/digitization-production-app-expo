export interface Shift {
  check_id?:number,
  shift: number
  time: string
  type: string
  tsd_ppm?: number
  ph_level?: number
  temperature?: number
  pressure?: number
  air_release?: boolean
  other?: string
  press_inlet?: number
  press_treat?: number
  press_drain?: number
  checked_by: string
  odor?: boolean
  taste?: boolean
  machines: string[]
  inspection_status: boolean
}

export interface WaterPlant {
  check_id: number
  waterplant_type: string
  shifts: Shift[]
  check_date: string
  other: string
  remark: string
}

export interface WaterPlantsData {
  waterplants: WaterPlant[]
}
