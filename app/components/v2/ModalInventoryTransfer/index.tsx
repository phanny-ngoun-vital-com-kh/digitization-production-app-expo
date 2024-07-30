

import React, { useEffect, useState } from 'react';
import { Modal, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from '../Icon';
import { BaseStyle, useTheme } from '../../../theme-v2';
import styles from './styles';
import { Text, TextInput, Button } from '..';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { InventoryTransfer } from '../../../models/inventory-transfer/inventory-transfer-model';
import moment from 'moment';
import { DataTable } from 'react-native-paper';
import { useStores } from "../../../models"
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { CloseTransfer, ReceiveStatusChangeModel, TransferModel } from '../../../models/inventory-transfer/inventory-transfer-store';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import ConfirmDialog from '../Dialog';
import ProvidedListView from '../../../screens/inventory-transfer-request-warehouse/provided-list';
import ProvidedView from '../../../screens/inventory-transfer/provided';

interface ModalProps {
  data?: InventoryTransfer
  isVisible: boolean;
  onClose: () => void;
  total: ({
    code: string,
    total: number
  })
  isLoading: boolean;
  sapDoc: number;
  success:(t:boolean) => void;
  // onSubmit:()=>void
}

const ModalInventoryTransfer: React.FC<ModalProps> = ({ data, isVisible, onClose, sapDoc, isLoading, total,success }) => {

  const {
    inventoryTransferStore,
    inventoryRequestStore,
    authStore
  } = useStores()
  const { colors } = useTheme()
  const [getReceive, setGetReceive] = useState('')
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState([])
  const [isSubmit, setIsSubmit] = useState(true)
  const [state, setState] = useState(false)
  const [isProdAdm, setIsProdAdm] = useState()
  const [isWareAdm, setIsWareAdm] = useState()
  const [isProdUser, setIsProdUser] = useState()
  const [isWareUser, setIsWareUser] = useState()
  const [isReceiveshow, setIsReceiveShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [provide, setProvide] = useState(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [getReason, setGetReason] = useState('')
  const [totalProvidedValues, setTotalProvidedValues] = useState({});

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
    try {
      const da = async () => {
        const provide = (await inventoryRequestStore.getprovidelist(data?.id))
        setProvide(provide)
      }
      da()
      setState(true)
    } catch (e) {

    } finally {
      setState(false)
    }
  }, [isVisible == true])

  useEffect(() => {
    const calculateAndStoreTotalValues = async () => {
      // Assuming items is an array containing item objects with itemcode and id properties
      for (const itemss of data?.item) {
        const receive = await inventoryRequestStore.getprovideitemforclose(data?.id, 'done', itemss.item_code);
        const val = receive.map(v => parseFloat(v.received));
        let total = 0;
        for (let r = 0; r < val?.length; r++) {
          total += val[r];
        }

        // Update total provided values in the state
        setTotalProvidedValues(prevState => ({
          ...prevState,
          [itemss.item_code]: total
        }));
      }
    }
    calculateAndStoreTotalValues();
  }, [isVisible == true]);

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
      total: (totalProvidedValues[it.item_code] == undefined ? '0' : totalProvidedValues[it.item_code].toString()),
      is_receive: '',
      itemReceive: 0
    })))
  }, [isVisible == true, totalProvidedValues])

  // useEffect(() => {
  //   const allReceived = newItem?.every(item => {
  //     const Quantity = parseFloat(item?.quantity);
  //     const totalQuantity = parseFloat(item?.total);
  //     return (totalQuantity=== Quantity);
  //   });
  //   if (allReceived) {
  //     setStatus('completed');
  //   } else {
  //     setStatus('pending');
  //   }
  // }, [newItem]);

  // console.log(data)
  // const submit = async () => {
  //   setLoading(true)
  //   if (isSubmit == false) {
  //     Dialog.show({
  //       type: ALERT_TYPE.DANGER,
  //       title: 'បរាជ័យ',
  //       textBody: 'ចំនួនមិនត្រឹមត្រូវ',
  //       button: 'បិទ',
  //     })
  //     setIsSubmit(true)
  //     return
  //   }
  //   if (!newItem?.length){
  //     Dialog.show({
  //       type: ALERT_TYPE.DANGER,
  //       title: 'បរាជ័យ',
  //       textBody: 'សូមបំពេញចំនួន',
  //       button: 'បិទ',
  //     })
  //     return
  //   }
  //   const it = TransferModel.create({
  //     transfer_type: data.transfer_type,
  //     business_unit: data.business_unit,
  //     status: status,
  //     transfer_request: data.id.toString(),
  //     transfer_id: data.transfer_id,
  //     posting_date: data?.posting_date.toString(),
  //     due_date: data?.due_date.toString(),
  //     from_warehouse: parseInt(String(data.from_warehouse[0].id).charAt(0)),
  //     to_warehouse: parseInt(String(data.to_warehouse[0].id).charAt(0)),
  //     line: data.line,
  //     shift: data.shift,
  //     items: newItem
  //   })
  //   const da = ReceiveStatusChangeModel.create({
  //     id: data.id,
  //     transfer_request: data.id
  //   })

  //   try {
  //     await inventoryTransferStore.addTransfer(it).savetransfer();
  //     await inventoryTransferStore.addReceiveChange(da).receivestatuschange();
  //     onClose()
  //     setNewItem([])
  //     Dialog.show({
  //       type: ALERT_TYPE.SUCCESS,
  //       title: 'ជោគជ័យ',
  //       textBody: 'រក្សាទុកបានជោគជ័យ',
  //       // button: 'close',
  //       autoClose: 100
  //     })
  //     // Both operations were successful, proceed with further actions
  //     // ...
  //   } catch (error) {
  //     Dialog.show({
  //       type: ALERT_TYPE.DANGER,
  //       title: 'បរាជ័យ',
  //       textBody: 'បរាជ័យ',
  //       button: 'បិទ',
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  const onCloseTransfer = async () => {
    setLoading(true)
    const da = CloseTransfer.create({
      id: data?.id,
      items: items,
      docEntry: sapDoc,
      transfer_type: data?.transfer_type,
      business_unit: data?.business_unit,
      transfer_request: data?.id,
      posting_date: data?.posting_date.toString(),
      due_date: data?.due_date.toString(),
      from_warehouse: parseInt(String(data?.from_warehouse[0].id)),
      to_warehouse: parseInt(String(data?.to_warehouse[0].id)),
      line: data?.line,
      shift: data?.shift,
      status: 'completed',
      statusChange: 'received',
      state: 'completed',
      activities_name: 'Receive',
      action: `Close Transfer`,
      transfer_request_id: data?.transfer_id,
      remark: getReason
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
            <View style={styles.model}>
              <View style={{ flexDirection: 'row' }}>
                <Text body1 accentColor>Inventory Transfer </Text>

                {data?.transfer_type == 'PM/RM' && (isProdAdm || isProdUser) ?
                  <Menu style={{ marginLeft: '79%' }}>
                    <MenuTrigger style={[styles.menu, {}]}>
                      <Icon name="ellipsis-v" size={20} />
                    </MenuTrigger>
                    <MenuOptions customStyles={{ optionText: styles.menuText }} optionsContainerStyle={{ marginLeft: 10, marginTop: 10 }}>
                      {/* <MenuOption text="ALL" customStyles={{ optionText: [styles.menuText, { color: '#2292EE' }] }} onSelect={() => setStatus('ALL')} /> */}
                      <MenuOption text="Close Tranfer" customStyles={{ optionText: [styles.menuText, { color: 'red' }] }} onSelect={() => setIsConfirmationVisible(true)} />
                    </MenuOptions>
                  </Menu>
                  : data?.transfer_type == 'FG' && (isWareAdm || isWareUser) ?
                    <Menu style={{ marginLeft: '79%' }}>
                      <MenuTrigger style={[styles.menu, {}]}>
                        <Icon name="ellipsis-v" size={20} />
                      </MenuTrigger>
                      <MenuOptions customStyles={{ optionText: styles.menuText }} optionsContainerStyle={{ marginLeft: 10, marginTop: 10 }}>
                        {/* <MenuOption text="ALL" customStyles={{ optionText: [styles.menuText, { color: '#2292EE' }] }} onSelect={() => setStatus('ALL')} /> */}
                        <MenuOption text="Close Tranfer" customStyles={{ optionText: [styles.menuText, { color: 'red' }] }} onSelect={() => setIsConfirmationVisible(true)} />
                      </MenuOptions>
                    </Menu>
                    : <></>}
                {/* <Icon
                    color={colors.primary}
                    style={{ marginLeft: 'auto' }}
                    size={25}
                    name={"times"}
                    onPress={onClose}
                  /> */}
              </View>
              <View style={styles.divider}></View>
              {state ? (<View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
              </View>) : (
                <>
                  {provide?.length > 0 ?

                    < FlatList
                      data={provide}
                      // refreshControl={
                      //   <RefreshControl
                      //     colors={[colors.primary]}
                      //     tintColor={colors.primary}
                      //     refreshing={refreshing}
                      //     onRefresh={refresh}
                      //   />
                      // }
                      renderItem={({ item, index }) =>
                        <ProvidedView data={item} index={index + 1} transferItem={data} onSuccess={(t) => { t == true ? (onClose(),success(t)) : undefined }} />}
                    />
                    : <Text style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 20, fontSize: 15 }}>No Transfer</Text>}</>
              )}
              {/* {data?.transfer_type == 'PM/RM' && (isProdAdm || isProdUser) ?
                < View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: '3%' }}>
                  <Button style={{ width: '13%', backgroundColor: '#fff', borderColor: 'gray', borderWidth: 1 }} styleText={{ color: '#000', fontSize: 15 }} onPress={onClose}>Cancel</Button>
                  <Button style={{ width: '13%', marginLeft: 20 }} styleText={{ fontSize: 15 }} onPress={() => { }}>Submit</Button>
                </View>
                : data?.transfer_type == 'FG' && (isWareAdm || isWareUser) ?
                  < View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: '3%' }}>
                    <Button style={{ width: '13%', backgroundColor: '#fff', borderColor: 'gray', borderWidth: 1 }} styleText={{ color: '#000', fontSize: 15 }} onPress={onClose}>Cancel</Button>
                    <Button style={{ width: '13%', marginLeft: 20 }} styleText={{ fontSize: 15 }} onPress={() => { }}>Submit</Button>
                  </View> :  */}
              < View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: '3%' }}>
                <Button style={{ width: '13%', backgroundColor: '#fff', borderColor: 'gray', borderWidth: 1 }} styleText={{ color: '#000', fontSize: 15 }} onPress={onClose}>Cancel</Button>
              </View>
              {/* } */}
            </View>

          </View>
        </MenuProvider>
      )}
      {isConfirmationVisible && (
        <ConfirmDialog
          onClose={() => setIsConfirmationVisible(false)}
          isVisible={isConfirmationVisible}
          textChange={(text) => setGetReason(text)}
          onSubmit={onCloseTransfer}
          loading={loading}
        />
      )}
    </Modal>
  );
};

export default ModalInventoryTransfer;