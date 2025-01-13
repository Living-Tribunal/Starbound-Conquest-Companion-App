import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
  StatusBar,
  ToastAndroid
} from "react-native";
import { Colors } from "../../constants/Colors.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import ShowStat from "../../hooks/ShowStat.js";
import { ShipTypeIcons } from "../../constants/ImagePaths.js";
import { ShipAttributes } from "../../constants/ShipAttributes.js";
import { shipDiceMapping } from "../../components/buttons/Dice.js";
import { SpecialOrders} from "../../constants/SpecialOrders.js";

export default function ShipStats() {
  const { showStat, handlePress, showAllStat } = ShowStat();
  const [areAllStatsShows, setAreAllStatsShows] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [selectedShip, setSelectedShip] = useState("Fighter");

  const ShipData = ShipAttributes[selectedShip];

  const selectedShipDice = shipDiceMapping[selectedShip];
  const selectedShipSpecialOrders = SpecialOrders[selectedShip];

  const handleShipSelectionPress = (shipName) => {
    setSelectedShip(shipName);
  };
  /* console.log(selectedShip); */
  return (
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar/>
        <ScrollView nestedScrollEnabled style>
          <View style={styles.image}>
            <View style={{}}>
              <Text style={styles.headerText}>Ship Classes</Text>
              <FlatList
  horizontal
  showsHorizontalScrollIndicator={false}
  data={Object.entries(ShipTypeIcons)}
  renderItem={({ item }) => {
    const isSelected = selectedShip === item[0];
    return (
      <Pressable
        onPress={() => handleShipSelectionPress(item[0])}
        style={{
          borderTopLeftRadius: 20,
          borderBottomRightRadius: 20,
          margin: 5,
          alignItems: "center",
          borderColor: isSelected ? Colors.gold : Colors.blue_gray,
          borderWidth: isSelected?  2:1,
        }}
      >
        <Image
          source={item[1]}
          style={{ width: isSelected?  45:35, height: 45, margin: 5, tintColor: isSelected ? Colors.gold : Colors.misty_blue }}
          resizeMode="contain"
        />
        <Text style={{fontSize: isSelected?  14:12,fontFamily: "monospace", color: isSelected ? Colors.gold : Colors.misty_blue, margin: 5 }}>{item[0]}</Text>
      </Pressable>
    );
  }}
  keyExtractor={(item) => item[0]}
/>

            </View>
            {/* <Text style={styles.headerText}>-Ship Stats-</Text> */}
            <Text style={styles.headerText}>{selectedShip}</Text>
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
              <View
                style={[
                  styles.statButton,
                  { backgroundColor: Colors.blue_gray },
                ]}
              >
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
                  <Text style={{ textAlign: "center", color: Colors.white, fontFamily: "monospace", }}>
                    {ShipData.hp}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ width: "45%" }}>
              <View style={[styles.statButton]}>
                <TouchableOpacity onPress={() => handlePress("toHit")}>
                  <Text style={[styles.statButtonText, {}]}>To Hit</Text>
                </TouchableOpacity>
              </View>
              {showStat.toHit && (
                <View style={{}}>
                  <Text style={{ textAlign: "center", color: Colors.white, fontFamily: "monospace", }}>
                    {ShipData.toHit}
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
                  <Text style={{ textAlign: "center", color: Colors.white, fontFamily: "monospace", }}>
                    {ShipData.soak}
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
                  <Text style={{ textAlign: "center", color: Colors.white, fontFamily: "monospace", }}>
                    {ShipData.moveDistance}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <View style={{ width: "45%" }}>
              <View style={[styles.statButton]}>
                <TouchableOpacity onPress={() => handlePress("weaponRange")}>
                  <Text style={styles.statButtonText}>Weapon Range</Text>
                </TouchableOpacity>
              </View>
              {showStat.weaponRange && (
                <View style={{}}>
                  {Array.isArray(ShipData.weaponRange) ? (
                    ShipData.weaponRange.map((weaponRange, index) => (
                      <Text
                        key={index}
                        style={{ textAlign: "center", color: Colors.white, fontFamily: "monospace", }}
                      >
                        {weaponRange}
                      </Text>
                    ))
                  ) : (
                    // Fallback if firingArc is a single value
                    <Text style={{ textAlign: "center", color: Colors.white, fontFamily: "monospace", }}>
                      {ShipData.weaponRange}
                    </Text>
                  )}
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
                  {Array.isArray(ShipData.firingArc) ? (
                    ShipData.firingArc.map((firingArc, index) => (
                      <Text
                        key={index}
                        style={{ textAlign: "center", color: Colors.white, fontFamily: "monospace", }}
                      >
                        {firingArc}
                      </Text>
                    ))
                  ) : (
                    // Fallback if firingArc is a single value
                    <Text style={{ textAlign: "center", color: Colors.white, fontFamily: "monospace", }}>
                      {ShipData.firingArc}
                    </Text>
                  )}
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
                    {selectedShipDice.map((DiceComponent, index) => (
                      <View key={index} style={{alignSelf: "center", margin: 2, flexDirection: "row", gap: 20}}>
                            {DiceComponent}
                        <View>
                        </View>
                      </View>
                    ))}
                </View>
              )}
            </View>
            <View style={{ width: "45%" }}>
              <View style={[styles.statButton]}>
                <TouchableOpacity onPress={() => handlePress("weaponType")}>
                  <Text style={styles.statButtonText}>Weapon Type</Text>
                </TouchableOpacity>
              </View>
              {showStat.weaponType && (
                <View style={{}}>
                  {Array.isArray(ShipData.weaponType) ? (
                    ShipData.weaponType.map((weapon, index) => (
                      <Text
                        key={index}
                        style={{ textAlign: "center", color: Colors.white, fontFamily: "monospace", }}
                      >
                        {weapon}
                      </Text>
                    ))
                  ) : (
                    // Fallback if weaponType is a single value
                    <Text style={{ textAlign: "center", color: Colors.white, fontFamily: "monospace", }}>
                      {ShipData.weaponType}
                    </Text>
                  )}
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
                  <Text style={{ textAlign: "center", color: Colors.white, fontFamily: "monospace", }}>
                    {ShipData.capacity}
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
                  <Text style={{ textAlign: "center", color: Colors.white,fontFamily: "monospace", }}>
                    {ShipData.pointValue}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <View style={{ width: "95%" }}>
              <View style={[styles.statButton]}>
                <TouchableOpacity onPress={() => handlePress("specialOrders")}>
                  <Text style={styles.statButtonText}>Special Orders</Text>
                </TouchableOpacity>
              </View>
              {showStat.specialOrders && (
                <>
                <View style={{}}>
                  {Array.isArray(ShipData.specialOrders) ? (
                    ShipData.specialOrders.map((orders, index) => (
                        
                        <View key={index}>                        
                            <Text
                        
                        style={{ textAlign: "center", color: Colors.white, marginRight: 5, paddingBottom: 10, fontFamily: "monospace", }}
                      >
                        {orders}
                      </Text>   
                        </View>
                    ))
                  ) : (
                    // Fallback if weaponType is a single value
                    <Text style={{ textAlign: "center", color: Colors.white }}>
                      {ShipData.specialOrders}
                    </Text>
                  )}

                </View>
                </>
                )}
            </View>
          </View>

          {/* <View style={styles.shipTableStatsType}>
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
          </View> */}
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
    paddingBottom: 20
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
  diceItem: {
    alignItems: "center",
  },
  statButton: {
    borderRadius: 5,
    backgroundColor: Colors.blue_gray,
    borderWidth: 2,
    borderColor: Colors.slate,
    marginBottom: 10,
    marginTop: 10,
  },
  statButtonText: {
    justifyContent: "center",
    color: Colors.white,
    fontSize: 13,
    textAlign: "center",
    fontFamily: "monospace",
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
  button:{
    borderRadius: 5,
    borderWidth: 2,
  }
});
