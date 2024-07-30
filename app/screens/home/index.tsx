import { useIsFocused } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Button, Text, Dimensions, FlatList, Image, ImageStyle, Platform, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import IconFontisto from "react-native-vector-icons/Fontisto"
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import style from "./style"
import { useStores } from "app/models"
import { Avatar, Card } from "react-native-paper"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}
export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen({ navigation }) {
  const {
    authStore: { getUserInfo },
  } = useStores()
  const isFocused = useIsFocused()

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

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data?.length / numColumns);

    let numberOfElementsLastRow = data?.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true })
      numberOfElementsLastRow++
    }

    return data
  }

  const [list, setList] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const ItemList = ({ item }) => {
    const LeftContent = (props) => (
      <Avatar.Icon {...props} icon={item.iconname} style={{ backgroundColor: "#2292EE" }} />
    )
    if (item.empty === true) {
      return <View style={[style.item, style.itemInvisible]} />
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
      </View>
    )
  }
  // handleNetworkChanges()

  

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
      {/* <TouchableOpacity

        onPress={()=>sendNotification('New Transfer Request','You have new transfer request from ', ["eqGVmlV1SWuc8CbbyCPZht:APA91bFjAQ0uL8ZHKGlihtjxeJSYFOq7PJqtKlZ4nk-tL9NICNaExGIctKDgZgxmmrAPnwc_0ZFaqPH5D7nxJyrcxBS18qZTVxYK9K195auRWJ7PjDpgRKELtZ9SubEhnY4y32f_4Dq4"])
        }
      >
        <Text style={{ paddingTop: 150 }}>Test Noti</Text>
      </TouchableOpacity> */}
      {/* <NotificSoundModal
      color="red"
      title={message?.title}
        message={message?.body}
        onClose={() => setNotiVisible(false)}
        isVisible={isNotiVisible}
      /> */}
    </>
  )
})
