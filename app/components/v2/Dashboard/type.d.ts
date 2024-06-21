interface PieChartData {
    value: number;
    text: string;
    color?: string;
  }
  
  type PerformanceChartProps = {
    pieData: PieChartData[];
    percentages:any;
    machineLength:any;
    showPopup:boolean;
    isloading:boolean;
    setPopupdata:React.Dispatch<React.SetStateAction<any>>;
    setShowPopup: React.Dispatch<React.SetStateAction<any>>;
    popupData: {
      total: string;
      percentages: string;
      label: string;
      index?:number 
    }; // optional
  };
  