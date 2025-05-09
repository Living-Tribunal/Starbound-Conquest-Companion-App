import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
  Modal,
  StatusBar,
  TextInput,
} from "react-native";
import { Colors } from "../../constants/Colors.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import ShowStat from "../../hooks/ShowStat.js";
import { ShipAttributes } from "../../constants/ShipAttributes.js";
import { FONTS } from "../../constants/fonts.js";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider.js";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { doc, or, updateDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import HeaderComponent from "@/components/header/HeaderComponent.js";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import BattleDice from "@/components/dice/BattleGroundDice.js";

export default function ShipStats({ route }) {
  const navigation = useNavigation();
  const user = FIREBASE_AUTH.currentUser;
  const { shipId } = route.params || {};
  const { showStat, showAllStat } = ShowStat();
  const [areAllStatsShows, setAreAllStatsShows] = useState(true);
  const [pressed, setPressed] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalToRollADice, setModalToRollADice] = useState(false);
  const [orderName, setOrderName] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [selectedFaction, setSelectedFaction] = useState("Nova Raiders");
  const tabBarHeight = useBottomTabBarHeight();

  const {
    faction,
    data,
    setData,
    hitPoints,
    setHitPoints,
    setHitPointsColor,
    setSingleUserShip,
    setSingleUser,
    setHit,
    setRolledD20,
    setWeaponId,
    setDamageDone,
    diceValueToShare,
    setDiceValueToShare,
  } = useStarBoundContext();
  const ship = data.find((s) => s.id === shipId);
  const ShipData = ship ? ShipAttributes[ship.type] : null;
  useEffect(() => {
    setSelectedFaction(faction);
    console.log(faction);
  }, [faction]);

  useEffect(() => {
    if (!ship || typeof ship.hp !== "number" || typeof ship.maxHP !== "number")
      return;

    const shipHealth = (ship.hp / ship.maxHP) * 100;
    let newColor = "red";

    if (shipHealth === 100) newColor = "green";
    else if (shipHealth >= 75) newColor = "yellow";
    else if (shipHealth >= 50) newColor = "orange";

    setHitPointsColor((prevColors) => ({
      ...prevColors,
      [ship.id]: newColor,
    }));
  }, [ship]);

  /*  console.log(
    JSON.stringify(ship, null, 2) +
      " That came from player through ship flatlist into shipStats"
  );
 */
  //console.log("In ship stats:" + JSON.stringify(data, null, 2));
  //console.log("SPecial Orders Length: " + specialOrders.isToggled.length);

  const toggleSpecialOrdersButton = async (orderName) => {
    if (!ship || !user) return;

    try {
      const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", shipId);

      // Existing special orders
      const currentOrders = ship.specialOrders || {};

      // Count how many are currently ON (true)
      const activeOrdersCount = Object.values(currentOrders).filter(
        (v) => v
      ).length;

      const isCurrentlyActive = currentOrders[orderName];

      // Check if trying to turn ON a third order
      if (!isCurrentlyActive && activeOrdersCount >= 2) {
        Toast.show({
          type: "error", // 'success' | 'error' | 'info'
          text1: "Starbound Conquest",
          text2: "You can only have two active special orders at a time.",
          position: "top", // optional, 'top' | 'bottom'
        });
        return; // stop, don't allow more than 2
      }

      const updatedOrders = {
        ...currentOrders,
        [orderName]: !currentOrders[orderName],
      };
      const { x, y, ...safeData } = ship;
      await updateDoc(shipRef, {
        ...safeData,
        specialOrders: updatedOrders,
      });

      // Update local data
      setData((prevData) =>
        prevData.map((s) =>
          s.id === shipId ? { ...s, specialOrders: updatedOrders } : s
        )
      );
    } catch (e) {
      console.error("Error toggling special order:", e);
    }
  };

  const toggleTurn = () => {
    setData((prevData) =>
      prevData.map((s) =>
        s.id === shipId ? { ...s, isToggled: !s.isToggled } : s
      )
    );
  };

  const toggleHasTakenTurn = async () => {
    if (!ship || !user) return;
    try {
      const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", shipId);
      const { x, y, ...safeData } = ship;
      await updateDoc(shipRef, {
        ...safeData,
        isToggled: !ship.isToggled,
      });
      console.log("Updated ship:", ship.isToggled);
      toggleTurn();
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const adjustHP = () => {
    //prev data is the ships array of all currnt ships
    setData((prevData) =>
      //map through the array and update the ship with the new hp
      prevData.map((s) =>
        //if the ship id matches the one we are updating, update the hp if not return the ship
        s.id === shipId
          ? { ...s, hp: Math.max(0, Math.min(Number(hitPoints), s.maxHP)) }
          : s
      )
    );
  };

  const rollForBonus = () => {
    if (diceValueToShare >= 11) {
      setDiceValueToShare(ship.moveDistance);
    } else {
      const halfShipMoveDistance = ship.moveDistance / 2;
      setDiceValueToShare(halfShipMoveDistance);
    }
  };

  console.log("In Ship Stats:", JSON.stringify(diceValueToShare, null, 2));
  const adjustShipsHitPoints = async () => {
    if (!ship || !user) return;
    try {
      const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", shipId);
      const newHP = Math.max(0, Math.min(Number(hitPoints), ship.maxHP));
      const { x, y, ...safeData } = ship;
      await updateDoc(shipRef, {
        ...safeData,
        hp: newHP,
      });
      console.log("Updated ship HP:", hitPoints);
      adjustHP();
    } catch (e) {
      console.error("Error updating HP in Firestore:", e);
    }
  };

  const openHPModal = () => {
    setIsModalVisible(true);
  };

  if (!ship) {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Text
          style={{ color: Colors.white, textAlign: "center", marginTop: 50 }}
        >
          Loading ship data...
        </Text>
      </SafeAreaView>
    );
  }

  if (modalToRollADice) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.dark_gray,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: Colors.white,
            fontFamily: "monospace",
            fontSize: 12,
            marginBottom: 2,
          }}
        >
          {orderName}
        </Text>
        <Text
          style={{
            fontSize: 10,
            color: Colors.slate,
            textAlign: "center",
            fontFamily: "monospace",
            paddingHorizontal: 10,
            marginBottom: 10,
          }}
        >
          {orderDescription}
        </Text>
        <BattleDice
          text={orderName}
          number1={1}
          id={"D20"}
          number2={20}
          tintColor={Colors.goldenrod}
          textStyle={{ color: Colors.gold }}
          borderColor={{ borderColor: Colors.goldenrod }}
          disabledButton={false}
          disabledButtonOnHit={false}
          disabled={false}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await toggleSpecialOrdersButton(orderName);
              setModalToRollADice(false);
              rollForBonus();
            }}
          >
            <Text>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setModalToRollADice(false);
              setDiceValueToShare(0);
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar />
      <HeaderComponent
        onPress={() => setDiceValueToShare(0)}
        text="Ship Stats"
        NavToWhere={"Player"}
      />
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
                const newShowAllStatsState = !areAllStatsShows;
                showAllStat(newShowAllStatsState);
                setAreAllStatsShows(newShowAllStatsState);
                setPressed(newShowAllStatsState);
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
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: ship.isToggled ? Colors.hudDarker : Colors.hud,
                borderColor: ship.isToggled ? Colors.hud : Colors.hud,
                width: "45%",
              },
            ]}
            onPress={toggleHasTakenTurn}
          >
            <Text
              style={[
                styles.headerText,
                {
                  fontSize: 15,
                  color: ship.isToggled ? Colors.hud : Colors.hudDarker,
                },
              ]}
            >
              {ship.isToggled ? "Ended turn" : "Ready to engage"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: Colors.hud,
                borderColor: Colors.hud,
                width: "45%",
              },
            ]}
            onPress={() => {
              navigation.navigate("BattleGround", { ship: ship });
              setSingleUser(null);
              setSingleUserShip(null);
              setHit("");
              setRolledD20(false);
              setWeaponId(null);
              setDamageDone(0);
            }}
          >
            <Text
              style={[
                styles.headerText,
                {
                  fontSize: 15,
                  color: Colors.hudDarker,
                },
              ]}
            >
              BattleGround
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <TouchableOpacity onPress={openHPModal}>
                <View
                  style={{ width: "100%", backgroundColor: Colors.hudDarker }}
                >
                  <Text style={styles.statButtonText}>Hit Point</Text>
                </View>
                <View style={styles.statTextUnder}>
                  <Text
                    style={{
                      textAlign: "center",
                      color: Colors.hud,
                      fontFamily: "monospace",
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {ship.hp}/{ship.maxHP}
                  </Text>
                </View>
              </TouchableOpacity>
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
                {ship.moveDistance + diceValueToShare}
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
            <View style={styles.statButton}>
              <Text
                style={[
                  styles.statButtonText,
                  {
                    color: Colors.hudDarker,
                    backgroundColor: Colors.hud,
                    borderRadius: 10,
                    width: "100%",
                    borderWidth: 4,
                    borderColor: Colors.hudDarker,
                    marginBottom: 10,
                  },
                ]}
              >
                Special Orders
              </Text>
            </View>
            <>
              <View
                style={{
                  backgroundColor: Colors.underTextGray,
                  borderRadius: 5,
                }}
              >
                {ShipData?.specialOrders?.map((specialOrder, index) => {
                  const orderName = specialOrder[0];
                  const description = specialOrder[1];

                  const activeOrdersCount = Object.values(
                    ship.specialOrders || {}
                  ).filter(Boolean).length;
                  const isDisabled =
                    ship.specialOrders?.[orderName] || activeOrdersCount >= 2;

                  return (
                    <View
                      key={index}
                      style={{
                        marginBottom: 10,
                      }}
                    >
                      <TouchableOpacity
                        disabled={ship.specialOrders?.[orderName]}
                        onPress={() => {
                          if (!isDisabled) {
                            setOrderName(orderName);
                            setOrderDescription(description);
                            setModalToRollADice(true);
                            setDiceValueToShare(0);
                          }
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            color: ship.specialOrders?.[orderName]
                              ? Colors.hudDarker
                              : Colors.white,
                            fontFamily: "monospace",
                            fontSize: 12,
                            marginBottom: 2,
                          }}
                        >
                          {orderName}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            color: ship.specialOrders?.[orderName]
                              ? Colors.hudDarker
                              : Colors.slate,
                            textAlign: "center",
                            fontFamily: "monospace",
                            paddingHorizontal: 10,
                          }}
                        >
                          {description}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </>
          </View>
        </View>
        {isModalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
              setIsModalVisible(false);
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPressOut={() => setIsModalVisible(false)}
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  height: "25%",
                  backgroundColor: Colors.hudDarker,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  padding: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Modal Content */}
                <Text style={styles.textHeader}>Adjust Hit Points</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => setHitPoints(text)}
                  value={hitPoints}
                  keyboardType="numeric"
                  placeholder="Hit Points"
                  maxLength={3}
                  autoFocus={true}
                  returnKeyType="done"
                  keyboardAppearance="dark"
                />
                <TouchableOpacity
                  style={[styles.button, { borderColor: Colors.hudDarker }]}
                  onPress={() => {
                    adjustShipsHitPoints();
                    setIsModalVisible(false);
                  }}
                >
                  <Text
                    style={[styles.textHeader, { color: Colors.hudDarker }]}
                  >
                    Save Hit Points
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
    flex: 1,
  },
  textInput: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: Colors.hud,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    color: Colors.hud,
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
    marginBottom: 10,
    marginTop: 10,
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
  button: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: Colors.hud,
  },
  textHeader: {
    color: Colors.white,
    fontSize: 15,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: FONTS.leagueBold,
  },
});
