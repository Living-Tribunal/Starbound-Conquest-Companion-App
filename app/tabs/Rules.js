import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
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
                bottom: 10,
                flexDirection: "row",
              }}
            >
              <Text style={styles.subHeaderText}>
                Below, you'll find all the essential rules you need to master
                the game and embark on your journey to victory. For a deeper
                dive into the unique strategies and actions you can take, tap
                the 'Special Orders' button to explore all the available Special
                Orders and elevate your gameplay.
              </Text>
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 25,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SpecialOrdersScreen");
              }}
              style={styles.TouchableOpacityStyleButton}
            >
              <Image
                style={[
                  styles.textContainer2,
                  {
                    tintColor: Colors.darker_green_toggle,
                    width: 175,
                    height: 90,
                  },
                ]}
                source={require("../../assets/images/hud2.png")}
              />
              <Text style={[styles.textSection2]}>Special Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Game Lore");
              }}
              style={styles.TouchableOpacityStyleButton}
            >
              <Image
                style={[
                  styles.textContainer2,
                  {
                    tintColor: Colors.darker_green_toggle,
                    width: 175,
                    height: 90,
                  },
                ]}
                source={require("../../assets/images/hud2.png")}
              />
              <Text style={[styles.textSection2]}>Factions</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rulesSection}>
            <View style={styles.textSectionContainer}>
              <Text style={styles.textSection}>Movement Basics</Text>
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

          <View style={styles.rulesSection}>
            <View style={styles.textSectionContainer}>
              <Text style={styles.textSection}>Hit Roll</Text>
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
              <Text style={styles.textSection}>Damage Roll</Text>
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
          <View style={styles.rulesSection}>
            <View style={styles.textSectionContainer}>
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
                <Text style={styles.rulerCatHeader}>Line of Sight:</Text> Ensure
                there are no obstacles blocking the direct path to the target.
                If an obstacle is present, the shot is blocked.
              </Text>
            </View>
          </View>

          {/* ///weapon types */}
          <View style={styles.rulesSection}>
            <View style={styles.textSectionContainer}>
              <Text style={[styles.textSection]}>Weapon Ranges and Arcs</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              top: 5,
              bottom: 5,
              flexDirection: "row",
            }}
          >
            <Text style={styles.subHeaderText}>
              Tap a weapon type for more information.
            </Text>
          </View>
          <View style={styles.imageRow}>
            {Object.entries(weapons).map(([key, type]) => (
              <TouchableOpacity
                style={styles.TouchableOpacityStyleButtonWeapon}
                key={key}
                onPress={() => {
                  navigation.navigate("WeaponTypes", { type, key });
                }}
              >
                <View style={styles.mainTypeContainer}>
                  {/* Weapon Name */}
                  <Text style={styles.weaponName}>{key}</Text>
                  {/* Background Image */}
                </View>
              </TouchableOpacity>
            ))}
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textSection: {
    fontFamily: "LeagueSpartan-Light",
    color: Colors.hud,
    fontSize: 14,
    textAlign: "center",
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
    width: "50%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
    backgroundColor: Colors.hudDarker,
    padding: 5,
    margin: 5,
  },
  TouchableOpacityStyleButton: {
    textAlign: "center",
    justifyContent: "center",
    width: "40%",
  },
  textBody: {
    color: Colors.white,
    fontFamily: "LeagueSpartan-Regular",
    fontSize: 12,
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
    padding: 5,
  },
  exampleContainer: {
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
    margin: 5,
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
    width: 145,
    height: 100,
  },
  weaponName: {
    fontSize: 12,
    fontFamily: "LeagueSpartan-ExtraBold",
    color: Colors.hudDarker,
    textAlign: "center",
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignContent: "center",
  },
  mainTypeContainer: {
    padding: 5,
  },
  rulerCatHeader: {
    fontFamily: "LeagueSpartan-Regular",
    color: Colors.statDarker,
    fontSize: 12,
  },
  TouchableOpacityStyleButtonWeapon: {
    borderWidth: 1,
    borderColor: Colors.hudDarker,
    borderRadius: 5,
    padding: 5,
    backgroundColor: Colors.hud,
    alignSelf: "center",
    width: "35%",
    margin: 5,
  },
});
