import { StyleSheet, Text, View, StatusBar, Image,  Pressable } from "react-native";
import React, { useState } from 'react';
import { Colors } from "@/constants/Colors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";


export default function Rules() {
    const [showText, setShowText] = useState(false);
    
    const handlePress = () => {
        setShowText(!showText);
    };

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.textHeader}>Movement Rules</Text>
          <View style={styles.rulesSection}>
            <View style={styles.textSectionContainer}>
              <Text style={styles.textSection}>Movement Basics:</Text>
            </View>
            <View style={styles.textBodyContainer}>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Player Turn Sequence:
                </Text>{" "}
                All movement and combat actions are resolved during each
                player's turn.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Movement Distance:
                </Text>{" "}
                Each ship can move a number of feet equal to, or less than, its
                Move Distance each turn.
              </Text>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <Pressable onPress={handlePress} style={({ pressed }) => [
                styles.textSectionSpecial,
                {
                  backgroundColor: pressed ? Colors.goldenrod : Colors.gold,
                },
              ]}>
            <View style={styles.textSectionContainer}>
              <Text style={styles.textSectionSpecial}>Special Orders :</Text>
            </View>    
            </Pressable>
            {showText && (
            <View style={styles.textBodyContainer}>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  All Ahead Full:
                </Text>{" "}
                Roll 2d10. The result is the additional feet the ship can move
                that turn.
              </Text>
              <Text style={styles.textBody}>
                <Text style={{ fontWeight: "bold", color: "#ff2b2b" }}>
                  Restriction:
                </Text>{" "}
                Ships that use All Ahead Full cannot fire any weapons until
                their next turn. This simulates the focus on maximum speed and
                maneuverability at the cost of offensive capability.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Evasive Maneuvers:
                </Text>{" "}
                Roll 1d20, on an 11 or higher, this ship cannon be targeted by
                Anti-Fighter Barrage this turn and attack rolls against it are
                made with disadvantage.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Combine Fire:
                </Text>{" "}
                You can choose and number of ships with this maneuver to combine
                fire against a target that is within the weapon's range of each
                ship involved. When you do so, roll 1d20, if the attack hits,
                roll the damage dice for all the ships and add their totals
                together and compare against the target's soak value to deal
                damage as normal. If the attack misses, all ships miss.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Anti-Fire Barrage:
                </Text>{" "}
                For up to six Fighters within 60ft of your ship, you can roll
                1d6. On a 6, that Fighter is destroyed.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Power Up Main Guns:
                </Text>{" "}
                Roll 1d20, on an 11 or higher, you can upgrade the die type of
                your weapon by one step, ex. 1d6 to 1d8.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  All Systems Fire:
                </Text>{" "}
                Roll 1d20, on an 11 or higher, you can fire another weapon
                avaliable to the ship. Weapon's whose firing arc is to the sides
                can be selected to fire again if they target a ship on the
                opposite side of the one that already was fired upon.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Reinforce Shields:
                </Text>{" "}
                Roll 1d20, on an 11 or higher, you regain 1hp.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Broadside:
                </Text>{" "}
                Roll 1d20, on an 11 or higher, you can move 15ft in the
                direction you're facing, rotate 90 degrees and fire a weapon
                with a firing arc that faces the sides.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Launch Fighters:
                </Text>{" "}
                Roll 1d20, deploy or collect up to the number of Fighters
                rolled. For each turn you take this maneuver in a row, you can
                add an additional +5 to the die result.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Charge Ion Beams:
                </Text>{" "}
                Roll 1d20, on an 11 or higher, your Ion Particle Beam Recharges
                and can fire again.
              </Text>
            </View>
        )}
          </View>
          <Text style={styles.textHeader}>Combat System</Text>
          <View style={styles.rulesSection}>
            <View style={styles.textSectionContainer}>
              <Text style={styles.textSection}>Hit Roll:</Text>
            </View>
            <View style={styles.textBodyContainer}>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Check for Obstacles:
                </Text>{" "}
                Ensure there are no obstacles blocking the direct path to the
                target. If an obstacle is present, the shot is blocked.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Roll the Dice:
                </Text>{" "}
                Roll a d20
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Check Against To Hit:
                </Text>{" "}
                Compare the result to the target's To Hit number. If your roll is
                equal to or higher than the target's To Hit number, you hit!
              </Text>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.textSectionContainer}>
              <Text style={styles.textSection}>Damage Roll:</Text>
            </View>
            <View style={styles.textBodyContainer}>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  If the Attack Hits:
                </Text>{" "}
                Proceed with the following steps
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Roll Damage:
                </Text>{" "}
                Roll the appropriate dice for the weapon to determine the amount
                of damage dealt.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Check Against Target's Soak:
                </Text>{" "}
                Compare the rolled damage to the target ship's Soak.
                If the damage meets or exceeds this threshold, the ship takes
                damage; otherwise, it withstands the attack.
              </Text>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <Text style={styles.textHeader}>Firing Mechanics</Text>
            <View style={styles.textSectionContainer}>
              <Text style={styles.textSection}>Range Measurement</Text>
            </View>
            <View style={styles.textBodyContainer}>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Weapon Firing Arcs:
                </Text>{" "}
                Weapons without a 360-degree firing arc must use one of the
                following 90-degree firing arcs: forward, aft, portside, or
                starboard.
              </Text>
              <View style={styles.exampleContainer}>
                <Image
                  source={require("../../assets/images/arcs/firingarc.png")}
                  style={{ height: 250, width: 250 }}
                />
              </View>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Range:
                </Text>{" "}
                To determine if a target is within range, measure from the
                center of the firing ship to the center of the target ship using
                the in-game ruler.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 14,
                  }}
                >
                  Line of Sight:
                </Text>{" "}
                Ensure there are no obstacles blocking the direct path to the
                target. If an obstacle is present, the shot is blocked.
              </Text>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.textSectionContainer}>
              <Text style={styles.textSection}>Weapon Ranges and Arcs</Text>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableCellHeader}>Light Cannon</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>30ft</Text>
              </View>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>Forward(90°)</Text>
              </View>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableCellHeader}>Medium Cannon</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>30ft</Text>
              </View>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>Forward(90°)</Text>
              </View>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableCellHeader}>Heavy Cannon</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>30ft</Text>
              </View>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>Forward(90°)</Text>
              </View>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableCellHeader}>Plasma Cannon</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>60ft</Text>
              </View>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>Portside/Starboard(90°)</Text>
              </View>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableCellHeader}>350mm Railgun</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>30ft-120ft</Text>
              </View>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>Forward/Aft(90°)</Text>
              </View>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableCellHeader}>Missile Battery</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>15ft-60ft</Text>
              </View>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>All(360°)</Text>
              </View>
            </View>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableCellHeader}>Ion Particle Branch</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>30ft-60ft</Text>
              </View>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>Forward(90°)</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  textSection: {
    fontFamily: "monospace",
    color: Colors.dark_gray,
    textAlign: "center",
    fontSize: 16,
    backgroundColor: Colors.slate,
    fontWeight: "bold",
    marginBottom: 5,
    padding: 5,
  },
  textSectionSpecial: {
    fontFamily: "monospace",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    padding: 5,
  },
  textSectionContainer: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    marginLeft: 5,
    marginRight: 5,
  },
  textBody: {
    color: Colors.white,
    flex: 1,
    fontFamily: "monospace",
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
    fontSize: 13,
  },
  textHeader: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "aboreto",
    marginBottom: 20,
    marginTop: 20,
  },
  textBodyContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
    paddingTop: 10,
    paddingBottom: 10,
  },
  exampleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.misty_blue,
    marginLeft: 5,
    marginRight: 5,
  },
  tableHeaderContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
    alignItems: "center",
    padding: 3,
  },
  tableHeader: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  tableCellHeader: {
    color: Colors.slate,
    fontSize: 13,
    fontFamily: "monospace",
    padding: 3,
    fontWeight: "bold",
  },
});
