import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Animated } from "react-native"
import {
    Button,
    Text,
    TextInput,
} from "../../components/v2"
import { AppStackScreenProps } from "../../navigators"
import styles from "./styles"
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BaseStyle } from "../../theme-v2"
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { useStores } from "../../models"
import { InventoryTransferRequest, InventoryTransferRequestModel } from "../../models/inventory-transfer-request/inventory-transfer-request-store"
import moment from 'moment'
import { useTheme } from "../../theme-v2"
import { showErrorMessage } from "../../utils-v2"
import ModalApprove from "../../components/v2/ModalApprove"
import { ActivitiesModel, ItemModel } from "../../models/inventory-transfer-request/inventory-transfer-request-model"
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import ModalReject from "../../components/v2/ModalReject"
import IconFontisto from 'react-native-vector-icons/Fontisto';
import ModalWarehouseApprove from "../../components/v2/ModalWarehouseApprove"
import { useNavigation } from "@react-navigation/native"

interface InventoryTransferRequestWarehouseScreenProps extends AppStackScreenProps<"InventoryTransferRequestWarehouse"> { }

export const InventoryTransferRequestWarehouseScreen: FC<InventoryTransferRequestWarehouseScreenProps> = observer(function InventoryTransferRequestWarehouseScreen(
) {
    const navigation = useNavigation();
    const { colors } = useTheme()
    const { inventoryRequestStore, authStore } = useStores()
    const [state, setState] = useState('in-progress')
    const [refreshing, setRefreshing] = useState(false)
    const [isModalApproveVisible, setModalApproveVisible] = useState(false)
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<InventoryTransferRequest[]>([])
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedStatus, setSeletedStatus] = useState(null)
    const [isModalRejectVisible, setModalRejectVisible] = useState(false);
    const [getRemarkReject, setGetRemarkReject] = useState('')
    const [newItem, setNewItem] = useState([]);
    const [requesterFcm, setRequesterFcm] = useState([])
    const [prodAdmFcm, setProdAdmFcm] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [getRemark, setGetRemark] = useState('')
    const [isNotiVisible, setNotiVisible] = useState(false);
    const [isRejectNotiVisible, setRejectNotiVisible] = useState(false);
    const [type, setType] = useState('')

    useEffect(() => {

        const getTransferRequest = async (showLoading = false) => {
            try {
                showLoading ? setLoading(true) : setRefreshing(true)
                const data = (await inventoryRequestStore.getWarehouseTransferRequestList(state))
                setList(data.items)
            } catch (e) {
                showErrorMessage('ទិន្នន័យមិនអាចទាញយកបាន', e.message)
            } finally {
                showLoading ? setLoading(false) : setRefreshing(false)
            }
        }
        getTransferRequest()

    }, [state])

    const refresh = async (showLoading = false) => {
        try {
            showLoading ? setLoading(true) : setRefreshing(true)
            const data = (await inventoryRequestStore.getWarehouseTransferRequestList(state))
            setList(data.items)

        } catch (e) {
            showErrorMessage('ទិន្នន័យមិនអាចទាញយកបាន', e.message)
        } finally {
            showLoading ? setLoading(false) : setRefreshing(false)
        }
    }

    useEffect(() => {
        const getToken = async () => {
            const data = (await inventoryRequestStore.getMobileUserList())
            const createdByValues = data
                .filter(item => item.login === selectedItem?.createdBy)
                .map(item => item.fcm_token);
            setRequesterFcm(createdByValues);
            const usersWithRole = data.filter(user =>
                user.authorities.some(authority => authority.authority_name === "ROLE_PROD_PRO_ADMIN")
            );
            const fcmTokens = usersWithRole.map(user => user.fcm_token);
            // console.log(fcmTokens)
            setProdAdmFcm(fcmTokens)
        }
        getToken()

    }, [selectedItem])

    // const updateSupplier = (index, supplier) => {
    //     const updatedList = [...selectedItem.item];
    //     updatedList[index].supplier = supplier;
    //     console.log(updatedList)
    //     setNewItem(updatedList);
    // };

    // const updateRemark = (index, remark) => {
    //     const updatedList = [...selectedItem.item];
    //     updatedList[index].remark = remark;
    //     console.log(updatedList)
    //     setNewItem(updatedList);
    // };

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

    const reject = async () => {
        const data = InventoryTransferRequestModel.create({
            id: selectedItem.id,
            remark: getRemarkReject,
            state: "rejected",
            statusChange: "transfer-request-warehouse-reject",
            action: "Rejected",
            activities_name: "Warehouse Approval",
            transfer_request: selectedItem.transfer_id,
            docEntry: selectedItem.sapDocEntry
        })
        const rs = await inventoryRequestStore.approveReq(data).closerequest().then().catch((e) => console.log(e))
        if (rs == 'Success') {
            setModalRejectVisible(false)
            setSelectedItem(null)
            setSeletedStatus(null)
            setGetRemarkReject('')
            refresh()
            setRejectNotiVisible(true)
            sendNotification('Rejected', 'Your transfer request has been rejected', prodAdmFcm)
            sendNotification('Rejected', 'Warehouse rejected your transfer request', requesterFcm)
            // setProdAdmFcm([])
            // setRequesterFcm([])
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'ជោគជ័យ',
                textBody: 'រក្សាទុកបានជោគជ័យ',
                // button: 'close',
                autoClose: 100
            })
        } else {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'បរាជ័យ',
                textBody: "សូមព្យាយាមម្ដងទៀត",
                autoClose: 100,
            })
        }
    }

    const getSap = async () => {
        try {
            setIsLoading(true)
            if (selectedItem.sapDocEntry == null) {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'Error',
                    textBody: `Error`,
                    button: 'Close',
                    // autoClose: 200
                })
                return
            }
            const detail_sap = await inventoryRequestStore.findsaprequest(selectedItem.sapDocEntry)

            if (detail_sap?.transferRequests[0].transferRequestDetails && selectedItem?.item) {
                // Convert the second list to a map for easy lookup
                const detailMap = new Map(selectedItem.item.map(item => [item.item_code, item]));

                for (const sapItem of detail_sap?.transferRequests[0].transferRequestDetails) {
                    const detailItem = detailMap.get(sapItem.itemCode);
                    if (detailItem) {
                        // Compare quantity
                        if (sapItem.quantity !== parseInt(detailItem.quantity)) {
                            Dialog.show({
                                type: ALERT_TYPE.DANGER,
                                title: 'Error',
                                textBody: `Mismatch found for item code ${sapItem.itemCode} in IES ${detailItem.quantity} in SAP ${sapItem.quantity}!`,
                                button: 'Close',
                                // autoClose: 200
                            })
                            return
                        }

                    } else {
                        Dialog.show({
                            type: ALERT_TYPE.DANGER,
                            title: 'Error',
                            textBody: `Item code ${sapItem.itemCode} not found in the sap list!`,
                            button: 'Close',
                            // autoClose: 200
                        })
                    }

                }
                setModalApproveVisible(true)
            } else {
                console.error("One of the lists is undefined or empty.");
            }
        } catch (error: any) {
            console.error('An error occurred:', error);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: error,
                // button: 'close',
                autoClose: 200
            })
        } finally {
            setIsLoading(false); // Reset loading state regardless of success or failure
        }
    }

    const submit = async () => {
        try {
            setIsLoading(true)
            const activities = ActivitiesModel.create({
                action: "Approved",
                activities_name: "Warehouse Approval",
                remark: getRemark,
                transfer_request: selectedItem.transfer_id
            })

            const status = InventoryTransferRequestModel.create({
                id: selectedItem.id,
                remark: getRemark,
                state: "in-progress",
                statusChange: "request-warehouse-approve"
            })

            const approve = await inventoryRequestStore.approveReq(status).approverequest().then().catch((e) => console.log(e))
            if (approve == 'Success') {
                const acti = await inventoryRequestStore.addActivites(activities).addactivities().then().catch((e) => console.log(e))
                if (acti == 'Success') {
                    setModalApproveVisible(false)
                    setSelectedItem(null)
                    setSeletedStatus(null)
                    setNewItem([])
                    // setGetRemarkReject('')
                    refresh()
                    setNotiVisible(true)
                    sendNotification('Accepted', 'Your transfer request has been accept', prodAdmFcm)
                    sendNotification('Accepted', 'Warehouse accepted your transfer request', requesterFcm)
                    // setProdAdmFcm([])
                    // setRequesterFcm([])
                    Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'ជោគជ័យ',
                        textBody: 'រក្សាទុកបានជោគជ័យ',
                        // button: 'close',
                        autoClose: 100
                    })
                } else {
                    Dialog.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'បរាជ័យ',
                        textBody: "សូមព្យាយាមម្ដងទៀត",
                        autoClose: 100,
                    })
                }
            } else {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'បរាជ័យ',
                    textBody: "សូមព្យាយាមម្ដងទៀត",
                    autoClose: 100,
                })
            }


        } catch (e) {
            console.log(e)
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'ជោគជ័យ',
                textBody: 'រក្សាទុកបានជោគជ័យ',
                // button: 'close',
                autoClose: 100
            })
        } finally {
            setIsLoading(false)
        }

    }

    const handleItemPress = (itemId, itemStatus, itemType) => {
        setSelectedItem(list.find((v) => v.id === itemId));
        setSeletedStatus(itemStatus)
        setType(itemType)
    };

    //   useEffect(()=>{
    //     list
    //   },[list])

    return (
        <AlertNotificationRoot>
            <View style={styles.container}>
                <View style={styles.leftPane} >
                    {/* <View style={{flexDirection:'row' }}> */}
                    <MenuProvider>
                        <View style={{ flexDirection: 'row' }}>
                            <Menu>
                                <MenuTrigger style={[styles.menu, { marginTop: 20 }]}><Icon name="filter" size={25} color={state == 'in-progress' ? '#E69B00' : state == 'completed' ? 'green' : state == 'rejected' ? 'red' : '#2292EE'} /></MenuTrigger>
                                <MenuOptions customStyles={{ optionText: styles.menuText }} optionsContainerStyle={{ marginTop: -40, marginLeft: 30 }}>
                                    {/* <MenuOption text="ALL" customStyles={{ optionText: [styles.menuText, { color: '#2292EE' }] }} onSelect={() => setStatus('ALL')} /> */}
                                    <MenuOption text="In Progress" customStyles={{ optionText: [styles.menuText, { color: '#E69B00' }] }} onSelect={() => setState('in-progress')} />
                                    <MenuOption text="Completed" customStyles={{ optionText: [styles.menuText, { color: 'green' }] }} onSelect={() => setState('completed')} />
                                    <MenuOption text="Rejected" customStyles={{ optionText: [styles.menuText, { color: 'red' }] }} onSelect={() => setState('rejected')} />
                                </MenuOptions>
                            </Menu>

                            <TextInput
                                style={[BaseStyle.textInput, { margin: 10, width: '90%' }]}
                                keyboardType="default"
                                autoCorrect={false}
                                icon={<Icon
                                    color={'#2292EE'}
                                    // style={{ marginRight: 10 }}
                                    size={17}
                                    name={"search"}
                                />}
                            />
                        </View>
                        <FlatList
                            data={list}
                            refreshControl={
                                <RefreshControl
                                    colors={[colors.primary]}
                                    tintColor={colors.primary}
                                    refreshing={refreshing}
                                    onRefresh={refresh}
                                />
                            }
                            renderItem={({ item }) => (
                                <View style={{ borderBottomWidth: 0.4, borderColor: '#d3d3d3' }}>
                                    <TouchableOpacity onPress={() => handleItemPress(item.id, item.status, item.transfer_type)} >
                                        <View style={[styles.itemContainer, selectedItem != null ? selectedItem.id === item.id && styles.selectedItemContainer : []]}>
                                            <Icon name={'file-text-o'} size={20} color="gray" style={{ marginRight: 10, marginLeft: 5 }} />
                                            <Text style={[styles.item, selectedItem === item.id, item.state === 'completed' ? { color: 'green' } : item.state === 'rejected' ? { color: 'red' } : item.state === 'in-progress' ? { color: '#E69B00' } : { color: '#000' }]}>
                                                {`PDR-${String(item.id).padStart(6, '0')}`}
                                            </Text>
                                            {item.status == 'request-production-approve' ?
                                                <Icon name={'clock-o'} size={25} color="#2292EE" style={{ marginRight: 10, marginLeft: 'auto' }} />
                                                : <></>}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </MenuProvider>
                </View>
                <View>
                    <ScrollView style={styles.rightPane}>
                        {loading ? (
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator />
                            </View>
                        ) : selectedItem !== null ? (
                            <View key={selectedItem.id}>
                                <View style={{ flexDirection: 'row', width: '88%' }} key={selectedItem.id}>
                                    <DataTable>
                                        <DataTable.Row style={styles.row}>
                                            <DataTable.Cell textStyle={styles.item}>
                                                <Text style={styles.textTitle}>Type: </Text>
                                                <Text style={styles.textBody}>{selectedItem.transfer_type}</Text>
                                            </DataTable.Cell>
                                            <DataTable.Cell textStyle={styles.item}>
                                                <Text style={styles.textTitle}>Line: </Text>
                                                <Text style={styles.textBody}>{selectedItem.line}</Text>
                                            </DataTable.Cell>
                                            <DataTable.Cell textStyle={styles.item}>
                                                <Text style={styles.textTitle}>Shift: </Text>
                                                <Text style={styles.textBody}>{selectedItem.shift}</Text>
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                        <DataTable.Row style={styles.row}>
                                            <DataTable.Cell textStyle={styles.item}>
                                                <Text style={styles.textTitle}>From Warehouse: </Text>
                                                <Text style={styles.textBody}>{selectedItem.from_warehouse.map(w => w.whsCode)}</Text>
                                            </DataTable.Cell>
                                            <DataTable.Cell textStyle={styles.item}>
                                                <Text style={styles.textTitle}>To Warehouse: </Text>
                                                <Text style={styles.textBody}>{selectedItem.to_warehouse.map(w => w.whsCode)}</Text>
                                            </DataTable.Cell>
                                            <DataTable.Cell textStyle={styles.item}>
                                                <Text style={styles.textTitle}>Posting Date: </Text>
                                                <Text style={styles.textBody}>{moment(selectedItem.posting_date).format('YYYY-MM-DD')}</Text>
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                        <DataTable.Row style={styles.row}>
                                            <DataTable.Cell textStyle={styles.item}>
                                                <Text style={styles.textTitle}>Due Date: </Text>
                                                <Text style={styles.textBody}>{moment(selectedItem.due_date).format('YYYY-MM-DD')}</Text>
                                            </DataTable.Cell>
                                            <DataTable.Cell textStyle={styles.item}>
                                                <Text style={styles.textTitle}>Created Date: </Text>
                                                <Text style={styles.textBody}>{moment(selectedItem.createdDate).format('YYYY-MM-DD hh:mm:ss')}</Text>
                                            </DataTable.Cell>
                                            <DataTable.Cell textStyle={styles.item}>
                                                <Text style={styles.textTitle}>Created By: </Text>
                                                <Text style={styles.textBody}>{selectedItem.createdBy}</Text>
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                        <DataTable.Row style={styles.row}>
                                            <DataTable.Cell textStyle={styles.item}>
                                                <Text style={styles.textTitle}>Status: </Text>
                                                <View style={[styles.dot, selectedItem.state === 'completed' ? { backgroundColor: 'green' } : selectedItem.state === 'rejected' ? { backgroundColor: 'red' } : selectedItem.state === 'in-progress' ? { backgroundColor: '#E69B00' } : { backgroundColor: '#000' }]}></View>
                                                <Text style={[styles.textBody, { textTransform: 'capitalize' }]}> {selectedItem.state}</Text>
                                            </DataTable.Cell>

                                            <DataTable.Cell textStyle={styles.item}>
                                                <Text style={styles.textTitle}>Remark: </Text>
                                                <Text style={styles.textBody}>{(selectedItem.remark == null || selectedItem.remark == '') ? '-' : selectedItem.remark}</Text>
                                            </DataTable.Cell>
                                            {selectedItem.sapDocNo ?
                                                <DataTable.Cell textStyle={styles.item}>
                                                    <Text style={styles.textTitle}>Sap Doc No: </Text>
                                                    <Text style={styles.textBody}>{selectedItem.sapDocNo}</Text>
                                                </DataTable.Cell>
                                                : <></>}

                                        </DataTable.Row>
                                    </DataTable>
                                </View>
                                <DataTable style={{ marginTop: '5%' }}>
                                    <DataTable.Header >
                                        <DataTable.Title style={{ flex: 0.3 }} textStyle={styles.textHeader}>No</DataTable.Title>
                                        <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Item Code</DataTable.Title>
                                        <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Item Name</DataTable.Title>
                                        <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>Quantity</DataTable.Title>
                                        <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>UoM</DataTable.Title>
                                        <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>Vendor</DataTable.Title>
                                        <DataTable.Title textStyle={styles.textHeader}>Remark</DataTable.Title>
                                    </DataTable.Header>

                                    {selectedItem.item.map((i, index) =>
                                        <DataTable.Row style={{}} key={index}>
                                            <DataTable.Cell style={{ flex: 0.3 }} textStyle={styles.textHeader}>{index + 1}</DataTable.Cell>
                                            <DataTable.Cell style={{ flex: 0.8 }} textStyle={styles.textHeader}>{i.item_code}</DataTable.Cell>
                                            <DataTable.Cell style={{ flex: 0.8 }}><Text style={[styles.textHeader, { marginTop: 10, marginBottom: 10 }]}>{i.item_name}</Text></DataTable.Cell>
                                            <DataTable.Cell style={{ flex: 0.5 }} textStyle={styles.textHeader}>{i.quantity}</DataTable.Cell>
                                            <DataTable.Cell style={{ flex: 0.5 }} textStyle={styles.textHeader}>{i.uom}</DataTable.Cell>
                                            <DataTable.Cell style={{ flex: 0.5 }}><Text style={[styles.textHeader, { marginTop: 10, marginBottom: 10 }]}>{i.supplier == null || i.supplier == '' ? '-' : i.supplier}</Text></DataTable.Cell>
                                            <DataTable.Cell ><Text style={[styles.textHeader, { marginTop: 10, marginBottom: 10 }]}>{i.remark == '' || i.remark == null ? '-' : i.remark}</Text></DataTable.Cell>
                                        </DataTable.Row>
                                    )}
                                </DataTable>
                            </View>

                        ) : (
                            <View style={{}}>
                                <Text style={{}}>No item seleted</Text>
                            </View>
                        )}
                    </ScrollView>
                    {selectedStatus == 'request-production-approve' ?
                        <>
                            <View style={styles.divider} />
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '82%', marginBottom: 25 }}>

                                <Button style={{ width: '20%', }} onPress={() => { getSap() }} disabled={isLoading}>
                                    {/* Approve */}
                                    {isLoading ? (
                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: 17 }}>Approve</Text><ActivityIndicator color="white" /></View>
                                    ) : (
                                        <Text style={{ color: '#fff' }}>Approve</Text>
                                    )}
                                </Button>
                                <Button style={{ width: '20%', backgroundColor: 'red', marginLeft: 20 }} onPress={() => { setModalRejectVisible(true) }}>Reject</Button>
                            </View>
                            {/* <View style={styles.divider} /> */}
                        </>
                        : selectedStatus == 'request-warehouse-approve' && type == 'PM/RM' ?
                            <>
                                <View style={styles.divider} />
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '82%', marginBottom: 25 }}>

                                    <Button style={{ width: '20%', }} onPress={() => { navigation.navigate('AddTransfer', { id: selectedItem.id }) }}>Transfer</Button>
                                </View>
                                {/* <View style={styles.divider} /> */}
                            </>
                            : <></>

                    }
                </View>
            </View >
            {/* <ModalWarehouseApprove
                onClose={() => setModalApproveVisible(false)}
                isVisible={isModalApproveVisible}
                data={selectedItem != null ? selectedItem.item : []}
                supplierChange={(index, text) => updateSupplier(index, text)}
                onSubmit={submit}
                remarkChange={(index, text) => updateRemark(index, text)}
                tenden={selectedItem != null ? selectedItem.business_unit : ''}
            /> */}
            <ModalApprove
                onClose={() => setModalApproveVisible(false)}
                isVisible={isModalApproveVisible}
                textChange={(text) => setGetRemark(text)}
                onSubmit={submit}
                loading={isLoading}
            />
            <ModalReject
                onClose={() => setModalRejectVisible(false)}
                isVisible={isModalRejectVisible}
                textChange={(text) => setGetRemarkReject(text)}
                onSubmit={reject}
                loading={isLoading}
            />
        </AlertNotificationRoot>
    )
})