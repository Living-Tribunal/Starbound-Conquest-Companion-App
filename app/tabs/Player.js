import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import API from "../../components/API/API";
import ShipFlatlist from "../../components/shipdata/ShipFlatlist";


export default function Player() {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();

  const {
    username,
    setUsername,
    fighterImages,
    destroyerImages,
    cruiserImages,
    carrierImages,
    dreadnoughtImages,
    faction,
    setFaction,
    profile,
    setProfile,
  } = useStarBoundContext();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("UserName");
        const storedFaction = await AsyncStorage.getItem("Faction");
        const storedProfile = await AsyncStorage.getItem("ProfilePicture");
        console.log("stored username in Player: " + storedUsername);

        setUsername(storedUsername || "Commander");
        setFaction(storedFaction || "Nova Raiders");
        setProfile(storedProfile || "");
      } catch (error) {
        console.error("Failed to retrieve user data:", error);
      }
    };

    getUserData();
  }, []);

  const fleetData = [
    { type: "Fighter", fleetClass: "fleetFighter", ships: fighterImages },
    { type: "Destroyer", fleetClass: "fleetDestroyer", ships: destroyerImages },
    { type: "Cruiser", fleetClass: "fleetCruiser", ships: cruiserImages },
    { type: "Carrier", fleetClass: "fleetCarrier", ships: carrierImages },
    { type: "Dreadnought", fleetClass: "fleetDreadnought", ships: dreadnoughtImages },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark_gray }}>
      <FlatList
        data={fleetData}
        keyExtractor={(item) => item.type}
        ListHeaderComponent={
          <>
            <View style={styles.container}>
              <Text style={styles.subHeaderText}>
              Welcome to Starbound Conquest! Prepare to command your fleet and
              conquer the stars. Below, you'll find a quick snapshot of your
              fleet's status. Use the buttons to navigate to screens where you
              can manage your ships' stats, toggle their turns, and issue
              orders. Also tap on the username to change your Faction, Username and Profie Picture.
              </Text>
              <View style={{ alignItems: "center", marginTop: 10 }}>
                <API />
              </View>
              <TouchableOpacity
                style={styles.profileContainer}
              >
                <Image
                  style={styles.profile}
                  source={
                    profile
                      ? { uri: profile }
                      : require("../../assets/images/ships.jpg")
                  }
                />
                <Text style={styles.playerText}>{username}</Text>
                <Text style={styles.factionText}>{faction}</Text>
              </TouchableOpacity>
              <Text style={styles.textSub}>Fleet Overview</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.shipContainer}>
            <Text style={styles.textUnder}>{item.type}</Text>
            <ShipFlatlist type={item.type} fleetClass={item.fleetClass} ships={item.ships} />
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
  textSub: {
    fontSize: 30,
    color: Colors.white,
    fontFamily: "leagueBold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  textUnder: {
    fontSize: 20,
    color: Colors.white,
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
    backgroundColor: Colors.dark_gray,
    width: "80%",
    padding: 10,
    alignSelf: "center",
    elevation: 8,
    borderRadius: 10,
    justifyContent: "center",
    shadowColor: Colors.hud,
  },
  profile: {
    width: 250,
    height: 250,
    borderRadius: 10,
    elevation: 5,
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
});
