import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Image, ImageStyle, TextStyle, View, useWindowDimensions, FlatList, RefreshControl, TouchableOpacity, ScrollView } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import { useStores } from "../../models"
import { showErrorMessage } from "../../utils-v2"
import ListInventoryTransfer from "../../components/v2/ListInventoryTransfer"
import { InventoryTransfer } from "../../models/inventory-transfer/inventory-transfer-model"
import { DataTable } from "react-native-paper"
import styles from "./styles"
import { BaseStyle, useTheme } from "../../theme-v2"
import { TextInput, Text } from "../../components/v2"
import Icon from "react-native-vector-icons/FontAwesome"
import ModalInventoryTransfer from "../../components/v2/ModalInventoryTransfer"
import RightSlideModal from "../../components/v2/RightSlideModal"
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';


interface InventoryTransferScreenProps extends AppStackScreenProps<"InventoryTransfer"> { }

export const InventoryTransferScreen: FC<InventoryTransferScreenProps> = observer(function InventoryTransferScreen(
) {

  const { inventoryTransferStore, authStore } = useStores()
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing,] = useState(false)
  const [list, setList] = useState<InventoryTransfer[]>([])
  const [finalList, setFinalList] = useState<InventoryTransfer[]>([])
  const [getDisplay, setGetDisplay] = useState<InventoryTransfer[]>([])
  const { colors } = useTheme()
  const [searchRequestId, setSearchRequestId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showRightModal, setShowRightModal] = useState(false)
  const [getEachItem, setGetEachItem] = useState<InventoryTransfer>()
  const [getDetail, setGetDetail] = useState<InventoryTransfer>()
  const [isLoading, setIsLoading] = useState(false);
  const [sapDocEntry, setSapDocEntry] = useState(0)
  const [index, setIndex] = useState(0);
  const [gettotal, setGetTotal] = useState<{ code: string, total: number }>({
    code: '',
    total: 0
  })
  // const [role, setRole] = useState([])

  // useEffect(() => {
  //   const getRole = async () => {
  //     const rs = await authStore.getUserInfo()
  //     // console.log(rs.data.authorities)
  //     setRole(rs.data.authorities)
  //   }
  //   getRole()
  // }, [])

  useEffect(() => {
    const getTransfer = async (showLoading = false) => {
      try {
        showLoading ? setLoading(true) : setRefreshing(true)
        if (index == 0) {
          const data = (await inventoryTransferStore.getTransferList('ALL', ''))
          setList(data.items)
        } else if (index == 1) {
          const data = (await inventoryTransferStore.getInvantoryTransferFinalList('ALL', ''))
          setFinalList(data.items)
        }
      } catch (e) {
        showErrorMessage('ទិន្នន័យមិនអាចទាញយកបាន', e.message)
      } finally {
        showLoading ? setLoading(false) : setRefreshing(false)
      }
    }
    getTransfer()

  }, [index])

  useEffect(() => {
    const getTransfer = async (showLoading = false) => {
      try {
        showLoading ? setLoading(true) : setRefreshing(true)
        if (index == 0) {
          const data = (await inventoryTransferStore.getTransferList('ALL', searchRequestId))
          setList(data.items)
        } else if (index == 1) {
          const data = (await inventoryTransferStore.getInvantoryTransferFinalList('ALL', searchRequestId))
          setFinalList(data.items)
        }
      } catch (e) {
        showErrorMessage('ទិន្នន័យមិនអាចទាញយកបាន', e.message)
      } finally {
        showLoading ? setLoading(false) : setRefreshing(false)
      }
    }
    getTransfer()

  }, [searchRequestId])

  useEffect(() => {

    const getTransfer = async (showLoading = false) => {
      try {
        showLoading ? setLoading(true) : setRefreshing(true)
        const data = (await inventoryTransferStore.gettransfer('ALL'))
        setGetDisplay(data.items)

        // console.log(data.items.map(v => v.item))
      } catch (e) {
        showErrorMessage('ទិន្នន័យមិនអាចទាញយកបាន', e.message)
      } finally {
        showLoading ? setLoading(false) : setRefreshing(false)
      }
    }
    getTransfer()

  }, [])

  const refresh = async (showLoading = false) => {
    try {
      showLoading ? setLoading(true) : setRefreshing(true)
      setSearchRequestId('')
      const top_list = (await inventoryTransferStore.gettransfer('ALL'))
      // console.log(top_list)
      setGetDisplay(top_list.items)
      if (index == 0) {
        const data = (await inventoryTransferStore.getTransferList('ALL', ''))
        setList(data.items)
      } else if (index == 1) {
        const data = (await inventoryTransferStore.getInvantoryTransferFinalList('ALL', ''))
        setFinalList(data.items)
      }
      // console.log(data.items)

    } catch (e) {
      showErrorMessage('ទិន្នន័យមិនអាចទាញយកបាន', e.message)
    } finally {
      showLoading ? setLoading(false) : setRefreshing(false)
    }
  }

  const FirstRoute = () => {

    return (
      <>
        <DataTable style={{ margin: 5 }}>
          <DataTable.Header >
            <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Request ID</DataTable.Title>
            <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>ID</DataTable.Title>
            <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>Type</DataTable.Title>
            <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>Line</DataTable.Title>
            <DataTable.Title style={{ flex: 0.4 }} textStyle={styles.textHeader}>Shift</DataTable.Title>
            <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Created By</DataTable.Title>
            <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Created Date</DataTable.Title>
            <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Progress</DataTable.Title>
            <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Status</DataTable.Title>
          </DataTable.Header>
        </DataTable>
        <FlatList
          data={list}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={refresh}
            />
          }
          renderItem={({ item }) => <ListInventoryTransfer data={item}
            onPress={() => {
              try {
                setIsLoading(true)
                setShowRightModal(true),
                  setGetDetail(item)
              } catch (e) {
                console.log(e)
              } finally {
                setIsLoading(false)
              }

            }}
          />}
        />
      </>
    )
  }
  const SecondRoute = () => {

    return (
      <>
        <DataTable style={{ margin: 5 }}>
          <DataTable.Header >
            <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Request ID</DataTable.Title>
            <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>ID</DataTable.Title>
            <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>Type</DataTable.Title>
            <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>Line</DataTable.Title>
            <DataTable.Title style={{ flex: 0.4 }} textStyle={styles.textHeader}>Shift</DataTable.Title>
            <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Created By</DataTable.Title>
            <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Created Date</DataTable.Title>
            <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Progress</DataTable.Title>
            <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Status</DataTable.Title>
          </DataTable.Header>
        </DataTable>
        <FlatList
          data={finalList}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={refresh}
            />
          }
          renderItem={({ item }) => <ListInventoryTransfer data={item}
            onPress={() => {
              try {
                setIsLoading(true)
                setShowRightModal(true),
                  setGetDetail(item)
              } catch (e) {
                console.log(e)
              } finally {
                setIsLoading(false)
              }

            }}
          />}
        />
      </>
    )
  }

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const layout = useWindowDimensions();

  const [routes] = useState([
    { key: 'first', title: 'Transaction Movement' },
    { key: 'second', title: 'Transaction' },
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
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <View style={{ margin: 5, marginTop: 10, borderWidth: 1, padding: 10, borderColor: '#CDCDCD', borderRadius: 10, flexDirection: 'row' }}>
        <Icon name={'clock-o'} size={25} color="#2292EE" style={{ marginRight: 10, }} />
        <ScrollView horizontal={true}>
          <FlatList
            data={getDisplay}
            numColumns={10}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.displayButton, { borderColor: item.transfer_type === 'FG' ? 'green' : colors.primary }]}
                  onPress={async () => {
                    try {
                      setIsLoading(true)
                      setShowModal(true);
                      setGetEachItem(item);
                      setSapDocEntry(item.sapDocEntry)
                      // const itemcode = item.item.map((it) => it.item_code)
                      // for (let i = 0; i < itemcode?.length; i++) {
                      //   const receive = await inventoryTransferStore.getreceivedata(itemcode[i], item.id)
                      //   const val = receive.map(v => parseFloat(v.received))

                      //   let total = 0
                      //   for (let r = 0; r < val?.length; r++) {
                      //     total += val[r]
                      //   }
                      //   setGetTotal(prevState => ({
                      //     ...prevState,
                      //     [itemcode[i]]: total
                      //   }));
                      // }
                    } catch (error) {
                      console.log(error)
                    } finally {
                      setIsLoading(false)
                    }

                  }}
                >
                  <Text style={styles.textHeader}>{`PDR-${String(item.id).padStart(6, '0')}`}</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </ScrollView>
      </View>
      <View style={{ alignItems: 'center' }}>
        <TextInput
          autoCapitalize="characters"
          style={[BaseStyle.textInput, { margin: 10, width: '98%' }]}
          keyboardType="default"
          placeholder="Search Request ID"
          placeholderTextColor={"gray"}
          autoCorrect={false}
          selectionColor={colors.primary}
          value={searchRequestId}
          onChangeText={(text) => setSearchRequestId(text)}
          icon={<Icon
            color={colors.primary}
            style={{ marginRight: 10 }}
            size={17}
            name={"search"}
          />}
        />
      </View>
      {/* <DataTable style={{ margin: 5 }}>
        <DataTable.Header >
        <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Request ID</DataTable.Title>
          <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>ID</DataTable.Title>
          <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>Type</DataTable.Title>
          <DataTable.Title style={{ flex: 0.5 }} textStyle={styles.textHeader}>Line</DataTable.Title>
          <DataTable.Title style={{ flex: 0.4 }} textStyle={styles.textHeader}>Shift</DataTable.Title>
          <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Created By</DataTable.Title>
          <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Created Date</DataTable.Title>
          <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>Progress</DataTable.Title>
          <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>Status</DataTable.Title>
        </DataTable.Header>
      </DataTable>
      <FlatList
        data={list}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
        renderItem={({ item }) => <ListInventoryTransfer data={item}
          onPress={() => {
            try{
              setIsLoading(true)
              setShowRightModal(true),
              setGetDetail(item)
            }catch (e){
              console.log(e)
            }finally{
              setIsLoading(false)
            }
            
          }}
        />}
      /> */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar} />
      <ModalInventoryTransfer
        onClose={() => {
          setShowModal(false), setGetTotal({
            code: '',
            total: 0
          })
          setGetEachItem(undefined)
        }}
        isVisible={showModal}
        data={getEachItem}
        total={gettotal}
        isLoading={isLoading}
        sapDoc={sapDocEntry}
        success={(t) => { t == true ? refresh() : '' }}
      />
      <RightSlideModal
        onClose={() => setShowRightModal(false)}
        isVisible={showRightModal}
        data={getDetail}
        isLoading={isLoading}
      />
    </View>

  )
})