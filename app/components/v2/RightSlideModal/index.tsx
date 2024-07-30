import React, { useEffect, useRef } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Animated, FlatList, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { Text } from '..';
import { InventoryTransfer } from '../../../models/inventory-transfer/inventory-transfer-model';
import moment from 'moment';
import { DataTable } from 'react-native-paper';
import { useTheme } from '../../../theme-v2';
import Icon from '../Icon';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    data?: InventoryTransfer
    isLoading: boolean
}

const RightSlideModal: React.FC<ModalProps> = ({ data, isVisible, onClose, isLoading }) => {
    const slideAnimation = useRef(new Animated.Value(0)).current;
    const { colors } = useTheme()
    useEffect(() => {
        if (isVisible) {
            slideIn();
        } else {
            slideOut();
        }
    }, [isVisible]);

    const slideIn = () => {
        Animated.timing(slideAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const slideOut = () => {
        Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            onClose(); // Close the modal after the slide-out animation completes
        });
    };

    const slideFromRight = slideAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <TouchableOpacity
                    activeOpacity={1}
                    // onPress={onClose}
                    style={styles.overlay}
                >
                    <Animated.View style={[styles.container, { transform: [{ translateX: slideFromRight }] }]}>
                        {/* <View style={styles.modal}> */}
                        <View style={{flexDirection:'row'}}>
                        <Text style={{ fontSize: 17 }}>Inventory Transfer Detail</Text>
                        <Icon
                            color={colors.primary}
                            style={{ marginLeft: 'auto', marginBottom: 10 }}
                            size={25}
                            name={"times"}
                            onPress={onClose}
                        />
                        </View>
                        <View style={styles.divider}></View>

                        {/* <View>
                        <Text>Type: </Text>
                    </View> */}
                        {data ?
                            <View>
                                <View style={styles.view_main}>
                                    <View style={styles.view_sub}>
                                        <Text style={styles.text_main}>Type: </Text>
                                        <Text style={styles.text_sub}>{data.transfer_type}</Text>
                                    </View>
                                    <View style={styles.view_sub}>
                                        <Text style={styles.text_main}>From Warehouse: </Text>
                                        <Text style={styles.text_sub}>{data.from_warehouse.map(v => v.whsCode)}</Text>
                                    </View>
                                    <View style={styles.view_sub}>
                                        <Text style={styles.text_main}>To Warehouse: </Text>
                                        <Text style={styles.text_sub}>{data.to_warehouse.map(v => v.whsCode)}</Text>
                                    </View>
                                </View>
                                <View style={styles.view_main}>
                                    <View style={styles.view_sub}>
                                        <Text style={styles.text_main}>Posting Date: </Text>
                                        <Text style={styles.text_sub}>{moment(data.posting_date).format('YYYY-MM-DD')}</Text>
                                    </View>
                                    <View style={styles.view_sub}>
                                        <Text style={styles.text_main}>Due Date: </Text>
                                        <Text style={styles.text_sub}>{moment(data.due_date).format('YYYY-MM-DD')}</Text>
                                    </View>
                                    <View style={styles.view_sub}>
                                        <Text style={styles.text_main}>Remark: </Text>
                                        <Text style={styles.text_sub}>{data.remark ? data.remark : '-'}</Text>
                                    </View>
                                </View>
                                <View style={[styles.view_main, { marginBottom: '2%' }]}>
                                    <View style={styles.view_sub}>
                                        <Text style={styles.text_main}>Created By: </Text>
                                        <Text style={styles.text_sub}>{data.createdBy}</Text>
                                    </View>
                                    <View style={styles.view_sub}>
                                        <Text style={styles.text_main}>Create Date: </Text>
                                        <Text style={styles.text_sub}>{moment(data.createdDate).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                    </View>
                                    <View style={styles.view_sub}>
                                        {/* <Text style={styles.text_main}> </Text>
                                    <Text style={styles.text_sub}> </Text> */}
                                    </View>
                                </View>
                                <View style={styles.divider}></View>
                                <DataTable style={{}}>
                                    <DataTable.Header >
                                        <DataTable.Title style={{ flex: 0.4 }} textStyle={styles.textHeader}>No</DataTable.Title>
                                        <DataTable.Title style={{ flex: 1 }} textStyle={styles.textHeader}>Item Code</DataTable.Title>
                                        <DataTable.Title style={{ flex: 1 }} textStyle={styles.textHeader}>Item Name</DataTable.Title>
                                        <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Quantity</DataTable.Title>
                                        <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>Received</DataTable.Title>
                                        <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Total</DataTable.Title>
                                        <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>UoM</DataTable.Title>
                                        <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Vendor</DataTable.Title>
                                        <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Remark</DataTable.Title>
                                    </DataTable.Header>
                                </DataTable>
                                {/* <View style={{ flex: 1 }}> */}
                                <FlatList
                                    data={data.item}
                                    renderItem={({ item, index }) =>
                                        <View style={{ flex: 1 }}>
                                            <DataTable style={{}}>
                                                <DataTable.Row key={data.id}>
                                                    <DataTable.Cell style={{ flex: 0.4 }}>{index + 1}</DataTable.Cell>
                                                    <DataTable.Cell style={{ flex: 1 }} textStyle={styles.textHeader}>{item.item_code}</DataTable.Cell>
                                                    <DataTable.Cell style={{ flex: 1 }} textStyle={styles.textHeader}><Text style={styles.textHeader}>{item.item_name}</Text></DataTable.Cell>
                                                    <DataTable.Cell style={{ flex: 0.6 }} textStyle={styles.textHeader}>{item.quantity}</DataTable.Cell>
                                                    <DataTable.Cell style={{ flex: 0.7 }} textStyle={styles.textHeader}>{item.received}</DataTable.Cell>
                                                    <DataTable.Cell style={{ flex: 0.6 }} textStyle={styles.textHeader}>{item.total}</DataTable.Cell>
                                                    <DataTable.Cell style={{ flex: 0.6 }} textStyle={styles.textHeader}>{item.uom}</DataTable.Cell>
                                                    <DataTable.Cell style={{ flex: 0.8 }} textStyle={styles.textHeader}><Text style={styles.textHeader}>{item.supplier ? item.supplier : '-'}</Text></DataTable.Cell>
                                                    <DataTable.Cell style={{ flex: 0.8 }} textStyle={styles.textHeader}>{item.remark ? item.remark : '-'}</DataTable.Cell>

                                                </DataTable.Row>
                                            </DataTable>
                                        </View>
                                    }
                                />
                                {/* </View> */}
                            </View>
                            : ''}
                        {/* </View> */}
                    </Animated.View>
                </TouchableOpacity>
            )}
        </Modal>
    );

};

export default RightSlideModal;
