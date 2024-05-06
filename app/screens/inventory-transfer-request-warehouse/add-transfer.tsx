import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, FlatList, RefreshControl, TouchableOpacity, ScrollView } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { useStores } from "app/models"
import { showErrorMessage } from "app/utils-v2"
import ListInventoryTransfer from "app/components/v2/ListInventoryTransfer"
import { InventoryTransfer } from "app/models/inventory-transfer/inventory-transfer-model"
import { DataTable } from "react-native-paper"
import styles from "./styles"
import { BaseStyle, useTheme } from "app/theme-v2"
import { TextInput, Text } from "app/components/v2"
import Icon from "react-native-vector-icons/FontAwesome"
import ModalInventoryTransfer from "app/components/v2/ModalInventoryTransfer"
import RightSlideModal from "app/components/v2/RightSlideModal"
// import styles from "./styles"

interface AddTransferScreenProps extends AppStackScreenProps<"AddTransfer"> { }

export const AddTransferScreen: FC<AddTransferScreenProps> = observer(function AddTransferScreen(
) {
    const { colors } = useTheme()
    const { inventoryRequestStore } = useStores()
    const act = [
        { id: '1', name: 'Info' },
        { id: '2', name: 'Transfer' },
        { id: '3', name: 'Activities' },
    ]

    useEffect(()=>{
        const get = async()=>{
            const data = (await inventoryRequestStore.getdetail(4155))
            console.log(data)
        }
        get()
    },[])
    return (
        <View style={styles.container}>
            <View style={styles.leftPane} >
                <FlatList
                    data={act}
                    //   refreshControl={
                    //     <RefreshControl
                    //       colors={[colors.primary]}
                    //       tintColor={colors.primary}
                    //       refreshing={refreshing}
                    //       onRefresh={refresh}
                    //     />
                    //   }
                    renderItem={({ item }) => (
                        <View style={{ borderBottomWidth: 0.4, borderColor: '#d3d3d3' }}>
                            <TouchableOpacity onPress={() => { }} >
                                <View style={styles.itemContainer}>
                                    {/* <Icon name={'file-text-o'} size={20} color="gray" style={{ marginRight: 10, marginLeft: 5 }} /> */}
                                    <Text style={[styles.item,]}>
                                        {item.name}
                                    </Text>
                                    {/* {item.status == 'transfer-request' ?
                        <Icon name={'clock-o'} size={25} color="#2292EE" style={{ marginRight: 10, marginLeft: 'auto' }} />
                        : <></>} */}
                                </View>
                            </TouchableOpacity>

                        </View>
                    )}
                />
            </View>
        </View>
    )
})