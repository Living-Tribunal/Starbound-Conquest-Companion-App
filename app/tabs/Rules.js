import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Pressable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { weapons } from "../../constants/weapons.js";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

export default function Rules() {
  const [showText, setShowText] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();

  const handlePress = () => {
    setShowText(!showText);
  };

  return (
    <SafeAreaView style={[styles.mainContainer]}>
      <GestureHandlerRootView>
        <StatusBar />
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
                right: 10,
                flexDirection: "row",
              }}
            >
              <Text style={styles.subHeaderText}>
                Welcome to Starbound Conquest! Below, you'll find all the
                essential rules you need to master the game and embark on your
                journey to victory. For a deeper dive into the unique strategies
                and actions you can take, tap the 'Special Orders' button to
                explore all the available Special Orders and elevate your
                gameplay.
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SpecialOrders");
              }}
              style={styles.TouchableOpacityStyleButton}
            >
              <Image
                style={[styles.textContainer2, {tintColor:Colors.darker_green_toggle}]}
                source={require("../../assets/images/hud2.png")}
              />
              <Text style={[styles.textSection2]}>Special Orders</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rulesSection}>
            <View style={styles.textSectionContainer}>
            <Image
                style={styles.textContainer2}
                source={require("../../assets/images/hud2.png")}
              />
              <Text style={styles.textSection}>Movement Basics:</Text>
            </View>
            <View style={styles.textBodyContainer}>
              <Text style={styles.textBody}>
                <Text style={styles.rulerCatHeader}>Player Turn Sequence:</Text>{" "}
                All movement and combat actions are resolved during each
                player's turn.
              </Text>
              <Text style={styles.textBody}>
                <Text style={styles.rulerCatHeader}>Movement Distance:</Text>{" "}
                Each ship can move a number of feet equal to, or less than, its
                Move Distance each turn.
              </Text>
            </View>
          </View>

          {/* ////combat actions */}
          {/* <View style={styles.imageContainer}>
            <Image
              style={styles.textContainer}
              source={require("../../assets/images/rulesheader-01.png")}
            />
          </View> */}
          <View style={styles.rulesSection}>
            <View style={styles.textSectionContainer}>
            <Image
                style={styles.textContainer2}
                source={require("../../assets/images/hud2.png")}
              />
              <Text style={styles.textSection}>Hit Roll:</Text>
            </View>
            <View style={styles.textBodyContainer}>
              <Text style={styles.textBody}>
                <Text style={styles.rulerCatHeader}>Check for Obstacles:</Text>{" "}
                Ensure there are no obstacles blocking the direct path to the
                target. If an obstacle is present, the shot is blocked.
              </Text>
              <Text style={styles.textBody}>
                <Text style={styles.rulerCatHeader}>Roll the Dice:</Text> Roll a
                d20
              </Text>
              <Text style={styles.textBody}>
                <Text style={styles.rulerCatHeader}>Check Against To Hit:</Text>{" "}
                Compare the result to the target's To Hit number. If your roll
                is equal to or higher than the target's To Hit number, you hit!
              </Text>
            </View>
          </View>


          <View style={styles.rulesSection}>
            <View style={styles.textSectionContainer}>
            <Image
                style={styles.textContainer2}
                source={require("../../assets/images/hud2.png")}
              />
              <Text style={styles.textSection}>Damage Roll:</Text>
            </View>
            <View style={styles.textBodyContainer}>
              <Text style={styles.textBody}>
                <Text style={styles.rulerCatHeader}>If the Attack Hits:</Text>{" "}
                Proceed with the following steps
              </Text>
              <Text style={styles.textBody}>
                <Text style={styles.rulerCatHeader}>Roll Damage:</Text> Roll the
                appropriate dice for the weapon to determine the amount of
                damage dealt.
              </Text>
              <Text style={styles.textBody}>
                <Text style={styles.rulerCatHeader}>
                  Check Against Target's Soak:
                </Text>{" "}
                Compare the rolled damage to the target ship's Soak. If the
                damage meets or exceeds this threshold, the ship takes damage;
                otherwise, it withstands the attack.
              </Text>
            </View>
          </View>

          {/*  ///Firings */}
          <View style={[styles.Section]}>
            {/* <View style={styles.imageContainer}>
               <Text style={styles.textHeader}>Firing Mechanics</Text> 
              <Image
                style={styles.textContainer}
                source={require("../../assets/images/rulesheader-01.png")}
              />
            </View>*/}
            <View style={styles.rulesSection}>
              <View style={styles.textSectionContainer}>
                <Image
                  style={styles.textContainer2}
                  source={require("../../assets/images/hud2.png")}
                />
                <Text style={styles.textSection}>Range Measurement</Text>
              </View>
              <View style={styles.textBodyContainer}>
                <Text style={styles.textBody}>
                  <Text style={styles.rulerCatHeader}>Weapon Firing Arcs:</Text>{" "}
                  Weapons without a 360-degree firing arc must use one of the
                  following 90-degree firing arcs: forward, aft, portside, or
                  starboard.
                </Text>
                <View style={styles.exampleContainer}>
                  <Image
                    source={require("../../assets/images/arcs/firingarc.png")}
                    style={{ height: 150, width: 150 }}
                  />
                </View>
                <Text style={styles.textBody}>
                  <Text style={styles.rulerCatHeader}>Range:</Text> To determine
                  if a target is within range, measure from the center of the
                  firing ship to the center of the target ship using the in-game
                  ruler.
                </Text>
                <Text style={styles.textBody}>
                  <Text style={styles.rulerCatHeader}>Line of Sight:</Text>{" "}
                  Ensure there are no obstacles blocking the direct path to the
                  target. If an obstacle is present, the shot is blocked.
                </Text>
              </View>
            </View>
          </View>

          {/* ///weapon types */}
          <View style={[styles.Section]}>
            {/*  <View style={styles.imageContainer}>
               <Text style={styles.textHeader}>Weapon Types</Text> 
              <Image
                style={styles.textContainer}
                source={require("../../assets/images/rulesheader-01.png")}
              />
            </View>*/}
            <View style={styles.rulesSection}>
              <View style={styles.textSectionContainer}>
              <Image
                  style={styles.textContainer2}
                  source={require("../../assets/images/hud2.png")}
                />
                <Text style={[styles.textSection, { fontSize: 15 }]}>
                  Weapon Ranges and Arcs
                </Text>
              </View>
            </View>
            <View style={styles.imageRow}>
              {Object.entries(weapons).map(([key, type], index) => (
                <View key={key} style={styles.imageContainer}>
                  <View style={styles.mainTypeContainer}>
                    <Text style={styles.weaponName}>{key}</Text>
                    <Text style={styles.weaponName}>{type.range}</Text>
                    <Text style={styles.weaponName}>{type.firingarc}</Text>
                    <Image
                      style={styles.typeContainer}
                      source={require("../../assets/images/typecont.png")}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  mainContainer: {
    flexGrow: 1,
    backgroundColor: Colors.dark_gray,
  },
  text: {
    color: Colors.misty_blue,
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "aboreto",
  },
  rulesSection: {
    flex: 1,
    padding: 5,
  },
  textSection: {
    fontFamily: "leagueRegular",
    color: Colors.hud,
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "bold",
    position: "absolute",
  },
  textSection2: {
    fontFamily: "leagueRegular",
    color: Colors.green_toggle,
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "bold",
    position: "absolute",
  },
  textSectionSpecial: {
    fontFamily: "monospace",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    padding: 5,
  },
  textSectionContainer: {
    textAlign: "center",
    justifyContent: "center",
    resizeMode: "container",
    left: 5,
    right: 5,
  },
  TouchableOpacityStyleButton: {
    textAlign: "center",
    justifyContent: "center",
    left: 5,
    right: 5,
    width: "75%",
  },
  textBody: {
    color: Colors.white,
    flex: 1,
    fontFamily: "monospace",
    fontSize: 13,
  },
  textHeader: {
    color: Colors.hud,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "aboreto",
  },
  textHeaderTop: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "aboreto",
  },
  textBodyContainer: {
    backgroundColor: "transparent",
  },
  exampleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  subHeaderText: {
    fontFamily: "monospace",
    color: Colors.white,
    fontSize: 9,
    textAlign: "center",
    backgroundColor: Colors.underTextGray,
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
    marginTop: 5,
  },
  textContainer: {
    position: "absolute",
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    backgroundColor: "transparent",
    margin: 20,
  },
  textContainer2: {
    resizeMode: "center",
    alignSelf: "center",
    width: 250,
    height: 90,
  },
  typeContainer: {
    position: "absolute",
    resizeMode: "contain",
    alignSelf: "center",
    width: 150,
    height: 120,
  },
  weaponName: {
    fontSize: 10,
    color: Colors.white,
    textAlign: "center",
    top: 25,
  },
  Section: {
    margin: 5,
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignContent: "center",
    padding: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  mainTypeContainer: {
    margin: 5,
    marginHorizontal: 5,
    padding: 5,
    alignItems: "center",
  },
  rulerCatHeader: {
    fontWeight: "bold",
    color: Colors.statDarker,
    fontSize: 16,
  },
});
