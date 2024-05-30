export type TimePanelProps = {
  time?: string
  progressValue?: number | string
  isSelected?: boolean
  bgColor?: string
  color?: string
  onPress?:()=>void
  isWarning?:boolean
}

export type MachinePanelProps = {
  machine_type: string  | undefined
  status?: MACHINE_STATE   
  assign_to: string  | undefined
  time: string | undefined
  onPress:()=>void
  handleAssigntask?:()=>void
  warning_count?:string 
  created_date: string | Date | undefined

}

export type MACHINE_STATE = "normal" | "pending" | "warning"
