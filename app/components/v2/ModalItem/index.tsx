import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, FlatList, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from '../Icon';
import { BaseStyle, useTheme } from '../../../theme-v2';
import styles from './styles';
import { Text, TextInput, Button } from '..';
import { Bom, ItemList } from '../../../models/item/item-model';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useStores } from "../../../models"
import { Dropdown } from 'react-native-element-dropdown';

interface ModalProps {
  data: ItemList[];
  tendency: string
  isVisible: boolean;
  onClose: () => void;
  textChange: (text: string) => void;
  onAddPress: (data) => void;
}

const ModalItem: React.FC<ModalProps> = ({ tendency, data, isVisible, onClose, textChange, onAddPress }) => {
  const { colors } = useTheme()
  const {
    inventoryRequestStore
  } = useStores()

  const FirstRoute = () => {
    const [textInputValue, setTextInputValue] = useState('');

    const handleTextChange = (text: string) => {
      setTextInputValue(text);
      textChange(text);
    };

    const handleAddPress = (data) => {
      onAddPress(data);
    };

    return (
      // <KeyboardAvoidingView
      //   behavior={Platform.OS === "ios" ? "padding" : "height"}
      //   style={{ flex: 1 }}
      // >
        <View style={{ flex: 1 }}>
          <View style={{flexDirection:'row',width:'100%'}}>
          <TextInput
            style={[BaseStyle.textInput, { marginTop: 20, marginBottom: 20 }]}
            keyboardType="default"
            autoCorrect={false}
            // value={textInputValue}
            onChangeText={(text) => setTextInputValue(text)}
            icon={<Icon
              color={'#2292EE'}
              // style={{ marginRight: 10 }}
              size={17}
              name={"search"}
            />}
          />
          <TouchableOpacity onPress={()=>textChange(textInputValue)} style={styles.buttonSearch}><Text>Search</Text></TouchableOpacity>
          </View>
          <FlatList
            numColumns={1}
            data={data}
            renderItem={({ item }) =>
              <View style={{}}>
                <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                  <Text body1 accentColor style={{ marginRight: '2%', fontWeight: '500' }}>{item.itemName}</Text>
                  <Text body1 grayColor>{item.itemCode}</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <View style={{ flexDirection: 'row', width: '30%' }}>
                    <Text body1 grayColor>Group: </Text>
                    <Text body1 accentColor>{item.item_group.map(i => i.itemGroupName)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', width: '25%' }}>
                    <Text body1 grayColor>UoM: </Text>
                    <Text body1 accentColor>{item.inventoryUoM}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', width: '20%' }}>
                    <Text body1 grayColor>Business Unit: </Text>
                    <Text body1 accentColor>{item.tendency}</Text>
                  </View>
                  <View style={{ width: '24%' }}>
                    <TouchableOpacity onPress={() => handleAddPress(item)}>
                      <Text body1 style={{ textAlign: 'right', color: '#2292EE' }} >Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.divider}></View>
              </View>
            }
          />
          {/* </View> */}

        </View>
      // </KeyboardAvoidingView>
    );
  }
  const SecondRoute = () => {
    const [bomList, setBomList] = useState<Bom[]>([])
    const [subItem, setSubItem] = useState([])
    const [fatherCode, setFatherCode] = useState('')
    const [bomSearch, setBomSearch] = useState('')
    const [qty, setQty] = useState('')

    useEffect(() => {
      const getBom = async () => {
        const bom = (await inventoryRequestStore.getBomList(bomSearch, tendency))
        setBomList(bom.items)
      }
      getBom()
    }, [bomSearch])

    useEffect(() => {
      const getSub = async () => {
        const list = (await inventoryRequestStore.getListSubBom(fatherCode, tendency))
        setSubItem(list)
      }
      getSub()
    }, [fatherCode])

    const handleAddToSubItemList = () => {
      // Calculate the values
      const calculatedValues = subItem.map(item => ({
        ...item,
        quantity: (item.childItem.reduce((acc, v) => acc + parseFloat(v.quantity), 0)) * parseFloat(qty)
      }));
      // Update the subItem list with the calculated values
      setSubItem(calculatedValues);
      for (let r = 0; r < calculatedValues?.length; r++) {
        onAddPress(calculatedValues[r]);
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#fff', width: '100%', flexDirection: 'row' }} >
          <View style={{ marginTop: 5, marginBottom: 20, width: '69%' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ margin: 5, color: "red", fontSize: 18 }}>*</Text>
              <Text style={{ margin: 5, fontSize: 18 }}>Item</Text>
            </View>
            <Dropdown style={styles.dropdown}
                    data={bomList}
                    labelField="product_name"
                    valueField="product_code"
                    placeholder="Select Bom"
                    // onSelect={setSelected}
                    search
                    value={bomList}
                    onChangeText={(text:any) => setBomSearch(text)}
                    onChange={item => {
                      setFatherCode(item.product_code)
                    }} />
          </View>
          <View style={{ marginTop: 5, marginBottom: 20, width: '29%', marginLeft: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ margin: 5, color: "red", fontSize: 18 }}>*</Text>
              <Text style={{ margin: 5, fontSize: 18 }}>Quantity</Text>
            </View>
            <TextInput
              style={{
                borderColor: '#696969',
                borderRadius: 8,
                borderWidth: 1,
                backgroundColor: '#fff',
                // height: '32%'
              }}
              keyboardType="number-pad"
              autoCorrect={false}
              onChangeText={(e) => setQty(e)}
              placeholder='Please Enter'
              placeholderTextColor={'gray'}
            />
          </View>

        </View>

        {subItem ?
          <View style={{ flex: 1 }}>
            <FlatList
              // numColumns={1}
              data={subItem}
              renderItem={({ item }) =>
                <View style={{}}>
                  <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                    <Text body1 accentColor style={{ marginRight: '2%', fontWeight: '500' }}>{item.itemName}</Text>
                    <Text body1 grayColor>{item.itemCode}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ flexDirection: 'row', width: '30%' }}>
                      <Text body1 grayColor>Group: </Text>
                      <Text body1 accentColor>{item.item_group.map(i => i.itemGroupName)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: '25%' }}>
                      <Text body1 grayColor>UoM: </Text>
                      <Text body1 accentColor>{item.inventoryUoM}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: '20%' }}>
                      <Text body1 grayColor>Business Unit: </Text>
                      <Text body1 accentColor>{item.tendency}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: '20%' }}>
                      <Text body1 grayColor>Qty: </Text>
                      <Text body1 accentColor>{(item.childItem.reduce((acc, v) => acc + parseFloat(v.quantity), 0)) * parseFloat(qty) || 0}</Text>
                    </View>
                  </View>
                  <View style={styles.divider}></View>
                </View>
              }
            />

          </View>
          : <View></View>}
        <View style={{ justifyContent: 'flex-end', width: '20%', marginLeft: 'auto' }}>
          <Button onPress={handleAddToSubItemList}>Add</Button>
        </View>
      </View>
    );
  }
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Select Item' },
    { key: 'second', title: 'BOM' },
  ]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{ backgroundColor: '#ffffff', borderColor: colors.primary, borderBottomWidth: 1 }}
      activeColor={colors.primary}
      inactiveColor='gray'
    />
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.model}>
          {/* <View style={{ flexDirection: 'row' }}> */}
          <Icon
            color={colors.primary}
            style={{ marginLeft: 'auto', marginBottom: 10 }}
            size={25}
            name={"times"}
            onPress={onClose}
          />
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar} />

          {/* </View> */}
        </View>
      </View>
    </Modal>
  );
};

export default ModalItem;