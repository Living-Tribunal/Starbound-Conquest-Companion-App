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
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { goBack } from "expo-router";

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
  } = useStarBoundContext();
  const [modal, setModal] = useState(false);
  const user = FIREBASE_AUTH.currentUser;

  const selectedShipDice = ship ? shipBattleDiceMapping[ship.type] : [];

  const getAllUsers = async () => {
    try {
      const allUsersArray = [];
      const currentUserEmail = FIREBASE_AUTH.currentUser.email;
      if (!currentUserEmail) return [];
      const usersCollection = collection(FIREBASE_DB, "users");
      const myQuery = query(
        usersCollection,
        where("email", "!=", currentUserEmail)
      );
      const querySnapshot = await getDocs(myQuery);
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      allUsersArray.push(...users);
      setAllUsers(allUsersArray);
      //console.log("Users:", JSON.stringify(allUsersArray, null, 2));
      return users;
    } catch (e) {
      console.error("Error getting users:", e);
      return [];
    }
  };

  /* console.log("Ship:", ship.weaponDamage); */

  useEffect(() => {
    const getAllUsersAndShips = async () => {
      const users = await getAllUsers();
      const usersWithShips = [];

      for (const user of users) {
        const shipCollection = collection(
          FIREBASE_DB,
          "users",
          user.id,
          "ships"
        );
        const shipSnapshot = await getDocs(shipCollection);
        const ships = shipSnapshot.docs.map((doc) => ({
          id: doc.id,
          userId: user.id,
          ...doc.data(),
        }));
        usersWithShips.push({ ...user, allUsersShips: ships });
      }
      setAllUsersShips(usersWithShips);
      //console.log("Ships:", JSON.stringify(usersWithShips, null, 2));
    };
    getAllUsersAndShips();
  }, []);
  // console.log("Single User:", JSON.stringify(singleUser, null, 2));
  console.log("Single User Ship:", JSON.stringify(singleUserShip, null, 2));

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
          <View style={{ borderColor: Colors.white, borderWidth: 1 }} />
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
              style={styles.closeButton}
              onPress={() => {
                setModal(true);
                setSingleUser(null);
                setSingleUserShip(null);
                setExpandUserShipList({});
              }}
            >
              <Text style={styles.closeText}>Choose Your Opponent</Text>
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
                      Array.isArray(item.allUsersShips) &&
                      item.allUsersShips
                        .slice()
                        .sort((a, b) =>
                          (a.type || "").localeCompare(b.type || "")
                        )
                        .map((ship) => (
                          <TouchableOpacity
                            onPress={() => {
                              setSingleUserShip(ship);
                            }}
                            key={ship.id}
                            style={{
                              marginTop: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "row",
                            }}
                          >
                            {ship.image && (
                              <Image
                                source={{ uri: ship.image }}
                                style={{
                                  width: 150,
                                  height: 150,
                                  resizeMode: "contain",
                                }}
                              />
                            )}
                            <Text style={styles.text}>{ship.shipId}</Text>
                          </TouchableOpacity>
                        ))}
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
  row: {},
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
});
