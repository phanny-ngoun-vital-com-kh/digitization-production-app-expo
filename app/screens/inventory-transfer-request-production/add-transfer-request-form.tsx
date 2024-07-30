import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import { Platform, ScrollView, TouchableOpacity, View } from "react-native"
import {
  Button,
  Text,
  TextInput,
  Icon,
  ModelItem
} from "../../components/v2"
import { AppStackScreenProps, goBack } from "../../navigators"
import styles from "./styles"
import { useNavigation } from "@react-navigation/native"
import DatePicker from '@react-native-community/datetimepicker';
import { DataTable } from "react-native-paper"
import { useTheme } from "../../theme-v2"
import { useStores } from "../../models"
// import { ActivitiesModel, ItemList, Warehouse } from "app/models/inventory-transfer-request/inventory-transfer-request-model"
import { TransferRequestModel } from "../../models/inventory-transfer-request/inventory-transfer-request-store"
import ModalSubmit from "../../components/v2/ModalSubmit"
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { Warehouse } from "../../models/warehouse/warehouse-model"
import { ItemList } from "../../models/item/item-model"
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Dropdown } from 'react-native-element-dropdown';
import sendPushNotification from "../../utils-v2/push-notification-helper"
import NotificSoundModal from "../../components/v2/NotificSoundModal"
import PushNotificationComponent from "../../utils-v2/push-notification-helper"

interface AddTransferRequestFormProps extends AppStackScreenProps<"AddTransferRequestForm"> { }

