import React, { useState } from "react";
import { TouchableOpacity, View, Text, TouchableOpacityProps, ViewStyle, StyleProp } from "react-native"
import { ProvidedList } from "app/models/inventory-transfer-request/inventory-transfer-request-model";
import { DataTable } from "react-native-paper";
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import MaterialIconsIcons from 'react-native-vector-icons/MaterialIcons';
import ModalViewProvided from "./view-provided-detail";

interface Props extends TouchableOpacityProps {
    data: ProvidedList
    style?: StyleProp<ViewStyle>
    index?: number;
    // onPress: () => void
}
const ProvidedListView = ({ data, index, style }: Props) => {
    const check = <AntDesignIcons name='checksquare' size={30} color={'green'} />;
    const uncheck = <MaterialIconsIcons name='check-box-outline-blank' size={35} color={'gray'} />;
    const cross = <AntDesignIcons name='closesquare' size={30} color={'red'} />;
    const [isModalVisible, setModalVisible] = useState(false)

    return (
        <>
            <TouchableOpacity onPress={() => { setModalVisible(true) }}>
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
            <ModalViewProvided
                onClose={() => setModalVisible(false)}
                isVisible={isModalVisible}
                provided={data.provided != null ? data.provided : ''}
            />
        </>
    )
}

export default ProvidedListView