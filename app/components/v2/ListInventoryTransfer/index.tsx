import React, { useState } from "react";
import { TouchableOpacity, View, Text, TouchableOpacityProps, ViewStyle, StyleProp } from "react-native"
import styles from "./styles";
import Button from "../Button";
import { InventoryTransferScreen } from "app/screens/inventory-transfer";
import { InventoryTransfer } from "app/models/inventory-transfer/inventory-transfer-model";
import { DataTable } from "react-native-paper";
import moment from "moment";
import ProgressBar from "react-native-animated-progress";

interface Props extends TouchableOpacityProps {
    data: InventoryTransfer
    style?: StyleProp<ViewStyle>
    onPress: () => void
}
const ListInventoryTransfer = ({ data, style, onPress }: Props) => {

    // Calculate total received and total quantity
    const totalReceived = data.item.reduce((acc, item) => acc + parseFloat(item.total), 0);
    const totalQuantity = data.item.reduce((acc, item) => acc + parseFloat(item.quantity), 0);

    const getWholeAndDecimal = value => {
        const [whole] = String(value).split('.');
        return [Number(whole)];
    }
    const percentageReceived = (getWholeAndDecimal(totalReceived / totalQuantity * 100))

    return (
        <TouchableOpacity onPress={onPress}>
            <DataTable style={{ margin: 5 }}>
                <DataTable.Row key={data.id}>
                <DataTable.Cell style={{ flex: 0.8 }} textStyle={styles.textHeader}>{`PDR-${String(data.transfer_request).padStart(6, '0')}`}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.8 }} textStyle={styles.textHeader}>{`PDT-${String(data.id).padStart(6, '0')}`}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.5 }} textStyle={styles.textHeader}>{data.transfer_type}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.5 }} textStyle={styles.textHeader}>{data.line}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.4 }} textStyle={styles.textHeader}>{data.shift}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.6 }} textStyle={styles.textHeader}>{data.createdBy}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.8 }} textStyle={styles.textHeader}>{moment(data.createdDate).format('YYYY-MM-DD')}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.8, width: '100%' }} textStyle={styles.textHeader}>
                        <View style={{ width: '90%', }}>
                            <ProgressBar
                                progress={percentageReceived[0]}
                                height={3}
                                backgroundColor={percentageReceived[0] == 100 ? 'green' : percentageReceived[0] <= 50 ? '#E69B00' : "#2292EE"}
                                animated={false}
                            />

                            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 14, textAlign: 'center' }}>
                                {percentageReceived}%
                            </Text>
                        </View>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 0.6, width: '100%' }} textStyle={[styles.textHeader,data.status == 'completed' ?{color:'green'}:{color:"#2292EE"}]}>{data.status.charAt(0).toUpperCase() + data.status.slice(1)}</DataTable.Cell>

                </DataTable.Row>
                {/* <View style={{ width: '50%' }}>
                    <ProgressBar
                        progress={percentageReceived[0]}
                        height={7}
                        backgroundColor="#4a0072"
                        animated={false}
                    />
                </View> */}
            </DataTable>
        </TouchableOpacity>
    )
}

export default ListInventoryTransfer