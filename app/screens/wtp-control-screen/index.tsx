import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Dimensions, FlatList, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import NetInfo from "@react-native-community/netinfo"
import style from "./style"
import { useStores } from "app/models"
import { Avatar, Card } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
// import HomeCard from "app/components/v2/HomeCard"

interface WaterTreatmentControlListScreenProps
  extends AppStackScreenProps<"WaterTreatmentControlList"> {}

export const WaterTreatmentControlListScreen: FC<WaterTreatmentControlListScreenProps> = observer(
  function WaterTreatmentControlListScreen() {
    const navigation = useNavigation()

    useEffect(() => {
      const updatedList = [
        {
          id: 1,
          name: "Daily Water Control and HACCP",
          subname: "Daily Water Treatment Plant System and HACCP Monitoring-Pre RO Stock Tank",
          navigation: "WaterTreatment",
          iconname: "bottle-tonic",
          icontype: "MaterialCommunityIcons",
        },
        {
          id: 2,
          name: "Daily Pre Water Control",
          subname: "Pre-water treatment control record",
          navigation: "PrewaterTreatment",
          iconname: "water-check",
          icontype: "MaterialCommunityIcons",
        },
        {
          id: 3,
          name: "Scan Machine",
          subname: "Quick and Simple Scan Machine",
          navigation: "ScanMachine",
          iconname: "keyboard",
          icontype: "MaterialCommunityIcons",
        },
      ]

      setList(updatedList)

      // role();
    }, [])

    useEffect(() => {}, [])
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
  },
)

const $root: ViewStyle = {
  flex: 1,
}
