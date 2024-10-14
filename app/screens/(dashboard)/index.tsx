import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Dimensions, FlatList, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import IconFontisto from "react-native-vector-icons/Fontisto"
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import style from "./styles"
import { Avatar, Card } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface DashboardScreenProps extends AppStackScreenProps<"Dashboard"> {}

export const DashboardScreen: FC<DashboardScreenProps> = observer(function DashboardScreen() {
  const navigation = useNavigation()
  const icon1 = <IconFontisto name="arrow-swap" size={40} color="#000" />
  const icon2 = <IconMaterialCommunityIcons name="warehouse" size={40} />

  useEffect(() => {
    const updatedList = [
      {
        id: 1,
        name: "Daily Water Treatment",
        subname: "Daily Water Treatment Overview",
        navigation: "DailyDs",
        iconname: "bottle-tonic",
        icontype: "MaterialCommunityIcons",
      },
      {
        id: 2,
        name: "Pre Water Treatment",
        subname: "Daily Pre-Water Treatment Insights",
        navigation: "PreWaterDs",
        iconname: "water-check",
        icontype: "MaterialCommunityIcons",
      },
      {
        id: 3,
        name: "HACCP Monitoring Line",
        subname: "HACCP Monitoring Line Dashboard",
        navigation: "LineDs",
        iconname: "alert-octagon",
        icontype: "MaterialCommunityIcons",
      },
    ]

    setList(updatedList)
  }, [])

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
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}
