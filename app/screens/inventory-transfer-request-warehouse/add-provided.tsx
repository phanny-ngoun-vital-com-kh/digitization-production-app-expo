import React, { useEffect, useState } from 'react';
import { Modal, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { BaseStyle, useTheme } from 'app/theme-v2';
import styles from './styles';
import { Text, TextInput, Button } from '../../components/v2';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { useStores } from 'app/models';
import { DataTable } from 'react-native-paper';
import { Item } from 'app/models/inventory-transfer-request/inventory-transfer-request-model';
import { Dropdown } from 'react-native-element-dropdown';
import { ProvidedModel } from 'app/models/inventory-transfer-request/inventory-transfer-request-store';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

interface ModalProps {
    data: Item[]
    isVisible: boolean;
    onClose: () => void;
    tenden: string;
    id: number
    // provided: string
    //   textChange: (text: string) => void;
    //   onSubmit:()=>void
}

const ModalAddProvided: React.FC<ModalProps> = ({ isVisible, onClose, data, tenden, id }) => {
    const { inventoryRequestStore, inventoryTransferStore } = useStores()
    const [suppilerSearch, setSupplierSearch] = useState('')
    const [supplier, setSupplier] = useState([])
    const [selectedSupplier, setSeletedSupplier] = useState('')
    const [totalProvidedValues, setTotalProvidedValues] = useState({});
    const [newItem, setNewItem] = useState([])
    const [isSubmit, setIsSubmit] = useState(true)
    const [loading, setLoading] = useState(false)
    const [received, setReceived] = useState(false)

    useEffect(() => {
        const getsupplier = async () => {
            const it = (await inventoryRequestStore.getSupplierList(tenden, suppilerSearch))
            setSupplier(it.items)
        }
        getsupplier()
    }, [tenden, suppilerSearch])

    // const calculateTotalReceived = async (itemcode: string) => {
    //     const receive = await inventoryRequestStore.gettotalprovided(itemcode, id);
    //     const val = receive.map(v => parseFloat(v.received));

    //     let total = 0;
    //     for (let r = 0; r < val.length; r++) {
    //         total += val[r];
    //     }
    //     return total;
    // };

    useEffect(() => {
        setNewItem(data?.map(it => ({
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
    }, [])

    useEffect(() => {
        const calculateAndStoreTotalValues = async () => {
            // Assuming items is an array containing item objects with itemcode and id properties
            for (const item of data) {
                const receive = await inventoryRequestStore.gettotalprovided(item.item_code, id);
                const val = receive.map(v => parseFloat(v.received));

                let total = 0;
                for (let r = 0; r < val.length; r++) {
                    total += val[r];
                }

                // Update total provided values in the state
                setTotalProvidedValues(prevState => ({
                    ...prevState,
                    [item.item_code]: total
                }));
            }
        };

        calculateAndStoreTotalValues();
    }, [isVisible == true]);

    const submit = async () => {
        setLoading(true)
        if (isSubmit == false) {
            setIsSubmit(true)
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'បរាជ័យ',
                textBody: 'ចំនួនមិនត្រឹមត្រូវ',
                button: 'បិទ',
            })
            setIsSubmit(true)
            setNewItem([])
            return
        }
        if (!newItem.length) {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'បរាជ័យ',
                textBody: 'សូមបំពេញចំនួន',
                button: 'បិទ',
            })
            return
        }
        try {
            const data = ProvidedModel.create({
                item: newItem,
                status: '',
                transfer_request_id: id
            })
            await inventoryRequestStore.addProvided(data).saveprovided().then().catch((e) => console.log(e))
            onClose()
            setNewItem([])
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
            <View style={styles.modalcontainer}>
                <View style={styles.model}>
                    {/* <Text>{data.map(v=>v.item_code)}</Text> */}
                    <ScrollView>
                        <DataTable style={{ marginTop: '5%' }}>
                            <DataTable.Header >
                                <DataTable.Title style={{ flex: 0.3 }} textStyle={styles.textHeader}>No</DataTable.Title>
                                <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Item Code</DataTable.Title>
                                <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Item Name</DataTable.Title>
                                <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Quantity</DataTable.Title>
                                <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Provided</DataTable.Title>
                                <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>UoM</DataTable.Title>
                                <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>Provide</DataTable.Title>
                                <DataTable.Title style={{ flex: 1 }} textStyle={styles.textHeader}>Vendor</DataTable.Title>
                                <DataTable.Title textStyle={styles.textHeader}>Remark</DataTable.Title>
                            </DataTable.Header>

                            {data?.map((i, index) =>
                                <DataTable.Row style={{}} key={index}>
                                    <DataTable.Cell style={{ flex: 0.3 }} textStyle={styles.textHeader}>{index + 1}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 0.8 }} textStyle={styles.textHeader}>{i.item_code}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 0.8 }}><Text style={[styles.textHeader, { marginTop: 10, marginBottom: 10 }]}>{i.item_name}</Text></DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 0.6 }} textStyle={styles.textHeader}>{i.quantity}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 0.6 }} textStyle={styles.textHeader}>{totalProvidedValues[i.item_code]}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 0.6 }} textStyle={styles.textHeader}>{i.uom}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                                        <TextInput
                                            style={[styles.input, { height: 40, width: '100%' }]}
                                            // value={i.remark}
                                            keyboardType='numeric'
                                            multiline={true}
                                            placeholder="Please Enter"
                                            placeholderTextColor="gray"
                                            onChangeText={t => {
                                                if (parseInt(t) == 0) {
                                                    const update_item = [...data]
                                                    update_item[index].is_receive = ' '
                                                    update_item[index].received = (parseInt(t) ?? 0).toString()
                                                    update_item[index].itemReceive = parseInt(t)
                                                    update_item[index].total = (totalProvidedValues[i.item_code] + parseInt(t)).toString()
                                                    setNewItem(update_item)
                                                } else {
                                                    if (totalProvidedValues[i.item_code] + parseInt(t) == i.quantity) {
                                                        const update_item = [...data]
                                                        update_item[index].is_receive = 'True'
                                                        update_item[index].received = (parseInt(t) ?? 0).toString()
                                                        update_item[index].itemReceive = parseInt(t)
                                                        update_item[index].total = (totalProvidedValues[i.item_code] + parseInt(t)).toString()
                                                        setNewItem(update_item)
                                                        console.log(update_item)
                                                    } else if (totalProvidedValues[i.item_code] + parseInt(t) > i.quantity) {
                                                        setIsSubmit(false)
                                                    }
                                                    else if (totalProvidedValues[i.item_code] + parseInt(t) < i.quantity) {
                                                        const update_item = [...data]
                                                        update_item[index].is_receive = 'False'
                                                        update_item[index].received = (parseInt(t) ?? 0).toString()
                                                        update_item[index].itemReceive = parseInt(t)
                                                        update_item[index].total = (totalProvidedValues[i.item_code] + parseInt(t)).toString()
                                                        setNewItem(update_item)
                                                    }
                                                }
                                            }
                                            }
                                        />
                                    </DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 1, margin: 8 }}>
                                        <Dropdown style={styles.dropdown}
                                            data={supplier}
                                            labelField="card_name"
                                            valueField="card_name"
                                            placeholder="Select"
                                            // onSelect={setSelected}
                                            search
                                            value={supplier}
                                            onChangeText={(text) => setSupplierSearch(text)}
                                            onChange={item => {
                                                setSeletedSupplier(item.card_name)
                                                const update_item = [...data]
                                                update_item[index].supplier = item.card_name
                                                setNewItem(update_item)
                                                // setSearchWarehouse('')
                                                // console.log(item)
                                                // console.log(item.title)

                                                // setSelected(item.title);
                                            }} />
                                    </DataTable.Cell>
                                    <DataTable.Cell >
                                        <TextInput
                                            style={[styles.input, { height: 40, width: '100%' }]}
                                            // value={i.remark}
                                            multiline={true}
                                            placeholder="Please Enter"
                                            placeholderTextColor="gray"
                                            onChangeText={(text) => {
                                                const update_item = [...data]
                                                update_item[index].remark = text
                                                setNewItem(update_item)
                                            }}
                                        />
                                    </DataTable.Cell>
                                </DataTable.Row>
                            )}
                        </DataTable>
                    </ScrollView>
                    <View style={styles.butuon_view}>
                        <Button style={[styles.button_cancel, { marginRight: 10 }]} styleText={{ color: 'black' }} onPress={onClose}>Cancel</Button>
                        <Button style={styles.button} onPress={() => { submit() }}>Submit</Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalAddProvided;