import { StyleSheet, Text, View, StatusBar, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
export default function Rules() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.textHeader}>Movement Rules</Text>
          <View style={styles.rulesSection}>
            <View style={styles.textSectionContainer}>
              <Text style={styles.textSection}>Hex Movement Basics:</Text>
            </View>
            <View style={styles.textBodyContainer}>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 16,
                  }}
                >
                  Hex Measurement:
                </Text>{" "}
                Each hex represents a distance of 5 feet.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 16,
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
                    fontSize: 16,
                  }}
                >
                  Movement Distance:
                </Text>{" "}
                Each ship can move a number of hexes equal to, or less than, its Move Distance
                each turn.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 16,
                  }}
                >
                  Movement Rules:
                </Text>{" "}
                Movement can be in any direction, but must follow the hex grid.
              </Text>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.textSectionContainer}>
              <Text style={styles.textSection}>Special Movement Orders:</Text>
            </View>
            <View style={styles.textBodyContainer}>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 16,
                  }}
                >
                  All Ahead Full:
                </Text>{" "}
                Roll 2d10. The result is the additional hexes the ship can move
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
            </View>
            <View style={styles.textBodyContainer}>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 16,
                  }}
                >
                  Burn Retros:
                </Text>{" "}
                Allows a ship to reduce its movement by up to 2 hexes, enabling
                careful maneuvering around obstacles.
              </Text>
            </View>
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
                    fontSize: 16,
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
                    fontSize: 16,
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
                    fontSize: 16,
                  }}
                >
                  Check Against Threat Level:
                </Text>{" "}
                Compare the result to the target's Threat Level. If your roll is
                equal to or higher than the target's Threat Level, you hit!
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
                    fontSize: 16,
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
                    fontSize: 16,
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
                    fontSize: 16,
                  }}
                >
                  Check Against Damage Threshold:
                </Text>{" "}
                Compare the rolled damage to the target ship's Damage Threshold.
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
                    fontSize: 16,
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
                  source={require("../assets/images/arcs/firingarc.png")}
                  style={{ height: 250, width: 250 }}
                />
              </View>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 16,
                  }}
                >
                  Range:
                </Text>{" "}
                To determine if a target is within range, measure from the
                center of the firing ship's hex to the center of the target
                ship's hex using the in-game ruler.
              </Text>
              <Text style={styles.textBody}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: Colors.slate,
                    fontSize: 16,
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
              <Text style={styles.tableCellHeader}>Laser Cannons</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>30ft</Text>
              </View>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>Turret(360°)</Text>
              </View>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableCellHeader}>Missile Batteries</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>70ft</Text>
              </View>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>Forward/Aft(90°)</Text>
              </View>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableCellHeader}>Plasma Torpedoes</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>50ft</Text>
              </View>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>Forward(90°)</Text>
              </View>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableCellHeader}>Dual Laser Cannons</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>30ft</Text>
              </View>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>Turret(360°)</Text>
              </View>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableCellHeader}>Railguns</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>80ft</Text>
              </View>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>
                  Portside/Starboard(90°)
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.rulesSection}>
            <View style={styles.tableHeaderContainer}>
              <Text style={styles.tableCellHeader}>Ion Beams</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>40ft</Text>
              </View>
              <View style={styles.tableHeaderContainer}>
                <Text style={styles.tableHeader}>
                  Portside/Starboard(90°)
                </Text>
              </View>
            </View>
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
    fontSize: 18,
    backgroundColor: Colors.slate,
    fontWeight: "bold",
    marginBottom: 5,
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
    fontSize: 15,
  },
  textHeader: {
    color: Colors.white,
    fontSize: 24,
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
    borderWidth: 3,
    borderColor: Colors.misty_blue,
    marginLeft: 5,
    marginRight: 5,
  },
  tableHeaderContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
    alignItems: "center",
    padding: 5,
  },
  tableHeader: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  tableCellHeader: {
    color: Colors.slate,
    fontSize: 17,
    fontFamily: "monospace",
    padding: 4,
    fontWeight: "bold",
  },
});
