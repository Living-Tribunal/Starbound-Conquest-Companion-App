import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import ShipFlatlist from "../../components/shipdata/ShipFlatlist";
import { useNavigation } from "@react-navigation/native";
import { getFleetData } from "../../components/API/API";
import { collection, doc, addDoc, setDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function Player() {
  const navigation = useNavigation();
  const user = FIREBASE_AUTH.currentUser;
  const tabBarHeight = useBottomTabBarHeight();
  const [loading, setLoading] = useState(false);
  const [isShowWarning, setIsShowWarning] = useState(false);

  const {
    username,
    setUsername,
    fighterImages,
    destroyerImages,
    cruiserImages,
    carrierImages,
    dreadnoughtImages,
    profile,
    faction,
    setFaction,
    setProfile,
    data,
    setData,
    gameValue,
    setGameValue,
    toggleToDelete,
    setToggleToDelete,
  } = useStarBoundContext();

  const onCancelWarning = () => {
    setIsShowWarning(false);
    setToggleToDelete(false);
  };

  const onConfirmWarning = () => {
    setIsShowWarning(false);
    setToggleToDelete(true);
    console.log("Toggled:", toggleToDelete);
  };

  const valueWarning = () => {
    if (totalFleetValue > gameValue) {
      return (
        <Text style={styles.valueWarning}>
          Warning: You are over your game value limit.
        </Text>
      );
    }
  };

  const getFleetDataButton = async () => {
    setLoading(true);
    console.log("getFleetDataButton1");
    await getFleetData({ data, setData });
    console.log("getFleetDataButton2");
    setLoading(false);
  };

  const addShipToFleet = async (item) => {
    try {
      const docRef = await addDoc(
        collection(FIREBASE_DB, "users", user.uid, "ships"),
        {
          prevX: 394.99999999999983,
          user: "DMUBOsrB04e2ovwwrGl29OZLGgf2",
          width: 218,
          shipId: "DR-ID: 47",
          image:
            "https://starboundconquest.com/images/NovaRaiders/loa_alastair.png",
          globalAlpha: 1,
          pointValue: 240,
          x: 394.99999999999983,
          id: "1745634176047",
          type: "Dreadnought",
          factionName: "Nova Raiders",
          orders:
            "Full Throttle \nReinforce Shields \nLaunch Fighters \nAll Systems Fire \nCharge Ion Beam",
          damageThreshold: 4,
          highlighted: false,
          firingArc:
            "Forward(90°) \nPortside(90°)/Starboard(90°) \nForward(90°)/Aft(90°)",
          moveDistance: "30ft",
          height: 371,
          prevY: 621.6666666666667,
          y: 621.6666666666667,
          maxHP: 30,
          weaponDamage: "1d12\n1d10\n1d8",
          ordersUsed: 0,
          rotation_angle: 0,
          hp: 30,
          username: "Living",
          threatLevel: 8,
          isToggled: false,
          weaponType: "Ion Partical Beam \nPlasma Cannon \n350mm Railgun",
          isSelected: false,
          weaponRange: "30ft-60ft \n60ft \n30ft-120ft",
        }
      );

      // After adding, update it to include the doc ID
      await setDoc(docRef, { id: docRef.id }, { merge: true });

      console.log("Ship added with ID:", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    getFleetDataButton();
  };

  console.log("faction:", faction);

  const totalFleetValue = data
    ? data.reduce((sum, ship) => sum + (ship.pointValue || 0), 0)
    : 0;

  /*   const factionName = data
    ? [...new Set(data.map((ship) => ship.factionName))]
    : [];
 */
  const onLongPressToReset = () => {
    setToggleToDelete(false);
    console.log("Toggled:", toggleToDelete);
  };

  /* console.log(JSON.stringify(data)); */

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("UserName");
        const gameMaxValue = await AsyncStorage.getItem("GameValue");
        const storedProfile = await AsyncStorage.getItem("ProfilePicture");
        const storedFaction = await AsyncStorage.getItem("Faction");

        setUsername(storedUsername || "Commander");
        setProfile(storedProfile || "");
        setGameValue(gameMaxValue || 0);
        setFaction(storedFaction || "Choose a Faction");
      } catch (error) {
        console.error("Failed to retrieve user data:", error);
      }
    };

    getUserData();
  }, []);

  const fleetData = [
    { type: "Fighter", fleetClass: "fleetFighter", ships: fighterImages },
    { type: "Destroyer", fleetClass: "fleetDestroyer", ships: destroyerImages },
    { type: "Cruiser", fleetClass: "fleetCruiser", ships: cruiserImages },
    { type: "Carrier", fleetClass: "fleetCarrier", ships: carrierImages },
    {
      type: "Dreadnought",
      fleetClass: "fleetDreadnought",
      ships: dreadnoughtImages,
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          style={{ width: "80%", height: "22%" }}
          source={require("../../assets/images/SC_logo1.png")}
        />
        <Text style={styles.textLoading}>Your fleet is arriving</Text>
      </View>
    );
  }

  /* console.log(JSON.stringify(totalFleetValue) + " In Player"); */

  if (isShowWarning) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.valueWarning, { fontSize: 20, padding: 10 }]}>
          Warning: You are now in a delete mode, any ship you tap on WILL be
          deleted.
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity style={styles.button} onPress={onCancelWarning}>
            <Image
              source={require("../../assets/icons/icons8-x-48.png")}
              style={{
                width: 25,
                height: 25,
                marginTop: 5,
                tintColor: Colors.lighter_red,
              }}
            />
            <Image
              style={{
                width: 60,
                height: 60,
                position: "absolute",
              }}
              source={require("../../assets/images/edithud.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onConfirmWarning}>
            <Image
              source={require("../../assets/icons/icons8-check-50.png")}
              style={{
                width: 25,
                height: 25,
                marginTop: 5,
                tintColor: Colors.green_toggle,
              }}
            />
            <Image
              style={{
                width: 60,
                height: 60,
                position: "absolute",
              }}
              source={require("../../assets/images/edithud.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: Colors.dark_gray }}>
      <FlatList
        data={fleetData}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        ListHeaderComponent={
          <>
            <View style={styles.container}>
              <Text style={styles.subHeaderText}>
                Welcome to Starbound Conquest! Prepare to command your fleet and
                conquer the stars. Below, you'll find a quick snapshot of your
                fleet's status. Use the buttons to navigate to screens where you
                can manage your ships' stats, toggle their turns, and issue
                orders. Also tap on the username to change your Faction,
                Username and Profie Picture.
              </Text>
              <TouchableOpacity
                onPress={getFleetDataButton}
                style={[
                  styles.profileContainer,
                  { borderWidth: 1, borderColor: Colors.hud },
                ]}
              >
                <Text style={styles.textValue}>Call in your fleet</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled style={[styles.profileContainer]}>
                <Image
                  style={styles.profile}
                  source={
                    profile
                      ? { uri: profile }
                      : require("../../assets/images/ships.jpg")
                  }
                />
                <Text style={styles.playerText}>{username}</Text>
                <Text style={styles.factionText}>{faction}</Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text style={styles.textSub}>Fleet Overview</Text>
                <TouchableOpacity
                  style={styles.button}
                  onLongPress={onLongPressToReset}
                  onPress={() => {
                    setIsShowWarning(true);
                  }}
                >
                  <Image
                    source={require("../../assets/icons/icons8-save-50.png")}
                    style={{
                      width: 25,
                      height: 25,
                      marginTop: 5,
                    }}
                  />
                  <Image
                    style={{ width: 60, height: 60, position: "absolute" }}
                    source={require("../../assets/images/edithud.png")}
                  />
                </TouchableOpacity>
              </View>
              {toggleToDelete && (
                <View>
                  <Text
                    style={[styles.valueWarning, { fontSize: 15, padding: 5 }]}
                  >
                    Delete Mode Has Been Enabled
                  </Text>
                </View>
              )}
              <View
                style={[
                  styles.valueContainer,
                  {
                    borderColor: toggleToDelete
                      ? Colors.lighter_red
                      : Colors.hud,
                    backgroundColor: toggleToDelete
                      ? Colors.deep_red
                      : Colors.hudDarker,
                  },
                ]}
              >
                {valueWarning()}
                <Text
                  style={[
                    styles.textValue,
                    { color: toggleToDelete ? Colors.lighter_red : Colors.hud },
                  ]}
                >
                  Total Fleet Value: {totalFleetValue}/{gameValue}
                </Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.shipContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                margin: 10,
              }}
            >
              <Text
                style={[
                  styles.textUnder,
                  { color: toggleToDelete ? Colors.lighter_red : Colors.white },
                ]}
              >
                {item.type}
              </Text>
              <TouchableOpacity
                onPress={() => addShipToFleet(item)}
                style={styles.button}
              >
                <Image
                  source={require("../../assets/icons/icons8-plus-100.png")}
                  style={{
                    width: 25,
                    height: 25,
                    marginTop: 5,
                    tintColor: Colors.hud,
                  }}
                />
                <Image
                  style={{ width: 60, height: 60, position: "absolute" }}
                  source={require("../../assets/images/edithud.png")}
                />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "column" }}>
              <ShipFlatlist
                toggleToDelete={toggleToDelete}
                type={item.type}
                fleetClass={item.fleetClass}
                ships={item.ships}
              />
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
  },
  shipContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  textSub: {
    fontSize: 30,
    color: Colors.white,
    fontFamily: "leagueBold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 25,
  },
  textLoading: {
    fontSize: 30,
    color: Colors.hud,
    fontFamily: "leagueBold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 25,
  },
  textUnder: {
    fontSize: 20,
    color: Colors.white,
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
    backgroundColor: Colors.dark_gray,
    width: "80%",
    padding: 10,
    alignSelf: "center",
    elevation: 8,
    borderRadius: 10,
    justifyContent: "center",
    shadowColor: Colors.hud,
  },
  profile: {
    width: 250,
    height: 250,
    borderRadius: 10,
    elevation: 5,
    shadowColor: Colors.dark_gray,
  },
  playerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.hud,
    marginTop: 10,
  },
  factionText: {
    fontSize: 20,
    fontStyle: "italic",
    color: Colors.hud,
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
  textValue: {
    fontSize: 15,
    color: Colors.hud,
    fontFamily: "leagueBold",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 5,
  },
  valueContainer: {
    backgroundColor: Colors.hudDarker,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
    padding: 10,
  },
  valueWarning: {
    fontSize: 12,
    color: Colors.lighter_red,
    fontFamily: "leagueBold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark_gray,
  },
  button: {
    width: 75,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
});
