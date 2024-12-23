import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Colors } from "../../constants/Colors.js";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import D4Dice from "../dice/D4Dice.js";
import D20Dice from "../dice/D20Dice.js";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import ShowStat from "../../hooks/ShowStat.js";
import { ShipTypeIcons } from "../../constants/ImagePaths.js";
import { ShipAttributes } from "../../constants/ShipAttributes.js";

export default function ShipStats() {
  const { showStat, handlePress, showAllStat } = ShowStat();
  const [areAllStatsShows, setAreAllStatsShows] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden backgroundColor="#61dafb" />
        <ScrollView nestedScrollEnabled style>
          <View style={styles.image}>
            <View style={{}}>
            <Text style={styles.headerText}>Ship Classes</Text>
              <FlatList
                style={{}}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={Object.entries(ShipTypeIcons)}
                renderItem={({ item, index }) => (
                    <TouchableOpacity >
                    <View style={{alignItems: "center"}}>
                    <Image
                    source={item[1]}
                    style={{ width: 65, height: 65, margin: 10 }}
                    resizeMode="contain"
                    />
                    <Text style={{color: Colors.white, margin: 10 }}>{item[0]}</Text>
                  </View>
                    
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item[0]}
              />
            </View>
            <Text style={styles.headerText}>Ship Stats</Text>
            <View style={{ width: "50%", alignSelf: "center" }}>
              {areAllStatsShows ? (
                <TouchableOpacity
                  style={[
                    styles.showButton,
                    {
                      backgroundColor: Colors.gold,
                      borderColor: Colors.goldenrod,
                    },
                  ]}
                  onPress={() => {
                    showAllStat(false);
                    setAreAllStatsShows(false);
                  }}
                >
                  <Text style={[styles.showText, { color: Colors.goldenrod }]}>
                    Hide All Stats
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.showButton,
                    { backgroundColor: Colors.blue_gray },
                  ]}
                  onPress={() => {
                    showAllStat(true);
                    setAreAllStatsShows(true);
                  }}
                >
                  <Text style={[styles.showText]}>Show All Stats</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <View style={{ width: "45%" }}>
              <View style={[styles.statButton, {backgroundColor: pressed? Colors.gold : Colors.blue_gray}]}>
              <TouchableOpacity
                onPress={() => {
                    handlePress("hitPoint");
                    setPressed((prev) => !prev);
                }}
                >
                  <Text style={styles.statButtonText}>Hit Point</Text>
                </TouchableOpacity>
              </View>
              {showStat.hitPoint && (
                <View style={{}}>
                  <Text style={{ textAlign: "center", color: Colors.white }}>
                    {ShipAttributes.hp}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ width: "45%" }}>
              <View style={[styles.statButton]}>
                <TouchableOpacity onPress={() => handlePress("toHit")}>
                  <Text style={[styles.statButtonText,{}]}>To Hit</Text>
                </TouchableOpacity>
              </View>
              {showStat.toHit && (
                <View style={{}}>
                  <Text style={{ textAlign: "center", color: Colors.white }}>
                    15
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <View style={{ width: "45%" }}>
              <View style={[styles.statButton]}>
                <TouchableOpacity onPress={() => handlePress("soak")}>
                  <Text style={styles.statButtonText}>Soak</Text>
                </TouchableOpacity>
              </View>
              {showStat.soak && (
                <View style={{}}>
                  <Text style={{ textAlign: "center", color: Colors.white }}>
                    1
                  </Text>
                </View>
              )}
            </View>
            <View style={{ width: "45%" }}>
              <View style={[styles.statButton]}>
                <TouchableOpacity onPress={() => handlePress("moveDistance")}>
                  <Text style={styles.statButtonText}>Move Distance</Text>
                </TouchableOpacity>
              </View>
              {showStat.moveDistance && (
                <View style={{}}>
                  <Text style={{ textAlign: "center", color: Colors.white }}>
                    80ft
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <View style={{ width: "45%" }}>
              <View style={[styles.statButton]}>
                <TouchableOpacity onPress={() => handlePress("weaponType")}>
                  <Text style={styles.statButtonText}>Weapon Type</Text>
                </TouchableOpacity>
              </View>
              {showStat.weaponType && (
                <View style={{}}>
                  <Text style={{ textAlign: "center", color: Colors.white }}>
                    Light Cannon
                  </Text>
                </View>
              )}
            </View>
            <View style={{ width: "45%" }}>
              <View style={[styles.statButton]}>
                <TouchableOpacity onPress={() => handlePress("firingArc")}>
                  <Text style={styles.statButtonText}>Firing Arc</Text>
                </TouchableOpacity>
              </View>
              {showStat.firingArc && (
                <View style={{}}>
                  <Text style={{ textAlign: "center", color: Colors.white }}>
                    Forward (90°)
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <View style={{ width: "45%" }}>
              <View style={[styles.statButton]}>
                <TouchableOpacity onPress={() => handlePress("weaponDamage")}>
                  <Text style={styles.statButtonText}>Weapon Damage</Text>
                </TouchableOpacity>
              </View>
              {showStat.weaponDamage && (
                <View style={{}}>
                  <Text style={{ textAlign: "center", color: Colors.white }}>
                    1d4
                  </Text>
                </View>
              )}
            </View>
            <View style={{ width: "45%" }}>
              <View style={[styles.statButton]}>
                <TouchableOpacity onPress={() => handlePress("weaponRange")}>
                  <Text style={styles.statButtonText}>Weapon Range</Text>
                </TouchableOpacity>
              </View>
              {showStat.weaponRange && (
                <View style={{}}>
                  <Text style={{ textAlign: "center", color: Colors.white }}>
                    30ft
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <View style={{ width: "45%" }}>
              <View style={[styles.statButton]}>
                <TouchableOpacity onPress={() => handlePress("capacity")}>
                  <Text style={styles.statButtonText}>Capacity</Text>
                </TouchableOpacity>
              </View>
              {showStat.capacity && (
                <View style={{}}>
                  <Text style={{ textAlign: "center", color: Colors.white }}>
                    0
                  </Text>
                </View>
              )}
            </View>
            <View style={{ width: "45%" }}>
              <View style={[styles.statButton]}>
                <TouchableOpacity onPress={() => handlePress("pointValue")}>
                  <Text style={styles.statButtonText}>Point Value</Text>
                </TouchableOpacity>
              </View>
              {showStat.pointValue && (
                <View style={{}}>
                  <Text style={{ textAlign: "center", color: Colors.white }}>
                    1
                  </Text>
                </View>
              )}
            </View>
          </View>
          {/* <View style={styles.tableRow}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableHeader}>Special Orders</Text>
            </View>
            <View style={styles.tableCellContainer}>
              <Text style={styles.tableCell}>1 Full Throttle</Text>
              <Text style={styles.tableCell}>2 Combine Fire</Text>
              <Text style={styles.tableCell}>3 Eevasive Maneuvers</Text>
            </View>
          </View> */}
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
              <D4Dice />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
    flex: 1,
  },
  headerText: {
    color: Colors.white,
    fontSize: 28,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "aboreto",
    borderBottomColor: Colors.white,
    borderTopColor: "transparent",
  },
  table: {
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.misty_blue,
    borderTopColor: "transparent",
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
    borderTopColor: "transparent",
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
  },
  diceWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
  },
  diceItem: {
    alignItems: "center",
  },
  statButton: {
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Colors.blue_gray,
    borderWidth: 2,
    borderColor: Colors.slate,
    marginBottom: 10,
    marginTop: 10,
  },
  statButtonText: {
    justifyContent: "center",
    color: Colors.white,
    fontSize: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  showButton: {
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Colors.blue_gray,
    borderWidth: 2,
    borderColor: Colors.slate,
    marginBottom: 10,
    padding: 4,
  },
  showText: {
    color: Colors.white,
    fontSize: 15,
    textAlign: "center",
  },
});
