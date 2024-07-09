import { useIsFocused } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Dimensions, FlatList, View } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import IconFontisto from "react-native-vector-icons/Fontisto"
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import style from "./style"
import { useStores } from "app/models"
import { Avatar, Card } from "react-native-paper"
import { WaterTreatment } from "app/models/water-treatment/water-treatment-model"
// import networkStore from "app/models/network"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}



export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen({ navigation }) {
  const {
    authStore: { getUserInfo },
    waterTreatmentStore,
    preWaterTreatmentStore,
    haccpLinesStore,
  } = useStores()
  const { width: ScreenWidth } = Dimensions.get("screen")

  const [isNotiVisible, setNotiVisible] = useState(false)
  const icon1 = <IconFontisto name="arrow-swap" size={40} color="#000" />
  const icon2 = <IconMaterialCommunityIcons name="warehouse" size={40} />
  const [isInitDb, setInitDb] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [status, setStatus] = useState(null)
  const isFocused = useIsFocused()
  const remoteWork = () => {
    const updatedList = [
      {
        id: 1,
        name: "Inventory Transfer Request",
        subname: "Inventory Transfer Request List",
        navigation: "InventoryTransferRequestProduction",
        iconname: "arrow-top-right-bottom-left",
        icontype: "Fontisto",
      },
      {
        id: 2,
        name: "Inventory Transfer",
        subname: "Inventory Transfer List",
        navigation: "InventoryTransfer",
        iconname: "warehouse",
        icontype: "MaterialCommunityIcons",
      },
      {
        id: 3,
        name: "Water Treatment Control",
        subname: "Water Treatment  List",
        navigation: "WaterTreatmentControlList",
        iconname: "water",
        icontype: "MaterialCommunityIcons",
      },

      {
        id: 4,
        name: "HACCP Monitoring",
        subname: "HACCP Monitoring List",
        navigation: "HccpMonitor",
        iconname: "alert-octagon",
        icontype: "MaterialCommunityIcons",
      },
      // {
      //   id: 4,
      //   name: "HACCP Monitoring",
      //   subname: "HACCP Monitoring List",
      //   navigation: "HccpMonitor",
      //   iconname: "alert-octagon",
      //   icontype: "MaterialCommunityIcons",
      // },
      {
        id: 5,
        name: "Dashboard",
        subname: "Overview and Analytic",
        navigation: "Dashboard",
        iconname: "view-dashboard-outline",
        icontype: "MaterialCommunityIcons",
      },
    ]
    setList(updatedList)
  }




  // TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  //   try {
  //     console.log("Running background sync task")

  //     // Call all Sync to Server here
  //     await waterTreatmentStore.syncDataToserver()
  //     return BackgroundFetch.BackgroundFetchResult.NewData
  //   } catch (error) {
  //     console.error("Error in background sync task:", error)
  //     return BackgroundFetch.BackgroundFetchResult.Failed
  //   }
  // })

  // const BindingWaterTreatment = async () => {
  //   try {
  //     const db = await getDBConnection()
  //     db?.withExclusiveTransactionAsync(async () => {
  //       await db?.runAsync(`DELETE FROM treatments;`)
  //       await db?.runAsync(`DELETE FROM treatment_list;`)
  //       await db?.runAsync(`DELETE FROM assignself;`)
  //     })
  //     const result = await waterTreatmentStore.loadWtp()

  //     result.forEach(async (element: WaterTreatment) => {
  //       await db?.runAsync(
  //         `
  //       INSERT OR REPLACE INTO treatments 
  //       (assign_to, shift, treatment_id, remark, createdBy, createdDate, lastModifiedBy, lastModifiedDate, assign_date) 
  //       VALUES 
  //       (?, ?, ?, ?, ?, ?, ?, ?, ?);
  //     `,
  //         [
  //           element?.assign_to,
  //           element?.shift,
  //           element?.treatment_id,
  //           element?.remark,
  //           element?.createdBy,
  //           element?.createdDate,
  //           element?.lastModifiedBy,
  //           element?.lastModifiedDate,
  //           element?.assign_date,
  //         ],
  //       )

  //       element.treatmentlist.forEach(async (treatment) => {
  //         await db?.runAsync(
  //           `INSERT OR REPLACE INTO treatment_list 
  //         (id, machine, treatment_id, tds, ph, temperature, pressure, air_release, press_inlet, press_treat, press_drain, check_by, status, warning_count, odor, taste, other, assign_to_user, createdBy, createdDate, lastModifiedBy, lastModifiedDate) 
  //         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  //       `,
  //           [
  //             treatment?.id,
  //             treatment?.machine,
  //             treatment?.treatment_id,
  //             treatment?.tds,
  //             treatment?.ph,
  //             treatment?.temperature,
  //             treatment?.pressure,
  //             treatment?.air_release,
  //             treatment?.press_inlet,
  //             treatment?.press_treat,
  //             treatment?.press_drain,
  //             treatment?.check_by,
  //             treatment?.status,
  //             treatment?.warning_count,
  //             treatment?.odor,
  //             treatment?.taste,
  //             treatment?.other,
  //             treatment?.assign_to_user,
  //             treatment?.createdBy,
  //             treatment?.createdDate,
  //             treatment?.lastModifiedBy,
  //             treatment?.lastModifiedDate,
  //           ],
  //         )
  //       })
  //     })
  //   } catch (error) {
  //     console.error("Error local again", error)
  //   } finally {
  //     console.log("Load server to local")
  //   }
  // }

  useEffect(() => {
    const role = async () => {
      try {
        const rs = await getUserInfo()
        // console.log(rs.data.authorities)
        // Modify the list based on the user's role
        if (
          rs.data.authorities.includes("ROLE_PROD_WARE_ADMIN") ||
          rs.data.authorities.includes("ROLE_PROD_WARE_USER")
        ) {
          // If user is a warehouse admin
          const updatedList = [
            {
              id: 1,
              name: "Inventory Transfer Request",
              subname: "Inventory Transfer Request List",
              navigation: "InventoryTransferRequestWarehouse",
              iconname: "arrow-top-right-bottom-left",
              icontype: "Fontisto",
            },
            {
              id: 2,
              name: "Inventory Transfer",
              subname: "Inventory Transfer List",
              navigation: "InventoryTransfer",
              iconname: "warehouse",
              icontype: "MaterialCommunityIcons",
            },
            {
              id: 3,
              name: "Water Treatment Control",
              subname: "Water Treatment  List",
              navigation: "WaterTreatmentControlList",
              iconname: "water",
              icontype: "MaterialCommunityIcons",
            },

            {
              id: 4,
              name: "HACCP Monitoring",
              subname: "HACCP Monitoring List",
              navigation: "HccpMonitor",
              iconname: "alert-octagon",
              icontype: "MaterialCommunityIcons",
            },

            // Add other items as needed
          ]
          setList(updatedList)
        } else if (
          rs.data.authorities.includes("ROLE_PROD_PRO_ADMIN") ||
          rs.data.authorities.includes("ROLE_PROD_PRO_USER")
        ) {
          const updatedList = [
            {
              id: 1,
              name: "Inventory Transfer Request",
              subname: "Inventory Transfer Request List",
              navigation: "InventoryTransferRequestProduction",
              iconname: "arrow-top-right-bottom-left",
              icontype: "Fontisto",
            },
            {
              id: 2,
              name: "Inventory Transfer",
              subname: "Inventory Transfer List",
              navigation: "InventoryTransfer",
              iconname: "warehouse",
              icontype: "MaterialCommunityIcons",
            },
            {
              id: 3,
              name: "Water Treatment Control",
              subname: "Water Treatment  List",
              navigation: "WaterTreatmentControlList",
              iconname: "water",
              icontype: "MaterialCommunityIcons",
            },

            {
              id: 4,
              name: "HACCP Monitoring",
              subname: "HACCP Monitoring List",
              navigation: "HccpMonitor",
              iconname: "alert-octagon",
              icontype: "MaterialCommunityIcons",
            },
            {
              id: 5,
              name: "Dashboard",
              subname: "Overview and Analytic",
              navigation: "Dashboard",
              iconname: "view-dashboard-outline",
              icontype: "MaterialCommunityIcons",
            },

            // {
            //   id: 4,
            //   name: "HACCP Monitoring",
            //   subname: "HACCP Monitoring List",
            //   navigation: "HccpMonitor",
            //   iconname: "alert-octagon",
            //   icontype: "MaterialCommunityIcons",
            // },
          ]
          setList(updatedList)
        }

        // else {
        //   const updatedList = [
        //     {
        //       id: 1,
        //       name: "Inventory Transfer Request",
        //       subname: "Inventory Transfer Request List",
        //       navigation: "InventoryTransferRequestProduction",
        //       iconname: "arrow-top-right-bottom-left",
        //       icontype: "Fontisto",
        //     },
        //     {
        //       id: 2,
        //       name: "Inventory Transfer",
        //       subname: "Inventory Transfer List",
        //       navigation: "InventoryTransfer",
        //       iconname: "warehouse",
        //       icontype: "MaterialCommunityIcons",
        //     },
        //     {
        //       id: 3,
        //       name: "Water Treatment Control",
        //       subname: "Water Treatment  List",
        //       navigation: "WaterTreatmentControlList",
        //       iconname: "water",
        //       icontype: "MaterialCommunityIcons",
        //     },

        //     {
        //       id: 4,
        //       name: "HACCP Monitoring",
        //       subname: "HACCP Monitoring List",
        //       navigation: "HccpMonitor",
        //       iconname: "alert-octagon",
        //       icontype: "MaterialCommunityIcons",
        //     },

        //     // {
        //     //   id: 4,
        //     //   name: "HACCP Monitoring",
        //     //   subname: "HACCP Monitoring List",
        //     //   navigation: "HccpMonitor",
        //     //   iconname: "alert-octagon",
        //     //   icontype: "MaterialCommunityIcons",
        //     // },
        //   ]
        //   setList(updatedList)
        // }
      } catch (e) {
        console.log(e)
      } finally {
      }
    }

    role()
    // remoteWork()
  }, [])

  // useEffect(() => {
  //   if (state == true) {
  //     console.log(!isWareAdm)
  //     console.log(!isProdAdm)
  //     console.log(role)
  //   }

  // }, [isWareAdm, isProdAdm, role])



  // const handleNetworkChanges = () => {
  //   NetInfo.addEventListener((state) => {
  //     if (state.isConnected) {
  //       console.log("Internet connection restored, triggering background sync task")
  //       // Trigger the background sync task when the internet connection is restored
  //       registerBackgroundSyncTask()
  //     } else {
  //       console.log("Wifi or Internet has disconnected, switch to offlien Mode")
  //     }
  //   })
  // }

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns)

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true })
      numberOfElementsLastRow++
    }

    return data
  }

  const [list, setList] = useState([])

  const ItemList = ({ item }) => {
    const LeftContent = (props) => (
      <Avatar.Icon {...props} icon={item.iconname} style={{ backgroundColor: "#2292EE" }} />
    )
    if (item.empty === true) {
      return <View style={[style.item, style.itemInvisible]} />
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* <TouchableOpacity style={{ margin: 20 }} onPress={() => { navigation.navigate(item.navigation) }}>
          <View style={{ alignItems: 'center', backgroundColor: '#fff', flex: 1, paddingTop: 40, paddingBottom: 40, height: 130, flexDirection: 'row', borderRadius: 5, borderColor: '#2292EE', borderWidth: 1 }}>
            <View style={{ alignItems: 'flex-start', width: '20%', height: '100%', marginLeft: 30 }}>
              <Text style={{ paddingTop: 15 }}>{item.icon}</Text>
            </View>
            <View>
              <Text style={{ color: '#000' }}>{item.name}</Text>
              <Text style={{ color: '#000' }}>{item.subname}</Text>
            </View>

          </View>
        </TouchableOpacity> */}
        <Card
          style={{ margin: 20, backgroundColor: "#fff" }}
          onPress={() => {
            navigation.navigate(item.navigation)
          }}
        >
          <Card.Title title={item.name} subtitle={item.subname} left={LeftContent} />
        </Card>
        {/* <HomeCard
  //         title={item.name}
  //         iconName={item.iconname}
  //         iconType={item.icontype}
  //         description={item.subname}
  //         onPress={() => { navigation.navigate(item.navigation) }}
  //         iconBackgroundColor='#2292EE'
  //         style={{ margin: 20 ,width:'92%',borderColor:'#2292EE'}}
  //         iconStyle={{ height:7}}
  //         iconSize={30}
  //         borderRadius={5}
  //       /> */}
      </View>
    )
  }
  // handleNetworkChanges()

  // React.useEffect(() => {
  //   let unsubscribe: () => void
  //   const handleNetworkChanges = () => {
  //     unsubscribe = NetInfo.addEventListener(async (state) => {
  //       if (state.isConnected) {
  //         console.log("Internet connection restored, triggering background sync task")
  //         // Trigger the background sync task when the internet connection is restored

  //         await waterTreatmentStore.syncDataToserver()

  //       } else {
  //         console.log("Wifi or Internet has disconnected, switch to offline mode")
  //       }
  //     })
  //   }

  //   handleNetworkChanges()

  //   return () => {
  //     unsubscribe()
  //   }
  // }, [])

  useEffect(() => {
    // console.log(networkStore.isConnected) 
    if (false) {
      // console.log(networkStore.isConnected) 

    }
  }, [isFocused,
    // networkStore.isConnected
  
  ])
  return (
    <>
      <FlatList
        style={{ backgroundColor: "#fff" }}
        keyExtractor={(item) => item.id}
        data={formatData(list, 3)}
        numColumns={3}
        renderItem={ItemList}
      />
      {/* <TouchableOpacity onPress={() => setNotiVisible(true)} >
        <Text style={{ paddingTop: 15 }}>Test Noti</Text>
      </TouchableOpacity>
      <NotificSoundModal
      color="red"
      title="Test"
        message="HI"
        onClose={() => setNotiVisible(false)}
        isVisible={isNotiVisible}
      /> */}
    </>
  )
})
