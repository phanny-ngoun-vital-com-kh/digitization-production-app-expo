import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Button, Text, Dimensions, FlatList, Image, ImageStyle, Platform, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import style from "./style"
import { useStores } from "../../models"
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import sendPushNotification from "../../utils-v2/push-notification-helper";
import PushNotificationComponent from "../../utils-v2/push-notification-helper";
// import NotificSoundModal from "app/components/v2/NotificSoundModal";
// import CustomAudioPlayer from "app/components/v2/NotificSoundModal/CustomAudioPlayer";
// import sendPushNotification from "app/utils-v2/push-notification-helper";
// import PushNotificationComponent from "app/utils-v2/push-notification-helper";
// import HomeCard from "app/components/v2/HomeCard"

interface HomeScreenProps extends AppStackScreenProps<"Home"> { }

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen({ navigation }
) {

  const {
    authStore: { getUserInfo }
  } = useStores()

  useEffect(() => {
    const role = async () => {
      try {
        const rs = await getUserInfo();
        // console.log(rs.data.authorities)
        // Modify the list based on the user's role
        if (rs.data.authorities.includes('ROLE_PROD_WARE_ADMIN') || rs.data.authorities.includes('ROLE_PROD_WARE_USER')) {
          // If user is a warehouse admin
          const updatedList = [
            { id: 1, name: 'Inventory Transfer Request', subname: "Inventory Transfer Request List", navigation: 'InventoryTransferRequestWarehouse', iconname: 'arrow-top-right-bottom-left', icontype: 'Fontisto' },
            { id: 2, name: 'Inventory Transfer', subname: "Inventory Transfer List", navigation: 'InventoryTransfer', iconname: 'warehouse', icontype: 'MaterialCommunityIcons' },
            // Add other items as needed
          ];
          setList(updatedList);
        } else if (rs.data.authorities.includes('ROLE_PROD_PRO_ADMIN') || rs.data.authorities.includes('ROLE_PROD_PRO_USER')) {
          const updatedList = [
            { id: 1, name: 'Inventory Transfer Request', subname: "Inventory Transfer Request List", navigation: 'InventoryTransferRequestProduction', iconname: 'arrow-top-right-bottom-left', icontype: 'Fontisto' },
            { id: 2, name: 'Inventory Transfer', subname: "Inventory Transfer List", navigation: 'InventoryTransfer', iconname: 'warehouse', icontype: 'MaterialCommunityIcons' },
          ]
          setList(updatedList)
        }

      } catch (e) {
        console.log(e);
      }
    };
    role();
  }, []);

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
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }

    return data;
  };


  const [list, setList] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const ItemList = ({ item }) => {
    const LeftContent = props => <Avatar.Icon {...props} icon={item.iconname} style={{ backgroundColor: '#2292EE' }} />
    if (item.empty === true) {
      return <View style={[style.item, style.itemInvisible]} />;
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
        <Card style={{ margin: 20, backgroundColor: '#fff' }} onPress={() => { navigation.navigate(item.navigation) }}>
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

  async function sendNotification(title, body, deviceTokens, sound = 'default') {
    const SERVER_KEY = 'AAAAOOy0KJ8:APA91bFo9GbcJoCq9Jyv2iKsttPa0qxIif32lUnDmYZprkFHGyudIlhqtbvkaA1Nj9Gzr2CC3aiuw4L-8DP1GDWh3olE1YV4reA3PJwVMTXbSzquIVl4pk-XrDaqZCoAhmsN5apvkKUm';

    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${SERVER_KEY}`
        },
        body: JSON.stringify({
          registration_ids: deviceTokens,
          notification: {
            title: title,
            body: body,
            sound: sound,
          },
          android: {
            notification: {
              sound: sound,
              priority: 'high',
              vibrate: true,
            }
          }

        }),
      });

      const responseData = await response.json();
      console.log('Notification sent successfully:', responseData);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
  return (
    <>
      <FlatList
        style={{ backgroundColor: '#fff' }}
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
