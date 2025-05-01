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
} from "react-native";
import HeaderComponent from "@/components/header/HeaderComponent";
import { Colors } from "../../constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";

export default function BattleGround(props) {
  const { ship } = props.route.params;
  //console.log("Ship in BattleGround:", ship);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const currentUserEmail = FIREBASE_AUTH.currentUser.email;
      console.log("Current user email:", currentUserEmail);
      if (!currentUserEmail) return;
      const usersCollection = collection(FIREBASE_DB, "users");
      const myQuery = query(
        usersCollection,
        where("email", "!=", currentUserEmail)
      );
      const querySnapshot = await getDocs(myQuery);
      const users = querySnapshot.docs.map((doc) => doc.data());
      console.log("Users:", JSON.stringify(users, null, 2));
      return users;
    } catch (e) {
      console.error("Error getting users:", e);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <HeaderComponent text="BattleGround" NavToWhere={"Player"} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Battleground</Text>
        </View>
        <View style={styles.body}>
          <ScrollView></ScrollView>
        </View>
      </View>
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
  },
});
