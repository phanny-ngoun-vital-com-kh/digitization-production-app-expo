import React from "react";
import { View, Text, TouchableOpacityProps, ViewStyle, StyleProp } from "react-native"
import { Activities } from "app/models/inventory-transfer-request/inventory-transfer-request-model";
import { Caption, DataTable } from "react-native-paper";
import moment from "moment";

interface Props extends TouchableOpacityProps {
    data: Activities
    style?: StyleProp<ViewStyle>
    index?: number;
    // onPress: () => void
}
const ActivitiesListView = ({ data, index, style }: Props) => {
    const formatDatewithNumber = (value: moment.Moment) => {
        if (moment(value).fromNow().search('ago') > 0) {
            return moment(value).fromNow().replace('in', '');
        } else {
            return moment(value).fromNow().replace('in', '') + ' from now';
        }
    };
    return (
        <>
            {/* <TouchableOpacity onPress={() => { setModalVisible(true) }}> */}

            <DataTable style={{ margin: 5 }}>
                <DataTable.Row key={data.id}>
                    <View style={{ width: '88%' }}>
                        <View style={{ flexDirection: 'row' }} >
                            <Text style={{ margin: 8, fontSize: 18, }}>{data.activities_name}</Text>
                            <Caption style={{ fontSize: 18, marginTop: 'auto', marginBottom: 'auto', marginLeft: 20 }}>{data.action} by {data.actionBy} {formatDatewithNumber(moment(data.actionDate))}</Caption>
                            <Caption style={{ fontSize: 18, marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: '5%' }}>{moment(data.actionDate).format('YYYY-MM-DD hh:mm:ss A')}</Caption>
                            {/* </DataTable.Cell> */}
                        </View>
                        <View>
                            <Caption style={{ fontSize: 16, margin: 8 }}>{data.remark}</Caption>
                        </View>
                    </View>
                </DataTable.Row>
            </DataTable>

            {/* </TouchableOpacity> */}
        </>
    )
}

export default ActivitiesListView