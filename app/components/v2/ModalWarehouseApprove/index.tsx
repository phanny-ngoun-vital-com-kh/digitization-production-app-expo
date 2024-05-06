import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Icon from '../Icon';
import { BaseStyle, useTheme } from 'app/theme-v2';
import styles from './styles';
import { Text, TextInput, Button } from '..';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { Item } from 'app/models/inventory-transfer-request/inventory-transfer-request-model';
import { DataTable } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown'
import { useStores } from 'app/models';

interface ModalProps {
    data: Item[]
    tenden: string
    isVisible: boolean;
    onClose: () => void;
    supplierChange: (index, text: string) => void;
    remarkChange: (index, text: string) => void;
    onSubmit: () => void
}

const ModalWarehouseApprove: React.FC<ModalProps> = ({ data, isVisible, onClose, onSubmit, supplierChange, remarkChange, tenden }) => {
    // const loading= true
    const {
        inventoryRequestStore
    } = useStores()
    const [isSubmit, setIsSubmit] = useState(true);
    const [received, setReceived] = useState('');
    const [remark, setRemark] = useState('');
    const [suppilerSearch, setSupplierSearch] = useState('')
    const [supplier, setSupplier] = useState([])
    const [selectedSupplier, setSeletedSupplier] = useState('')
    const droptypeRef = useRef<SelectDropdown>(null);

    useEffect(() => {
        const getsupplier = async () => {
            const it = (await inventoryRequestStore.getSupplierList(tenden, suppilerSearch))
            // console.log(it)
            setSupplier(it.items)
        }
        getsupplier()
    }, [tenden, suppilerSearch])

    const handleSupplier = (index, text: string) => {
        setSeletedSupplier(text);
        supplierChange(index, text);
    };


    const handlesetRemarkChange = (index, text: string) => {
        setRemark(text);
        remarkChange(index, text);
    };

    const handleSubmit = () => {
        // if (!received) {
        //     setIsSubmit(false)
        //     return
        // }
        onSubmit()
        setReceived('')
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.model}>
                    <View style={{ flexDirection: 'row' }}>
                        {/* <Text>{data.map(v=>v.item_code)}</Text> */}
                        <IconAntDesign name='exclamationcircle' color={'#E69B00'} size={25} />
                        <Text body1 accentColor style={{ marginLeft: '3%' }}>Approve Form </Text>
                    </View>
                    <ScrollView>
                        <DataTable style={{ marginTop: '2%' }}>
                            <DataTable.Header >
                                <DataTable.Title style={{ flex: 0.4 }} textStyle={styles.textHeader}>No</DataTable.Title>
                                <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Item Code</DataTable.Title>
                                <DataTable.Title style={{ flex: 1.3 }} textStyle={styles.textHeader}>Item Name</DataTable.Title>
                                <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Quantity</DataTable.Title>
                                <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>UoM</DataTable.Title>
                                <DataTable.Title style={{ flex: 1, marginRight: 15 }} textStyle={styles.textHeader}>Vendor</DataTable.Title>
                                <DataTable.Title textStyle={styles.textHeader}>Remark</DataTable.Title>
                            </DataTable.Header>

                            {data.map((i, index) =>
                                <DataTable.Row style={{}} key={index}>
                                    <DataTable.Cell style={{ flex: 0.4 }} textStyle={styles.textHeader}>{index + 1}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 0.8 }} textStyle={styles.textHeader}>{i.item_code}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 1.3 }} textStyle={styles.textHeader}><Text style={styles.textHeader}>{i.item_name}</Text></DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 0.6 }} textStyle={styles.textHeader}>{i.quantity}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 0.5 }} textStyle={styles.textHeader}>{i.uom}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 1, marginRight: 15 }} textStyle={styles.textHeader}>
                                        <SelectDropdown
                                            data={supplier}
                                            ref={droptypeRef}
                                            search={true}
                                            defaultButtonText="Please Select"
                                            onChangeSearchInputText={(text) => setSupplierSearch(text)}
                                            renderSearchInputLeftIcon={() => (
                                                <Icon name="search" />
                                            )}
                                            onSelect={(selectedItem) => {
                                                handleSupplier(index,selectedItem.card_name)
                                            }}
                                            buttonTextAfterSelection={(selectedItem) => {
                                                return selectedItem.card_name
                                            }}
                                            rowTextForSelection={(item) => {
                                                return item.card_name
                                            }}
                                            dropdownIconPosition='right'
                                            renderDropdownIcon={() => (
                                                <Icon
                                                    name="angle-down"
                                                // style={styles.dropdownIconStyle}
                                                />
                                            )}
                                            dropdownStyle={styles.dropdownStyle}
                                            buttonStyle={styles.buttonStyle}
                                            buttonTextStyle={styles.buttonTextStyle}
                                        />
                                    </DataTable.Cell>
                                    <DataTable.Cell style={{}} textStyle={styles.textHeader}>
                                        <TextInput
                                            style={[styles.input, { height: 40, width: '100%' }]}
                                            // value={i.remark}
                                            multiline={true}
                                            placeholder="Please Enter"
                                            placeholderTextColor="gray"
                                            onChangeText={(text) => handlesetRemarkChange(index, text)}
                                        />
                                    </DataTable.Cell>
                                </DataTable.Row>
                            )}
                        </DataTable>
                    </ScrollView>
                    <View style={styles.butuon_view}>
                        <Button style={styles.button_cancel} styleText={{ color: 'black' }} onPress={onClose}>Cancel</Button>
                        <Button style={styles.button} onPress={handleSubmit}>Submit</Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalWarehouseApprove;