export type TimePanelProps = {
  time?: string
  progressValue?: number | string
  isSelected?: boolean
  bgColor?: string
  color?: string
  onPress?:()=>void
}

export type MachinePanelProps = {
  machine_type: string  | undefined
  status?: MACHINE_STATE   
  assign_to: string  | undefined
  time: string | undefined
  onPress:()=>void
  warning_count?:string 
}

export type MACHINE_STATE = "normal" | "pending" | "warning"
