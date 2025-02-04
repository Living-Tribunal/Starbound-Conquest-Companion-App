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
import { weapons } from "./constants/weapons.js";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

export default function SpecialOrders() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.mainContainer]}>
      <GestureHandlerRootView>
        <StatusBar />
        <ScrollView>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.navigate("Rules")}>
              <Image
                style={styles.image}
                source={require("../../assets/icons/icons8-back-arrow-50.png")}
              />
            </TouchableOpacity>
            <Text style={[styles.text, { left: 40 }]}>Special Orders</Text>
          </View>

          <View style={styles.rulesSection}>
            <Text style={styles.headerText}>All Ahead Full:</Text>
            <Text style={styles.textBody}>
              {" "}
              Roll 2d10. The result is the additional feet the ship can move
              that turn.
            </Text>
            <Text style={{ fontWeight: "bold", color: "#ff2b2b" }}>
              Restriction:
            </Text>
            <Text style={styles.textBody}>
              {" "}
              Ships that use All Ahead Full cannot fire any weapons until their
              next turn. This simulates the focus on maximum speed and
              maneuverability at the cost of offensive capability.
            </Text>

            <Text style={styles.headerText}>Anti Fighter Barrage:</Text>
            <Text style={styles.textBody}>
              {" "}
              Roll 1d20, on an 11 or higher, this ship cannon be targeted by
              Anti-Fighter Barrage this turn and attack rolls against it are
              made with disadvantage.
            </Text>

            <Text style={styles.headerText}>Combine Fire:</Text>
            <Text style={styles.textBody}>
              {" "}
              You can choose and number of ships with this maneuver to combine
              fire against a target that is within the weapon's range of each
              ship involved. When you do so, roll 1d20, if the attack hits, roll
              the damage dice for all the ships and add their totals together
              and compare against the target's soak value to deal damage as
              normal. If the attack misses, all ships miss.
            </Text>

            <Text style={styles.headerText}>Anti-Fire Barrage:</Text>
            <Text style={styles.textBody}>
              {" "}
              For up to six Fighters within 60ft of your ship, you can roll 1d6.
              On a 6, that Fighter is destroyed.
            </Text>

            <Text style={styles.headerText}>Power Up Main Guns:</Text>
            <Text style={styles.textBody}>
              {" "}
              Roll 1d20, on an 11 or higher, you can upgrade the die type of
              your weapon by one step, ex. 1d6 to 1d8.
            </Text>

            <Text style={styles.headerText}>All Systems Fire:</Text>
            <Text style={styles.textBody}>
              {" "}
              Roll 1d20, on an 11 or higher, you can fire another weapon
              avaliable to the ship. Weapon's whose firing arc is to the sides
              can be selected to fire again if they target a ship on the
              opposite side of the one that already was fired upon.
            </Text>

            <Text style={styles.headerText}>Reinforce Shields:</Text>
            <Text style={styles.textBody}>
              {" "}
              Roll 1d20, on an 11 or higher, you regain 1hp.
            </Text>

            <Text style={styles.headerText}>Broadside:</Text>
            <Text style={styles.textBody}>
              {" "}
              Roll 1d20, on an 11 or higher, you can move 15ft in the direction
              you're facing, rotate 90 degrees and fire a weapon with a firing
              arc that faces the sides.
            </Text>

            <Text style={styles.headerText}>Launch Fighters:</Text>
            <Text style={styles.textBody}>
              {" "}
              Roll 1d20, deploy or collect up to the number of Fighters rolled.
              For each turn you take this maneuver in a row, you can add an
              additional +5 to the die result.
            </Text>

            <Text style={styles.headerText}>Charge Ion Beams:</Text>
            <Text style={styles.textBody}>
              Roll 1d20, on an 11 or higher, your Ion Particle Beam Recharges
              and can fire again.
            </Text>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  rulesSection: {
    padding: 20,
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
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 20,
  },
  textBody: {
    color: Colors.hud,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    fontFamily: "leagueRegular",
    lineHeight: 20,
    textAlign: "justify",
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.underTextGray,
    borderRadius: 5,
  },
  headerText: {
    fontWeight: "bold",
    color: Colors.white,
    fontSize: 15,
    fontFamily: "leagueBold",
    marginBottom: 5,
  },
});
