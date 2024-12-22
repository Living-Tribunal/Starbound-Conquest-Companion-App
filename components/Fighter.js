import { StyleSheet, Text, View, ScrollView, Image} from "react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import D4Dice from "./dice/D4Dice.js";
import D20Dice from "./dice/D20Dice.js";
import { StatusBar } from 'expo-status-bar';

export default function Fighters() {
  return (
    <SafeAreaView style={styles.container}>
    <StatusBar hidden />
      <ScrollView>
        <View style={styles.image}>
            <Image source={require('../assets/icons/rookie_64.png')} style={{ height: 100, width: 100}} />
        </View>
        <Text style={styles.headerText}>Fighter Stats</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Hit Point</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>1</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>To Hit</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>15</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Soak</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>1</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Move Distance</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>80ft</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Capacity</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>0</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Special Orders</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>1 Full Throttle</Text>
              <Text style={styles.tableCell}>2 Combine Fire</Text>
              <Text style={styles.tableCell}>3 Eevasive Maneuvers</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Weapon Type</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>Light Cannon</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Firing Arc</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>Forward (90°)</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Weapon Damage</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>1d4</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Weapon Range</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>30ft</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Point Value</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>1</Text>
            </View>
          </View>
        </View>
            <View style={styles.shipTableStatsType}>
                <Text style={styles.tableHeader}>Ship Class:</Text>    
            </View>
            <View style={styles.shipTableStats}>
                <Text style={styles.tableHeader}>Fi</Text>
                <Text style={styles.tableHeader}>De</Text>
                <Text style={styles.tableHeader}>Cr</Text>
                <Text style={styles.tableHeader}>Ca</Text>
                <Text style={styles.tableHeader}>Dn</Text>
            </View>
            <View style={styles.shipTableStatsType}>
                <Text style={styles.tableHeaderValues}>To Hit:</Text>  
            </View>
            <View style={styles.shipTableStatsNumbers}>
                <Text style={styles.tableHeaderValues}>15</Text>
                <Text style={styles.tableHeaderValues}>10</Text>
                <Text style={styles.tableHeaderValues}>8</Text>
                <Text style={styles.tableHeaderValues}>6</Text>
                <Text style={styles.tableHeaderValues}>4</Text>
            </View>
            <View style={styles.shipTableStatsType}>
                <Text style={styles.tableHeaderValues}>Soak:</Text>    
            </View>
            <View style={styles.shipTableStatsNumbers}>
                <Text style={styles.tableHeaderValues}>1</Text>
                <Text style={styles.tableHeaderValues}>4</Text>
                <Text style={styles.tableHeaderValues}>6</Text>
                <Text style={styles.tableHeaderValues}>7</Text>
                <Text style={styles.tableHeaderValues}>8</Text>
            </View>
            <View style={styles.diceWrapper}>
                <View style={styles.diceItem}>
                <Text style={styles.tableHeaderValues}>To Hit</Text>
                <D20Dice />
                </View>
                <View style={styles.diceItem}>
                <Text style={styles.tableHeaderValues}>Laser Cannon</Text>
                <D4Dice/>
                </View>
            </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
    flex: 1,
    paddingTop: 10
  },
  headerText: {
    color: Colors.white,
    fontSize: 28,
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
    fontFamily: "aboreto",
    borderWidth: 1,
    borderBottomColor: Colors.white,
    borderTopColor: 'transparent',
  },
  table: {
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.misty_blue,
    borderTopColor: 'transparent',
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: Colors.misty_blue,
  },
  tableHeaderContainer: {
    flex: 1,
    backgroundColor: Colors.blue_gray,
    justifyContent: "center",
  },
  tableHeader: {
    color: Colors.dark_gray,
    fontSize: 13,
    fontFamily: "monospace",
    fontWeight: "bold",
    textAlign: "left",
    padding: 5,
  },
  tableHeaderValues: {
    color: Colors.slate,
    fontSize: 13,
    fontFamily: "monospace",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCellContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableCell: {
    color: Colors.white,
    fontSize: 10,
    textAlign: "left",
    fontFamily: "monospace",
  },
  shipTableStats: {
    flexDirection: "row",
    backgroundColor: Colors.blue_gray,
    marginTop: 5,
    borderTopColor: 'transparent',
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 10,
  },
  shipTableStatsNumbers: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: Colors.dark_gray,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginTop: 2,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.slate,
  },
  shipTableStatsType: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.dark_gray,
    marginTop: 2,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  diceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
  },
  diceItem: {
    alignItems: 'center',
  },
});
