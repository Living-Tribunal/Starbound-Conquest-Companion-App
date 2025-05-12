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

export default function ShipFlatList({ type, fleetClass }) {
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

  const {
    data,
    setData,
    toggleToDelete,
    turnTaken,
    setDeleting,
    setSetDeleting,
    hitPointsColor,
  } = useStarBoundContext();
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();

  const fleetData = Array.isArray(data)
    ? data.filter((ship) => ship.type === type)
    : [];

  /*   console.log("----------------------");
  console.log(`${type} count:`, fleetData.length);
  console.log("----------------------"); */

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

      console.log(`Deleted Ship: ${ship.id}`);
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
            const thisShipColor = hitPointsColor[item.id] || "green";

            return (
              <TouchableOpacity
                //disabled={item.isToggled === true}
                onPress={() => {
                  if (toggleToDelete) {
                    deleteShip(item);
                    //console.log("Deleted Ship:", item.id);
                  } else {
                    navigation.navigate("Stats", { shipId: item.id });
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
                  }}
                >
                  <View
                    style={{
                      height: 5,
                      width: "80%",
                      backgroundColor: "gray", // the empty bar background
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
                    borderColor:
                      item.isToggled === true ? Colors.gold : Colors.hud,
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
                        tintColor: Colors.hud,
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
                      source={{ uri: item.image }}
                      style={{
                        width: 60,
                        height: 60,
                        alignSelf: "center",
                        marginTop: 5,
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
