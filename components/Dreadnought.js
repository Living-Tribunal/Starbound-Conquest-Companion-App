import { StyleSheet, Text, View, ScrollView, Image} from "react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import TD8Dice from "./dice/TD8Dice/";
import TD6Dice from "./dice/TD6Dice/";
import D20Dice from "./dice/D20Dice/";

export default function Dreadnought() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.image}>
            <Image source={require('../assets/icons/frigate.png')} />
        </View>
        <Text style={styles.header_text}>Ship Stats</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Hit Point</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>10</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Damage Threshold</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>10</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Threat Level</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>15</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Move Distance</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>4 Hexes</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Turn Requirement</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>2 Movement Hex</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Weapon Type</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>Plasma Torpedoes</Text>
              <Image source={require('../assets/images/arcs/pt-arc.png')} style={{ height: 50, width: 50, alignSelf: 'flex-end', }} />
              <Text style={styles.tableCell}>Railguns</Text>
              <Image source={require('../assets/images/arcs/rg-arc.png')} style={{ height: 50, width: 50, alignSelf: 'flex-end', }} />
              <Text style={styles.tableCell}>Ion Beams</Text>
              <Image source={require('../assets/images/arcs/lc-arc.png')} style={{ height: 50, width: 50, alignSelf: 'flex-end', }} />

            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Weapon Damage</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>2d8</Text>
              <Text style={styles.tableCell}>2d6</Text>
              <Text style={styles.tableCell}>2d8</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Weapon Range</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>0-10 Hexes</Text>
              <Text style={styles.tableCell}>0-16 Hexes</Text>
              <Text style={styles.tableCell}>0-8 Hexes</Text>
            </View>
          </View>
        </View>
        <View style={styles.shipTableStatsType}>
                <Text style={styles.tableHeader}>Ship Class:</Text>    
            </View>
            <View style={styles.shipTableStats}>
                <Text style={styles.tableHeader}>Fi</Text>
                <Text style={styles.tableHeader}>Fr</Text>
                <Text style={styles.tableHeader}>De</Text>
                <Text style={styles.tableHeader}>Lc</Text>
                <Text style={styles.tableHeader}>Hc</Text>
                <Text style={styles.tableHeader}>Ca</Text>
                <Text style={styles.tableHeader}>Ba</Text>
                <Text style={styles.tableHeader}>Dn</Text>
            </View>
            <View style={styles.shipTableStatsType}>
                <Text style={styles.tableHeader}>Threat Level:</Text>  
            </View>
            <View style={styles.shipTableStatsNumbers}>
                <Text style={styles.tableHeader}>5</Text>
                <Text style={styles.tableHeader}>6</Text>
                <Text style={styles.tableHeader}>7</Text>
                <Text style={styles.tableHeader}>8</Text>
                <Text style={styles.tableHeader}>9</Text>
                <Text style={styles.tableHeader}>10</Text>
                <Text style={styles.tableHeader}>12</Text>
                <Text style={styles.tableHeader}>15</Text>
            </View>
            <View style={styles.shipTableStatsType}>
                <Text style={styles.tableHeader}>Damage Threshold:</Text>    
            </View>
            <View style={styles.shipTableStatsNumbers}>
                <Text style={styles.tableHeader}>2</Text>
                <Text style={styles.tableHeader}>2</Text>
                <Text style={styles.tableHeader}>3</Text>
                <Text style={styles.tableHeader}>4</Text>
                <Text style={styles.tableHeader}>5</Text>
                <Text style={styles.tableHeader}>7</Text>
                <Text style={styles.tableHeader}>8</Text>
                <Text style={styles.tableHeader}>10</Text>
            </View>
        <ScrollView horizontal={true}>
        <View style={styles.diceWrapper}>
            <View style={styles.diceItem}>
                <Text style={styles.tableHeader}>To Hit</Text>
                <D20Dice />
            </View>
            <View style={styles.diceItem}>
                <Text style={styles.tableHeader}>Plasma Torpedoes</Text>
                <TD8Dice />
            </View>
            <View style={styles.diceItem}>
                <Text style={styles.tableHeader}>Railguns</Text>
                <TD6Dice />
            </View>
            <View style={styles.diceItem}>
                <Text style={styles.tableHeader}>Ion Beams</Text>
                <TD8Dice />
            </View>
        </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
    flex: 1,
  },
  header_text: {
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
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableHeader: {
    color: Colors.misty_blue,
    fontSize: 12,
    textAlign: "left",
    fontFamily: "monospace",
    fontWeight: "bold",
    flex: 1,
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
    fontSize: 12,
    textAlign: "right",
    fontFamily: "monospace",
  },
  shipTableStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.blue_gray,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginTop: 10,
    borderTopColor: 'transparent',
    marginHorizontal: 10,
  },
  shipTableStatsNumbers: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
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
    marginBottom: -10,
    marginTop: -10,
  },
  diceWrapper: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
  },
  diceItem: {
    alignItems: 'center',
  },
});
