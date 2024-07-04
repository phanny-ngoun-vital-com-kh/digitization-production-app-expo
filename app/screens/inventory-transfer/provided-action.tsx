import React, { useEffect, useState } from 'react';
import { Modal, View, FlatList, TouchableOpacity } from 'react-native';
import { BaseStyle, useTheme } from '../../theme-v2';
import styles from './styles';
import { Text, TextInput, Button } from '../../components/v2';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { useStores } from '../../models';
import { DataTable } from 'react-native-paper';
import { InventoryTransfer } from '../../models/inventory-transfer/inventory-transfer-model';
import { ReceiveStatusChangeModel, TransferModel } from '../../models/inventory-transfer/inventory-transfer-store';
import ConfirmDialog from '../../components/v2/Dialog';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { ProvidedListModel } from '../../models/inventory-transfer-request/inventory-transfer-request-model';
import PushNotificationComponent from '../../utils-v2/push-notification-helper';
import ModalApprove from 'app/components/v2/ModalApprove';
import ModalReject from 'app/components/v2/ModalReject';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    provided: string;
    transferItem: InventoryTransfer,
    provided_status: string,
    onSuccess: (t: boolean) => void;
    main_provided: any,
    transferIndex:number
    //   textChange: (text: string) => void;
    //   onSubmit:()=>void
}

