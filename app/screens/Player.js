import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "../../constants/fonts";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ShipImageLength } from "../../constants/ShipImageLength";

export default function Player() {
  const navigation = useNavigation();

  const tabBarHeight = useBottomTabBarHeight();

  const {
    username,
    setUsername,
    fighterImages,
    setFighterImages,
    destroyerImages,
    setDestroyerImages,
    cruiserImages,
    setCruiserImages,
    carrierImages,
    setCarrierImages,
    dreadnoughtImages,
    setDreadnoughtImages,
    faction,
    setFaction
  } = useStarBoundContext();

  const ship = ShipImageLength(
    fighterImages,
    destroyerImages,
    cruiserImages,
    carrierImages,
    dreadnoughtImages
  );

  useFocusEffect(
    useCallback(() => {
      const loadCounts = async () => {
        try {
          const savedFighterCount = await AsyncStorage.getItem("fighterCount");
          const savedCarrierCount = await AsyncStorage.getItem("carrierCount");
          const savedDreadnoughtCount = await AsyncStorage.getItem(
            "dreadnoughtCount"
          );
          const savedCruiserCount = await AsyncStorage.getItem("cruiserCount");
          const savedDestroyerCount = await AsyncStorage.getItem(
            "destroyerCount"
          );

          const counts = {
            fighterCount: parseInt(savedFighterCount) || 0,
            carrierCount: parseInt(savedCarrierCount) || 0,
            dreadnoughtCount: parseInt(savedDreadnoughtCount) || 0,
            cruiserCount: parseInt(savedCruiserCount) || 0,
            destroyerCount: parseInt(savedDestroyerCount) || 0,
          };

          setFighterImages(
            Array.from({ length: counts.fighterCount }, (_, i) => ({ id: i }))
          );
          setDestroyerImages(
            Array.from({ length: counts.destroyerCount }, (_, i) => ({ id: i }))
          );
          setCruiserImages(
            Array.from({ length: counts.cruiserCount }, (_, i) => ({ id: i }))
          );
          setCarrierImages(
            Array.from({ length: counts.carrierCount }, (_, i) => ({ id: i }))
          );
          setDreadnoughtImages(
            Array.from({ length: counts.dreadnoughtCount }, (_, i) => ({
              id: i,
            }))
          );
        } catch (e) {
          console.error("Failed to load counts:", e);
        }
      };

      loadCounts();
    }, [])
  );

  useEffect(() => {
    const getUserName = async () => {
      try {
        const username = await AsyncStorage.getItem("UserName");
        if (username) {
          setUsername(username); // Only set if a username exists
        } else {
          setUsername("Commander");
        }
      } catch (error) {
        console.error("Failed to retrieve username:", error);
      }
    };
    getUserName();
  }, []);

  useEffect(() => {
    const getFaction = async () => {
      try {
        const faction = await AsyncStorage.getItem("Faction");
        if (faction) {
          setFaction(faction); // Only set if a username exists
        } else {
          setFaction("0");
        }
      } catch (error) {
        console.error("Failed to retrieve username:", error);
      }
    };
    getFaction();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark_gray }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: tabBarHeight,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              top: 5,
              bottom: 20,
              flexDirection: "row",
            }}
          >
            <Text style={styles.subHeaderText}>
              Welcome to Starbound Conquest! Prepare to command your fleet and
              conquer the stars. Below, you'll find the username entry field to
              begin your journey and the fleet overview, offering a quick
              snapshot of your fleet's status. Use the buttons to navigate to
              screens where you can manage your ships' stats, toggle their
              turns, and issue orders.
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              top: 20,
            }}
          >
            <Pressable
              onPress={() => {
                navigation.navigate("Logout");
              }}
              style={({ pressed }) => [styles.textSectionSpecial]}
            >
              {({ pressed }) => (
                <View style={{ position: "relative" }}>
                  {/* HUD Image */}
                  <Image
                    style={{
                      tintColor: pressed ? Colors.gold : Colors.hud,
                      width: 350,
                      height: 150,
                      resizeMode: "contain",
                    }}
                    source={require("../../assets/images/titlehud.png")}
                  />
                  {/* Text inside HUD */}
                  <Text
                    numberOfLines={1}
                    style={{
                      position: "absolute",
                      color: Colors.hud, // Adjust color as per HUD theme
                      fontWeight: "bold",
                      fontSize: 20,
                      textAlign: "center",
                      fontFamily: "monospace",
                      width: "100%", // Ensure text stays centered
                      top: "27%", // Adjust based on image size
                      transform: [{ translateY: -15 }], // Center vertically
                    }}
                  >
                    {username || "Commander"}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      position: "absolute",
                      color: Colors.hud, // Adjust color as per HUD theme
                      fontWeight: "bold",
                      fontSize: 20,
                      textAlign: "center",
                      fontFamily: "monospace",
                      width: "100%", // Ensure text stays centered
                      top: "70%", // Adjust based on image size
                      transform: [{ translateY: -15 }], // Center vertically
                    }}
                  >
                    {faction}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
          <Text style={styles.textSub}>Fleet Overview</Text>

          <View style={styles.shipContainer}>
            {Object.entries(ship).map(([shipClass, { type, value }], index) => (
              <View style={styles.shipItem} key={shipClass}>
                <TouchableOpacity
                  style={styles.touchable}
                  onPress={() => {
                    navigation.navigate("Fleet", { shipClass });
                  }}
                >
                  <Image
                    source={require("../../assets/images/6966409.png")}
                    style={styles.image}
                  />
                  <View
                    style={{
                      backgroundColor: Colors.hudDarker,
                      width: "100%",
                      height: "40%",
                      justifyContent: "center",
                      zIndex: 10,
                    }}
                  >
                    <Text style={styles.typeText}>{type}</Text>
                  </View>

                  <Text style={styles.valueStat}>{value}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  textSub: {
    fontSize: 30,
    color: Colors.white,
    fontFamily: FONTS.leagueRegular,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  shipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  shipItem: {
    width: "50%",
    marginBottom: 10,
    padding: 5,
  },
  touchable: {
    justifyContent: "center",
    height: 150,
    alignItems: "center",
    position: "relative",
  },
  image: {
    position: "absolute",
    width: 220,
    height: 150,
    zIndex: 1,
    tintColor: Colors.hud,
  },
  typeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.hudDarker,
    zIndex: 1,
    padding: 4,
    fontFamily: "leagueBold",
    letterSpacing: 2,
    backgroundColor: Colors.hud,
    elevation: 8,
    width: "100%",
    borderWidth: 2,
    borderColor: Colors.hudDarker,

    textAlign: "center",
  },
  valueStat: {
    fontSize: 12,
    color: Colors.white,
    zIndex: 2,
    padding: 5,
    fontFamily: "monospace",
  },
  gearImage: {
    width: 25,
    height: 25,
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
