import NetInfo from "@react-native-community/netinfo"
import { observable } from "mobx"

class NetworkStore {
  @observable isConnected = true

  constructor() {
    NetInfo.addEventListener((state) => {
      this.isConnected = state.isConnected ?? false
    })
  }
}

const networkStore = new NetworkStore()
export default networkStore
