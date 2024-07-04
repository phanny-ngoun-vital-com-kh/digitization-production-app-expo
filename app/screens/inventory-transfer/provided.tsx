import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, TouchableOpacityProps, ViewStyle, StyleProp } from "react-native"
import { ProvidedList } from "app/models/inventory-transfer-request/inventory-transfer-request-model";
import { DataTable } from "react-native-paper";
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import MaterialIconsIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from "react-native";
import ProvidedAction from "./provided-action";
import { InventoryTransfer } from "app/models/inventory-transfer/inventory-transfer-model";
import { useStores } from "app/models";
// import ModalViewProvided from "./view-provided-detail";

interface Props extends TouchableOpacityProps {
    data: ProvidedList
    style?: StyleProp<ViewStyle>
    index?: number;
    transferItem: InventoryTransfer
    onSuccess:(t:boolean)=>void
    // onPress: () => void
}
const ProvidedView = ({ data, index, style, transferItem,onSuccess }: Props) => {
    const check = <AntDesignIcons name='checksquare' size={30} color={'green'} />;
    const uncheck = <MaterialIconsIcons name='check-box-outline-blank' size={35} color={'gray'} />;
    const cross = <AntDesignIcons name='closesquare' size={30} color={'red'} />;
    const [isModalVisible, setModalVisible] = useState(false)
    const [transferIndex,setTransferIndex] = useState(0)
    return (
        <>
            <ScrollView>
                <TouchableOpacity onPress={() => { setModalVisible(true),setTransferIndex(index) }}>
                    <View style={{ flexDirection: 'row', width: '88%' }} >
                        <DataTable style={{ margin: 5 }}>
                            <DataTable.Row key={data.id}>
                                {/* <DataTable.Cell> */}
                                {data.status == 'done' ? check : data.status == 'cancel' ? cross : uncheck}
                                {/* <Checkbox style={{ margin: 8 }} disabled value={true} /> */}
                                <Text style={{ margin: 8, fontSize: 18, }}>Transfer {index}</Text>
                                {/* </DataTable.Cell> */}
                            </DataTable.Row>
                        </DataTable>
                    </View>
                </TouchableOpacity>
            </ScrollView>
            <ProvidedAction
                transferItem={transferItem}
                onClose={() => setModalVisible(false)}
                isVisible={isModalVisible}
                provided={data.provided != null ? data.provided : ''}
                provided_status={data.status!= null ? data.status : ''}
                main_provided={data}
                onSuccess={(t)=>{onSuccess(t)}}
                transferIndex={transferIndex}
            />
        </>
    )
}

export default ProvidedView