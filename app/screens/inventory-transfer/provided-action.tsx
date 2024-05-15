import React, { useEffect, useState } from 'react';
import { Modal, View, FlatList, TouchableOpacity } from 'react-native';
import { BaseStyle, useTheme } from 'app/theme-v2';
import styles from './styles';
import { Text, TextInput, Button } from '../../components/v2';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { useStores } from 'app/models';
import { DataTable } from 'react-native-paper';
import { InventoryTransfer } from 'app/models/inventory-transfer/inventory-transfer-model';
import { ReceiveStatusChangeModel, TransferModel } from 'app/models/inventory-transfer/inventory-transfer-store';
import ConfirmDialog from 'app/components/v2/Dialog';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { ProvidedListModel } from 'app/models/inventory-transfer-request/inventory-transfer-request-model';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    provided: string;
    transferItem: InventoryTransfer,
    provided_status: string,
    onSuccess: (t: boolean) => void;
    //   textChange: (text: string) => void;
    //   onSubmit:()=>void
}

const ProvidedAction: React.FC<ModalProps> = ({ isVisible, onClose, provided, transferItem, provided_status,onSuccess }) => {
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
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const [loading, setLoading] = useState(false)

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
            // Assuming items is an array containing item objects with itemcode and id properties
            for (const items of transferItem.item) {
                const receive = await inventoryRequestStore.getprovideitemforclose(transferItem.id, 'done', items.item_code);
                const val = receive.map(v => parseFloat(v.received));

                let total = 0;
                for (let r = 0; r < val.length; r++) {
                    total += val[r];
                }

                // Update total provided values in the state
                setTotalProvidedValues(prevState => ({
                    ...prevState,
                    [items.item_code]: total
                }));
            }
        };

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
                provided:provided,
                remark:'',
                status:"done"
            })
            await inventoryTransferStore.addTransfer(it).savetransfer();
            await inventoryTransferStore.addReceiveChange(da).receivestatuschange();
            await inventoryRequestStore.upstatus(providedstatus).updatestatus()
            onSuccess(true)
            setNewItem(null)
            setIsConfirmationVisible(false)
            onClose()
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
                            <Button style={{ width: '13%', marginLeft: 20 }} styleText={{ fontSize: 15 }} onPress={() => { }}>Reject</Button>
                            <Button style={{ width: '13%', marginLeft: 20 }} styleText={{ fontSize: 15 }} onPress={() => { }}>Receive</Button>
                        </View>
                        : transferItem?.transfer_type == 'FG' && (isWareAdm || isWareUser) && (provided_status !== "done" && provided_status !== "cancel") ?
                            < View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginTop: '3%' }}>
                                <Button style={{ width: '13%', backgroundColor: '#fff', borderColor: 'gray', borderWidth: 1 }} styleText={{ color: '#000', fontSize: 15 }} onPress={onClose}>Cancel</Button>
                                <Button style={{ width: '13%', marginLeft: 20, backgroundColor: '#fff', borderColor: 'red', borderWidth: 1 }} styleText={{ color: 'red', fontSize: 15 }} onPress={() => { }}>Reject</Button>
                                <Button style={{ width: '13%', marginLeft: 20 }} styleText={{ fontSize: 15 }} onPress={() => { setIsConfirmationVisible(true) }}>Receive</Button>
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
            {isConfirmationVisible && (
                <ConfirmDialog
                    title="Receive"
                    message="Are you sure ?"
                    buttons={[
                        { text: 'បិទ', onPress: () => setIsConfirmationVisible(false), backgroundColor: 'white', borderWidth: 1, color: 'gray' },
                        { text: 'បាទ', onPress: onReceive, backgroundColor: colors.primary, color: 'white', isLoading: loading }
                    ]}
                />
            )}
        </Modal>
    );
};

export default ProvidedAction;