const ProvidedAction: React.FC<ModalProps> = ({ isVisible, onClose, provided, transferItem, provided_status, onSuccess, main_provided,transferIndex }) => {
    const { colors } = useTheme()
    const { inventoryRequestStore, inventoryTransferStore, authStore } = useStores()
    const [item, setItem] = useState(null)
    const [isProdAdm, setIsProdAdm] = useState()
    const [isWareAdm, setIsWareAdm] = useState()
    const [isProdUser, setIsProdUser] = useState()
    const [isWareUser, setIsWareUser] = useState()
    const [state, setState] = useState('')
    const [totalProvidedValues, setTotalProvidedValues] = useState({});
    const [newItem, setNewItem] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isRejectConfirmationVisible, setIsRejectConfirmationVisible] = useState(false);
    const [Fcm, setFcm] = useState([])
    const [isModalApproveVisible, setModalApproveVisible] = useState(false);
    const [isModalRejectVisible, setModalRejectVisible] = useState(false);
    const [getRemarkReject, setGetRemarkReject] = useState('')
    const [getRemarkApprove, setGetRemarkApprove] = useState('')


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
    }, [isVisible == true]);

    useEffect(() => {
        const get = async () => {
            const data = await inventoryRequestStore.getprovided(provided)
            setItem(data)
        }
        get()
    }, [])
    useEffect(() => {
        const calculateAndStoreTotalValues = async () => {
            // console.log(transferItem)
            // Assuming items is an array containing item objects with itemcode and id properties
            for (const items of transferItem.item) {
                const receive = await inventoryRequestStore.getprovideitemforclose(transferItem.id, 'done', items.item_code);
                const val = receive.map(v => parseFloat(v.received));

                let total = 0;
                for (let r = 0; r < val?.length; r++) {
                    total += val[r];
                }

                // Update total provided values in the state
                setTotalProvidedValues(prevState => ({
                    ...prevState,
                    [items.item_code]: total
                }));
            }
        };

        const getToken = async () => {
            const data = (await inventoryRequestStore.getMobileUserList())
            const createdByValues = data
                .filter(item => item.login === main_provided?.createdBy)
                .map(item => item.fcm_token);
            setFcm(createdByValues);
        }
        getToken()

        calculateAndStoreTotalValues();
    }, [isVisible == true]);

    useEffect(() => {
        const updatedItems = item?.map((it: any) => {
            let itemReceive = parseFloat(it.received)
            let is_receive;
            const oldtotal = totalProvidedValues[it.item_code] || 0;
            const subtotal = parseFloat(oldtotal) + parseFloat(it.received);
            const total = subtotal.toString()
            if (parseFloat(it.received) == 0) {
                is_receive = '';
            } else {
                if (parseFloat(oldtotal) + parseFloat(itemReceive) == parseFloat(it.quantity)) {
                    is_receive = 'True';
                } else {
                    is_receive = 'False';
                }
            }
            return { ...it, itemReceive, is_receive, total, oldtotal };
        });
        const allReceived = item?.every((item: any) => {
            const Quantity = parseFloat(item?.quantity);
            const receivedQuantity = parseFloat(String(item?.received)) || 0;
            return ((totalProvidedValues[item.item_code] + receivedQuantity) === Quantity);
        });
        let state
        if (allReceived) {
            state = 'completed';
        } else {
            state = 'pending';
        }
        setNewItem(updatedItems)
        setState(state)
    }, [isVisible == true]);

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

    const onReceive = async () => {
        try {
            const it = TransferModel.create({
                transfer_type: transferItem.transfer_type,
                business_unit: transferItem?.business_unit,
                status: state,
                transfer_request: transferItem.id.toString(),
                transfer_id: transferItem.transfer_id,
                posting_date: transferItem?.posting_date.toString(),
                due_date: transferItem?.due_date.toString(),
                from_warehouse: parseInt(String(transferItem.from_warehouse[0].id).charAt(0)),
                to_warehouse: parseInt(String(transferItem.to_warehouse[0].id).charAt(0)),
                line: transferItem.line,
                shift: transferItem.shift,
                items: newItem
            })
            const da = ReceiveStatusChangeModel.create({
                id: transferItem.id,
                transfer_request: transferItem.id
            })
            const providedstatus = ProvidedListModel.create({
                provided: provided,
                remark: getRemarkApprove,
                status: "done",
                transfer_request: transferItem?.transfer_id,
                activities_name: 'Receive',
                action: `Receive Transfer ${transferIndex}`
            })
            await inventoryTransferStore.addTransfer(it).savetransfer();
            await inventoryTransferStore.addReceiveChange(da).receivestatuschange();
            await inventoryRequestStore.upstatus(providedstatus).updatestatus()
            onSuccess(true)
            // setNotiVisible(true)
            sendNotification('Received', 'Your Transfer has been receive', Fcm)
            setNewItem(null)
            setModalApproveVisible(false)
            setGetRemarkApprove('')
            transferIndex=0
            // onClose()
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'ជោគជ័យ',
                textBody: 'រក្សាទុកបានជោគជ័យ',
                // button: 'close',
                autoClose: 100
            })
        } catch (e) {
            console.log(e)
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'បរាជ័យ',
                textBody: 'បរាជ័យ',
                button: 'បិទ',
            })
        }

    }

    const onReject = async () => {
        try {
            const providedstatus = ProvidedListModel.create({
                provided: provided,
                remark: getRemarkReject,
                status: "cancel",
                transfer_request: transferItem?.transfer_id,
                activities_name: 'Receive',
                action: `Rejected Transfer ${transferIndex}`

            })
            await inventoryRequestStore.upstatus(providedstatus).updatestatus()
            // setRejectNotiVisible(true)
            sendNotification('Rejected', 'Your Transfer has been reject', Fcm)
            onSuccess(true)
            setNewItem(null)
            setModalRejectVisible(false)
            setGetRemarkReject('')
            transferIndex=0
            onClose()
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'ជោគជ័យ',
                textBody: 'រក្សាទុកបានជោគជ័យ',
                // button: 'close',
                autoClose: 100
            })
        } catch (e:any) {
            console.log(e)
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'បរាជ័យ',
                textBody: e,
                button: 'បិទ',
            })
        }

    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalcontainer}>
                <View style={styles.model}>
                    <DataTable style={{ marginTop: '5%' }}>
                        <DataTable.Header >
                            <DataTable.Title style={{ flex: 0.3 }} textStyle={styles.textHeader}>No</DataTable.Title>
                            <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Item Code</DataTable.Title>
                            <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Item Name</DataTable.Title>
                            <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>Quantity</DataTable.Title>
                            <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>Received</DataTable.Title>
                            <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>UoM</DataTable.Title>
                            <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>Vendor</DataTable.Title>
                            <DataTable.Title textStyle={styles.textHeader}>Remark</DataTable.Title>
                        </DataTable.Header>

                        {item?.map((i, index) =>
                            <DataTable.Row style={{}} key={index}>
                                <DataTable.Cell style={{ flex: 0.3 }} textStyle={styles.textHeader}>{index + 1}</DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.8 }} textStyle={styles.textHeader}>{i.item_code}</DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.8 }}><Text style={[styles.textHeader, { marginTop: 10, marginBottom: 10 }]}>{i.item_name}</Text></DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.5 }} textStyle={styles.textHeader}>{i.quantity}</DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.5 }} textStyle={styles.textHeader}>{i.received}</DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.5 }} textStyle={styles.textHeader}>{i.uom}</DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.5 }}><Text style={[styles.textHeader, { marginTop: 10, marginBottom: 10 }]}>{i.supplier == null ? '-' : i.supplier}</Text></DataTable.Cell>
                                <DataTable.Cell ><Text style={[styles.textHeader, { marginTop: 10, marginBottom: 10 }]}>{i.remark == null ? '-' : i.remark}</Text></DataTable.Cell>
                            </DataTable.Row>
                        )}
                    </DataTable>
                    {transferItem?.transfer_type == 'PM/RM' && (isProdAdm || isProdUser) && (provided_status !== "done" && provided_status !== "cancel") ?
                        < View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: '3%' }}>
                            <Button style={{ width: '13%', backgroundColor: '#fff', borderColor: 'gray', borderWidth: 1 }} styleText={{ color: '#000', fontSize: 15 }} onPress={onClose}>Cancel</Button>
                            <Button style={{ width: '13%', marginLeft: 20, backgroundColor: '#fff', borderColor: 'red', borderWidth: 1 }} styleText={{ color: 'red', fontSize: 15 }} onPress={() => setModalRejectVisible(true)}>Reject</Button>
                            <Button style={{ width: '13%', marginLeft: 20 }} styleText={{ fontSize: 15 }} onPress={() => setModalApproveVisible(true)}>Receive</Button>
                        </View>
                        : transferItem?.transfer_type == 'FG' && (isWareAdm || isWareUser) && (provided_status !== "done" && provided_status !== "cancel") ?
                            < View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: '3%' }}>
                                <Button style={{ width: '13%', backgroundColor: '#fff', borderColor: 'gray', borderWidth: 1 }} styleText={{ color: '#000', fontSize: 15 }} onPress={onClose}>Cancel</Button>
                                <Button style={{ width: '13%', marginLeft: 20, backgroundColor: '#fff', borderColor: 'red', borderWidth: 1 }} styleText={{ color: 'red', fontSize: 15 }} onPress={() => setModalRejectVisible(true)}>Reject</Button>
                                <Button style={{ width: '13%', marginLeft: 20 }} styleText={{ fontSize: 15 }} onPress={() => { setModalApproveVisible(true) }}>Receive</Button>
                            </View> :
                            < View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: '3%' }}>
                                <Button style={{ width: '13%', backgroundColor: '#fff', borderColor: 'gray', borderWidth: 1 }} styleText={{ color: '#000', fontSize: 15 }} onPress={onClose}>Cancel</Button>
                            </View>
                    }
                    {/* <View style={styles.butuon_view}>
                        <Button style={styles.button_cancel} styleText={{ color: 'black' }} onPress={onClose}>Cancel</Button>
                    </View> */}
                </View>
            </View>
            {/* {isConfirmationVisible && (
                <ConfirmDialog
                    title="Receive"
                    message="Are you sure ?"
                    buttons={[
                        { text: 'បិទ', onPress: () => setIsConfirmationVisible(false), backgroundColor: 'white', borderWidth: 1, color: 'gray' },
                        { text: 'បាទ', onPress: onReceive, backgroundColor: colors.primary, color: 'white', isLoading: loading }
                    ]}
                />
            )}
            {isRejectConfirmationVisible &&
                <ConfirmDialog
                    title="Reject"
                    message="Are you sure ?"
                    buttons={[
                        { text: 'បិទ', onPress: () => setIsRejectConfirmationVisible(false), backgroundColor: 'white', borderWidth: 1, color: 'gray' },
                        { text: 'បាទ', onPress: onReject, backgroundColor: colors.primary, color: 'white', isLoading: loading }
                    ]}
                />
            } */}
            <ModalApprove
                onClose={() => setModalApproveVisible(false)}
                isVisible={isModalApproveVisible}
                textChange={(text) => setGetRemarkApprove(text)}
                onSubmit={onReceive}
            />
            <ModalReject
                onClose={() => setModalRejectVisible(false)}
                isVisible={isModalRejectVisible}
                textChange={(text) => setGetRemarkReject(text)}
                onSubmit={onReject}
            />
            {/* <PushNotificationComponent
                isVisible={isRejectNotiVisible}
                recipientTokens={Fcm}
                title={'Rejected'}
                body={'Your Transfer has been reject'}
                close={() => (setRejectNotiVisible(false))}
            />
            <PushNotificationComponent
                isVisible={isNotiVisible}
                recipientTokens={Fcm}
                title={'Received'}
                body={'Your Transfer has been receive'}
                close={() => (setNotiVisible(false))}
            /> */}
        </Modal>
    );
};

export default ProvidedAction;