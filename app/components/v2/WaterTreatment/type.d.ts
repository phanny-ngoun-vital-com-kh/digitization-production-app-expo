export type TimePanelProps = {
  time: string
  progressValue: number | string
  isSelected?: boolean
  bgColor: string
  color: string
  onPress:()=>void
}

export type MachinePanelProps = {
  machine_type: string
  status: MACHINE_STATE
  assign_to: string
  time: string
  onPress:()=>void
}

export type MACHINE_STATE = "normal" | "pending" | "warning"
