export type TimePanelProps = {
  time?: string
  progressValue?: number | string
  isSelected?: boolean
  bgColor?: string
  color?: string
  onPress?: () => void
  isWarning?: boolean
}

export type MachinePanelProps = {
  machine_type: string | undefined
  status?: MACHINE_STATE
  isAssign?: boolean | null
  assign_to: string | undefined
  validDate: boolean
  validShift: number
  handleShowdialog?: (users: string[]) => void
  time: string | undefined
  onPress: (isValidShift: any) => void
  currUser?: string | null
  handleAssigntask?: (id: number, assign_to_user: string) => void
  id: number
  pre_treatment_type?: string
  pre_treatment_id?: string
  assign_to_user: string
  warning_count?: string | number
  created_date: string | Date | undefined
}

export type MACHINE_STATE = "normal" | "pending" | "warning"
