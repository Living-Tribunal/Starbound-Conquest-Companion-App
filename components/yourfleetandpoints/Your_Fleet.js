import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import EditButtonHP from "../buttons/EditButtonHP";
import ToggleAttributeButton from "../buttons/ToggleAttribute";
import ToggleDone from "../buttons/ToggleDone";
import { useStarBoundContext } from "../Global/StarBoundProvider";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Your_Fleet() {
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
    toggleDoneStates, 
    setToggleDoneStates
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
          const savedDreadnoughtCount = await AsyncStorage.getItem("dreadnoughtCount");
          const savedCruiserCount = await AsyncStorage.getItem("cruiserCount");
          const savedDestroyerCount = await AsyncStorage.getItem("destroyerCount");

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

  const onLongPress = () => resetToggles();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.endcontainer}></View>
        <ScrollView style={styles.scrollView}>
          <Pressable
            onPress={handlePressFi}
            style={({ pressed }) => [
              styles.textSectionSpecial,
              {
                backgroundColor: pressed ? Colors.dark_gray : Colors.dark_gray,
              },
            ]}
          >
            <View style={styles.textSectionContainer}>
              <Text style={styles.shipTextHeader}>
                Fighters - {fighterImages.length} Ships
              </Text>
            </View>
          </Pressable>

          {showFighterClass && (
            <View style={styles.imageRow}>
              {fighterImages.map((image, index) => (
                <View key={image.id} style={styles.imageContainer}>
                  {/* <ToggleDone type="fighter1" index={index} /> */}
                  <View style={styles.toggleContainer}>
                    <EditButtonHP type="fighter" index={index} />
                    <ToggleAttributeButton type="fighter" index={index} />
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
                    <ToggleAttributeButton type="destroyer" index={index} />
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
                    <ToggleAttributeButton type="cruiser" index={index} />
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
                    <ToggleAttributeButton type="carrier" index={index} />
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
                    <ToggleAttributeButton type="dreadnought" index={index} />
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
});
