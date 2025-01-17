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
  ToastAndroid,
} from "react-native";
import { Colors } from "../../constants/Colors.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import ShowStat from "../../hooks/ShowStat.js";
import { ShipTypeIcons } from "../../constants/ImagePaths.js";
import { ShipAttributes } from "../../constants/ShipAttributes.js";
import { shipDiceMapping } from "../../components/buttons/Dice.js";
import { SpecialOrders } from "../../constants/SpecialOrders.js";
import { FONTS } from "../../constants/fonts";

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

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar />
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
                      borderWidth: isSelected ? 2 : 1,
                    }}
                  >
                    <Image
                      source={item[1]}
                      style={{
                        width: isSelected ? 45 : 35,
                        height: 45,
                        margin: 5,
                        tintColor: isSelected ? Colors.gold : Colors.misty_blue,
                      }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        fontSize: isSelected ? 14 : 12,
                        fontFamily: "monospace",
                        color: isSelected ? Colors.gold : Colors.misty_blue,
                        margin: 5,
                      }}
                    >
                      {item[0]}
                    </Text>
                  </Pressable>
                );
              }}
              keyExtractor={(item) => item[0]}
            />
          </View>
          <Text style={styles.headerText}>-Ship Stats-</Text>
          <Text style={styles.shipTypeText}>{selectedShip}</Text>
          <View style={{ width: "50%", alignSelf: "center", marginBottom: 10 }}>
            <TouchableOpacity
              style={[
                styles.showButton,
                {
                  marginVertical: 40,
                },
              ]}
              onPress={() => {
                const newShowAllStatsState = !areAllStatsShows; // Toggle the current state
                showAllStat(newShowAllStatsState); // Update the showAllStat hook
                setAreAllStatsShows(newShowAllStatsState); // Update local state
                setPressed(newShowAllStatsState); // Update button text state
              }}
            >
              <View
                style={{
                  backgroundColor: areAllStatsShows
                    ? Colors.lightened_deep_red
                    : Colors.green_toggle,
                }}
              >
                <Text
                  style={[
                    styles.showText,
                    {
                      color: areAllStatsShows
                        ? Colors.lightened_deep_red
                        : Colors.green_toggle,
                      backgroundColor: areAllStatsShows
                        ? Colors.deep_red
                        : Colors.darker_green_toggle,
                    },
                  ]}
                >
                  {areAllStatsShows ? "Hide All Stats" : "Show All Stats"}
                </Text>
              </View>

              <Image
                style={{
                  resizeMode: "contain",
                  position: "absolute",
                  right: "25%",
                  tintColor: areAllStatsShows
                    ? Colors.lightened_deep_red
                    : Colors.green_toggle,
                  transform: [
                    { translateX: 220 },
                    { translateY: -100 },
                    { scale: 0.5 },
                    { scaleY: 0.8 }, // Adjust the value to scale the image
                  ],
                }}
                source={require("../../assets/images/showallstats.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <TouchableOpacity
                style={styles.touchButton}
                onPress={() => {
                  handlePress("hitPoint");
                  setPressed((prev) => !prev);
                }}
              >
                <View
                  style={{ width: "100%", backgroundColor: Colors.hudDarker }}
                >
                  <Text style={styles.statButtonText}>Hit Point</Text>
                </View>

                <Image
                  style={styles.statButtonImage}
                  source={require("../../assets/images/stathud.png")}
                />
              </TouchableOpacity>
            </View>
            {showStat.hitPoint && (
              <View style={styles.statTextUnder}>
                <Image
                  style={{
                    transform: [
                      { translateX: 0 },
                      { translateY: 30 },
                      { scale: 0.6 }, // Adjust the value to scale the image
                    ],
                  }}
                  source={require("../../assets/images/top.png")}
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.white,
                    fontFamily: "monospace",
                    fontSize: 13,
                    // Add margin to space it out from the images
                  }}
                >
                  {ShipData.hp}
                </Text>
                <Image
                  style={{
                    transform: [
                      { translateX: 0 },
                      { translateY: -30 },
                      { scale: 0.6 }, // Adjust the value to scale the image
                    ],
                  }}
                  source={require("../../assets/images/bottom.png")}
                />
              </View>
            )}
          </View>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <TouchableOpacity
                style={styles.touchButton}
                onPress={() => handlePress("toHit")}
              >
                <View
                  style={{ width: "100%", backgroundColor: Colors.hudDarker }}
                >
                  <Text style={styles.statButtonText}>To Hit</Text>
                </View>
                <Image
                  style={styles.statButtonImage}
                  source={require("../../assets/images/stathud.png")}
                />
              </TouchableOpacity>
            </View>
            {showStat.toHit && (
              <View style={styles.statTextUnder}>
                <Image
                  style={{
                    transform: [
                      { translateX: 0 },
                      { translateY: 30 },
                      { scale: 0.6 }, // Adjust the value to scale the image
                    ],
                  }}
                  source={require("../../assets/images/top.png")}
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.white,
                    fontFamily: "monospace",
                    fontSize: 13,
                    // Add margin to space it out from the images
                  }}
                >
                  {ShipData.toHit}
                </Text>
                <Image
                  style={{
                    transform: [
                      { translateX: 0 },
                      { translateY: -30 },
                      { scale: 0.6 }, // Adjust the value to scale the image
                    ],
                  }}
                  source={require("../../assets/images/bottom.png")}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <TouchableOpacity
                style={styles.touchButton}
                onPress={() => handlePress("soak")}
              >
                <View
                  style={{ width: "100%", backgroundColor: Colors.hudDarker }}
                >
                  <Text style={styles.statButtonText}>Soak</Text>
                </View>
                <Image
                  style={styles.statButtonImage}
                  source={require("../../assets/images/stathud.png")}
                />
              </TouchableOpacity>
            </View>
            {showStat.soak && (
              <View style={styles.statTextUnder}>
                <Image
                  style={{
                    transform: [
                      { translateX: 0 },
                      { translateY: 30 },
                      { scale: 0.6 }, // Adjust the value to scale the image
                    ],
                  }}
                  source={require("../../assets/images/top.png")}
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.white,
                    fontFamily: "monospace",
                    fontSize: 13,
                    // Add margin to space it out from the images
                  }}
                >
                  {ShipData.soak}
                </Text>
                <Image
                  style={{
                    transform: [
                      { translateX: 0 },
                      { translateY: -30 },
                      { scale: 0.6 }, // Adjust the value to scale the image
                    ],
                  }}
                  source={require("../../assets/images/bottom.png")}
                />
              </View>
            )}
          </View>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <TouchableOpacity
                style={styles.touchButton}
                onPress={() => handlePress("moveDistance")}
              >
                <View
                  style={{ width: "100%", backgroundColor: Colors.hudDarker }}
                >
                  <Text style={styles.statButtonText}>Move Distance</Text>
                </View>
                <Image
                  style={styles.statButtonImage}
                  source={require("../../assets/images/stathud.png")}
                />
              </TouchableOpacity>
            </View>
            {showStat.moveDistance && (
              <View style={styles.statTextUnder}>
                <Image
                  style={{
                    transform: [
                      { translateX: 0 },
                      { translateY: 30 },
                      { scale: 0.6 }, // Adjust the value to scale the image
                    ],
                  }}
                  source={require("../../assets/images/top.png")}
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.white,
                    fontFamily: "monospace",
                    fontSize: 13,
                    // Add margin to space it out from the images
                  }}
                >
                  {ShipData.moveDistance}
                </Text>
                <Image
                  style={{
                    transform: [
                      { translateX: 0 },
                      { translateY: -30 },
                      { scale: 0.6 }, // Adjust the value to scale the image
                    ],
                  }}
                  source={require("../../assets/images/bottom.png")}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <TouchableOpacity
                style={styles.touchButton}
                onPress={() => handlePress("weaponRange")}
              >
                <View
                  style={{ width: "100%", backgroundColor: Colors.hudDarker }}
                >
                  <Text style={styles.statButtonText}>Weapon Range</Text>
                </View>
                <Image
                  style={styles.statButtonImage}
                  source={require("../../assets/images/stathud.png")}
                />
              </TouchableOpacity>
            </View>
            {showStat.weaponRange && (
              <View style={{}}>
                {Array.isArray(ShipData.weaponRange) ? (
                  ShipData.weaponRange.map((weaponRange, index) => (
                    <View style={styles.statTextUnder}>
                      <Image
                        style={{
                          transform: [
                            { translateX: 0 },
                            { translateY: 30 },
                            { scale: 0.6 }, // Adjust the value to scale the image
                          ],
                        }}
                        source={require("../../assets/images/top.png")}
                      />
                      <Text
                        style={{
                          textAlign: "center",
                          color: Colors.white,
                          fontFamily: "monospace",
                          fontSize: 13,
                          marginHorizontal: 10, // Add margin to space it out from the images
                        }}
                      >
                        {weaponRange}
                      </Text>
                      <Image
                        style={{
                          transform: [
                            { translateX: 0 },
                            { translateY: -30 },
                            { scale: 0.6 }, // Adjust the value to scale the image
                          ],
                        }}
                        source={require("../../assets/images/bottom.png")}
                      />
                    </View>
                  ))
                ) : (
                  // Fallback if firingArc is a single value
                  <View style={styles.statTextUnder}>
                    <Image
                      style={{
                        transform: [
                          { translateX: 0 },
                          { translateY: 30 },
                          { scale: 0.6 }, // Adjust the value to scale the image
                        ],
                      }}
                      source={require("../../assets/images/top.png")}
                    />
                    <Text
                      style={{
                        textAlign: "center",
                        color: Colors.white,
                        fontFamily: "monospace",
                        fontSize: 13,
                        // Add margin to space it out from the images
                      }}
                    >
                      {ShipData.weaponRange}
                    </Text>
                    <Image
                      style={{
                        transform: [
                          { translateX: 0 },
                          { translateY: -30 },
                          { scale: 0.6 }, // Adjust the value to scale the image
                        ],
                      }}
                      source={require("../../assets/images/bottom.png")}
                    />
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <TouchableOpacity
                style={styles.touchButton}
                onPress={() => handlePress("firingArc")}
              >
                <View
                  style={{ width: "100%", backgroundColor: Colors.hudDarker }}
                >
                  <Text style={styles.statButtonText}>Firing Arc</Text>
                </View>
                <Image
                  style={styles.statButtonImage}
                  source={require("../../assets/images/stathud.png")}
                />
              </TouchableOpacity>
            </View>
            {showStat.firingArc && (
              <View style={{}}>
                {Array.isArray(ShipData.firingArc) ? (
                  ShipData.firingArc.map((firingArc, index) => (
                    <View style={styles.statTextUnder}>
                      <Image
                        style={{
                          transform: [
                            { translateX: 0 },
                            { translateY: 20 },
                            { scale: 0.6 }, // Adjust the value to scale the image
                          ],
                        }}
                        source={require("../../assets/images/top.png")}
                      />
                      <Text
                        style={{
                          textAlign: "center",
                          color: Colors.white,
                          fontFamily: "monospace",
                          fontSize: 13,
                          // Add margin to space it out from the images
                        }}
                      >
                        {firingArc}
                      </Text>
                      <Image
                        style={{
                          transform: [
                            { translateX: 0 },
                            { translateY: -20 },
                            { scale: 0.6 }, // Adjust the value to scale the image
                          ],
                        }}
                        source={require("../../assets/images/bottom.png")}
                      />
                    </View>
                  ))
                ) : (
                  // Fallback if firingArc is a single value
                  <View style={styles.statTextUnder}>
                    <Image
                      style={{
                        transform: [
                          { translateX: 0 },
                          { translateY: 30 },
                          { scale: 0.6 }, // Adjust the value to scale the image
                        ],
                      }}
                      source={require("../../assets/images/top.png")}
                    />
                    <Text
                      style={{
                        textAlign: "center",
                        color: Colors.white,
                        fontFamily: "monospace",
                        fontSize: 13,
                        // Add margin to space it out from the images
                      }}
                    >
                      {ShipData.firingArc}
                    </Text>
                    <Image
                      style={{
                        transform: [
                          { translateX: 0 },
                          { translateY: -30 },
                          { scale: 0.6 }, // Adjust the value to scale the image
                        ],
                      }}
                      source={require("../../assets/images/bottom.png")}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <TouchableOpacity
                style={styles.touchButton}
                onPress={() => handlePress("weaponDamage")}
              >
                <View
                  style={{ width: "100%", backgroundColor: Colors.hudDarker }}
                >
                  <Text style={styles.statButtonText}>Weapon Damage</Text>
                </View>
                <Image
                  style={styles.statButtonImage}
                  source={require("../../assets/images/stathud.png")}
                />
              </TouchableOpacity>
            </View>
            {showStat.weaponDamage && (
              <View style={{}}>
                {selectedShipDice.map((DiceComponent, index) => (
                  <View style={styles.statTextUnder}>
                    <Image
                      style={{
                        transform: [
                          { translateX: 0 },
                          { translateY: 30 },
                          { scale: 0.6 }, // Adjust the value to scale the image
                        ],
                      }}
                      source={require("../../assets/images/top.png")}
                    />
                    <View
                      style={{
                      }}
                    >
                      {DiceComponent}
                    </View>
                    <Image
                      style={{
                        transform: [
                          { translateX: 0 },
                          { translateY: -30 },
                          { scale: 0.6 }, // Adjust the value to scale the image
                        ],
                      }}
                      source={require("../../assets/images/bottom.png")}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <TouchableOpacity
                style={styles.touchButton}
                onPress={() => handlePress("weaponType")}
              >
                <View
                  style={{ width: "100%", backgroundColor: Colors.hudDarker }}
                >
                  <Text style={styles.statButtonText}>Weapon Type</Text>
                </View>
                <Image
                  style={styles.statButtonImage}
                  source={require("../../assets/images/stathud.png")}
                />
              </TouchableOpacity>
            </View>
            {showStat.weaponType && (
              <View>
                {Array.isArray(ShipData.weaponType) ? (
                  ShipData.weaponType.map((weapon, index) => (
                    <View style={styles.statTextUnder}>
                      <Image
                        style={{
                          transform: [
                            { translateX: 0 },
                            { translateY: 30 },
                            { scale: 0.6 }, // Adjust the value to scale the image
                          ],
                        }}
                        source={require("../../assets/images/top.png")}
                      />
                      <Text
                        style={{
                          textAlign: "center",
                          color: Colors.white,
                          fontFamily: "monospace",
                          fontSize: 13,
                          // Add margin to space it out from the images
                        }}
                      >
                        {weapon}
                      </Text>
                      <Image
                        style={{
                          transform: [
                            { translateX: 0 },
                            { translateY: -30 },
                            { scale: 0.6 }, // Adjust the value to scale the image
                          ],
                        }}
                        source={require("../../assets/images/bottom.png")}
                      />
                    </View>
                  ))
                ) : (
                  // Fallback if weaponType is a single value
                  <View style={styles.statTextUnder}>
                    <Image
                      style={{
                        transform: [
                          { translateX: 0 },
                          { translateY: 0 },
                          { scale: 0.6 }, // Adjust the value to scale the image
                        ],
                      }}
                      source={require("../../assets/images/top.png")}
                    />
                    <Text
                      style={{
                        textAlign: "center",
                        color: Colors.white,
                        fontFamily: "monospace",
                        fontSize: 13,
                        // Add margin to space it out from the images
                      }}
                    >
                      {ShipData.weaponType}
                    </Text>
                    <Image
                      style={{
                        transform: [
                          { translateX: 0 },
                          { translateY: 0 },
                          { scale: 0.6 }, // Adjust the value to scale the image
                        ],
                      }}
                      source={require("../../assets/images/bottom.png")}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <TouchableOpacity
                style={styles.touchButton}
                onPress={() => handlePress("capacity")}
              >
                <View
                  style={{ width: "100%", backgroundColor: Colors.hudDarker }}
                >
                  <Text style={styles.statButtonText}>Capacity</Text>
                </View>
                <Image
                  style={styles.statButtonImage}
                  source={require("../../assets/images/stathud.png")}
                />
              </TouchableOpacity>
            </View>
            {showStat.capacity && (
                <View style={styles.statTextUnder}>
                  <Image
                    style={{
                      transform: [
                        { translateX: 0 },
                        { translateY: 30 },
                        { scale: 0.6 }, // Adjust the value to scale the image
                      ],
                    }}
                    source={require("../../assets/images/top.png")}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      color: Colors.white,
                      fontFamily: "monospace",
                      fontSize: 13,
                      // Add margin to space it out from the images
                    }}
                  >
                    {ShipData.capacity}
                  </Text>
                  <Image
                    style={{
                      transform: [
                        { translateX: 0 },
                        { translateY: -30 },
                        { scale: 0.6 }, // Adjust the value to scale the image
                      ],
                    }}
                    source={require("../../assets/images/bottom.png")}
                  />
                </View>
            )}
          </View>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <TouchableOpacity
                style={styles.touchButton}
                onPress={() => handlePress("pointValue")}
              >
                <View
                  style={{ width: "100%", backgroundColor: Colors.hudDarker }}
                >
                  <Text style={styles.statButtonText}>Point Value</Text>
                </View>
                <Image
                  style={styles.statButtonImage}
                  source={require("../../assets/images/stathud.png")}
                />
              </TouchableOpacity>
            </View>
            {showStat.pointValue && (
              <View style={styles.statTextUnder}>
                <View style={styles.statTextUnder}>
                  <Image
                    style={{
                      transform: [
                        { translateX: 0 },
                        { translateY: 30 },
                        { scale: 0.6 }, // Adjust the value to scale the image
                      ],
                    }}
                    source={require("../../assets/images/top.png")}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      color: Colors.white,
                      fontFamily: "monospace",
                      fontSize: 13,
                      // Add margin to space it out from the images
                    }}
                  >
                    {ShipData.pointValue}
                  </Text>
                  <Image
                    style={{
                      transform: [
                        { translateX: 0 },
                        { translateY: -30 },
                        { scale: 0.6 }, // Adjust the value to scale the image
                      ],
                    }}
                    source={require("../../assets/images/bottom.png")}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={{ width: "95%" }}>
            <View style={[styles.statButton, { marginBottom: 40, marginTop: 10 }]}>
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
                  {Array.isArray(ShipData.specialOrders) ? (
                    ShipData.specialOrders.map((orders, index) => (
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
    marginBottom: 10,
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
  diceItem: {
    alignItems: "center",
  },
  statButton: {
    borderRadius: 5,
    marginBottom: "1%",
    marginTop: "%",
  },
  statButtonText: {
    color: Colors.hudDarker,
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
    marginBottom: 45,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  showButton: {},
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
    tintColor: Colors.hudDarker,
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
    flexDirection: "column", // Aligns children horizontally (side by side)
    justifyContent: "center", // Centers content horizontally
    alignItems: "center", // Centers content vertically
    width: "100%",
    backgroundColors: 'red',
    marginBottom: -60
  },
});
