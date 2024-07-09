import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from 'react-native';
import { Avatar, Title, Caption, Paragraph, Drawer, Text, TouchableRipple, Switch } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements'
import { useStores } from "app/models";
import { DrawerActions } from "@react-navigation/native";
import { MobileUserModel } from "app/models/auth/AuthStore";

interface DrawersProps {
    navigation: any; // Adjust the type accordingly
    username: string; // Adjust the type accordingly
}
const Drawers: React.FC<DrawersProps> = ({ navigation, username, ...props }) => {
    const {
        authenticationStore: { logout }, authStore
    } = useStores()

    const createTwoButtonAlert = () =>
        Alert.alert(
            "ចាកចេញ",
            "តើ​អ្នក​ចង់​ចេញមែនទេ?",
            [
                {
                    text: "ទេ",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "បាទ", onPress: async () => {
                        const rs = await authStore.getUserInfo();
                        // const authoritie = rs.data.authorities.map(authority_name => ({ user_id: rs.data.id, authority_name: authority_name }));
                        if (rs.data != undefined) {
                            const data = MobileUserModel.create({
                                user_id: rs.data?.id,
                                login: rs.data?.login,
                                fcm_token: '',
                                // authorities: authoritie
                            })
                            await authStore
                                .saveUser(data)
                                .saveMobileUser()
                                .then()
                                .catch((e) => console.log(e))
                            await logout(),
                                await navigation.dispatch(DrawerActions.closeDrawer)
                        } else {
                            await logout(),
                                await navigation.dispatch(DrawerActions.closeDrawer)
                        }

                        // await logout(),
                        //     await navigation.dispatch(DrawerActions.closeDrawer)
                    }
                }
            ]
        );

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View>
                    <View style={styles.userInfoSection}>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Avatar.Image
                                source={require('../../assets/images/770137_man_512x512.png')} size={50}
                            />
                            <View style={{ marginLeft: 20, flexDirection: 'column' }}>
                                <Title style={[styles.title, {}]} >{username}</Title>
                                {/* {username  && <div>{username.data.username}</div>} */}
                                {/* <Caption style={[styles.caption]}>@{nickname}</Caption>  */}
                            </View>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        marginTop: 20,
                    }}
                />
                <Drawer.Section style={{ marginTop: 10 }}>
                    <Drawer.Item
                        icon={({ color, size }) => (
                            <Icon name="home"
                                color={color}
                                size={size} >
                            </Icon>
                        )}
                        style={{}}
                        label="Home"
                        onPress={() => { { navigation.navigate('Home') } }}>
                    </Drawer.Item>
                    <Drawer.Item
                        icon={({ color, size }) => (
                            <Icon
                                name="settings"
                                color={color}
                                size={size} >
                            </Icon>
                        )}
                        label="Setting"
                        onPress={() => { { } }}>
                    </Drawer.Item>
                </Drawer.Section>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon
                            name="logout"
                            color={color}
                            size={size} >
                        </Icon>
                    )}
                    label="ចាកចេញ"
                    onPress={createTwoButtonAlert}>
                </DrawerItem>
            </Drawer.Section>
        </View>
    )
}
export default Drawers

const styles = StyleSheet.create({
    bottomDrawerSection: {
        // marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    // drawercontent: {
    //     flew: 1,
    // },
    userInfoSection: {
        paddingLeft: 20,
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
})