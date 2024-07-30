type HACCPList = {
    line: string;
    status: string;
    warning_count: number;
  }
  
  type HACCPResponse = {
    createdDate: string;
    haccplist: HACCPList[];
  }
  
  type AggregatedData = {
    date: string;
    machines: {
      machine: string;
      warning_count: number;
      pending_count: number;
      status: string | null;
    }[];
  }
  
  type MachineColor = {
    label: string;
    color: string;
  }