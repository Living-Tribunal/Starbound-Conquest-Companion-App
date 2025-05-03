import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import ShipFlatlist from "../../components/shipdata/ShipFlatlist";
import { getFleetData } from "../../components/API/API";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { getAuth } from "firebase/auth";
import { shipObject } from "../../constants/shipObjects";
import Toast from "react-native-toast-message";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useFocusEffect } from "expo-router";
export default function Player() {
  const user = getAuth().currentUser;
  const tabBarHeight = useBottomTabBarHeight();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowWarning, setIsShowWarning] = useState(false);
  const [shipCounts, setShipCounts] = useState({});

  const {
    username,
    setUsername,
    profile,
    faction,
    setFaction,
    setProfile,
    data,
    setData,
    gameValue,
    setGameValue,
    toggleToDelete,
    setToggleToDelete,
    setDeleting,
    setSetDeleting,
    userProfilePicture,
  } = useStarBoundContext();

  const onCancelWarning = () => {
    setIsShowWarning(false);
    setToggleToDelete(false);
  };

  const onConfirmWarning = () => {
    setIsShowWarning(false);
    setToggleToDelete(true);
    console.log("Toggled:", toggleToDelete);
  };

  const valueWarning = () => {
    if (totalFleetValue > gameValue) {
      return (
        <Text style={styles.valueWarning}>
          Warning: You are over your game value limit.
        </Text>
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      getFleetDataButton();
    }, [])
  );

  //console.log("Ship Length:", data);

  const getFleetDataButton = async () => {
    setLoading(true);
    //console.log("getFleetDataButton1");
    await getFleetData({ data, setData });
    //console.log("getFleetDataButton2");
    setLoading(false);
  };

  function generateShortId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 4; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  const addShipToFleet = async (shipData, count = 1) => {
    //console.log("Button Pressed: ", JSON.stringify(shipData, null, 2));
    //console.log("Players Faction: ", faction);

    if (!user) {
      // console.error("User not authenticated");
      return;
    }

    setIsLoading(true);

    try {
      for (let i = 0; i < count; i++) {
        const newShipId =
          Date.now().toString() + "_" + Math.floor(Math.random() * 10000);

        const ShipId = generateShortId();

        const shipToSave = {
          ...shipData,
          id: newShipId,
          shipId: ShipId,
          user: user.uid,
          username: username || "Commander",
          factionName: faction,
          isSelected: false,
          highlighted: false,
          isToggled: false,
          ordersUsed: 0,
        };
        // Add to Firestore
        const docRef = await addDoc(
          collection(FIREBASE_DB, "users", user.uid, "ships"),
          shipToSave
        );

        console.log("Ship added with ID:", docRef.id);
        // After adding, update it to include the doc ID
        await setDoc(docRef, { id: docRef.id }, { merge: true });
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      await getFleetData({ data, setData });
      setIsLoading(false);
    }
  };

  const totalFleetValue = data
    ? data.reduce((sum, ship) => sum + (ship.pointValue || 0), 0)
    : 0;

  /*   const factionName = data
    ? [...new Set(data.map((ship) => ship.factionName))]
    : [];
 */
  //console.log(JSON.stringify(data, null, data));

  useFocusEffect(
    useCallback(() => {
      const getUserData = async () => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) return;

          const docRef = doc(FIREBASE_DB, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("User Data:", data);
            setUsername(data.displayName);
            setProfile(data.photoURL);
            setFaction(data.factionName);
            //console.log("Profile Image In Player:", data.photoURL);
          }
        } catch (error) {
          console.error("Failed to retrieve user data:", error);
        }
      };

      console.log("User profile Image: ", profile);

      getUserData();
    }, [])
  );

  const incrementShipCount = (type) => {
    setShipCounts((prev) => ({
      ...prev,
      [type]: (prev[type] || 1) + 1,
    }));
  };

  const decrementShipCount = (type) => {
    setShipCounts((prev) => ({
      ...prev,
      [type]: Math.max(1, (prev[type] || 1) - 1),
    }));
  };

  const createShipForFleet = () => {
    if (!faction || faction === "Choose a Faction") return [];

    const factionData = shipObject[faction];
    if (!factionData) return [];

    return [
      {
        type: "Fighter",
        fleetClass: "fleetFighter",
        ships: [factionData.fighter],
      },
      {
        type: "Destroyer",
        fleetClass: "fleetDestroyer",
        ships: [factionData.destroyer],
      },
      {
        type: "Cruiser",
        fleetClass: "fleetCruiser",
        ships: [factionData.cruiser],
      },
      {
        type: "Carrier",
        fleetClass: "fleetCarrier",
        ships: [factionData.carrier],
      },
      {
        type: "Dreadnought",
        fleetClass: "fleetDreadnought",
        ships: [factionData.dreadnought],
      },
    ];
  };

  const fleetData = createShipForFleet(faction);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          style={{ width: "80%", height: "22%" }}
          source={require("../../assets/images/SC_logo1.png")}
        />
        <Text style={styles.textLoading}>Your fleet is arriving</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          style={{ width: "80%", height: "22%" }}
          source={require("../../assets/images/SC_logo1.png")}
        />
        <Text style={styles.textLoading}>Adding ships to your Fleet</Text>
      </View>
    );
  }

  /* console.log(JSON.stringify(totalFleetValue) + " In Player"); */

  function send_message_discord() {
    const request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://discord.com/api/webhooks/1334142368613400598/ByDe3g5n2lUlWW_dpj1tYV5JggI6XMbWpaldCsn53EJF5P1vJ3IU1Tg0-IqZ4cnWuOn_"
    );
    request.setRequestHeader("Content-Type", "application/json");
    const params = {
      username: "Starbound Conquest",
      avatar_url: "",
      content: `${username} has ended their turn.`,
    };
    request.send(JSON.stringify(params));
  }

  const endYourTurn = async () => {
    if (!user) return;
    try {
      const shipRef = collection(FIREBASE_DB, "users", user.uid, "ships");
      const snapshot = await getDocs(shipRef); // <-- fetch ALL ships

      const resetPromises = snapshot.docs.map(async (shipDoc) => {
        const shipDocRef = doc(
          FIREBASE_DB,
          "users",
          user.uid,
          "ships",
          shipDoc.id
        );
        const shipData = shipDoc.data();
        console.log("Ship data:", shipData);

        // Reset special orders if they exist
        let newSpecialOrders = {};
        if (shipData.specialOrders) {
          Object.keys(shipData.specialOrders).forEach((order) => {
            newSpecialOrders[order] = false;
          });
        }
        console.log("New special orders:", newSpecialOrders);

        await updateDoc(shipDocRef, {
          isToggled: false,
          specialOrders: newSpecialOrders,
        });
      });

      await Promise.all(resetPromises);
      await getFleetData({ data, setData });
      send_message_discord();

      Toast.show({
        type: "success",
        text1: "Starbound Conquest",
        text2: "Your turn has ended and all special orders reset.",
        position: "top",
      });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const endYourTurnPressed = () => {
    Toast.show({
      type: "error", // 'success' | 'error' | 'info'
      text1: "Starbound Conquest",
      text2: "Long press to end your turn.",
      position: "top", // optional, 'top' | 'bottom'
      visibilityTime: 2000, // 2 seconds
    });
  };

  if (isShowWarning) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.valueWarning, { fontSize: 20, padding: 10 }]}>
          Warning: You are now in a delete mode, any ship you tap on WILL be
          deleted.
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            gap: 40,
          }}
        >
          <TouchableOpacity style={styles.button} onPress={onCancelWarning}>
            <Image
              source={require("../../assets/icons/icons8-x-48.png")}
              style={{
                width: 25,
                height: 25,
                marginTop: 5,
                tintColor: Colors.lighter_red,
              }}
            />
            <Image
              style={{
                width: 60,
                height: 60,
                position: "absolute",
              }}
              source={require("../../assets/images/edithud.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onConfirmWarning}>
            <Image
              source={require("../../assets/icons/icons8-check-50.png")}
              style={{
                width: 25,
                height: 25,
                marginTop: 5,
                tintColor: Colors.green_toggle,
              }}
            />
            <Image
              style={{
                width: 60,
                height: 60,
                position: "absolute",
              }}
              source={require("../../assets/images/edithud.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: Colors.dark_gray, flex: 1 }}>
      <FlatList
        data={fleetData}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        ListHeaderComponent={
          <>
            <View style={styles.container}>
              <Text style={styles.subHeaderText}>
                Welcome to Starbound Conquest! Prepare to command your fleet and
                conquer the stars. Below, you'll find a quick snapshot of your
                fleet's status. Use the buttons to navigate to screens where you
                can manage your ships' stats, toggle their turns, and issue
                orders. Also tap on the settings to change your Faction,
                Username and Profie Picture.
              </Text>
              {toggleToDelete && (
                <View>
                  <Text
                    style={[
                      styles.valueWarning,
                      { fontSize: 17, padding: 5, marginTop: 10 },
                    ]}
                  >
                    Delete Mode Has Been Enabled
                  </Text>
                </View>
              )}
              <TouchableOpacity
                disabled
                style={[
                  styles.profileContainer,
                  {
                    borderColor: toggleToDelete
                      ? Colors.lighter_red
                      : Colors.hud,
                    shadowColor: toggleToDelete
                      ? Colors.lighter_red
                      : Colors.hud,
                  },
                ]}
              >
                <Image
                  style={styles.profile}
                  source={
                    profile
                      ? { uri: profile }
                      : require("../../assets/images/SC_logo1.png") // fallback image
                  }
                />
                <Text
                  style={[
                    styles.playerText,
                    { color: toggleToDelete ? Colors.lighter_red : Colors.hud },
                  ]}
                >
                  {username}
                </Text>
                <Text
                  style={[
                    styles.factionText,
                    { color: toggleToDelete ? Colors.lighter_red : Colors.hud },
                  ]}
                >
                  {faction}
                </Text>
              </TouchableOpacity>
              {faction !== "Choose a Faction" && (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 20,
                    }}
                  >
                    <Text
                      style={[
                        styles.textSub,
                        {
                          color: toggleToDelete
                            ? Colors.lighter_red
                            : Colors.white,
                        },
                      ]}
                    >
                      Fleet Overview
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.valueContainer,
                      {
                        borderColor: toggleToDelete
                          ? Colors.lighter_red
                          : Colors.hud,
                        backgroundColor: toggleToDelete
                          ? Colors.deep_red
                          : Colors.hudDarker,
                      },
                    ]}
                  >
                    {valueWarning()}
                    <Text
                      style={[
                        styles.textValue,
                        {
                          color: toggleToDelete
                            ? Colors.lighter_red
                            : Colors.hud,
                        },
                      ]}
                    >
                      Total Fleet Value: {totalFleetValue}/{gameValue}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <TouchableOpacity
                      disabled={toggleToDelete}
                      onPress={endYourTurnPressed}
                      onLongPress={endYourTurn}
                      style={[
                        styles.editContainer,
                        {
                          borderWidth: 1,
                          width: "35%",
                          shadowColor: toggleToDelete
                            ? Colors.lighter_red
                            : Colors.lighter_red,
                          borderColor: toggleToDelete
                            ? Colors.lighter_red
                            : Colors.lighter_red,
                          backgroundColor: Colors.deep_red,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.textValue,
                          {
                            color: toggleToDelete
                              ? Colors.lighter_red
                              : Colors.lighter_red,
                            fontSize: 12,
                          },
                        ]}
                      >
                        End your turn
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.editContainer,
                        {
                          borderWidth: 1,
                          width: "35%",
                          borderColor: toggleToDelete
                            ? Colors.lighter_red
                            : Colors.green_toggle,
                          backgroundColor: toggleToDelete
                            ? Colors.deep_red
                            : Colors.darker_green_toggle,
                        },
                      ]}
                      onPress={() => {
                        setIsShowWarning(true);
                      }}
                    >
                      <Text
                        style={[
                          styles.textValue,
                          {
                            color: toggleToDelete
                              ? Colors.lighter_red
                              : Colors.green_toggle,
                            fontSize: 12,
                          },
                        ]}
                      >
                        Delete a ship
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.shipContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                margin: 10,
              }}
            >
              <Text
                style={[
                  styles.textUnder,
                  { color: toggleToDelete ? Colors.lighter_red : Colors.white },
                ]}
              >
                {item.type}
              </Text>
              {/* //minus button */}
              <TouchableOpacity
                disabled={toggleToDelete}
                onPress={() => decrementShipCount(item.type)}
                style={styles.button}
              >
                <Image
                  source={require("../../assets/icons/icons8-minus-100.png")}
                  style={{
                    width: 25,
                    height: 25,
                    marginTop: 5,
                    tintColor: toggleToDelete ? Colors.lighter_red : Colors.hud,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={toggleToDelete}
                onPress={() =>
                  addShipToFleet(item.ships[0], shipCounts[item.type] || 1)
                }
                style={styles.button}
              >
                <Text style={styles.addButtonText}>
                  {shipCounts[item.type] || 1}
                </Text>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    position: "absolute",
                    tintColor: toggleToDelete ? Colors.lighter_red : Colors.hud,
                  }}
                  source={require("../../assets/images/edithud.png")}
                />
              </TouchableOpacity>
              {/* //add button */}
              <TouchableOpacity
                disabled={toggleToDelete}
                onPress={() => incrementShipCount(item.type)}
                style={styles.button}
              >
                <Image
                  source={require("../../assets/icons/icons8-plus-100.png")}
                  style={{
                    width: 25,
                    height: 25,
                    marginTop: 5,
                    tintColor: toggleToDelete ? Colors.lighter_red : Colors.hud,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "column" }}>
              <ShipFlatlist
                toggleToDelete={toggleToDelete}
                type={item.type}
                fleetClass={item.fleetClass}
                ships={item.ships}
              />
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "monospace",
    numberOfLines: 2,
    width: 50,
  },
  shipContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  textSub: {
    fontSize: 30,
    color: Colors.white,
    fontFamily: "leagueBold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 25,
  },
  textLoading: {
    fontSize: 30,
    color: Colors.hud,
    fontFamily: "leagueBold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 25,
  },
  textUnder: {
    fontSize: 20,
    color: Colors.white,
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
    backgroundColor: Colors.dark_gray,
    width: "80%",
    padding: 10,
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.hud,
    elevation: 10,
  },
  editContainer: {
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    shadowColor: Colors.hud,
  },
  profile: {
    width: 250,
    height: 250,
    borderRadius: 10,
    shadowColor: Colors.dark_gray,
  },
  playerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.hud,
    marginTop: 10,
  },
  factionText: {
    fontSize: 20,
    fontStyle: "italic",
    color: Colors.hud,
  },
  subHeaderText: {
    fontFamily: "monospace",
    color: Colors.white,
    fontSize: 9,
    textAlign: "center",
    backgroundColor: Colors.underTextGray,
    borderRadius: 5,
    padding: 5,
    margin: 5,
  },
  textValue: {
    fontSize: 15,
    color: Colors.hud,
    fontFamily: "leagueBold",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 5,
  },
  valueContainer: {
    backgroundColor: Colors.hudDarker,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
    padding: 10,
  },
  valueWarning: {
    fontSize: 12,
    color: Colors.lighter_red,
    fontFamily: "leagueBold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark_gray,
  },
  button: {
    width: 35,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
});
