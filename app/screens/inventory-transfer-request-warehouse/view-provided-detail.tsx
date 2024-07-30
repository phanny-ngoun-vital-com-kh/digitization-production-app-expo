import React, { useEffect, useState } from 'react';
import { Modal, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { BaseStyle, useTheme } from '../../theme-v2';
import styles from './styles';
import { Text, TextInput, Button } from '../../components/v2';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { useStores } from '../../models';
import { DataTable } from 'react-native-paper';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    provided: string
    //   textChange: (text: string) => void;
    //   onSubmit:()=>void
}

const ModalViewProvided: React.FC<ModalProps> = ({ isVisible, onClose, provided }) => {
    const { inventoryRequestStore } = useStores()
    const [item, setItem] = useState(null)
    useEffect(() => {
        const get = async () => {
            const data = await inventoryRequestStore.getprovided(provided)
            setItem(data)
        }
        get()
    }, [])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalcontainer}>
                <View style={styles.model}>
                    <ScrollView>
                        <DataTable style={{ marginTop: '5%' }}>
                            <DataTable.Header >
                                <DataTable.Title style={{ flex: 0.3 }} textStyle={styles.textHeader}>No</DataTable.Title>
                                <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Item Code</DataTable.Title>
                                <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Item Name</DataTable.Title>
                                <DataTable.Title style={{ flex: 0.5, marginLeft: 20 }} textStyle={styles.textHeader}>Quantity</DataTable.Title>
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
                                    <DataTable.Cell style={{ flex: 0.5, marginLeft: 30 }} textStyle={styles.textHeader}>{i.quantity}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 0.5 }} textStyle={styles.textHeader}>{i.received}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 0.5 }} textStyle={styles.textHeader}>{i.uom}</DataTable.Cell>
                                    <DataTable.Cell style={{ flex: 0.5 }}><Text style={[styles.textHeader, { marginTop: 10, marginBottom: 10 }]}>{i.supplier == null ? '-' : i.supplier}</Text></DataTable.Cell>
                                    <DataTable.Cell ><Text style={[styles.textHeader, { marginTop: 10, marginBottom: 10 }]}>{i.remark == null ? '-' : i.remark}</Text></DataTable.Cell>
                                </DataTable.Row>
                            )}
                        </DataTable>
                        <View style={styles.butuon_view}>
                            <Button style={styles.button_cancel} styleText={{ color: 'black' }} onPress={onClose}>Cancel</Button>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default ModalViewProvided;