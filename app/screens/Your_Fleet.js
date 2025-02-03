import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import EditButtonHP from "../../components/buttons/EditButtonHP";
import ToggleAttributeButton from "../../components/buttons/ToggleAttribute";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FactionImages } from "../../constants/FactionImages.js";

export default function Your_Fleet({ type, route }) {
  const navigation = useNavigation();
  const { shipClass } = route.params;

  const [selectedFaction, setSelectedFaction] = useState("");
  const [selectedShip, setSelectedShip] = useState("");
  const factionData = FactionImages[selectedFaction];

  const shipData = factionData ? factionData[selectedShip] : null;

  const classImage = shipData ? shipData.classImage : null;

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
    faction,
  } = useStarBoundContext();

  useEffect(() => {
    setSelectedFaction(faction);
    console.log(faction);
  }, [faction]);

/*   useFocusEffect(
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
          }; */

          /* setFighterImages(
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

  const onBackPress = () => {
    setShowCarrierClass(false);
    setShowDestroyerClass(false);
    setShowCruiserClass(false);
    setShowFighterClass(false);
    setShowDreadnoughtClass(false);
    navigation.navigate("Player");
  };
 */
  useEffect(() => {
    if (shipClass) {
      switch (shipClass) {
        case "fighter":
          setShowFighterClass(true);
          setSelectedShip("Fighter");
          break;
        case "destroyer":
          setShowDestroyerClass(true);
          setSelectedShip("Destroyer");
          break;
        case "carrier":
          setShowCarrierClass(true);
          setSelectedShip("Carrier");
          break;
        case "cruiser":
          setShowCruiserClass(true);
          setSelectedShip("Cruiser");
          break;
        case "dreadnought":
          setShowDreadnoughtClass(true);
          setSelectedShip("Dreadnought");
          break;
        default:
          break;
      }
    }
  }, [shipClass]);

  return (
    <SafeAreaView style={[styles.mainContainer]}>
      <StatusBar />
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: -10,
          }}
        >
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
          <View
            style={{
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={styles.textContainer}>
              Fighters - {fighterImages.length} Ships
            </Text>
          </View>
          {shipClass === "fighter" && (
            <View style={styles.imageRow}>
              <FlatList
                keyExtractor={(item, index) => item.id || index.toString()}
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                data={fighterImages}
                renderItem={({ item, index }) => (
                  <View key={item.id} style={styles.imageContainer}>
                    <View style={styles.toggleContainer}>
                      <EditButtonHP type="fighter" index={index} />
                      <ToggleAttributeButton shipType="fighter" index={index} />
                      <View style={styles.hudContainer}>
                        <Image style={styles.icon} source={classImage} />
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          )}

          <View
            style={{
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={styles.textContainer}>
              Destroyer - {destroyerImages.length} Ships
            </Text>
          </View>
          {shipClass === "destroyer" && setShowDestroyerClass && (
            <View style={styles.imageRow}>
              <FlatList
                keyExtractor={(item, index) => item.id || index.toString()}
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                data={destroyerImages}
                renderItem={({ item, index }) => (
                  <View key={item.id} style={styles.imageContainer}>
                    <View style={styles.toggleContainer}>
                      <EditButtonHP type="destroyer" index={index} />
                      <ToggleAttributeButton
                        shipType="destroyer"
                        index={index}/>
                      <View style={styles.hudContainer}>
                        <Image style={styles.icon} source={classImage} />
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          )}

          <View
            style={{
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={styles.textContainer}>
              Cruiser - {cruiserImages.length} Ships
            </Text>
          </View>
          {shipClass === "cruiser" && setShowCruiserClass && (
            <View style={styles.imageRow}>
              <FlatList
                keyExtractor={(item, index) => item.id || index.toString()}
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                data={cruiserImages}
                renderItem={({ item, index }) => (
                  <View key={item.id} style={styles.imageContainer}>
                    <View style={styles.toggleContainer}>
                      <EditButtonHP type="cruiser" index={index} />
                      <ToggleAttributeButton shipType="cruiser" index={index} />
                      <View style={styles.hudContainer}>
                        <Image style={styles.icon} source={classImage} />
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          )}

          <View
            style={{
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={styles.textContainer}>
              Carrier - {carrierImages.length} Ships
            </Text>
          </View>
          {shipClass === "carrier" && setShowCarrierClass && (
            <View style={styles.imageRow}>
              <FlatList
                keyExtractor={(item, index) => item.id || index.toString()}
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                data={carrierImages}
                renderItem={({ item, index }) => (
                  <View key={item.id} style={styles.imageContainer}>
                    <View style={styles.toggleContainer}>
                      <EditButtonHP type="carrier" index={index} />
                      <ToggleAttributeButton shipType="carrier" index={index} />
                      <View style={styles.hudContainer}>
                        <Image style={styles.icon} source={classImage} />
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          )}

          <View
            style={{
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={styles.textContainer}>
              Carrier - {dreadnoughtImages.length} Ships
            </Text>
          </View>
          {shipClass === "dreadnought" && setShowDreadnoughtClass && (
            <View style={styles.imageRow}>
              <FlatList
                keyExtractor={(item, index) => item.id || index.toString()}
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                data={dreadnoughtImages}
                renderItem={({ item, index }) => (
                  <View key={item.id} style={styles.imageContainer}>
                    <View style={styles.toggleContainer}>
                      <EditButtonHP type="dreadnought" index={index} />
                      <ToggleAttributeButton
                        shipType="dreadnought"
                        index={index}/>
                    </View>
                    <View style={styles.hudContainer}>
                      <Image style={styles.icon} source={classImage} />
                    </View>
                  </View>
                )}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
const { height, width } = Dimensions.get("window");

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
    justifyContent: "space-evenly",
    marginRight: 8,
    height: "60%",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
  },
  toggleContainer: {
    flexDirection: "row",
    alignSelf: "center",
    padding: 10,
  },
  textContainer: {
    color: Colors.hudDarker,
    fontWeight: "bold",
    top: "44%",
    fontSize: 17,
    textAlign: "center",
    backgroundColor: Colors.hud,
    width: "60%",
    borderRadius: 10,
  },
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
  icon: {
    width: width * 0.2,
    height: height * 0.2,
    resizeMode: "center",
  },
  hudContainer: {
    justifyContent: "center",
  },
});
