import React, { Component, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  SafeAreaView,
  FlatList,
  Modal,
} from "react-native";
import { shipBattleDiceMapping } from "../../components/buttons/BattleDice.js";
import HeaderComponent from "@/components/header/HeaderComponent";
import { Colors } from "../../constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function BattleGround(props) {
  const { ship } = props.route.params;
  const navigation = useNavigation();
  const {
    allUsers,
    setAllUsers,
    allUsersShips,
    setAllUsersShips,
    singleUser,
    setSingleUser,
    singleUserShip,
    setSingleUserShip,
    expandUserShipList,
    setExpandUserShipList,
    hit,
    damageDone,
    weaponId,
    gameRoom,
    setWeaponId,
    hasBeenInteractedWith,
    setHasBeenInteractedWith,
  } = useStarBoundContext();
  const [modal, setModal] = useState(false);
  const [newHP, setNewHP] = useState(0);
  const [isUser, setIsUser] = useState(null);
  const user = FIREBASE_AUTH.currentUser;

  const selectedShipDice = ship ? shipBattleDiceMapping[ship.type] : [];

  //function to get all users EXCEPT current user from firestore
  const getAllUsers = async () => {
    try {
      const allUsersArray = [];
      const currentUserEmail = FIREBASE_AUTH.currentUser.email;
      //console.log("Game Room:", gameRoom);
      //console.log("Game Room:", user.gameRoom);
      if (!currentUserEmail || !gameRoom) return [];

      const usersCollection = collection(FIREBASE_DB, "users");
      const myQuery = query(
        usersCollection,
        where("email", "!=", currentUserEmail),
        where("gameRoom", "==", gameRoom)
      );
      const querySnapshot = await getDocs(myQuery);
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      allUsersArray.push(...users);
      setAllUsers(allUsersArray);
      return users;
    } catch (e) {
      console.error("Error getting users:", e);
      return [];
    }
  };

  //useeffec function to update that selected users ships HP with the clampedHP value
  useEffect(() => {
    if (!singleUserShip || !isUser || damageDone == null || hit !== "Hit")
      return;

    const updateUserShipHP = async () => {
      const newHP = singleUserShip.hp - damageDone;
      const clampedHP = Math.max(0, newHP);

      const userShipDocRef = doc(
        FIREBASE_DB,
        "users",
        isUser.id,
        "ships",
        singleUserShip.id
      );

      try {
        await updateDoc(userShipDocRef, {
          hp: clampedHP,
        });
        setNewHP(clampedHP); // Sync your local state
        console.log("Auto-applied damage:", damageDone);
      } catch (e) {
        console.error("Failed to apply damage:", e);
      }
    };

    updateUserShipHP();
  }, [hit, damageDone, singleUserShip?.id, isUser?.id]);

  //useEffect function to listen for changes for the specific user and ship selected in battleGround
  useEffect(() => {
    if (!singleUserShip || !isUser) return;
    console.log("Ship:", JSON.stringify(singleUserShip, null, 2));
    //console.log("User:", JSON.stringify(isUser, null, 2));
    const userShipDocRef = doc(
      FIREBASE_DB,
      "users",
      isUser.id,
      "ships",
      singleUserShip.id
    );
    const unsubscribe = onSnapshot(userShipDocRef, (doc) => {
      if (doc.exists) {
        const updatedShip = { id: doc.id, ...doc.data() };
        console.log("Updated Ship:", JSON.stringify(updatedShip, null, 2));
        setSingleUserShip(updatedShip);
      }
    });
    return () => unsubscribe();
  }, [singleUserShip?.id, isUser?.id]);

  //useEffect function to get ALL users and their ships from firestore
  useEffect(() => {
    let unsubscribers = [];

    const getAllUsersAndListen = async () => {
      const users = await getAllUsers();
      const updatedUsersWithShips = [];

      for (const user of users) {
        const shipCollection = collection(
          FIREBASE_DB,
          "users",
          user.id,
          "ships"
        );

        const unsubscribe = onSnapshot(shipCollection, (snapshot) => {
          const ships = snapshot.docs.map((doc) => ({
            id: doc.id,
            userId: user.id,
            ...doc.data(),
          }));

          // Replace or update user in state
          setAllUsersShips((prev) => {
            const filtered = (prev || []).filter((u) => u.id !== user.id);
            return [...filtered, { ...user, allUsersShips: ships }];
          });
        });

        unsubscribers.push(unsubscribe);
      }
    };

    getAllUsersAndListen();

    // Cleanup listeners on unmount
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  //useEffect function to clamp the value from going lower than 0 when rolling for damage and setting it to state
  useEffect(() => {
    if (!singleUserShip || damageDone == null) return;

    const newHP = singleUserShip.hp - damageDone;
    const clampedHP = Math.max(0, newHP);
    setNewHP(clampedHP);
  }, [singleUserShip, damageDone]);

  //simple success message to show when a ship is selected in the battleGround
  const successMessage = () => {
    if (singleUser && singleUserShip) {
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              color: Colors.green_toggle,
            }}
          >
            Success! {singleUser} and {singleUserShip?.type} -{" "}
            {singleUserShip?.shipId} have been selected.
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <HeaderComponent
        text="BattleGround"
        NavToWhere={{ name: "Stats", params: { shipId: ship.id } }}
      />
      <ScrollView>
        <View style={styles.container}>
          <View
            style={[
              styles.row,
              {
                borderRadius: 5,
                backgroundColor: Colors.hudDarker,
                margin: 10,
              },
            ]}
          >
            <Text style={[styles.text, { color: Colors.hud }]}>
              {user.displayName}'s Ship
            </Text>
            <Text style={styles.text}>
              {ship.type} - {ship.shipId}
            </Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              source={{ uri: ship.image }}
              style={{ width: 150, height: 150, resizeMode: "contain" }}
            />
          </View>
          <View
            style={{
              margin: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={[
                styles.hitOrMissText,
                {
                  backgroundColor:
                    hit === "Miss"
                      ? Colors.deep_red
                      : Colors.darker_green_toggle,
                  borderRadius: 5,
                  padding: 5,
                  width: "70%",
                  borderWidth: 1,
                  flexDirection: "row",
                  borderColor:
                    hit === "Miss" ? Colors.lighter_red : Colors.green_toggle,
                },
              ]}
            >
              <Text
                style={[
                  styles.hitOrMissText,
                  {
                    color:
                      hit === "Miss" ? Colors.lighter_red : Colors.green_toggle,
                  },
                ]}
              >
                Result: {hit}
              </Text>
            </View>
            <View style={styles.hitOrMissTextContainer}>
              <Text style={styles.damageDone}>
                {weaponId} hit for: {damageDone} hp
              </Text>
            </View>
          </View>

          <View>
            {ship.weaponDamage &&
              selectedShipDice.map((DiceComponent, index) => (
                <View
                  key={index}
                  style={[
                    styles.statTextUnder,
                    {
                      backgroundColor: Colors.dark_gray,
                      flexDirection: "row",
                    },
                  ]}
                >
                  {DiceComponent}
                </View>
              ))}
          </View>
          <View
            style={{
              borderColor: Colors.white,
              borderWidth: 1,
              margin: 10,
            }}
          />
          <View style={styles.row}>
            <Text style={styles.text}>
              {!singleUser
                ? `Your opponents ship`
                : `${singleUser}'s ${singleUserShip?.type} - ${singleUserShip?.shipId}.`}
            </Text>

            <View style={styles.opponentContainer}>
              {singleUserShip ? (
                <>
                  <View
                    style={{
                      marginTop: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: singleUserShip?.image }}
                      style={{ width: 150, height: 150, resizeMode: "contain" }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <View style={styles.statContainerHolder}>
                      <View style={styles.statContainerHeader}>
                        <Text
                          style={[
                            styles.text,
                            {
                              color: Colors.hudDarker,
                              fontSize: 13,
                              fontFamily: "LeagueSpartan-Bold",
                            },
                          ]}
                        >
                          Hit Points
                        </Text>
                      </View>

                      <View style={styles.statContainer}>
                        <Text
                          style={[
                            styles.text,
                            { color: Colors.white, fontSize: 15 },
                          ]}
                        >
                          {singleUserShip?.hp} / {singleUserShip?.maxHP}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.statContainerHolder}>
                      <View style={styles.statContainerHeader}>
                        <Text
                          style={[
                            styles.text,
                            {
                              color: Colors.hudDarker,
                              fontSize: 13,
                              fontFamily: "LeagueSpartan-Bold",
                            },
                          ]}
                        >
                          To Hit
                        </Text>
                      </View>

                      <View style={styles.statContainer}>
                        <Text
                          style={[
                            styles.text,
                            { color: Colors.white, fontSize: 15 },
                          ]}
                        >
                          {singleUserShip?.threatLevel}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.statContainerHolder}>
                      <View style={styles.statContainerHeader}>
                        <Text
                          style={[
                            styles.text,
                            {
                              color: Colors.hudDarker,
                              fontSize: 13,
                              fontFamily: "LeagueSpartan-Bold",
                            },
                          ]}
                        >
                          Soak
                        </Text>
                      </View>

                      <View style={styles.statContainer}>
                        <Text
                          style={[
                            styles.text,
                            { color: Colors.white, fontSize: 15 },
                          ]}
                        >
                          {singleUserShip?.damageThreshold}
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              ) : (
                <Text style={[styles.text, { color: Colors.lighter_red }]}>
                  No opponent selected.
                </Text>
              )}
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={[
                styles.closeButton,
                {
                  backgroundColor: hit !== "" ? Colors.dark_gray : Colors.hud,
                  borderColor: hit !== "" ? Colors.hud : Colors.hudDarker,
                },
              ]}
              disabled={hit !== ""}
              onPress={() => {
                setModal(true);
                setExpandUserShipList({});
              }}
            >
              <Text
                style={[
                  styles.closeText,
                  {
                    color: hit !== "" ? Colors.hud : Colors.hudDarker,
                  },
                ]}
              >
                Choose Your Opponent
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal visible={modal} animationType="slide">
          <View style={{ flex: 1, backgroundColor: Colors.dark_gray }}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModal(false);
              }}
            >
              <Text style={styles.closeText}>Close Selection</Text>
            </TouchableOpacity>
            {successMessage()}
            <FlatList
              data={allUsersShips}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <View>
                    <TouchableOpacity
                      style={styles.usernameToggle}
                      onPress={() => {
                        setSingleUser(item.displayName);
                        setIsUser(item);
                        if (singleUser) {
                        }

                        setExpandUserShipList((prev) => ({
                          ...prev,
                          [item.id]: !prev[item.id],
                        }));
                      }}
                    >
                      <Text style={styles.usernameText}>
                        {item.displayName}
                      </Text>
                    </TouchableOpacity>
                    {expandUserShipList[item.id] &&
                      Array.isArray(item.allUsersShips) && (
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                          }}
                        >
                          {item.allUsersShips
                            .sort((a, b) =>
                              (a.type || "").localeCompare(b.type || "")
                            )
                            .map((ship) => (
                              <TouchableOpacity
                                disabled={
                                  ship.hp === 0 ||
                                  ship.hasBeenInteractedWith === true
                                }
                                onLongPress={async () => {
                                  setSingleUserShip(ship);
                                  try {
                                    const shipDocRef = doc(
                                      FIREBASE_DB,
                                      "users",
                                      item.id,
                                      "ships",
                                      ship.id
                                    );
                                    await updateDoc(shipDocRef, {
                                      hasBeenInteractedWith: false,
                                    });
                                  } catch (e) {
                                    console.error(
                                      "Error updating document: ",
                                      e
                                    );
                                  }
                                }}
                                onPress={async () => {
                                  setSingleUserShip(ship);
                                  try {
                                    const shipDocRef = doc(
                                      FIREBASE_DB,
                                      "users",
                                      item.id,
                                      "ships",
                                      ship.id
                                    );
                                    await updateDoc(shipDocRef, {
                                      hasBeenInteractedWith: true,
                                    });
                                  } catch (e) {
                                    console.error(
                                      "Error updating document: ",
                                      e
                                    );
                                  }
                                }}
                                key={ship.id}
                                style={{
                                  borderWidth: singleUser ? 1 : 5,
                                  borderColor:
                                    ship.hp === 0
                                      ? Colors.lighter_red
                                      : Colors.hud,
                                  backgroundColor:
                                    ship.hp === 0
                                      ? Colors.deep_red
                                      : Colors.hudDarker,
                                  borderRadius: 5,
                                  width: "32%",
                                  marginTop: 10,
                                  marginBottom: 10,
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                  flexDirection: "row",
                                  padding: 5,
                                }}
                              >
                                {ship.image && (
                                  <Image
                                    source={{ uri: ship.image }}
                                    style={{
                                      width: 40,
                                      height: 40,
                                      resizeMode: "center",
                                    }}
                                  />
                                )}
                                <Text style={styles.shipTextId}>
                                  {ship.shipId}
                                </Text>
                                {ship.hasBeenInteractedWith === true && (
                                  <View
                                    style={{
                                      backgroundColor: "gold",
                                      width: 15,
                                      height: 15,
                                      borderRadius: 50,
                                    }}
                                  />
                                )}
                              </TouchableOpacity>
                            ))}
                        </View>
                      )}
                    {/* or 2 columns */}
                    {/*  {expandUserShipList[item.id] &&
                      Array.isArray(item.allUsersShips) && (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          //First column
                          <View style={{ width: "48%" }}>
                            {item.allUsersShips
                              .slice(
                                0,
                                Math.ceil(item.allUsersShips.length / 2)
                              )
                              .sort((a, b) =>
                                (a.type || "").localeCompare(b.type || "")
                              )
                              .map((ship) => (
                                <TouchableOpacity
                                  disabled={ship.hp === 0}
                                  onPress={() => {
                                    setSingleUserShip(ship);
                                  }}
                                  key={ship.id}
                                  style={{
                                    borderWidth: 1,
                                    borderColor: Colors.hud,
                                    backgroundColor: Colors.hudDarker,
                                    borderRadius: 5,
                                    marginTop: 10,
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    padding: 5,
                                  }}
                                >
                                  {ship.image && (
                                    <Image
                                      source={{ uri: ship.image }}
                                      style={{
                                        width: 100,
                                        height: 100,
                                        resizeMode: "center",
                                      }}
                                    />
                                  )}
                                  <Text style={styles.shipTextId}>
                                    {ship.shipId}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                          </View>

                          //Second column
                          <View style={{ width: "48%" }}>
                            {item.allUsersShips
                              .slice(Math.ceil(item.allUsersShips.length / 2))
                              .sort((a, b) =>
                                (a.type || "").localeCompare(b.type || "")
                              )
                              .map((ship) => (
                                <TouchableOpacity
                                  disabled={ship.hp === 0}
                                  onPress={() => {
                                    setSingleUserShip(ship);
                                  }}
                                  key={ship.id}
                                  style={{
                                    borderWidth: 1,
                                    borderColor: Colors.hud,
                                    backgroundColor: Colors.hudDarker,
                                    borderRadius: 5,
                                    marginTop: 10,
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    padding: 5,
                                  }}
                                >
                                  {ship.image && (
                                    <Image
                                      source={{ uri: ship.image }}
                                      style={{
                                        width: 100,
                                        height: 100,
                                        resizeMode: "center",
                                      }}
                                    />
                                  )}
                                  <Text style={styles.shipTextId}>
                                    {ship.shipId}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                          </View>
                        </View>
                      )} */}
                  </View>
                );
              }}
              ListEmptyComponent={
                <View style={styles.row}>
                  <Text style={styles.text}>No opponents found.</Text>
                </View>
              }
            />
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 20 : 0,
    paddingHorizontal: 20,
    backgroundColor: Colors.dark_gray,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "league-gothic",
    backgroundColor: Colors.hud,
    borderRadius: 5,
    color: Colors.hudDarker,
  },
  body: {
    paddingHorizontal: 20,
    flex: 1,
  },
  shipTextId: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "monospace",
    color: Colors.white,
    marginRight: 15,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "monospace",
    color: Colors.white,
  },
  flatListRenderItem: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  usernameText: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "monospace",
    color: Colors.white,
  },
  usernameToggle: {
    backgroundColor: Colors.hudDarker,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  statTextUnder: {
    alignSelf: "center",
    margin: 5,
    backgroundColor: Colors.underTextGray,
    width: "100%",
    borderRadius: 2,
  },
  closeButton: {
    top: 0,
    right: 0,
    padding: 10,
    backgroundColor: Colors.hud,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
  },
  closeText: {
    color: Colors.hudDarker,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Bold",
  },
  statContainer: {
    borderRadius: 5,
    backgroundColor: Colors.hudDarker,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.hud,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10,
  },
  statContainerHolder: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    flex: 1,
    width: "100%",
  },
  statContainerHeader: {
    padding: 5,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: Colors.hud,
    borderWidth: 1,
    borderColor: Colors.hudDarker,
    width: "100%",
  },
  hitOrMissTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
    backgroundColor: Colors.hudDarker,
    width: "70%",
    borderRadius: 5,
    padding: 10,
  },
  hitOrMissText: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "monospace",
    color: Colors.white,
    justifyContent: "center",
  },
  damageDone: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "monospace",
    color: Colors.hud,
  },
});
