import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
  StatusBar,
} from "react-native";
import { Colors } from "../../constants/Colors.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import ShowStat from "../../hooks/ShowStat.js";
import { ShipAttributes } from "../../constants/ShipAttributes.js";
import { shipDiceMapping } from "../../components/buttons/Dice.js";
import { FONTS } from "../../constants/fonts.js";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider.js";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import HeaderComponent from "@/components/header/HeaderComponent.js";

export default function ShipStats({ route }) {
  const { ship } = route.params || {};
  const { showStat, handlePress, showAllStat } = ShowStat();
  const [areAllStatsShows, setAreAllStatsShows] = useState(true);
  const [pressed, setPressed] = useState(true);
  const [selectedShip, setSelectedShip] = useState(ship?.type || "");
  const navigation = useNavigation();

  const [selectedFaction, setSelectedFaction] = useState("Nova Raiders");

  const tabBarHeight = useBottomTabBarHeight();

  const { faction } = useStarBoundContext();

  const ShipData = ShipAttributes[ship.type];

  const selectedShipDice = shipDiceMapping[ship.type];

  console.log(
    JSON.stringify(ship) +
      " That came from player through ship flatlist into shipinfo"
  );

  const goBack = () => {
    navigation.navigate("Player");
  };

  useEffect(() => {
    setSelectedFaction(faction);
    console.log(faction);
  }, [faction]);

  const factionScale = {
    "The Zyrrians": 1,
    "Nova Raiders": 1,
    "Voidborn Marauders": 1,
    "Star Reapers": 1,
    "Praxleon Empire": 1,
    "Synthon Syndicate": 1,
    "The Union": 1,
  };

  const scale = factionScale[ship.factionName] || "1";

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar />
      <HeaderComponent text="Ship Stats" NavToWhere={"Player"} />
      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: tabBarHeight,
        }}
      >
        <Text style={styles.subHeaderText}>
          Below, you will find the stats of your selected ship.
        </Text>
        <View style={styles.image}>
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.headerText}>{faction}</Text>
            <Text style={styles.statButtonText1}>
              {ship.type} - {ship.shipId}
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              disabled
              style={styles.showButton}
              onPress={() => {
                const newShowAllStatsState = !areAllStatsShows; // Toggle the current state
                showAllStat(newShowAllStatsState); // Update the showAllStat hook
                setAreAllStatsShows(newShowAllStatsState); // Update local state
                setPressed(newShowAllStatsState); // Update button text state
              }}
            >
              <Image
                resizeMode={"center"}
                style={[styles.icon]}
                source={{ uri: ship.image }}
              />
              {/* <Text>{className}</Text>*/}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Hit Point</Text>
              </View>
            </View>
            <View style={styles.statTextUnder}>
              <Text
                style={{
                  textAlign: "center",
                  color: Colors.white,
                  fontFamily: "monospace",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {ship.hp}/{ship.maxHP}
              </Text>
            </View>
          </View>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>To Hit</Text>
              </View>
            </View>
            <View style={styles.statTextUnder}>
              <Text
                style={{
                  textAlign: "center",
                  color: Colors.white,
                  fontFamily: "monospace",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {ship.threatLevel}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Soak</Text>
              </View>
            </View>
            <View style={styles.statTextUnder}>
              <Text
                style={{
                  textAlign: "center",
                  color: Colors.white,
                  fontFamily: "monospace",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {ship.damageThreshold}
              </Text>
            </View>
          </View>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Move Distance</Text>
              </View>
            </View>
            <View style={styles.statTextUnder}>
              <Text
                style={{
                  textAlign: "center",
                  color: Colors.white,
                  fontFamily: "monospace",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {ship.moveDistance}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={{ flex: 1, marginHorizontal: 10 }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Weapon Damage</Text>
              </View>
            </View>
            {!showStat.weaponDamage &&
              selectedShipDice.map((DiceComponent, index) => (
                <View
                  key={index}
                  style={[
                    styles.statTextUnder,
                    { alignItems: "center", backgroundColor: Colors.dark_gray },
                  ]}
                >
                  {DiceComponent}
                </View>
              ))}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Capacity</Text>
              </View>
            </View>
            <View style={styles.statTextUnder}>
              <Text
                style={{
                  textAlign: "center",
                  color: Colors.white,
                  fontFamily: "monospace",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {ShipData.capacity}
              </Text>
            </View>
          </View>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <View
                style={{ width: "100%", backgroundColor: Colors.hudDarker }}
              >
                <Text style={styles.statButtonText}>Point Value</Text>
              </View>
            </View>
            <View style={styles.statTextUnder}>
              <Text
                style={{
                  textAlign: "center",
                  color: Colors.white,
                  fontFamily: "monospace",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {ShipData.pointValue}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ width: "95%" }}>
            <View
              style={[styles.statButton, { marginBottom: 40, marginTop: 50 }]}
            >
              <TouchableOpacity
                disabled
                style={{ backgroundColor: "transparent", width: "100%" }}
                onPress={() => {
                  handlePress("specialOrders");
                  setPressed((prev) => !prev);
                }}
              >
                <Text
                  style={[
                    styles.statButtonText,
                    {
                      color: Colors.hudDarker,
                      backgroundColor: Colors.hud,
                      width: "50%",
                      left: "13%",
                      borderWidth: 4,
                      borderColor: Colors.hudDarker,
                    },
                  ]}
                >
                  Special Orders
                </Text>
                <Image
                  style={{
                    resizeMode: "contain",
                    position: "absolute",
                    top: -125,
                    right: "25%",
                    transform: [
                      { translateX: 245 },
                      { translateY: 2 },
                      { scale: 0.5 }, // Adjust the value to scale the image
                    ],
                  }}
                  source={require("../../assets/images/hudstat1.png")}
                />
              </TouchableOpacity>
            </View>
            <>
              <View style={{}}>
                {ShipData.specialOrders.map((specialOrders, index) => (
                  <View key={index}>
                    <Text
                      style={{
                        textAlign: "center",
                        color: Colors.white,
                        marginRight: 5,
                        paddingBottom: 10,
                        fontFamily: "monospace",
                      }}
                    >
                      {specialOrders}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  headerText: {
    color: Colors.white,
    fontSize: 30,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: FONTS.leagueBold,
    borderBottomColor: Colors.white,
    borderTopColor: "transparent",
  },
  shipTypeText: {
    color: Colors.white,
    fontSize: 30,
    marginBottom: 5,
    marginTop: 5,
    textAlign: "center",
    fontFamily: FONTS.leagueRegular,
    borderBottomColor: Colors.white,
    borderTopColor: "transparent",
  },
  image: {
    flex: 1,
  },
  icon: {
    flex: 1,
    aspectRatio: 1,
    transform: [{ scale: 2 }, { rotate: "0deg" }],
    margin: 20,
  },
  statButton: {
    borderRadius: 5,
  },
  statButtonText: {
    color: Colors.hudDarker,
    borderRadius: 5,
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: Colors.hud,
    padding: 5,
    width: "100%",
  },
  statButtonText1: {
    color: Colors.hudDarker,
    borderRadius: 5,
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: Colors.hud,
    width: "80%",
  },

  buttonContainer: {
    marginBottom: 15,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  showText: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "monospace",
    marginVertical: "5",
    width: "100%",
    elevation: 8,
  },
  touchButton: {
    position: "relative",
  },
  statButtonImage: {
    resizeMode: "contain",
    position: "absolute",
    top: -34,
    right: -7,
    zIndex: -1,
    tintColor: Colors.statDarke50r,
  },
  statButtonSpecText: {
    justifyContent: "center",
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "monospace",
    bottom: 8,
  },
  statTextUnder: {
    alignSelf: "center",
    margin: 5,
    backgroundColor: Colors.underTextGray,
    width: "100%",
    borderRadius: 2,
  },
  subHeaderText: {
    fontFamily: "monospace",
    color: Colors.white,
    fontSize: 9,
    marginBottom: 5,
    marginTop: 5,
    textAlign: "center",
    backgroundColor: Colors.underTextGray,
    borderRadius: 5,
    padding: 5,
    margin: 5,
  },
  showButton: { height: 150, justifyContent: "center", marginVertical: 30 },
  image1: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: Colors.white,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
});
