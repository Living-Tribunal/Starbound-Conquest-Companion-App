/*  */ import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { doc, deleteDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { useNavigation } from "@react-navigation/native";
import { getFleetData } from "../../components/API/API";
import Toast from "react-native-toast-message";
import { FactionImages } from "../../constants/FactionImages";
import { useMapImageContext } from "../Global/MapImageContext";
//import { Shadow } from "react-native-neomorph-shadows";

export default function ShipFlatList({ type, usersColor, toggleToDelete }) {
  const specialOrderShortNames = {
    "All Ahead Full": "AHF",
    "Evasive Maneuvers": "EVM",
    "Combine Fire": "CBF",
    "Anti-Fighter Barrage": "AFB",
    "Power Up Main Guns": "PMG",
    "All Systems Fire": "ASF",
    "Reinforce Shields": "RFS",
    "Launch Fighters": "LF",
    "Charge Ion Beams": "CIB",
    Broadside: "BRS",
  };

  const launchAllFightersStatusColor = (ship) => {
    const fightersLaunched = ship.specialOrders?.["Launch Fighters"] === true;

    if (fightersLaunched) return Colors.green_toggle;
    return Colors.blue_gray;
  };

  const { data, setData, setSetDeleting } = useStarBoundContext();
  const { gameSectors } = useMapImageContext();
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();

  const fleetData = Array.isArray(data)
    ? data.filter(
        (ship) =>
          ship.type === type &&
          ship.user === user.uid &&
          (gameSectors === "Show All Ships..." ||
            ship.gameSector === gameSectors)
      )
    : [];

  /*   console.log("----------------------");
  console.log(`${type} count:`, fleetData.length);
  console.log("----------------------"); */

  //console.log("In Ship Flatlist:", JSON.stringify(fleetData, null, 2));

  const deleteShip = async (ship) => {
    setSetDeleting(true);
    if (!user?.uid) {
      console.error("User not found");
      return;
    }

    try {
      const deleteShipReference = doc(
        FIREBASE_DB,
        "users",
        user.uid,
        "ships",
        ship.id
      );
      await deleteDoc(deleteShipReference);
      await getFleetData({ data, setData });
      setSetDeleting(false);

      Toast.show({
        type: "success", // 'success' | 'error' | 'info'
        text1: "Starbound Conquest",
        text2: "Ship has been deleted.",
        position: "top", // optional, 'top' | 'bottom'
        visibilityTime: 2000, // 2 seconds
      });

      //console.log(`Deleted Ship: ${ship.id}`);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  return (
    <View style={{ alignItems: "center" }}>
      {fleetData.length > 0 ? (
        <FlatList
          data={fleetData}
          nestedScrollEnabled={true}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const localImage =
              FactionImages[item.factionName]?.[item.type]?.classImage;
            return (
              <TouchableOpacity
                style={{
                  /* backgroundColor:
                    item.hp === 0 ? Colors.deep_red : "transparent", */
                  backgroundColor: "transparent",
                  margin: 5,
                }}
                disabled={
                  !toggleToDelete &&
                  (!item.hp === 0 ||
                    item.isToggled === true ||
                    item.hasRolledDToHit === true)
                }
                onPress={() => {
                  if (toggleToDelete) {
                    deleteShip(item);
                  } else {
                    navigation.navigate("Stats", {
                      shipId: item.id,
                      from: "Player",
                    });
                    //console.log("Navigated to Stats:", item.id);
                  }
                }}
              >
                <View
                  style={{
                    marginTop: 5,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <View
                    style={{
                      height: 5,
                      width: "80%",
                      backgroundColor: Colors.blue_gray, // the empty bar background
                      borderRadius: 2,
                    }}
                  >
                    <View
                      style={{
                        height: 5,
                        width: `${(item.hp / item.maxHP) * 100}%`,
                        backgroundColor:
                          item.hp / item.maxHP > 0.5
                            ? "limegreen"
                            : item.hp / item.maxHP > 0.25
                            ? "yellow"
                            : "red",
                        borderRadius: 2,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 8,
                        color: "white",
                        textAlign: "center",
                        marginTop: 2,
                      }}
                    >
                      {item.hp} / {item.maxHP} HP
                    </Text>

                    {item.type === "Dreadnought" ? (
                      item.weaponStatus?.["Ion Particle Beam"] === true ? (
                        <View>
                          <Image
                            style={{
                              width: 30,
                              height: 30,
                              alignSelf: "center",
                              marginTop: 5,
                              tintColor: Colors.blue_gray,
                            }}
                            source={{
                              uri: "https://firebasestorage.googleapis.com/v0/b/starbound-conquest-a1adc.firebasestorage.app/o/maneuverIcons%2Fsinusoidal-beam.png?alt=media&token=96d76ac5-5426-4bbb-835c-f541f7ba3023",
                            }}
                          />
                        </View>
                      ) : (
                        <View>
                          <Image
                            style={{
                              width: 30,
                              height: 30,
                              alignSelf: "center",
                              marginTop: 5,
                              tintColor: Colors.green_toggle,
                            }}
                            source={{
                              uri: "https://firebasestorage.googleapis.com/v0/b/starbound-conquest-a1adc.firebasestorage.app/o/maneuverIcons%2Fsinusoidal-beam.png?alt=media&token=96d76ac5-5426-4bbb-835c-f541f7ba3023",
                            }}
                          />
                        </View>
                      )
                    ) : null}

                    {item.type === "Carrier" ? (
                      item.specialOrders?.["Launch Fighters"] === true ? (
                        <View style={{ flexDirection: "column" }}>
                          <Image
                            style={{
                              width: 30,
                              height: 30,
                              alignSelf: "center",
                              marginTop: 5,
                              margin: 2,
                              tintColor: launchAllFightersStatusColor(item),
                            }}
                            source={{
                              uri: "https://firebasestorage.googleapis.com/v0/b/starbound-conquest-a1adc.firebasestorage.app/o/maneuverIcons%2Fstrafe.png?alt=media&token=9a1bc896-f4c1-4a07-abc1-f71e6bbe9c5b",
                            }}
                          />
                        </View>
                      ) : (
                        <View style={{ flexDirection: "column" }}>
                          <Image
                            style={{
                              width: 30,
                              height: 30,
                              alignSelf: "center",
                              marginTop: 5,
                              margin: 2,
                              tintColor: launchAllFightersStatusColor(item),
                            }}
                            source={{
                              uri: "https://firebasestorage.googleapis.com/v0/b/starbound-conquest-a1adc.firebasestorage.app/o/maneuverIcons%2Fstrafe.png?alt=media&token=9a1bc896-f4c1-4a07-abc1-f71e6bbe9c5b",
                            }}
                          />
                        </View>
                      )
                    ) : null}
                  </View>
                </View>

                <View
                  style={{
                    alignSelf: "center",
                    width: "80%",
                    flex: 1,
                    alignItems: "center",
                    padding: 2,
                    borderRadius: 5,
                    borderWidth: 1,
                    boxShadow: `0px 0px 10px ${
                      item.hp === 0 ? Colors.lighter_red : usersColor
                    }`,
                    borderColor:
                      item.hp === 0
                        ? Colors.lighter_red // dead ship
                        : item.isToggled
                        ? Colors.gold // alive + toggled
                        : Colors.hud,
                    backgroundColor: Colors.dark_gray,
                    marginVertical: 5,
                  }}
                >
                  <View
                    style={{
                      marginBottom: 50,
                      position: "relative",
                      width: 90,
                      height: 40,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      source={require("../../assets/images/fleethud-01.png")}
                      style={{
                        width: 80,
                        height: 20,
                        tintColor:
                          item.hp === 0
                            ? Colors.lighter_red // dead ship
                            : item.isToggled
                            ? Colors.gold // alive + toggled
                            : Colors.hud,
                      }}
                    />
                    <Text
                      style={{
                        position: "absolute",
                        top: 5,
                        color: "white",
                        textAlign: "center",
                        fontSize: 8,
                      }}
                    >
                      {item.shipId}
                    </Text>

                    <Image
                      resizeMode="contain"
                      source={localImage}
                      style={{
                        width: 60,
                        height: 60,
                        alignSelf: "center",
                        borderRadius: 10,
                        marginTop: 5,
                        tintColor: item.hp === 0 ? Colors.lighter_red : null,
                      }}
                    />
                  </View>
                  {item.specialOrders && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginTop: 5,
                      }}
                    >
                      {Object.entries(item.specialOrders).map(
                        ([orderName, isActive], index) => {
                          if (!isActive) return null;

                          return (
                            <View
                              key={orderName}
                              style={{
                                backgroundColor: Colors.hudDarker,
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                                borderRadius: 10,
                                margin: 2,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 6,
                                  color: Colors.hud,
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                {specialOrderShortNames[orderName] || "???"}
                              </Text>
                            </View>
                          );
                        }
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <Text style={styles.noData}>No {type}s available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  noData: {
    fontSize: 16,
    color: Colors.hudDarker,
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 10,
  },
  text1: {
    fontSize: 10,
    color: Colors.hud,
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 10,
  },
});
