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
} from "react-native";
import { Colors } from "../../constants/Colors.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import ShowStat from "../../hooks/ShowStat.js";
import { ShipTypeIcons } from "../../constants/ImagePaths.js";
import { ShipAttributes } from "../../constants/ShipAttributes.js";
import { shipDiceMapping } from "../../components/buttons/Dice.js";
import { FactionImages } from "../../constants/FactionImages.js";
import { FONTS } from "../../constants/fonts";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function ShipStats() {
  const { showStat, handlePress, showAllStat } = ShowStat();
  const [areAllStatsShows, setAreAllStatsShows] = useState(false);
  const [pressed, setPressed] = useState(true);
  const [selectedShip, setSelectedShip] = useState("Fighter");
  const [selectedFaction, setSelectedFaction] = useState("Nova Raiders");

  const tabBarHeight = useBottomTabBarHeight();

  const { faction } = useStarBoundContext();

  const ShipData = ShipAttributes[selectedShip];

  const selectedShipDice = shipDiceMapping[selectedShip];
  const factionData = FactionImages[selectedFaction];
  const shipData = factionData ? factionData[selectedShip] : null;

  const classImage = shipData ? shipData.classImage : null;
  const className = shipData ? shipData.className : "Unknown";

  const handleShipSelectionPress = (shipName) => {
    setSelectedShip(shipName);
  };

  useEffect(() => {
    setSelectedFaction(faction);
    console.log(faction);
  }, [faction]);

  const factionRotation = {
    "The Zyrrians": "0deg",
    "Nova Raiders": "90deg",
    "Voidborn Marauders": "90deg",
    "Star Reapers": "0deg",
    "Praxleon Empire": "90deg",
    "Synthon Syndicate": "0deg",
    "The Union": "0deg",
  };

  const factionScale = {
    "The Zyrrians": 2.1,
    "Nova Raiders": 3,
    "Voidborn Marauders": 3,
    "Star Reapers": 2,
    "Praxleon Empire": 2.5,
    "Synthon Syndicate": 2,
    "The Union": 2,
  };

  const rotation = factionRotation[faction] || "180deg";
  const scale = factionScale[faction] || "1";

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar />
      <ScrollView nestedScrollEnabled contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: tabBarHeight,
            }}>
        <Text style={styles.subHeaderText}>
          Tap one of the ship classes, then it's image to show its stats.
        </Text>
        <View style={styles.image}>
          <View style={{}}>
            <Text style={styles.headerText}>-Ship Stats-</Text>
            <Text style={styles.headerText}>{faction}</Text>
            <FlatList
              keyExtractor={(item, index) => item.id || index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={Object.entries(ShipTypeIcons)}
              renderItem={({ item }) => {
                const isSelected = selectedShip === item[0];
                return (
                  <View style={{ marginBottom: -40 }}>
                    <Pressable
                      onPress={() => handleShipSelectionPress(item[0])}
                      style={{
                        width: 200,
                        margin: 5,
                        alignItems: "center",
                        marginBottom: 100,
                      }}
                    >
                      <Image
                        style={{
                          tintColor: isSelected ? Colors.hud : Colors.hudDarker,
                          width: 180,
                          height: 80,
                          position: "absolute",
                        }}
                        source={require("../../assets/images/cathud.png")}
                      />
                      <Text
                        style={{
                          marginTop: 23,
                          fontSize: 13,
                          fontFamily: "monospace",
                          backgroundColor: isSelected
                            ? Colors.hud
                            : Colors.hudDarker,
                          color: isSelected ? Colors.hudDarker : Colors.hud,
                          margin: 5,
                          width: 135,
                          textAlign: "center",
                          fontWeight: "bold",
                          borderWidth: 3,
                          borderColor: isSelected
                            ? Colors.hudDarker
                            : Colors.hud,
                          elevation: 8,
                          fontFamily: "leagueBold",
                        }}
                      >
                        {item[0]}
                      </Text>
                    </Pressable>
                  </View>
                );
              }}
            />
          </View>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={styles.showButton}
              onPress={() => {
                const newShowAllStatsState = !areAllStatsShows; // Toggle the current state
                showAllStat(newShowAllStatsState); // Update the showAllStat hook
                setAreAllStatsShows(newShowAllStatsState); // Update local state
                setPressed(newShowAllStatsState); // Update button text state
              }}
            >
              <Image
                resizeMode={"center"}
                style={[
                  styles.icon,
                  { transform: [{ rotate: rotation }, { scale: scale }] },
                ]}
                source={classImage}
              />
              {/* <Text>{className}</Text>*/}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Hit Point</Text>
              </View>
            </View>
            {showStat.hitPoint && (
              <View style={styles.statTextUnder}>
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.white,
                    fontFamily: "monospace",
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {ShipData.hp}
                </Text>
              </View>
            )}
          </View>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>To Hit</Text>
              </View>
            </View>
            {showStat.toHit && (
              <View style={styles.statTextUnder}>
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.white,
                    fontFamily: "monospace",
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {ShipData.toHit}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Soak</Text>
              </View>
            </View>
            {showStat.soak && (
              <View style={styles.statTextUnder}>
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.white,
                    fontFamily: "monospace",
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {ShipData.soak}
                </Text>
              </View>
            )}
          </View>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Move Distance</Text>
              </View>
            </View>
            {showStat.moveDistance && (
              <View style={styles.statTextUnder}>
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.white,
                    fontFamily: "monospace",
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {ShipData.moveDistance}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Weapon Range</Text>
              </View>
            </View>
            {showStat.weaponRange && (
              <View style={{}}>
                {Array.isArray(ShipData.weaponRange) ? (
                  ShipData.weaponRange.map((weaponRange, index) => (
                    <View key={index} style={styles.statTextUnder}>
                      <Text
                        style={{
                          textAlign: "center",
                          color: Colors.white,
                          fontFamily: "monospace",
                          fontSize: 13,
                          marginTop: 2, // Add margin to space it out from the images
                        }}
                      >
                        {weaponRange}
                      </Text>
                    </View>
                  ))
                ) : (
                  // Fallback if firingArc is a single value
                  <View style={styles.statTextUnder}>
                    <Text
                      style={{
                        textAlign: "center",
                        color: Colors.white,
                        fontFamily: "monospace",
                        fontSize: 13,
                        marginTop: 2,
                      }}
                    >
                      {ShipData.weaponRange}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Firing Arc</Text>
              </View>
            </View>
            {showStat.firingArc && (
              <View style={{}}>
                {Array.isArray(ShipData.firingArc) ? (
                  ShipData.firingArc.map((firingArc, index) => (
                    <View key={index} style={styles.statTextUnder}>
                      <Text
                        style={{
                          textAlign: "center",
                          color: Colors.white,
                          fontFamily: "monospace",
                          fontSize: 13,
                          marginTop: 2,
                        }}
                      >
                        {firingArc}
                      </Text>
                    </View>
                  ))
                ) : (
                  // Fallback if firingArc is a single value
                  <View style={styles.statTextUnder}>
                    <Text
                      style={{
                        textAlign: "center",
                        color: Colors.white,
                        fontFamily: "monospace",
                        fontSize: 13,
                        marginTop: 2,
                      }}
                    >
                      {ShipData.firingArc}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Weapon Damage</Text>
              </View>
            </View>
            {showStat.weaponDamage &&
              selectedShipDice.map((DiceComponent, index) => (
                <View
                  key={index}
                  style={[styles.statTextUnder, { alignItems: "center" }]}
                >
                  {DiceComponent}
                </View>
              ))}
          </View>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Weapon Type</Text>
              </View>
            </View>
            {showStat.weaponType && (
              <View>
                {Array.isArray(ShipData.weaponType) ? (
                  ShipData.weaponType.map((weapon, index) => (
                    <View key={index} style={styles.statTextUnder}>
                      <Text
                        style={{
                          textAlign: "center",
                          color: Colors.white,
                          fontFamily: "monospace",
                          fontSize: 13,
                          marginTop: 2,
                        }}
                      >
                        {weapon}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.statTextUnder}>
                    <Text
                      style={{
                        textAlign: "center",
                        color: Colors.white,
                        fontFamily: "monospace",
                        fontSize: 13,
                        marginTop: 20,
                      }}
                    >
                      {ShipData.weaponType}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Capacity</Text>
              </View>
            </View>
            {showStat.capacity && (
              <View style={styles.statTextUnder}>
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.white,
                    fontFamily: "monospace",
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {ShipData.capacity}
                </Text>
              </View>
            )}
          </View>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Point Value</Text>
              </View>
            </View>
            {showStat.pointValue && (
              <View style={styles.statTextUnder}>
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.white,
                    fontFamily: "monospace",
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {ShipData.pointValue}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ width: "95%" }}>
            <View
              style={[styles.statButton, { marginBottom: 40, marginTop: 40 }]}
            >
              <TouchableOpacity
                style={{ backgroundColor: "transparent", width: "100%" }}
                onPress={() => {
                  handlePress("specialOrders");
                  setPressed((prev) => !prev);
                }}
              >
                <Text
                  style={[
                    styles.statButtonText,
                    {
                      color: Colors.hudDarker,
                      backgroundColor: Colors.hud,
                      width: "50%",
                      left: "13%",
                      borderWidth: 4,
                      borderColor: Colors.hudDarker,
                    },
                  ]}
                >
                  Special Orders
                </Text>
                <Image
                  style={{
                    resizeMode: "contain",
                    position: "absolute",
                    top: -115,
                    right: "25%",
                    transform: [
                      { translateX: 245 },
                      { translateY: 2 },
                      { scale: 0.5 }, // Adjust the value to scale the image
                    ],
                  }}
                  source={require("../../assets/images/hudstat1.png")}
                />
              </TouchableOpacity>
            </View>
            {showStat.specialOrders && (
              <>
                <View style={{}}>
                  {ShipData.specialOrders.map((specialOrders, index) => (
                    <View key={index}>
                      <Text
                        style={{
                          textAlign: "center",
                          color: Colors.white,
                          marginRight: 5,
                          paddingBottom: 10,
                          fontFamily: "monospace",
                        }}
                      >
                        {specialOrders}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
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
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  headerText: {
    color: Colors.white,
    fontSize: 30,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: FONTS.leagueBold,
    borderBottomColor: Colors.white,
    borderTopColor: "transparent",
  },
  shipTypeText: {
    color: Colors.white,
    fontSize: 30,
    marginBottom: 5,
    marginTop: 5,
    textAlign: "center",
    fontFamily: FONTS.leagueRegular,
    borderBottomColor: Colors.white,
    borderTopColor: "transparent",
  },
  image: {
    flex: 1,
  },
  icon: {
    flex: 1,
    aspectRatio: 1,
    transform: [{ scale: 2 }, { rotate: "0deg" }],
    margin: 20,
  },
  statButton: {
    borderRadius: 5,
  },
  statButtonText: {
    color: Colors.hudDarker,
    borderRadius: 5,
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: Colors.hud,
    margin: "3%",
    width: "100%",
    elevation: 8,
  },
  buttonContainer: {
    marginBottom: 15,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  showText: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "monospace",
    marginVertical: "5",
    width: "100%",
    elevation: 8,
  },
  touchButton: {
    position: "relative",
  },
  statButtonImage: {
    resizeMode: "contain",
    position: "absolute",
    top: -34,
    right: -7,
    zIndex: -1,
    tintColor: Colors.statDarke50r,
  },
  statButtonSpecText: {
    justifyContent: "center",
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "monospace",
    bottom: 8,
  },
  statTextUnder: {
    alignSelf: "center",
    top: 25,
    margin: 5,
    backgroundColor: Colors.underTextGray,
    width: "100%",
    borderRadius: 2,
  },
  subHeaderText: {
    fontFamily: "monospace",
    color: Colors.white,
    fontSize: 9,
    marginBottom: 5,
    marginTop: 5,
    textAlign: "center",
    backgroundColor: Colors.underTextGray,
    borderRadius: 5,
    padding: 5,
    margin: 5,
  },
  showButton: { height: 150, justifyContent: "center", marginVertical: 30 },
});
