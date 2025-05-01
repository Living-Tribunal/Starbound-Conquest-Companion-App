import React, { Component, useEffect, useState } from "react";
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
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import HeaderComponent from "@/components/header/HeaderComponent";
import { Colors } from "../../constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";

export default function BattleGround(props) {
  const { ship } = props.route.params;
  const [allUsers, setAllUsers] = useState(null);
  const [allUsersShips, setAllUsersShips] = useState(null);
  const [singleUser, setSingleUser] = useState(null);
  const [singleUserShip, setSingleUserShip] = useState(null);
  const [pressed, setPressed] = useState(true);
  const [expandUserShipList, setExpandUserShipList] = useState(false);

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

  const headerComponent = () => {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Battleground</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.row}>
            <Text style={styles.text}>Your Ship</Text>
            <Text style={styles.text}>
              {ship.type} - {ship.shipId}
            </Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                source={{ uri: ship.image }}
                style={{ width: 150, height: 150, resizeMode: "contain" }}
              />
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>is attacking your ship!</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <HeaderComponent text="BattleGround" NavToWhere={"Player"} />
      <FlatList
        data={allUsersShips}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={headerComponent}
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => {
          const isPressed = item.id === expandUserShipList;

          return (
            <View>
              <TouchableOpacity
                style={styles.usernameToggle}
                onPress={() => {
                  setExpandUserShipList(isPressed ? null : item.id);
                }}
              >
                <Text style={styles.usernameText}>{item.displayName}</Text>
              </TouchableOpacity>

              {isPressed &&
                Array.isArray(item.allUsersShips) &&
                item.allUsersShips
                  .slice()
                  .sort((a, b) => (a.type || "").localeCompare(b.type || ""))
                  .map((ship) => (
                    <TouchableOpacity
                      onPress={() => {
                        console.log("Pressed ship:", ship.id);
                        setPressed((prev) => !prev);
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
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  row: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "monospace",
    color: Colors.white,
  },
  flatListRenderItem: {
    backgroundColor: Colors.green_toggle,
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
});
