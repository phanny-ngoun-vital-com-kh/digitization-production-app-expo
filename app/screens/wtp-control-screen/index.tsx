import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import {
  Button,
  Text,
  Dimensions,
  FlatList,
  Image,
  ImageStyle,
  Platform,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import IconFontisto from "react-native-vector-icons/Fontisto"
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import style from "./style"
import { useStores } from "app/models"
import { Avatar, Card, Title, Paragraph } from "react-native-paper"
import data from "../../utils/dummy/water-treatment-plant-2/index.json"
import { WaterTreatmentModel } from "app/models/water-treatment/water-treatment-model"
import { WaterTreatmentStoreModel } from "app/models/water-treatment/water-treatment-store"
import { useNavigation } from "@react-navigation/native"
// import HomeCard from "app/components/v2/HomeCard"

interface WaterTreatmentControlListScreenProps extends AppStackScreenProps<"WaterTreatmentControlList"> {}

export const WaterTreatmentControlListScreen: FC<WaterTreatmentControlListScreenProps> = observer(function WaterTreatmentControlListScreen() {
  const {
    authStore: { getUserInfo },
    waterTreatmentStore,
  } = useStores()
  const navigation = useNavigation()
  const { width: ScreenWidth } = Dimensions.get("screen")
  const [isNotiVisible, setNotiVisible] = useState(false)
  const icon1 = <IconFontisto name="arrow-swap" size={40} color="#000" />
  const icon2 = <IconMaterialCommunityIcons name="warehouse" size={40} />

  useEffect(() => {

    const updatedList = [
      {
        id: 1,
        name: "Daily Water Control and HACCP",
        subname: "Daily Water Treatment Plant System and HACCP Monitoring-Pre RO Stock Tank",
        navigation: "WaterTreatment",
        iconname: "arrow-top-right-bottom-left",
        icontype: "Fontisto",
      },
      {
        id: 2,
        name: "Daily Pre Water Control",
        subname: "Pre-water treatment control record",
        navigation: "PrewaterTreatment",
        iconname: "warehouse",
        icontype: "MaterialCommunityIcons",
      },
  
    ]

    // waterTreatmentStore.removeAll()

    // const payload1 = WaterTreatmentModel.create({
    //   check_date: data[0].check_date,
    //   check_id: data[0].check_id,
    //   waterplant_type: data[0].waterplant_type,
    //   shifts: data[0].shifts,
    // })

    // waterTreatmentStore.addAll(payload1)
    
    console.log(waterTreatmentStore.wtp2.length)
    setList(updatedList)

    // role();
  }, [])

  // useEffect(() => {
  //   if (state == true) {
  //     console.log(!isWareAdm)
  //     console.log(!isProdAdm)
  //     console.log(role)
  //   }

  // }, [isWareAdm, isProdAdm, role])

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



const $root: ViewStyle = {
  flex: 1,
}
