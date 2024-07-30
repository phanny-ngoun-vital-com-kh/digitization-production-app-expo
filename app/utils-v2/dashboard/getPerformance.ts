
export const getStatusPerformance = (percentages: number): { color: string; label: string } => {
    if (percentages === -1) {
      return { color: "#145da0", label: "" }
    }
    if (percentages < 30) {
      return { color: "#F15412", label: "Danger" } 
    } else if (percentages < 50) {
      return { color: "#BF3131", label: "Warning" } 
    } else if (percentages < 70) {
      return { color: "#10439F", label: "Normal" }  
    } else if (percentages < 90) {
      return { color: "#10439F", label: "Excellent" }
    } else if (percentages <= 100) {
      return { color: "#2B3467", label: "Perfect" }
    }
  }