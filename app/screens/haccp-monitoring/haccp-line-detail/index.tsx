import React, { FC, useLayoutEffect } from "react"
import { observer } from "mobx-react-lite"
import Icon from "react-native-vector-icons/AntDesign"
import { DataTable, ProgressBar } from "react-native-paper"
import { FlatList, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Text } from "app/components/v2"
import styles from "./styles"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface DailyHaccpLineDetailScreenProps extends AppStackScreenProps<"DailyHaccpLineDetail"> {}

export const DailyHaccpLineDetailScreen: FC<DailyHaccpLineDetailScreenProps> = observer(
  function DailyHaccpLineDetailScreen({
    type = "2",
    onClick,
  }: {
    type: "1" | "2"
    onClick: (item: any) => void
  }) {
    const navigation = useNavigation()

    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              navigation.navigate("HaccpLineForm",{line:2})
            }}
          >
            <Icon name="plus" size={25} />
            <Text style={{ fontSize: 14 }}> Add New</Text>
          </TouchableOpacity>
        ),
      })
    }, [navigation])
    const rendertableLine1 = ({ item, index }) => (
      <TouchableOpacity onPress={() => navigation.navigate("HaccpLineForm")}>
        <DataTable style={{ margin: 10, marginTop: 0 }}>
          <DataTable.Row key={1}>
            <DataTable.Cell style={{ flex: 0.4 }}>{index + 1}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.7 }}>7:00</DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.9 }}>
              <Text style={{ marginLeft: 18 }}>250</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 1 }}>
              <Text style={{ marginLeft: 28 }}>122</Text>
            </DataTable.Cell>

            <DataTable.Cell style={{ flex: 0.9 }}>
              <Text style={{ marginLeft: 44 }}>25</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.55 }}>
              <Text style={{ marginLeft: 4 }}>13</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.9 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    backgroundColor: "#0081F8",
                    width: 15,
                    height: 15,
                    borderRadius: 100,
                  }}
                ></View>
                <Text>normal</Text>
              </View>
            </DataTable.Cell>
            <DataTable.Cell style={{ flex: 0.9 }}>Hour VirekBoth</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </TouchableOpacity>
    )

    const rendertableLine4 = ({ item, index }) => {
      return (
        <TouchableOpacity>
          <DataTable style={{ margin: 10, marginTop: 0 }}>
            <DataTable.Row key={1}>
              <DataTable.Cell style={{ flex: 0.25 }}>{index + 1}</DataTable.Cell>
              <DataTable.Cell style={{ flex: 0.5 }}>13:00:00</DataTable.Cell>

              <DataTable.Cell style={{ flex: 0.8 }}>
                <Text style={{ marginLeft: 70 }}>250</Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 0.5 }}>
                <Text style={{ marginLeft: 30 }}>133</Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 0.5 }}>
                <Text style={{ marginLeft: 40 }}>13</Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 0.5 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View
                    style={{
                      backgroundColor: "#FF0000",
                      width: 15,
                      height: 15,
                      borderRadius: 100,
                    }}
                  ></View>
                  <Text>warning</Text>
                </View>
              </DataTable.Cell>
              <DataTable.Cell style={{ flex: 0.5 }}>
                <Text style={{ marginLeft: 20 }}>Vorn</Text>
              </DataTable.Cell>

              <DataTable.Cell style={{ flex: 0.6 }}>
                <Text style={{ marginRight: 0 }}>lorem lorem lorem lorem lorem lorem </Text>
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </TouchableOpacity>
      )
    }
    if (type === "2") {
      return (
        <View style={$root}>
          <View style={$outerContainer}>
            <DataTable style={{ margin: 10, marginTop: 0 }}>
              <DataTable.Header>
                <DataTable.Title style={{ flex: 0.4 }} textStyle={styles.textHeader}>
                  No
                </DataTable.Title>
                <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>
                  Time
                </DataTable.Title>
                <DataTable.Title style={{ flex: 1 }} textStyle={styles.textHeader}>
                  Water Pressure
                </DataTable.Title>
                <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                  Nozzie Rinser
                </DataTable.Title>

                <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>
                  FG
                </DataTable.Title>
                <DataTable.Title style={{ flex: 0.6 }} textStyle={styles.textHeader}>
                  Status
                </DataTable.Title>
                <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>
                  Done by
                </DataTable.Title>
                <DataTable.Title style={{ flex: 0.8 }} textStyle={styles.textHeader}>
                  Instruction
                </DataTable.Title>
              </DataTable.Header>
            </DataTable>

            <FlatList
              data={Array.from({ length: 20 }, (item, index) => index)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={rendertableLine4}
            />
          </View>
        </View>
      )
    }
    return (
      <View style={$root}>
        <View style={$outerContainer}>
          <DataTable style={{ margin: 10, marginTop: 5 }}>
            <DataTable.Header>
              <DataTable.Title style={{ flex: 0.4 }} textStyle={styles.textHeader}>
                No
              </DataTable.Title>
              <DataTable.Title style={{ flex: 0.7 }} textStyle={styles.textHeader}>
                Time
              </DataTable.Title>
              <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                Side Wall
              </DataTable.Title>
              <DataTable.Title style={{ flex: 1 }} textStyle={styles.textHeader}>
                Air Pressure
              </DataTable.Title>

              <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                Temperature
              </DataTable.Title>
              <DataTable.Title style={{ flex: 0.55 }} textStyle={styles.textHeader}>
                FG
              </DataTable.Title>
              <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                Status
              </DataTable.Title>
              <DataTable.Title style={{ flex: 0.9 }} textStyle={styles.textHeader}>
                Done by
              </DataTable.Title>
            </DataTable.Header>
          </DataTable>

          <View>
            <FlatList
              data={Array.from({ length: 20 }, (item, index) => index)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={rendertableLine1}
            />
          </View>
        </View>
      </View>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "white",
}
const $outerContainer: ViewStyle = {
  margin: 15,
  marginTop: 10,
  flex: 1,
  padding: 10,
}
