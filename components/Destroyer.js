import { StyleSheet, Text, View, ScrollView, Image} from "react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Destroyer() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.image}>
            <Image source={require('../assets/icons/destroyer.png')} />
        </View>
        <Text style={styles.header_text}>Ship Stats</Text>
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
              <Text style={styles.tableHeader}>Damage Threshold</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>0</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Threat Level</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>5</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Move Distance</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>14 Hexes</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Turn Req</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>1 Hex</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Weapon Type</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>Lasers</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Damage</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>1D4</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Range</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>0-6 Hexes</Text>
            </View>
          </View>
        </View>
        <View>
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
            <View style={styles.shipTableStatsNumbers}>
                <Text style={styles.tableHeader}>0</Text>
                <Text style={styles.tableHeader}>2</Text>
                <Text style={styles.tableHeader}>3</Text>
                <Text style={styles.tableHeader}>4</Text>
                <Text style={styles.tableHeader}>5</Text>
                <Text style={styles.tableHeader}>7</Text>
                <Text style={styles.tableHeader}>8</Text>
                <Text style={styles.tableHeader}>10</Text>
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
    fontSize: 13,
    textAlign: "left",
    fontFamily: "monospace",
    fontWeight: "bold",
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
    fontSize: 18,
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
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate,
    borderTopColor: 'transparent',
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -10,
    marginTop: -10,
  }
});
