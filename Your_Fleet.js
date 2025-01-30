import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import EditButtonHP from "./components/buttons/EditButtonHP.js";
import ToggleAttributeButton from "./components/buttons/ToggleAttribute.js";
import { useStarBoundContext } from "./components/Global/StarBoundProvider.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FactionImages } from "./constants/FactionImages.js";

export default function Your_Fleet({ type, route }) {
  const navigation = useNavigation();
  const { shipClass } = route.params;

  const [selectedFaction, setSelectedFaction] = useState("");
  const [selectedShip, setSelectedShip] = useState("");
  const factionData = FactionImages[selectedFaction];

  const shipData = factionData ? factionData[selectedShip] : null;

  const classImage = shipData ? shipData.classImage : null;

  console.log("Faction Data:", factionData);
console.log("Selected Ship:", selectedShip);

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
    setShowFighterClass,
    setShowDestroyerClass,
    setShowCarrierClass,
    setShowCruiserClass,
    setShowDreadnoughtClass,
    faction
  } = useStarBoundContext();

  useEffect(() => {
    setSelectedFaction(faction);
    console.log(faction);
  }, [faction]);

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

  useEffect(() => {
    if (shipClass) {
    switch (shipClass) {
      case "fighter":
        setShowFighterClass(true);
        setSelectedShip('Fighter');
        break;
      case "destroyer":
        setShowDestroyerClass(true);
        setSelectedShip('Destroyer');
        break;
      case "carrier":
        setShowCarrierClass(true);
        setSelectedShip('Carrier');
        break;
      case "cruiser":
        setShowCruiserClass(true);
        setSelectedShip('Cruiser');
        break;
      case "dreadnought":
        setShowDreadnoughtClass(true);
        setSelectedShip('Dreadnought');
        break;
      default:
        break;
    }
}
  }, [shipClass]);

  const onBackPress = () => {
    setShowCarrierClass(false);
    setShowDestroyerClass(false);
    setShowCruiserClass(false);
    setShowFighterClass(false);
    setShowDreadnoughtClass(false);
    setSelectedShip("");
    navigation.navigate("Player");
  };

  return (
    <SafeAreaView style={[styles.mainContainer]}>
      <StatusBar />
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: -10 }}>
          <TouchableOpacity
            onPress={() => {
              onBackPress();
            }}
          >
            <Image
              style={styles.image}
              source={require("../../assets/icons/icons8-back-arrow-50.png")}
            />
          </TouchableOpacity>
          <Text style={[styles.text, { left: 40 }]}>Your Fleet</Text>
        </View>
        <View style={styles.endcontainer}></View>
        <ScrollView style={styles.scrollView}>
          <Pressable
            onPress={handlePressFi}
            style={({ pressed }) => [styles.textSectionSpecial]}
          >
            {({ pressed }) => (
              <View
                style={{
                  position: "relative",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Image
                  style={{
                    width: 380,
                    height: 100,
                    tintColor: pressed ? Colors.gold : Colors.hud,
                  }}
                  source={require("../../assets/images/hudcont.png")}
                />
                <Text
                  style={{
                    position: "absolute",
                    color: Colors.hudDarker,
                    fontWeight: "bold",
                    top: "44%",
                    fontSize: 17,
                    textAlign: "center",
                    backgroundColor: Colors.hud,
                    width: "60%",
                  }}
                >
                  Fighters - {fighterImages.length} Ships
                </Text>
              </View>
            )}
          </Pressable>
          {shipClass === "fighter" && setShowFighterClass && (
            <View style={styles.imageRow}>
              {fighterImages.map((image, index) => (
                <View key={image.id} style={styles.imageContainer}>
                  <View style={styles.toggleContainer}>
                    <EditButtonHP type="fighter" index={index} />
                    <ToggleAttributeButton shipType="fighter" index={index} />
                    <View style={styles.hudContainer}>
                        <Image
                          style={styles.icon}
                          source={classImage}
                        />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={handlePressDe}
            style={({ pressed }) => [styles.textSectionSpecial]}
          >
            {({ pressed }) => (
              <View
                style={{
                  position: "relative",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Image
                  style={{
                    width: 380,
                    height: 100,
                    tintColor: pressed ? Colors.gold : Colors.hud,
                  }}
                  source={require("../../assets/images/hudcont.png")}
                />
                <Text
                  style={{
                    position: "absolute",
                    color: Colors.hudDarker,
                    fontWeight: "bold",
                    top: "44%",
                    fontSize: 17,
                    textAlign: "center",
                    backgroundColor: Colors.hud,
                    width: "60%",
                  }}
                >
                  Destroyers - {destroyerImages.length} Ships
                </Text>
              </View>
            )}
          </Pressable>

          {shipClass === "destroyer" && setShowDestroyerClass && (
            <View style={styles.imageRow}>
              {destroyerImages.map((image, index) => (
                <View key={image.id} style={styles.imageContainer}>
                  <View style={styles.toggleContainer}>
                    <EditButtonHP type="destroyer" index={index} />
                    <ToggleAttributeButton shipType="destroyer" index={index} />
                    <View style={styles.hudContainer}>
                    <Image
                          style={styles.icon}
                          source={classImage}
                        />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={handlePressCr}
            style={({ pressed }) => [styles.textSectionSpecial]}
          >
            {({ pressed }) => (
              <View
                style={{
                  position: "relative",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Image
                  style={{
                    width: 380,
                    height: 100,
                    tintColor: pressed ? Colors.gold : Colors.hud,
                  }}
                  source={require("../../assets/images/hudcont.png")}
                />
                <Text
                  style={{
                    position: "absolute",
                    color: Colors.hudDarker,
                    fontWeight: "bold",
                    top: "44%",
                    fontSize: 17,
                    textAlign: "center",
                    backgroundColor: Colors.hud,
                    width: "60%",
                  }}
                >
                  Cruisers - {cruiserImages.length} Ships
                </Text>
              </View>
            )}
          </Pressable>

          {shipClass === "cruiser" && setShowCruiserClass && (
            <View style={styles.imageRow}>
              {cruiserImages.map((image, index) => (
                <View key={image.id} style={styles.imageContainer}>
                  {/* <ToggleDone type="fighter1" index={index} /> */}
                  <View style={styles.toggleContainer}>
                    <EditButtonHP type="cruiser" index={index} />
                    <ToggleAttributeButton shipType="cruiser" index={index} />
                    <View style={styles.hudContainer}>
                   
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={handlePressCa}
            style={({ pressed }) => [styles.textSectionSpecial]}
          >
            {({ pressed }) => (
              <View
                style={{
                  position: "relative",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Image
                  style={{
                    width: 380,
                    height: 100,
                    tintColor: pressed ? Colors.gold : Colors.hud,
                  }}
                  source={require("../../assets/images/hudcont.png")}
                />
                <Text
                  style={{
                    position: "absolute",
                    color: Colors.hudDarker,
                    fontWeight: "bold",
                    top: "44%",
                    fontSize: 17,
                    textAlign: "center",
                    backgroundColor: Colors.hud,
                    width: "60%",
                  }}
                >
                  Carriers - {carrierImages.length} Ships
                </Text>
              </View>
            )}
          </Pressable>

          {shipClass === "carrier" && setShowCarrierClass && (
            <View style={styles.imageRow}>
              {carrierImages.map((image, index) => (
                <View key={image.id} style={styles.imageContainer}>
                  {/* <ToggleDone type="fighter1" index={index} /> */}
                  <View style={[styles.toggleContainer]}>
                    <EditButtonHP type="carrier" index={index} />
                    <ToggleAttributeButton shipType="carrier" index={index} />
                    <View style={[styles.hudContainer, {paddingTop: 20,}]}>
                        <Image
                          style={styles.icon}
                          source={classImage}
                        />
                    </View>
                    </View>
                  </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={handlePressDr}
            style={({ pressed }) => [styles.textSectionSpecial]}
          >
            {({ pressed }) => (
              <View
                style={{
                  position: "relative",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Image
                  style={{
                    width: 380,
                    height: 100,
                    tintColor: pressed ? Colors.gold : Colors.hud,
                  }}
                  source={require("../../assets/images/hudcont.png")}
                />
                <Text
                  style={{
                    position: "absolute",
                    color: Colors.hudDarker,
                    fontWeight: "bold",
                    top: "44%",
                    fontSize: 17,
                    textAlign: "center",
                    backgroundColor: Colors.hud,
                    width: "60%",
                  }}
                >
                  Dreadnought - {dreadnoughtImages.length} Ships
                </Text>
              </View>
            )}
          </Pressable>

          {shipClass === "dreadnought" && setShowDreadnoughtClass && (
            <View style={styles.imageRow}>
              {dreadnoughtImages.map((image, index) => (
                <View key={image.id} style={styles.imageContainer}>
                  {/* <ToggleDone type="fighter1" index={index} /> */}
                  <View style={[styles.toggleContainer]}>
                    <EditButtonHP type="dreadnought" index={index} />
                    <ToggleAttributeButton shipType="dreadnought" index={index} />
                    <View style={[styles.hudContainer, {paddingTop: 20,}]}>
                      {/* <Image
                        style={[styles.hudImage,{left: "15%",width: 450, height: 400, marginTop: 10, transform: [{rotate: '270deg'}]}]}
                        source={require("../../assets/images/shipcont.png")}
                      /> */}
                    </View>
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
    borderWidth: 2,
    borderColor: Colors.hudDarker,
    marginLeft: 11,
    marginRight: 8,
    paddingBottom:10
  },
  imageContainer: {
  },
  imageContainerHP: {
    flexDirection: "row",
    alignItems: "space-evenly",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding:10,
    marginBottom: 20,
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
  hudImage: {
    width: 270,
    height: 200,
    resizeMode: "contain",
  },
  /* hudContainer: {
    position: "absolute",
    top: -20,
    right: -30,
    zIndex: -1,
    borderWidth:
  }, */
  text: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "leagueRegular",
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: Colors.white,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  icon:{
    resizeMode: "contain",
  }
});
