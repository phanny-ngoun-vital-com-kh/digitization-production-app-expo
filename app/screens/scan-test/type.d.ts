interface AutomaticContainerRejection {
  atStartEndOfGap: number
  dueToDangerousGap: number
  dueToFaultOnNextMachine: number
  dueToFaultyBlowingProcess: number
  dueToIncorrectFillLevel: number
  dueToLabelFault: number
  dueToLackOfBlowAirPres: number
  dueToMachineMalfunctionWhileInOperation: number
  dueToMachineStop: number
  dueToTempTooHighLow: number
  throughContainerGap: number
  totalRejectedContainers: number
}

interface ContainerRejectionByPETView {
  bottles: number
}

interface ManualContainerRejection {
  dueToLabeller: number
  dueToServiceRejection: number
  dueToStationDisconnection: number
  inBlowingWheelDischarge: number
  inBlowingWheelInfeed: number
  throughFiller: number
}

interface Total {
  bottleDischarge: number
  preformInfeed: number
}

interface RejectionData {
  automaticContainerRejection: AutomaticContainerRejection
  containerRejectionByPETView: ContainerRejectionByPETView
  manualContainerRejection: ManualContainerRejection
  total: Total
}

type ProductionCounterType = {
  automaticContainerRejection: AutomaticContainerRejection
  containerRejectionByPETView: ContainerRejectionByPETView
  manualContainerRejection: ManualContainerRejection
  total: Total
}
