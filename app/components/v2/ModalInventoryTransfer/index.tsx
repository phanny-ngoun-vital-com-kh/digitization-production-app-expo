import React, { useEffect, useState } from 'react';
import { Modal, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from '../Icon';
import { BaseStyle, useTheme } from 'app/theme-v2';
import styles from './styles';
import { Text, TextInput, Button } from '..';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { InventoryTransfer } from 'app/models/inventory-transfer/inventory-transfer-model';
import moment from 'moment';
import { DataTable } from 'react-native-paper';
import { useStores } from "app/models"
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { CloseTransfer, ReceiveStatusChangeModel, TransferModel } from 'app/models/inventory-transfer/inventory-transfer-store';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import ConfirmDialog from '../Dialog';

interface ModalProps {
  data: InventoryTransfer
  isVisible: boolean;
  onClose: () => void;
  total: ({
    code: string,
    total: number
  })
  isLoading: boolean;
  sapDoc: number;
  // onSubmit:()=>void
}

const ModalInventoryTransfer: React.FC<ModalProps> = ({ data, isVisible, onClose, total, isLoading, sapDoc }) => {

  const {
    inventoryTransferStore,
    authStore
  } = useStores()
  const { colors } = useTheme()
  const [getReceive, setGetReceive] = useState('')
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState([])
  const [isSubmit, setIsSubmit] = useState(true)
  const [status, setStatus] = useState('')
  const [isProdAdm, setIsProdAdm] = useState()
  const [isWareAdm, setIsWareAdm] = useState()
  const [isProdUser, setIsProdUser] = useState()
  const [isWareUser, setIsWareUser] = useState()
  const [isReceiveshow, setIsReceiveShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  useEffect(() => {
    const role = async () => {
      try {
        const rs = await authStore.getUserInfo();
        // Modify the list based on the user's role
        setIsProdAdm(rs.data.authorities.includes('ROLE_PROD_PRO_ADMIN'))
        setIsWareAdm(rs.data.authorities.includes('ROLE_PROD_WARE_ADMIN'))
        setIsProdUser(rs.data.authorities.includes('ROLE_PROD_PRO_USER'))
        setIsWareUser(rs.data.authorities.includes('ROLE_PROD_WARE_USER'))
      } catch (e) {
        console.log(e);
      }
    };
    role();
  }, []);

  useEffect(() => {
    setItems(data?.item.map(it => ({
      id: it.id,
      item_code: it.item_code,
      item_name: it.item_name,
      quantity: it.quantity,
      received: it.received,
      remark: it.remark == null ? "" : it.remark,
      transfer_request: it.transfer_request,
      uom: it.uom,
      supplier: it.supplier,
      total: (total[it.item_code] == undefined ? '0' : total[it.item_code].toString()),
      is_receive: '',
      itemReceive: 0
    })))
  }, [isVisible == true, total])

  useEffect(() => {
    const allReceived = newItem?.every(item => {
      const Quantity = parseFloat(item?.quantity);
      const totalQuantity = parseFloat(item?.total);
      return (totalQuantity=== Quantity);
    });
    if (allReceived) {
      setStatus('completed');
    } else {
      setStatus('pending');
    }
  }, [newItem]);

  // console.log(data)
  const submit = async () => {
    setLoading(true)
    if (isSubmit == false) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'បរាជ័យ',
        textBody: 'ចំនួនមិនត្រឹមត្រូវ',
        button: 'បិទ',
      })
      setIsSubmit(true)
      return
    }
    if (!newItem.length){
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'បរាជ័យ',
        textBody: 'សូមបំពេញចំនួន',
        button: 'បិទ',
      })
      return
    }
    const it = TransferModel.create({
      transfer_type: data.transfer_type,
      business_unit: data.business_unit,
      status: status,
      transfer_request: data.id.toString(),
      transfer_id: data.transfer_id,
      posting_date: data?.posting_date.toString(),
      due_date: data?.due_date.toString(),
      from_warehouse: parseInt(String(data.from_warehouse[0].id).charAt(0)),
      to_warehouse: parseInt(String(data.to_warehouse[0].id).charAt(0)),
      line: data.line,
      shift: data.shift,
      items: newItem
    })
    const da = ReceiveStatusChangeModel.create({
      id: data.id,
      transfer_request: data.id
    })

    try {
      await inventoryTransferStore.addTransfer(it).savetransfer();
      await inventoryTransferStore.addReceiveChange(da).receivestatuschange();
      onClose()
      setNewItem([])
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'ជោគជ័យ',
        textBody: 'រក្សាទុកបានជោគជ័យ',
        // button: 'close',
        autoClose: 100
      })
      // Both operations were successful, proceed with further actions
      // ...
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'បរាជ័យ',
        textBody: 'បរាជ័យ',
        button: 'បិទ',
      })
    } finally {
      setLoading(false)
    }
  }

  const onCloseTransfer = async () => {
    setLoading(true)
    const da = CloseTransfer.create({
      id: data.id,
      items: items,
      docEntry: sapDoc,
      transfer_type: data.transfer_type,
      business_unit: data.business_unit,
      transfer_request: data.id,
      posting_date: data.posting_date.toString(),
      due_date: data.due_date.toString(),
      from_warehouse: parseInt(String(data.from_warehouse[0].id).charAt(0)),
      to_warehouse: parseInt(String(data.to_warehouse[0].id).charAt(0)),
      line: data.line,
      shift: data.shift,
      status: 'completed',
      statusChange: 'received',
      state: 'completed'
    })
    try {
      await inventoryTransferStore.addCloseTran(da).closetransfer()
      setIsConfirmationVisible(false)
      onClose()
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'ជោគជ័យ',
        textBody: 'រក្សាទុកបានជោគជ័យ',
        // button: 'close',
        autoClose: 100
      })
    } catch (error) {
      setLoading(false)
      setIsConfirmationVisible(false)
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'បរាជ័យ',
        textBody: 'បរាជ័យ',
        button: 'បិទ',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertNotificationRoot>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >

        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <MenuProvider>

            <View style={styles.container}>
              <View>
                <View style={styles.model}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text body1 accentColor>Inventory Transfer </Text>
                    {data?.transfer_type == 'PM/RM' && (isProdAdm || isProdUser)?
                      <Menu style={{ marginLeft: '79%' }}>
                        <MenuTrigger style={[styles.menu, {}]}>
                          <Icon name="ellipsis-v" size={20} />
                        </MenuTrigger>
                        <MenuOptions customStyles={{ optionText: styles.menuText }} optionsContainerStyle={{ marginLeft: -10 }}>
                          {/* <MenuOption text="ALL" customStyles={{ optionText: [styles.menuText, { color: '#2292EE' }] }} onSelect={() => setStatus('ALL')} /> */}
                          <MenuOption text="Close Tranfer" customStyles={{ optionText: [styles.menuText, { color: 'red' }] }} onSelect={() => setIsConfirmationVisible(true)} />
                        </MenuOptions>
                      </Menu>
                      : data?.transfer_type == 'FG' && (isWareAdm || isWareUser)?
                        <Menu style={{ marginLeft: '79%' }}>
                          <MenuTrigger style={[styles.menu, {}]}>
                            <Icon name="ellipsis-v" size={20} />
                          </MenuTrigger>
                          <MenuOptions customStyles={{ optionText: styles.menuText }} optionsContainerStyle={{ marginLeft: -10 }}>
                            {/* <MenuOption text="ALL" customStyles={{ optionText: [styles.menuText, { color: '#2292EE' }] }} onSelect={() => setStatus('ALL')} /> */}
                            <MenuOption text="Close Tranfer" customStyles={{ optionText: [styles.menuText, { color: 'red' }] }} onSelect={() => setIsConfirmationVisible(true)} />
                          </MenuOptions>
                        </Menu>
                        : <></>}
                    <Icon
                      color={colors.primary}
                      style={{ marginLeft: 'auto' }}
                      size={25}
                      name={"times"}
                      onPress={onClose}
                    />
                  </View>
                  {data ?
                    <View>
                      <View style={styles.main_view}>
                        <View style={styles.sub_view}>
                          <Text style={styles.text}>Request ID</Text>
                          <TextInput value={`PDR-${String(data.id).padStart(6, '0')}`} editable={false} />
                        </View>
                        <View style={styles.sub_view}>
                          <Text style={styles.text}>Type</Text>
                          <TextInput value={data.transfer_type} editable={false} />
                        </View>
                        <View style={[styles.main_view, { width: '30%' }]}>
                          <View style={[styles.sub_view, { width: '50%' }]}>
                            <Text style={[styles.text]}>Line</Text>
                            <TextInput value={data.line} editable={false} />
                          </View>
                          <View style={[styles.sub_view, { width: '50%' }]}>
                            <Text style={styles.text}>Shift</Text>
                            <TextInput value={data.shift} editable={false} />
                          </View>
                        </View>
                      </View>
                      <View style={styles.main_view}>
                        <View style={[styles.main_view, { width: '30%' }]}>
                          <View style={[styles.sub_view, { width: '49%' }]}>
                            <Text style={styles.text}>From Warehouse</Text>
                            <TextInput value={data.from_warehouse.map(v => v.whsCode).toString()} editable={false} />
                          </View>
                          <View style={[styles.sub_view, { width: '49%' }]}>
                            <Text style={styles.text}>To Warehouse</Text>
                            <TextInput value={data.to_warehouse.map(v => v.whsCode).toString()} editable={false} />
                          </View>
                        </View>
                        <View style={[styles.main_view, { marginLeft: '3%', width: '30%' }]}>
                          <View style={[styles.sub_view, { width: '49%' }]}>
                            <Text style={styles.text}>Posting Date</Text>
                            <TextInput value={moment(data.posting_date).format('YYYY-MM-DD')} editable={false} />
                          </View>
                          <View style={[styles.sub_view, { width: '49%' }]}>
                            <Text style={styles.text}>Due Date</Text>
                            <TextInput value={moment(data.due_date).format('YYYY-MM-DD')} editable={false} />
                          </View>
                        </View>
                        <View style={[styles.sub_view, { marginLeft: '4%', width: '32%' }]}>
                          <Text style={{ marginBottom: '1.5%' }}>Remark</Text>
                          <TextInput value={data.remark ? data.remark : '-'} editable={false} />
                        </View>
                      </View>

                      <DataTable style={{ margin: 10, marginTop: 10 }}>
                        <DataTable.Header >
                          <DataTable.Title style={{ flex: 0.4 }} textStyle={styles.textHeader}>No</DataTable.Title>
                          <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>Item Code</DataTable.Title>
                          <DataTable.Title style={{ flex: 1 }} textStyle={styles.textHeader}>Item Name</DataTable.Title>
                          <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Quantity</DataTable.Title>
                          <DataTable.Title style={{ flex: 0.4 }} textStyle={styles.textHeader}>Total</DataTable.Title>
                          {data?.transfer_type == 'PM/RM' && (isProdAdm || isProdUser)?
                            <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>Received</DataTable.Title>
                            : data?.transfer_type == 'FG' && (isWareAdm || isWareUser)?
                              <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>Received</DataTable.Title>
                              : <></>}
                          <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>UoM</DataTable.Title>
                          <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Supplier</DataTable.Title>
                          <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Remark</DataTable.Title>
                        </DataTable.Header>
                      </DataTable>
                      <View style={{ height: 120 }}>
                        <FlatList
                          data={data.item}
                          // style={{ height: 300 }}
                          renderItem={({ item, index }) =>
                            <DataTable style={{ margin: 10, marginTop: 0 }}>
                              <DataTable.Row key={data.id}>
                                <DataTable.Cell style={{ flex: 0.4 }}>{index + 1}</DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.7 }} textStyle={styles.textHeader}>{item.item_code}</DataTable.Cell>
                                <DataTable.Cell style={{ flex: 1 }}><Text style={styles.textHeader}>{item.item_name}</Text></DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.6 }} textStyle={styles.textHeader}>{item.quantity}</DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.4 }} textStyle={styles.textHeader}>{total[item.item_code]}</DataTable.Cell>
                                {data?.transfer_type == 'PM/RM' && (isProdAdm || isProdUser)?
                                  <DataTable.Cell style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                                    <TextInput
                                      keyboardType='numeric'
                                      style={{ width: '90%', backgroundColor: '#fff', borderColor: 'gray', borderWidth: 1, borderRadius: 10 }}
                                      placeholder='Please Enter'
                                      placeholderTextColor="gray"
                                      onChangeText={t => {
                                        if (parseInt(t) == 0) {
                                          const update_item = [...items]
                                          update_item[index].is_receive = ' '
                                          update_item[index].received = (parseInt(t) ?? 0).toString()
                                          update_item[index].itemReceive = parseInt(t)
                                          update_item[index].total = (total[item.item_code] + parseInt(t)).toString()
                                          setNewItem(update_item)
                                        } else {
                                          if (total[item.item_code] + parseInt(t) == item.quantity) {
                                            const update_item = [...items]
                                            update_item[index].is_receive = 'True'
                                            update_item[index].received = (parseInt(t) ?? 0).toString()
                                            update_item[index].itemReceive = parseInt(t)
                                            update_item[index].total = (total[item.item_code] + parseInt(t)).toString()
                                            setNewItem(update_item)
                                          } else if (total[item.item_code] + parseInt(t) > item.quantity) {
                                            setIsSubmit(false)
                                          }
                                          else if (total[item.item_code] + parseInt(t) < item.quantity) {
                                            const update_item = [...items]
                                            update_item[index].is_receive = 'False'
                                            update_item[index].received = (parseInt(t) ?? 0).toString()
                                            update_item[index].itemReceive = parseInt(t)
                                            update_item[index].total = (total[item.item_code] + parseInt(t)).toString()
                                            setNewItem(update_item)
                                          }
                                        }
                                      }
                                      }
                                    /></DataTable.Cell>
                                  : data?.transfer_type == 'FG' && (isWareAdm || isWareUser)?
                                    <DataTable.Cell style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                                      <TextInput
                                        keyboardType='numeric'
                                        style={{ width: '90%', backgroundColor: '#fff', borderColor: 'gray', borderWidth: 1, borderRadius: 10 }}
                                        placeholder='Please Enter'
                                        placeholderTextColor="gray"
                                        onChangeText={t => {
                                          if (parseInt(t) == 0) {
                                            const update_item = [...items]
                                            update_item[index].is_receive = ' '
                                            update_item[index].received = (parseInt(t) ?? 0).toString()
                                            update_item[index].itemReceive = parseInt(t)
                                            update_item[index].total = (total[item.item_code] + parseInt(t)).toString()
                                            setNewItem(update_item)
                                          } else {
                                            if (total[item.item_code] + parseInt(t) == item.quantity) {
                                              const update_item = [...items]
                                              update_item[index].is_receive = 'True'
                                              update_item[index].received = (parseInt(t) ?? 0).toString()
                                              update_item[index].itemReceive = parseInt(t)
                                              update_item[index].total = (total[item.item_code] + parseInt(t)).toString()
                                              setNewItem(update_item)
                                            } else if (total[item.item_code] + parseInt(t) > item.quantity) {
                                              setIsSubmit(false)
                                            }
                                            else if (total[item.item_code] + parseInt(t) < item.quantity) {
                                              const update_item = [...items]
                                              update_item[index].is_receive = 'False'
                                              update_item[index].received = (parseInt(t) ?? 0).toString()
                                              update_item[index].itemReceive = parseInt(t)
                                              update_item[index].total = (total[item.item_code] + parseInt(t)).toString()
                                              setNewItem(update_item)
                                            }
                                          }
                                        }
                                        }
                                      /></DataTable.Cell>
                                    : <></>}
                                <DataTable.Cell style={{ flex: 0.6 }} textStyle={styles.textHeader}>{item.uom}</DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.6 }}><Text style={styles.textHeader}>{item.supplier}</Text></DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.8 }} textStyle={styles.textHeader}>{item.remark}</DataTable.Cell>

                              </DataTable.Row>
                            </DataTable>
                          }
                        />
                      </View>
                      {data?.transfer_type == 'PM/RM' && (isProdAdm || isProdUser)?
                        < View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: '3%' }}>
                          <Button style={{ width: '13%', backgroundColor: '#fff', borderColor: 'gray', borderWidth: 1 }} styleText={{ color: '#000', fontSize: 15 }} onPress={onClose}>Cancel</Button>
                          <Button style={{ width: '13%', marginLeft: 20 }} styleText={{ fontSize: 15 }} onPress={submit}>Submit</Button>
                        </View>
                        : data?.transfer_type == 'FG' && (isWareAdm || isWareUser)?
                          < View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: '3%' }}>
                            <Button style={{ width: '13%', backgroundColor: '#fff', borderColor: 'gray', borderWidth: 1 }} styleText={{ color: '#000', fontSize: 15 }} onPress={onClose}>Cancel</Button>
                            <Button style={{ width: '13%', marginLeft: 20 }} styleText={{ fontSize: 15 }} onPress={submit}>Submit</Button>
                          </View> : < View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: '3%' }}>
                            <Button style={{ width: '13%', backgroundColor: '#fff', borderColor: 'gray', borderWidth: 1 }} styleText={{ color: '#000', fontSize: 15 }} onPress={onClose}>Cancel</Button>
                          </View>}

                    </View>
                    : ''}
                </View>
              </View>
            </View>
          </MenuProvider>
        )}
        {isConfirmationVisible && (
          <ConfirmDialog
            title="Cancel Transfer / Close Transfer"
            message="Are you sure to close this transfer?"
            buttons={[
              { text: 'បិទ', onPress: () => setIsConfirmationVisible(false), backgroundColor: 'white', borderWidth: 1, color: 'gray' },
              { text: 'បាទ', onPress: onCloseTransfer, backgroundColor: colors.primary, color: 'white', isLoading: loading }
            ]}
          />
        )}
      </Modal>

    </AlertNotificationRoot >
  );
};

export default ModalInventoryTransfer;