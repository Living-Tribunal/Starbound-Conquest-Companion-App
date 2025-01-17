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
import * as SplashScreen from "expo-splash-screen";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "../../constants/fonts";


export default function Player() {
  const navigation = useNavigation();

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
  } = useStarBoundContext();

    
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

  const ship = {
    fighter: {
      type: "Fighters",
      value: `${fighterImages.length} Ships`,
    },
    destroyer: {
      type: "Destroyers",
      value: `${destroyerImages.length} Ships`,
    },
    cruiser: {
      type: "Cruisers",
      value: `${cruiserImages.length} Ships`,
    },
    carrier: {
      type: "Carriers",
      value: `${carrierImages.length} Ships`,
    },
    dreadnought: {
      type: "Dreadnoughts",
      value: `${dreadnoughtImages.length} Ships`,
    },
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark_gray }}>
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            {/* <Text style={styles.text}>{`Welcome, ${username || "Commander"}`}</Text> */}
            <Pressable
              onPress={() => {
                navigation.navigate("Logout");
              }}
              style={({ pressed }) => [styles.textSectionSpecial]}
            >
              {({ pressed }) => (
                <View
                  style={{
                    position: "relative",
                  }}
                >
                  <Image
                    style={{
                      tintColor: pressed ? Colors.gold : Colors.hud,
                      width: 370,
                      height: 100,
                      resizeMode: "contain",
                    }}
                    source={require("../../assets/images/hudcont.png")}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      position: "absolute",
                      top: "53%",
                      left: "25%",
                      transform: [{ translateX: "-40%" }, { translateY: "-40%" }],
                      color: Colors.hud,
                      fontWeight: "bold",
                      fontSize: 20,
                      textAlign: "left",
                      fontFamily: "monospace",
                    }}
                  >
                    {`${username || "Commander"}`}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
          <Text style={styles.textSub}>Fleet Overview</Text>

          <View style={styles.shipContainer}>
            {Object.entries(ship).map(([shipClass, { type, value }], index) => (
              <View style={styles.shipItem} key={shipClass}>
                <TouchableOpacity style={styles.touchable} onPress={() => {navigation.navigate("Fleet", { shipClass });
              }}>
                  <Image
                    source={require("../../assets/images/6966409.png")}
                    style={styles.image}
                  />
                  <View style={{backgroundColor: Colors.hudDarker, width: "100%", height: "40%", justifyContent:"center", zIndex: 10,}}>
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
    marginTop: 10,
  },
  shipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  shipItem: {
    width: "50%",
    marginBottom: 10,
    padding: 5
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
    fontWeight: 'bold',
    color: Colors.hudDarker,
    zIndex: 1,
    padding: 4,
    fontFamily: 'leagueBold',
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
});