export const AddTransferRequestFormScreen: FC<AddTransferRequestFormProps> = observer(function AddTransferRequestFormScreen(
) {
  const {
    // inventoryRequestStore: { getWarehouseList, getItemList,addTransfer }
    inventoryRequestStore, authStore
  } = useStores()
  const currentDate = new Date(Date.now());
  currentDate.setUTCHours(0, 0, 0, 0);
  const [showPostingDate, setShowPostingDate] = useState(false);
  const [showDueDate, setShowDueDate] = useState(false);
  const [postingDate, setPostingDate] = useState(currentDate);
  const [dueDate, setDueDate] = useState(currentDate);
  const [listItem, setListItem] = useState([])
  const [isModalVisible, setModalVisible] = useState(false);
  const [ModalSubmitVisible, setModalSubmitVisible] = useState(false);
  const [searchItem, setSearchItem] = useState('')
  const [warehouse, setWarehouse] = useState<Warehouse[]>([])
  const [toWarehouse, setToWarehouse] = useState<Warehouse[]>([])
  const [searchWarehouse, setSearchWarehouse] = useState('')
  const [searchToWarehouse, setSearchToWarehouse] = useState('')
  const [warehouseTendency, setWarehouseTendency] = useState('')
  const [items, setItems] = useState<ItemList[]>([])
  const [transferType, setTansferType] = useState('PM/RM')
  const [getLine, setGetLine] = useState('')
  const [getShift, setGetShift] = useState('')
  const [fromWarehouse, setFromWarehouse] = useState(0)
  const [getToWarehouse, setGetToWarehouse] = useState(0)
  const [remark, setRemark] = useState('')
  const [newItem, setNewItem] = useState([]);
  const [isSubmit, setIsSubmit] = useState(true);
  const [sapItem, setsapItem] = useState([])
  const [getfromWarehouseCode, setGetFromWarehouseCode] = useState('')
  const [getToWarehouseCode, setGetToWarehouseCode] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [allFcm, setAllFcm] = useState([])
  const [line, setLine] = useState([])

  const [message, setMessage] = useState({})
  const [act, setAct] = useState([{
    activities_name: 'Start',
    action: 'Start Request',
    remark: remark
  }])

  useEffect(() => {
    setAct([{
      activities_name: 'Start',
      action: 'Start Request',
      remark: remark
    }])
  }, [remark])

  useEffect(() => {
    const getWarehouse = async () => {
      const i = (await inventoryRequestStore.getWarehouseList("NVC", searchWarehouse))
      setWarehouse(i.items)
    }
    getWarehouse()
  }, [searchWarehouse])

  useEffect(() => {
    const getItem = async () => {
      const it = (await inventoryRequestStore.getItemList(warehouseTendency, searchItem))
      setItems(it.items)
    }
    getItem()
  }, [searchItem, warehouseTendency])

  useEffect(() => {
    const getWarehouse = async () => {
      const i = (await inventoryRequestStore.getWarehouseList(warehouseTendency, searchToWarehouse))
      setToWarehouse(i.items)
    }
    getWarehouse()
  }, [warehouseTendency, searchToWarehouse])

  useEffect(() => {
    setNewItem(listItem.map((item, index) => ({
      itemCode: item.itemCode,
      itemId: item?.id?.toString() || item?.itemId,
      itemName: item.itemName,
      key: index + 1,
      quantity: item?.quantity?.toString(),
      remark: "",
      uom: item.inventoryUoM || item.uom
    })));
    setsapItem(listItem.map((item, index) => ({
      itemCode: item.itemCode,
      itemName: item.itemName,
      key: index + 1,
      quantity: item?.quantity?.toString(),
      remark: "",
      fromWarehouse: getfromWarehouseCode,
      toWarehouse: getToWarehouseCode
    })))
  }, [listItem, getfromWarehouseCode, getToWarehouseCode])

  useEffect(() => {
    const getToken = async () => {
      const data = (await inventoryRequestStore.getMobileUserList())
      const usersWithRole = data.filter(user =>
        user.authorities.some(authority => authority.authority_name === "ROLE_PROD_PRO_ADMIN")
      );

      // Extract fcm_token from the filtered user object
      const fcmTokens = usersWithRole.map(user => user.fcm_token);
      setAllFcm(fcmTokens)
      const listLine = (await inventoryRequestStore.getline())
      setLine(listLine)
    }
    getToken()

  }, [])

  const updateRemark = (index, remark) => {
    const updatedList = [...newItem];
    updatedList[index].remark = remark;
    setNewItem(updatedList);
    const updatedsapList = [...sapItem];
    updatedsapList[index].remark = remark;
    setsapItem(updatedsapList)
  };

  const updateQty = (index, quantity) => {
    const updatedList = [...newItem];
    updatedList[index].quantity = quantity;
    setNewItem(updatedList);
    const updatedsapList = [...sapItem];
    updatedsapList[index].quantity = quantity;
    setsapItem(updatedsapList)
  };

  const type = [
    { id: '1', name: 'PM/RM' },
    { id: '2', name: 'FG' }
  ]

  const shift = [
    { id: '1', name: 'S1' },
    { id: '2', name: 'S2' }
  ]

  // const line = [
  //   { id: '1', name: 'Line 1' },
  //   { id: '2', name: 'Line 2' },
  //   { id: '3', name: 'Line 3' },
  //   { id: '4', name: 'Line 4' },
  //   { id: '5', name: 'Line 5' },
  //   { id: '6', name: 'Line 6' }
  // ]

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


  const submit = () => {
    const isEmptyQuantity = newItem.some(item => item.quantity === undefined);
    if (!getLine) {
      setIsSubmit(false)
      return
    }
    if (!getShift) {
      setIsSubmit(false)
      return
    }
    if (dueDate < postingDate) {
      setIsSubmit(false)
      return
    }
    if (!fromWarehouse) {
      setIsSubmit(false)
      return
    }
    if (!getToWarehouse) {
      setIsSubmit(false)
      return
    }
    if (isEmptyQuantity) {
      setIsSubmit(false)
      return
    }
    if (newItem?.length == 0) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'បរាជ័យ',
        textBody: 'សូមជ្រើសរើស Item',
        button: 'បិទ',
      })
      return
    }
    setModalSubmitVisible(true)
  }


  const saveTransferRequest = async () => {
    setIsLoading(true)
    const data = TransferRequestModel.create({
      business_unit: warehouseTendency,
      docDueDate: dueDate.toISOString(),
      from_warehouse: fromWarehouse,
      item_count: newItem?.length,
      line: getLine,
      // postingDate:"2024-03-16T00:00:00",
      postingDate: postingDate.toISOString(),
      remark: remark,
      shift: getShift,
      to_warehouse: getToWarehouse,
      transfer_type: transferType,
      activities: act,
      items: newItem,
    })
    try {
      await (inventoryRequestStore
        .addTransferRequest(data)
        .savetransferrequest()
        .then()
        .catch((e) => console.log(e)))
      {
        // setNotiVisible(true)
        // sendNotification(allFcm, 'New Transfer Request', 'You have new transfer request from ' + getLine);
        sendNotification('New Transfer Request', 'You have new transfer request from ' + getLine, allFcm)
        // droplineRef.current.reset();
        // droptypeRef.current.reset();
        // dropshiftRef.current.reset();
        // dropfromwarehouseRef.current.reset();
        // droptowarehouseRef.current.reset();
        setIsSubmit(true)
        setModalSubmitVisible(false)
        setTansferType('PM/RM')
        // setGetLine('')
        setGetShift('')

        setPostingDate(currentDate);
        setDueDate(currentDate)
        setWarehouseTendency('')
        setGetFromWarehouseCode('')
        setGetToWarehouseCode('')
        setFromWarehouse(0)
        setGetToWarehouse(0)
        setRemark('')
        setGetLine('')
        setNewItem([])
        setListItem([])
        // setAllFcm([])
        // navigation.goBack()

        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'ជោគជ័យ',
          textBody: 'រក្សាទុកបានជោគជ័យ',
          // button: 'close',
          autoClose: 100
        })
      }
    } catch (error) {
      console.log(error);
      // Show error dialog
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'បរាជ័យ',
        textBody: 'សូមបំពេញទិន្នន័យអោយបានត្រឹមត្រូវ',
        button: 'បិទ',
      });
    } finally {
      setIsLoading(false); // Reset loading state regardless of success or failure
    }
  }

  return (
    <AlertNotificationRoot>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <View style={{ width: '30%', marginRight: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ margin: 5, color: "red", fontSize: 18 }}>*</Text>
                <Text style={{ margin: 5, fontSize: 18 }}>Type</Text>
              </View>
              <Dropdown style={styles.dropdown}
                data={type}
                labelField="name"
                valueField="name"
                placeholder="Select Type"
                // onSelect={setSelected}

                value={transferType}
                onChange={item => {
                  setTansferType(
                    item.name
                  );
                }} />
            </View>
            <View style={{ width: '30%', marginLeft: 10, flexDirection: 'row' }}>
              <View style={{ width: '50%', marginRight: 2.5 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ margin: 5, color: "red", fontSize: 18 }}>*</Text>
                  <Text style={{ margin: 5, fontSize: 18 }}>Line</Text>
                </View>
                <Dropdown style={styles.dropdown}
                  data={line}
                  labelField="prdname"
                  valueField="prdname"
                  placeholder="Select Line"
                  // onSelect={setSelected}

                  value={getLine}
                  onChange={item => {
                    setGetLine(
                      item.prdname
                    );
                  }} />
                {!getLine && !isSubmit && (
                  <View style={{ width: '100%' }}>
                    <Text caption1 errorColor>
                      សូមជ្រើសរើស Line
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ width: '50%', marginLeft: 2.5 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ margin: 5, color: "red", fontSize: 18 }}>*</Text>
                  <Text style={{ margin: 5, fontSize: 18 }}>Shift</Text>
                </View>
                <Dropdown style={styles.dropdown}
                  data={shift}
                  labelField="name"
                  valueField="name"
                  placeholder="Select Shift"
                  value={getShift}
                  onChange={item => {
                    setGetShift(
                      item.name
                    );
                  }} />
                {!getShift && !isSubmit && (
                  <View style={{ width: '100%' }}>
                    <Text caption1 errorColor>
                      សូមជ្រើសរើស Shift
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ width: '30%', marginLeft: 10, marginRight: 10, flexDirection: 'row' }}>
              <View style={{ width: '50%', marginRight: 2.5 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ margin: 5, color: "red", fontSize: 18 }}>*</Text>
                  <Text style={{ margin: 5, fontSize: 18 }}>Posting Date</Text>
                </View>
                <View style={{}}>
                  <TouchableOpacity onPress={() => setShowPostingDate(true)} style={styles.date_button}>
                    <Text style={{ marginLeft: 10 }}>{postingDate ? postingDate.toDateString() : 'Show Picker'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ width: '50%', marginRight: 2.5 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ margin: 5, color: "red", fontSize: 18 }}>*</Text>
                  <Text style={{ margin: 5, fontSize: 18 }}>Due Date</Text>
                </View>
                <View style={{}}>
                  <TouchableOpacity onPress={() => setShowDueDate(true)} style={styles.date_button}>
                    <Text style={{ marginLeft: 10 }}>{dueDate ? dueDate.toDateString() : 'Show Picker'}</Text>
                  </TouchableOpacity>
                  {dueDate < postingDate && !isSubmit && (
                    <View style={{ width: '100%' }}>
                      <Text caption1 errorColor>
                        Due Date មិនអាចក្រោយ Posting Date
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            {showPostingDate && (
              <DatePicker
                value={postingDate}
                mode={'date'}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                is24Hour={true}
                onChange={(e, v) => {
                  //  setPostingDate(v), setShowPostingDate(false),console.log(v) 
                  if (v) {
                    const selectedDate = new Date(v);
                    // Set time to midnight
                    selectedDate.setUTCHours(0, 0, 0, 0);
                    setPostingDate(selectedDate);
                    setShowPostingDate(false);
                  }
                }}
                style={{}}
              />
            )}
            {showDueDate && (
              <DatePicker
                value={dueDate}
                mode={'date'}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                is24Hour={true}
                onChange={(e, v) => {
                  // setDueDate(v), setShowDueDate(false) 
                  if (v) {
                    const selectedDate = new Date(v);
                    // Set time to midnight
                    selectedDate.setUTCHours(0, 0, 0, 0);
                    setDueDate(selectedDate);
                    setShowDueDate(false);
                  }
                }}
                style={{}}
              />
            )}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <View style={{ width: '30%', marginRight: 15 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ margin: 5, color: "red", fontSize: 18 }}>*</Text>
                <Text style={{ margin: 5, fontSize: 18 }}>From Warehouse</Text>
              </View>
              <Dropdown style={styles.dropdown}
                data={warehouse}
                labelField="whsCode"
                valueField="id"
                placeholder="Select From Warehouse"
                // onSelect={setSelected}
                search
                value={warehouse}
                onChange={item => {
                  setFromWarehouse(item.id)
                  setGetFromWarehouseCode(item.whsCode)
                  setWarehouseTendency(item.tendency)
                }} />
              {!fromWarehouse && !isSubmit && (
                <View style={{ width: '100%' }}>
                  <Text caption1 errorColor>
                    សូមជ្រើសរើស From Warehouse
                  </Text>
                </View>
              )}
            </View>
            <View style={{ width: '30%', marginRight: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ margin: 5, color: "red", fontSize: 18 }}>*</Text>
                <Text style={{ margin: 5, fontSize: 18 }}>To Warehouse</Text>
              </View>
              <Dropdown style={styles.dropdown}
                data={toWarehouse}
                labelField="whsCode"
                valueField="id"
                placeholder="Select To Warehouse"
                search
                value={toWarehouse}
                onChange={item => {
                  console.log(item)
                  setGetToWarehouse(item.id)
                  setGetToWarehouseCode(item.whsCode)
                }} />
              {!getToWarehouse && !isSubmit && (
                <View style={{ width: '100%' }}>
                  <Text caption1 errorColor>
                    សូមជ្រើសរើស To Warehouse
                  </Text>
                </View>
              )}
            </View>
            <View style={{ width: '30%', marginRight: 10 }}>
              <Text style={{ margin: 5, fontSize: 18 }}>Remark</Text>
              <TextInput multiline={true} value={remark} style={[styles.input, { width: '100%' }]} placeholder="Please Enter" placeholderTextColor="gray" onChangeText={(text) => setRemark(text)}></TextInput>
            </View>
          </View>
          <View style={[styles.divider, { marginTop: 30 }]}></View>
          <Text style={{ marginLeft: 45, marginTop: 10, fontSize: 18, }}>Item</Text>
          {/* <View style={{ justifyContent: 'center' }}> */}


          <DataTable style={{ marginTop: '2%', width: '95%', marginLeft: 'auto', marginRight: 'auto' }}>
            <DataTable.Header >
              <DataTable.Title style={{ flex: 0.3 }} textStyle={styles.textHeader}>No</DataTable.Title>
              <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>Item Code</DataTable.Title>
              <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>Item Name</DataTable.Title>
              <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Quantity</DataTable.Title>
              <DataTable.Title style={{ flex: 0.4 }} textStyle={styles.textHeader}>UoM</DataTable.Title>
              <DataTable.Title textStyle={styles.textHeader}>Remark</DataTable.Title>
              <DataTable.Title style={{ flex: 0, marginLeft: 30 }} textStyle={styles.textHeader}> </DataTable.Title>
            </DataTable.Header>
            {newItem?.length === 0 ?
              <View style={{ marginTop: '3%', alignItems: 'center' }}>
                <Icon name='inbox' size={60} color={'#696969'} ></Icon>
                <Text style={[styles.textHeader, { textAlign: 'center', color: '#696969', marginTop: 5 }]}>No Item Seleted</Text>
              </View>
              :
              (
                newItem.map((item, index) => (
                  <DataTable.Row key={index} style={{}}>
                    <DataTable.Cell style={{ flex: 0.3 }} textStyle={styles.textHeader}>{index + 1}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.5 }} textStyle={styles.textHeader}>{item.itemCode}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.9 }} textStyle={styles.textHeader}><Text style={{ fontSize: 17 }}>{item.itemName}</Text></DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.6 }} textStyle={styles.textHeader}>
                      <TextInput
                        style={[styles.input, item.quantity === undefined && !isSubmit ? { borderColor: 'red' } : { borderColor: '#696969' }, { height: 40, width: 125 }]}
                        value={item.quantity === undefined ? '0' : String(item.quantity)}
                        placeholder="Please Enter"
                        placeholderTextColor="gray"
                        keyboardType="number-pad"
                        onChangeText={(text) => updateQty(index, text)}
                      />
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.4 }} textStyle={styles.textHeader}>{item.uom}</DataTable.Cell>
                    <DataTable.Cell textStyle={styles.textHeader}>
                      <TextInput
                        multiline={true}
                        style={[styles.input, { height: 40, }]}
                        value={item.remark}
                        placeholder="Please Enter"
                        placeholderTextColor="gray"
                        onChangeText={(text) => updateRemark(index, text)}
                      />
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0, marginLeft: 20 }} textStyle={styles.textHeader}>
                      <Icon
                        name="trash"
                        size={20}
                        color={'red'}
                        onPress={() =>
                          setListItem(newItem.filter(value => value.key !== item.key))
                          // setsapItem(sapItem.filter(value => value.key !== item.key))
                        }
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                ))
              )}
            {fromWarehouse != 0 ?
              <Button style={styles.add_item_button} onPress={() => setModalVisible(true)}>Add Item</Button>
              : <></>}
          </DataTable>
        </ScrollView>
        <View style={styles.divider} />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginRight: 20, marginBottom: 25 }}>

          <Button style={{ width: '20%', }} onPress={submit}>Submit</Button>
        </View>
        <ModelItem
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          textChange={(text) => setSearchItem(text)}
          data={items}
          tendency={warehouseTendency}
          // onAddPress={(item) => setListItem([...new Set([...listItem, item])])}
          onAddPress={(item) => setListItem(prevList => [...new Set([...prevList, item])])}
        />
        <ModalSubmit
          isVisible={ModalSubmitVisible}
          onClose={() => setModalSubmitVisible(false)}
          onSubmit={saveTransferRequest}
          isLoading={isLoading}
        />
      </View>
    </AlertNotificationRoot>
  )
})

