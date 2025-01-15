import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import EditButtonHP from "../../components/buttons/EditButtonHP";
import ToggleAttributeButton from "../../components/buttons/ToggleAttribute";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Your_Fleet(type) {
  const {
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
    showFighterClass,
    setShowFighterClass,
    showDestroyerClass,
    setShowDestroyerClass,
    showCarrierClass,
    setShowCarrierClass,
    showCruiserClass,
    setShowCruiserClass,
    showDreadnoughtClass,
    setShowDreadnoughtClass,
  } = useStarBoundContext();

  const handlePressFi = () => {
    setShowFighterClass((prevState) => !prevState);
  };
  const handlePressDe = () => {
    setShowDestroyerClass((prevState) => !prevState);
  };
  const handlePressCa = () => {
    setShowCarrierClass((prevState) => !prevState);
  };
  const handlePressCr = () => {
    setShowCruiserClass((prevState) => !prevState);
  };
  const handlePressDr = () => {
    setShowDreadnoughtClass((prevState) => !prevState);
  };

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

  /* const handleLongPress = () => {
    // Reset state arrays to their initial state
    setToggleOrders(Array(SHIP_TOGGLES[type]).fill(false));
    setToggleCapacity(Array(SHIP_CAPACITY[type]).fill(false));
    setToggleDoneState(Array(SHIP_TOGGLES_DONE[type]).fill(false));
  
    // Clear AsyncStorage for the associated keys
    const clearAsyncStorage = async () => {
      try {
        for (let i = 0; i < SHIP_TOGGLES[type]; i++) {
          await AsyncStorage.removeItem(`${orderKey}-${i}`);
        }
        for (let i = 0; i < SHIP_CAPACITY[type]; i++) {
          await AsyncStorage.removeItem(`${capacityKey}-${i}`);
        }
        for (let i = 0; i < SHIP_TOGGLES_DONE[type]; i++) {
          await AsyncStorage.removeItem(`${doneKey}-${i}`);
        }
        console.log("All states reset and AsyncStorage cleared!");
      } catch (err) {
        alert("Failed to clear storage: " + err);
      }
    };
  
    clearAsyncStorage();
  }; */

  return (
    <SafeAreaView style={[styles.mainContainer]}>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.endcontainer}></View>
        <ScrollView style={styles.scrollView}>
          <Pressable
            onPress={handlePressFi}
            style={({ pressed }) => [styles.textSectionSpecial]}
          >
            {({ pressed }) => (
              <View style={{ position: "relative", alignItems: "center" }}>
                <Image
                  style={{
                    width: 400,
                    height: 100,
                    tintColor: pressed ? Colors.gold : Colors.hud,
                  }}
                  source={require("../../assets/images/hudcontainer.png")}
                />
                <Text
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: [{ translateX: -65 }, { translateY: -18 }],
                    color: "#b9e5ff",
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  Fighters - {fighterImages.length} Ships
                </Text>
              </View>
            )}
          </Pressable>

          {showFighterClass && (
            <View style={styles.imageRow}>
              {fighterImages.map((image, index) => (
                <View key={image.id} style={styles.imageContainer}>
                  {/* <ToggleDone type="fighter1" index={index} /> */}
                  <View style={styles.toggleContainer}>
                    <EditButtonHP type="fighter" index={index} />
                    <ToggleAttributeButton shipType="fighter" index={index} />
                    <View style={styles.hudContainer}>
                      <Image
                        style={styles.hudImage}
                        source={require("../../assets/images/hud.png")}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={handlePressDe}
            style={({ pressed }) => [
              styles.textSectionSpecial,
              {
                backgroundColor: pressed ? Colors.dark_gray : Colors.dark_gray,
              },
            ]}
          >
            <View style={styles.textSectionContainer}>
              <Text style={styles.shipTextHeader}>
                Destroyers - {destroyerImages.length} Ships
              </Text>
            </View>
          </Pressable>

          {showDestroyerClass && (
            <View style={styles.imageRow}>
              {destroyerImages.map((image, index) => (
                <View key={image.id} style={styles.imageContainer}>
                  {/* <ToggleDone type="destroyer2" index={index} /> */}
                  <View style={styles.toggleContainer}>
                    <EditButtonHP type="destroyer" index={index} />
                    <ToggleAttributeButton shipType="destroyer" index={index} />
                  </View>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={handlePressCr}
            style={({ pressed }) => [
              styles.textSectionSpecial,
              {
                backgroundColor: pressed ? Colors.dark_gray : Colors.dark_gray,
              },
            ]}
          >
            <View style={styles.textSectionContainer}>
              <Text style={styles.shipTextHeader}>
                Cruisers - {cruiserImages.length} Ships
              </Text>
            </View>
          </Pressable>

          {showCruiserClass && (
            <View style={styles.imageRow}>
              {cruiserImages.map((image, index) => (
                <View key={image.id} style={styles.imageContainer}>
                  {/*  <ToggleDone type="cruiser3" index={index} /> */}
                  <View style={styles.toggleContainer}>
                    <EditButtonHP type="cruiser" index={index} />
                    <ToggleAttributeButton shipType="cruiser" index={index} />
                  </View>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={handlePressCa}
            style={({ pressed }) => [
              styles.textSectionSpecial,
              {
                backgroundColor: pressed ? Colors.dark_gray : Colors.dark_gray,
              },
            ]}
          >
            <View style={styles.textSectionContainer}>
              <Text style={styles.shipTextHeader}>
                Carriers - {carrierImages.length} Ships
              </Text>
            </View>
          </Pressable>

          {showCarrierClass && (
            <View style={styles.imageRow}>
              {carrierImages.map((image, index) => (
                <View key={image.id} style={styles.imageContainer}>
                  {/* <ToggleDone type="carrier4" index={index} /> */}
                  <View style={styles.toggleContainer}>
                    <EditButtonHP type="carrier" index={index} />
                    <ToggleAttributeButton shipType="carrier" index={index} />
                  </View>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={handlePressDr}
            style={({ pressed }) => [
              styles.textSectionSpecial,
              {
                backgroundColor: pressed ? Colors.dark_gray : Colors.dark_gray,
              },
            ]}
          >
            <View style={styles.textSectionContainer}>
              <Text style={styles.shipTextHeader}>
                Dreadnoughts - {dreadnoughtImages.length} Ships
              </Text>
            </View>
          </Pressable>

          {showDreadnoughtClass && (
            <View style={styles.imageRow}>
              {dreadnoughtImages.map((image, index) => (
                <View key={image.id} style={styles.imageContainer}>
                  {/*  <ToggleDone type="dreadnought5" index={index} /> */}
                  <View style={styles.toggleContainer}>
                    <EditButtonHP type="dreadnought" index={index} />
                    <ToggleAttributeButton
                      shipType="dreadnought"
                      index={index}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
    paddingBottom: 20,
  },
  endcontainer: {
    gap: 5,
    marginBottom: 10,
    padding: 5,
  },
  title: {
    color: Colors.white,
    fontSize: 28,
    textAlign: "center",
    fontFamily: "monospace",
    marginBottom: 10,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    borderColor: Colors.slate,
    borderWidth: 2,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  imageContainerHP: {
    flexDirection: "row",
    alignItems: "space-evenly",
  },
  shipTextHeader: {
    color: Colors.dark_gray,
    fontSize: 20,
    fontFamily: "monospace",
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: Colors.dark_gray,
    textAlign: "center",
    backgroundColor: Colors.slate,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  resetbutton: {
    alignSelf: "center",
    width: 125,
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "monospace",
    fontWeight: "bold",
    textAlign: "center",
  },
  hudImage: {
    width: 275,
    height: 260,
    resizeMode: "contain",
  },
  hudContainer: {
    position: "absolute",
    top: -50,
    right: -40,
    zIndex: -1,
  },
});
