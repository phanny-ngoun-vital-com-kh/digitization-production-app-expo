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

interface HomeScreenProps extends AppStackScreenProps<"Home"> { }
export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen({ navigation }) {
  const {
    authStore: { getUserInfo },
  } = useStores()
  const isFocused = useIsFocused()
  const [list, setList] = useState([])

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
          // If user is a warehouse team
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
            // {
            //   id: 3,
            //   name: "Water Treatment Control",
            //   subname: "Water Treatment  List",
            //   navigation: "WaterTreatmentControlList",
            //   iconname: "water",
            //   icontype: "MaterialCommunityIcons",
            // },
            // {
            //   id: 4,
            //   name: "HACCP Monitoring",
            //   subname: "HACCP Monitoring List",
            //   navigation: "HccpMonitor",
            //   iconname: "alert-octagon",
            //   icontype: "MaterialCommunityIcons",
            // },
            // {
            //   id: 5,
            //   name: "Dashboard",
            //   subname: "Overview and Analytic",
            //   navigation: "Dashboard",
            //   iconname: "view-dashboard-outline",
            //   icontype: "MaterialCommunityIcons",
            // },

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
              name: "HACCP Monitoring Ozone",
              subname: "HACCP Monitoring Ozone List",
              navigation: "HACCPMonitoringOzone",
              iconname: "alert-octagon",
              icontype: "MaterialCommunityIcons",
            },
            {
              id: 6,
              name: "Dashboard",
              subname: "Overview and Analytic",
              navigation: "Dashboard",
              iconname: "view-dashboard-outline",
              icontype: "MaterialCommunityIcons",
            },
          ]
          setList(updatedList)
        } else if (
          rs.data.authorities.includes("ROLE_PROD_DWT_USER") ||
          rs.data.authorities.includes("ROLE_PROD_PWT_USER")
        ) {
          const updatedList = [
            {
              id: 1,
              name: "Water Treatment Control",
              subname: "Water Treatment  List",
              navigation: "WaterTreatmentControlList",
              iconname: "water",
              icontype: "MaterialCommunityIcons",
            },
            {
              id: 2,
              name: "Dashboard",
              subname: "Overview and Analytic",
              navigation: "Dashboard",
              iconname: "view-dashboard-outline",
              icontype: "MaterialCommunityIcons",
            },
          ]
          setList(updatedList)
        }
        else if (
          rs.data.authorities.includes("ROLE_PROD_HACCP_USER")
        ) {
          const updatedList = [
            {
              id: 1,
              name: "HACCP Monitoring",
              subname: "HACCP Monitoring List",
              navigation: "HccpMonitor",
              iconname: "alert-octagon",
              icontype: "MaterialCommunityIcons",
            },
            {
              id: 2,
              name: "Dashboard",
              subname: "Overview and Analytic",
              navigation: "Dashboard",
              iconname: "view-dashboard-outline",
              icontype: "MaterialCommunityIcons",
            },
          ]
          setList(updatedList)
        }
      } catch (e) {
        console.log(e)
      } finally {
      }
    }
    role()
  }, [])

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data?.length / numColumns);

    let numberOfElementsLastRow = data?.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true })
      numberOfElementsLastRow++
    }

    return data
  }

  const ItemList = ({ item }) => {
    const LeftContent = (props) => (
      <Avatar.Icon {...props} icon={item.iconname} style={{ backgroundColor: "#2292EE" }} />
    )
    if (item.empty === true) {
      return <View style={[style.item, style.itemInvisible]} />
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
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

  return (
    <>
      <FlatList
        style={{ backgroundColor: "#fff" }}
        keyExtractor={(item) => item.id}
        data={formatData(list, 3)}
        numColumns={3}
        renderItem={ItemList}
      />
    </>
  )
})
