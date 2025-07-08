import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  StatusBar,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Colors } from "../../constants/Colors.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { ShipAttributes } from "../../constants/ShipAttributes.js";
import { FONTS } from "../../constants/fonts.js";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider.js";
import { doc, or, updateDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import HeaderComponent from "@/components/header/HeaderComponent.js";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import BattleDice from "@/components/dice/BattleGroundDice.js";
import { getFleetData } from "@/components/API/API.js";
import { useDiceContext } from "@/components/Global/DiceContext.js";

export default function ShipStats({ route }) {
  const navigation = useNavigation();
  const { from } = route.params;
  const user = FIREBASE_AUTH.currentUser;
  const { shipId } = route.params || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localDiceRoll, setLocalDiceRoll] = useState(0); // this is the dice rolled by the player
  const [modalToRollADice, setModalToRollADice] = useState(false);
  const [orderName, setOrderName] = useState("");
  const [orderIcon, setOrderIcon] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [selectedFaction, setSelectedFaction] = useState("Nova Raiders");
  const [movementBonus, setMovementBonus] = useState(0);
  const [broadSideBonus, setBroadSideBonus] = useState(0);
  const { disableDiceModifiers, setDisableDiceModifiers } = useDiceContext();
  const {
    faction,
    data,
    setData,
    hitPoints,
    setHitPoints,
    setHitPointsColor,
    setHit,
    setDiceValueToShare,
    firstDice,
    fromGameMap,
    setFromGameMap,
  } = useStarBoundContext();
  const ship = data.find((s) => s.id === shipId);
  const fromPlayer =
    from === "Player" || from === "GameMap" || ship?.hasRolledDToHit === true;
  const shipSpecialOrders = ship ? ShipAttributes[ship.type] : null;
  const bonusNameChanged = {
    moveDistanceBonus: "Movement Bonus",
    broadSideBonus: "Broadside Bonus",
    inFighterRangeBonus: "Fighter Range Bonus",
  };

  useFocusEffect(
    useCallback(() => {
      if (from) {
        setFromGameMap(from);
        //console.log("Set fromGameMap to:", from);
      }
    }, [from, setFromGameMap])
  );

  useEffect(() => {
    setSelectedFaction(faction);
    /* console.log(faction); */
  }, [faction, from]);

  //console.log(`in Ship Stats: ${JSON.stringify(diceValueToShare, null, 2)}`);

  //console.log("In Ship Stats:", JSON.stringify(ship, null, 2));

  //showing the hp bar with colors representing the health of the ship

  //console.log("In Ship Stats:", JSON.stringify(orderIcon, null, 2));
  //console.log("In Ship Stats:", JSON.stringify(localDiceRoll, null, 2));

  useFocusEffect(
    useCallback(() => {
      getFleetData({ data, setData });
    }, [])
  );

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
      if (!isCurrentlyActive && activeOrdersCount >= 1) {
        return; // stop, don't allow more than 1
      }

      const updatedOrders = {
        ...currentOrders,
        [orderName]: !currentOrders[orderName],
      };
      await updateDoc(shipRef, {
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

  useEffect(() => {
    if (!ship || !user) return;

    // Only trigger if the ship hasn't toggled yet, but has rolled
    if (ship.hasRolledDToHit === true && ship.isToggled !== true) {
      const toggleHasTakenTurn = async () => {
        try {
          const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", shipId);
          await updateDoc(shipRef, {
            isToggled: true,
          });

          // Update local state
          toggleTurn();
          setDiceValueToShare(0);
          console.log("✅ Ship toggled after D20 roll.");
        } catch (e) {
          console.error("❌ Error toggling ship:", e);
        }
      };

      toggleHasTakenTurn();
    }
  }, [ship?.hasRolledDToHit, ship?.isToggled]);

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

  /* console.log("In Ship Stats:", JSON.stringify(diceValueToShare, null, 2)); */
  const adjustShipsHitPoints = async () => {
    if (!ship || !user) return;
    try {
      const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", shipId);
      const newHP = Math.max(0, Math.min(Number(hitPoints), ship.maxHP));

      await updateDoc(shipRef, {
        hp: newHP,
      });
      /* console.log("Updated ship HP:", hitPoints); */
      adjustHP();
    } catch (e) {
      console.error("Error updating HP in Firestore:", e);
    }
  };

  const openHPModal = () => {
    setIsModalVisible(true);
  };
  //switch case to apply bonuses based on which special order is selected

  /*  console.log(
    "Selected Weapon ID Status in shipStats:",
    ship.weaponStatus["Ion Particle Beam"]
  );
 */
  //console.log("In Ship Stats:", JSON.stringify(ship.hit, null, 2));
  const specialOrderBonuses = async (orderName, ship, localDiceRoll) => {
    //console.log("Special Order Bonuses: ", orderName);
    if (!ship || localDiceRoll === undefined) {
      console.warn("specialOrderBonuses called without ship or diceRoll");
      return;
    }
    switch (orderName) {
      case "All Ahead Full":
        const bonus =
          localDiceRoll >= 11 ? ship.moveDistance : ship.moveDistance / 2;

        try {
          const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);

          if (localDiceRoll >= 11) {
            await updateDoc(shipRef, {
              "bonuses.moveDistanceBonus": bonus,
            });

            // Update local state properly
            setData((prevData) =>
              prevData.map((s) =>
                s.id === ship.id
                  ? {
                      ...s,
                      bonuses: {
                        ...(s.bonuses || {}),
                        moveDistanceBonus: bonus,
                      },
                    }
                  : s
              )
            );

            Toast.show({
              type: "success",
              text1: "All Ahead Full!",
              text2: "Movement speed x2.",
              position: "top",
            });
          } else {
            Toast.show({
              type: "error",
              text1: "All Ahead Full!",
              text2: "Movement speed increased by half.",
              position: "top",
            });
          }

          console.log("Bonus applied:", bonus);
          setMovementBonus(bonus);
        } catch (error) {
          console.error("❌ Failed to update moveDistanceBonus:", error);
        }
        break;
      case "Reinforce Shields":
        if (ship.hp === ship.maxHP) {
          Toast.show({
            type: "error",
            text1: "Ship HP is already at max.",
            text2: `No bonus added`,
            position: "top",
          });
          return;
        }
        if (localDiceRoll >= 11) {
          const newHP = Math.max(0, Math.min(Number(ship.hp + 1), ship.maxHP));
          console.log("Reinforce Shields succeeded. New HP:", newHP);

          const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);

          updateDoc(shipRef, {
            hp: newHP,
          })
            .then(() => {
              // Update local data
              setData((prevData) =>
                prevData.map((s) =>
                  s.id === ship.id ? { ...s, hp: newHP } : s
                )
              );
              Toast.show({
                type: "success",
                text1: "Shields Reinforced!",
                text2: `+1 HP (now at ${newHP}/${ship.maxHP})`,
                position: "top",
              });
            })
            .catch((error) => {
              console.error("Failed to update HP in Firestore:", error);
            });
        } else {
          Toast.show({
            type: "error",
            text1: "Shields Reinforcement Failed!",
            text2: `No bonus added`,
            position: "top",
          });
        }
        break;
      case "Evasive Maneuvers":
        console.log("Evasive Maneuvers");
        break;
      case "Combine Fire":
        console.log("Combine Fire");
        break;
      case "Anti-Fighter Barrage":
        console.log("Anti-Fighter Barrage");
        break;
      case "Power Up Main Guns":
        if (localDiceRoll >= 11 && ship.type === "Destroyer") {
          console.log({ "ship type in switch": ship.type });
          setDisableDiceModifiers(false);
          Toast.show({
            type: "success",
            text1: "Power Up Main Guns!",
            position: "top",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Power Up Main Guns Failed!",
            position: "top",
          });
        }
        break;
      case "All Systems Fire":
        console.log("All Systems Fire Bonus");
        if (localDiceRoll >= 11) {
          console.log("All Systems Fire:", localDiceRoll);
          try {
            const shipRef = doc(
              FIREBASE_DB,
              "users",
              user.uid,
              "ships",
              ship.id
            );
            await updateDoc(shipRef, {
              hasRolledDToHit: false,
            });

            // ✅ Now update local state after Firestore confirmed update
            setHit(false);
            setData((prevData) =>
              prevData.map((s) => (s.id === ship.id ? { ...s, hit: false } : s))
            );

            Toast.show({
              type: "success",
              text1: "All systems, ready to fire!",
              position: "top",
            });
          } catch (error) {
            console.error("Failed to update hit in Firestore:", error);
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Unable to reintialize systems.",
            position: "top",
          });
        }
        break;
      case "Broadside":
        if (localDiceRoll >= 11) {
          console.log("Broadside Rolled:", localDiceRoll);
          const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", ship.id);
          console.log("Boardside Bonus:", broadSideBonus);

          updateDoc(shipRef, {
            "bonuses.broadSideBonus": 15,
            hasRolledDToHit: false,
          })
            .then(() => {
              // Update local data
              setData((prevData) =>
                prevData.map((s) =>
                  s.id === ship.id ? { ...s, "bonuses.broadSideBonus": 15 } : s
                )
              );
              Toast.show({
                type: "success",
                text1: "Systems have been reinitialized.",
                position: "top",
              });
            })
            .catch((error) => {
              console.error(
                "Failed to update broadSideBonus in Firestore:",
                error
              );
            });
        } else {
          Toast.show({
            type: "error",
            text1: "Unable to reintialize systems!",
            position: "top",
          });
        }
        setBroadSideBonus(15);
        break;
      case "Launch Fighters":
        if (localDiceRoll >= 11 && ship.type === "Carrier") {
          try {
            const shipRef = doc(
              FIREBASE_DB,
              "users",
              user.uid,
              "ships",
              ship.id
            );
            await updateDoc(shipRef, {
              "specialOrders.Launch Fighters": true,
              maxCapacity: 20,
            });
            // Update local data
            setData((prevData) =>
              prevData.map((s) =>
                s.id === ship.id ? { ...s, maxCapacity: 20 } : s
              )
            );
            Toast.show({
              type: "success",
              text1: "Launched Fighters!",
              position: "top",
            });
          } catch (e) {
            console.error("Failed to update launch fighters in Firestore:", e);
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Launch Fighters Failed!",
            position: "top",
          });
        }
        break;
      case "Charge Ion Beams":
        //console.log("Ion Beam check - ship.hit:", ship.hit);
        console.log("Starting Charge Ion Beams Bonus");
        if (localDiceRoll >= 2) {
          console.log("Bonus (Ion):", localDiceRoll);
          try {
            const shipRef = doc(
              FIREBASE_DB,
              "users",
              user.uid,
              "ships",
              ship.id
            );
            await updateDoc(shipRef, {
              "weaponStatus.Ion Particle Beam": false,
              "specialOrders.Charge Ion Beam": true,
              hit: false,
              //hasRolledDToHit: false,
            });

            // ✅ Now update local state after Firestore confirmed update
            setHit(false);
            setLocalDiceRoll(firstDice);
            setData((prevData) =>
              prevData.map((s) => (s.id === ship.id ? { ...s, hit: false } : s))
            );

            Toast.show({
              type: "success",
              text1: "Ion Particle Beam Recharges!",
              position: "top",
            });
          } catch (error) {
            console.error("Failed to update hit in Firestore:", error);
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Ion Particle Beam Recharge Failed!",
            position: "top",
          });
        }
        break;
      default:
        console.log("No special order selected");
    }
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
          disabledButton={localDiceRoll > 0}
          onRoll={(value, diceId) => {
            setLocalDiceRoll(value);
            /*  if (diceId === "D20") {
              changedRolledDToHit();
            } */
          }}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            disabled={localDiceRoll === 0}
            style={[
              styles.button,
              {
                backgroundColor:
                  localDiceRoll === 0 ? Colors.hudDarker : Colors.hud,
                borderColor:
                  localDiceRoll === 0 ? Colors.hud : Colors.hudDarker,
              },
            ]}
            onPress={async () => {
              setModalToRollADice(false);
              await specialOrderBonuses(orderName, ship, localDiceRoll); // check dice first
              getFleetData({ data, setData });
              setLocalDiceRoll(0);
              setDiceValueToShare(0);
            }}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: localDiceRoll === 0 ? Colors.hud : Colors.hudDarker,
                },
              ]}
            >
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={localDiceRoll !== 0}
            style={[
              styles.button,
              {
                backgroundColor:
                  localDiceRoll !== 0 ? Colors.hudDarker : Colors.hud,
                borderColor:
                  localDiceRoll !== 0 ? Colors.hud : Colors.hudDarker,
              },
            ]}
            onPress={() => {
              setModalToRollADice(false);
              setDiceValueToShare(0);
              setLocalDiceRoll(0);
            }}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: localDiceRoll !== 0 ? Colors.hud : Colors.hudDarker,
                },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar />
      <HeaderComponent
        onPress={() => {
          setMovementBonus(0);
          setBroadSideBonus(0);
          setDisableDiceModifiers(true);
        }}
        text="Ship Stats"
        NavToWhere={fromGameMap === "GameMap" ? "GameMap" : "Player"}
      />
      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={{
          flexGrow: 1,
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
            <Text style={styles.statButtonText1}>
              Sector: {ship.gameSector}
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Image
              resizeMode={"center"}
              style={[styles.icon]}
              source={{ uri: ship.image }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={[
              {
                backgroundColor:
                  ship.hasRolledDToHit === true
                    ? Colors.deep_red
                    : Colors.darker_green_toggle,
                borderColor:
                  ship.hasRolledDToHit === true
                    ? Colors.deep_red
                    : Colors.green_toggle,
                width: "95%",
                borderRadius: 5,
                borderWidth: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.headerText,
                {
                  fontSize: 15,
                  fontFamily: "LeagueSpartan-Regular",
                  color:
                    ship.hasRolledDToHit === true
                      ? Colors.lighter_red
                      : Colors.green_toggle,
                },
              ]}
            >
              {ship.hasRolledDToHit === true ? "Ended turn" : "Ready to engage"}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <TouchableOpacity onPress={openHPModal}>
                <View style={{ width: "100%" }}>
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
              <View style={{ width: "100%" }}>
                <Text style={styles.statButtonText}>Move Distance</Text>
              </View>
            </View>
            <View style={styles.statTextUnder}>
              <Text
                style={{
                  textAlign: "center",
                  color:
                    ship.bonuses.moveDistanceBonus > 0 ||
                    ship.bonuses.broadSideBonus
                      ? Colors.green_toggle
                      : Colors.white,
                  fontFamily: "monospace",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {ship.bonuses.moveDistanceBonus + ship.moveDistance}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {ship.capacity > 0 && (
            <View style={{ width: "25%" }}>
              <View style={[styles.statButton]}>
                <View style={{ width: "100%" }}>
                  <Text style={styles.statButtonText}>Capacity</Text>
                </View>
              </View>
              <View style={styles.statTextUnder}>
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.white,
                    fontFamily: "monospace",
                    fontSize: 10,
                  }}
                >
                  {ship.capacity}
                </Text>
              </View>
            </View>
          )}
          <View style={{ width: ship.capacity > 0 ? "25%" : "45%" }}>
            <View style={[styles.statButton]}>
              <View style={{ width: "100%" }}>
                <Text style={styles.statButtonText}>Point Value</Text>
              </View>
            </View>
            <View style={styles.statTextUnder}>
              <Text
                style={{
                  textAlign: "center",
                  color: Colors.white,
                  fontFamily: "monospace",
                  fontSize: 10,
                }}
              >
                {ship.pointValue}
              </Text>
            </View>
          </View>
          <View style={{ width: ship.capacity > 0 ? "25%" : "45%" }}>
            <View style={[styles.statButton]}>
              <Text style={styles.statButtonText}>Soak</Text>
            </View>
            <View style={styles.statTextUnder}>
              <Text
                style={{
                  textAlign: "center",
                  color:
                    ship.bonuses.inFighterRangeBonus > 0
                      ? Colors.green_toggle
                      : Colors.white,
                  fontFamily: "monospace",
                  fontSize: 10,
                }}
              >
                {ship.damageThreshold + ship.bonuses.inFighterRangeBonus || 0}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.statButton,
            {
              width: "95%",
              justifyContent: "center",
              alignSelf: "center",
            },
          ]}
        >
          <Text style={styles.statButtonText}>Bonuses</Text>
          {ship?.bonuses &&
            Object.entries(ship.bonuses).map(
              ([bonusName, bonusValue], index) => (
                <View
                  key={index}
                  style={{
                    justifyContent: "center",
                    borderRadius: 5,
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 10,
                    width: "100%",
                  }}
                >
                  <View style={[styles.statTextUnder, { width: "45%" }]}>
                    <Text
                      style={{
                        textAlign: "center",
                        color: Colors.white,
                        fontFamily: "monospace",
                        fontSize: 10,
                      }}
                    >
                      {bonusNameChanged[bonusName]}
                    </Text>
                  </View>
                  <View style={[styles.statTextUnder, { width: "45%" }]}>
                    <Text
                      style={{
                        textAlign: "center",
                        color:
                          bonusValue > 0 ? Colors.green_toggle : Colors.white,
                        fontFamily: "monospace",
                        fontSize: 10,
                      }}
                    >
                      +{bonusValue}
                    </Text>
                  </View>
                </View>
              )
            )}
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ width: "95%" }}>
            <View style={styles.statButton}>
              <Text
                style={[
                  styles.statButtonText,
                  {
                    color: Colors.hud,
                    borderRadius: 5,
                    width: "100%",
                    borderWidth: 2,
                    borderColor: Colors.hud,
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
                {shipSpecialOrders?.specialOrders?.map(
                  (specialOrder, index) => {
                    const orderName = specialOrder[0];
                    const description = specialOrder[1];
                    const orderIcon = specialOrder[2];
                    const activeOrdersCount = Object.values(
                      ship.specialOrders || {}
                    ).filter(Boolean).length;
                    const isDisabled =
                      ship.specialOrders?.[orderName] || activeOrdersCount >= 1;

                    return (
                      <View
                        key={index}
                        style={{
                          marginBottom: 10,
                        }}
                      >
                        <TouchableOpacity
                          disabled={isDisabled}
                          onPress={() => {
                            setOrderName(orderName);
                            if (
                              orderName === "Charge Ion Beams" &&
                              ship.weaponStatus["Ion Particle Beam"] === false
                            ) {
                              Toast.show({
                                type: "error",
                                text1: "Cannot activate",
                                text2: "Ion Particle Beam has not fired yet!",
                                position: "top",
                              });
                              return;
                            } else if (
                              orderName === "Reinforce Shields" &&
                              ship.hp === ship.maxHP
                            ) {
                              Toast.show({
                                type: "error",
                                text1: "Ship HP is already at max.",
                                position: "top",
                              });
                              return;
                            } else if (
                              orderName === "All Systems Fire" &&
                              ship.hasRolledDToHit === false
                            ) {
                              Toast.show({
                                type: "error",
                                text1: "No weapons have been fired yet!",
                                position: "top",
                              });
                              return;
                            } else {
                              setModalToRollADice(true);
                              setLocalDiceRoll(0);
                              setDiceValueToShare(0);
                              setOrderDescription(description);
                              setOrderIcon(orderIcon);
                            }
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 10,
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
                            {orderIcon && (
                              <Image
                                source={{ uri: orderIcon }}
                                style={{
                                  width: 34,
                                  height: 34,
                                  tintColor: ship.specialOrders?.[orderName]
                                    ? Colors.hudDarker
                                    : Colors.white,
                                  alignSelf: "center",
                                  opacity: ship.specialOrders?.[orderName]
                                    ? 0.3
                                    : 1,
                                  borderWidth: 1,
                                  borderColor: ship.specialOrders?.[orderName]
                                    ? Colors.hudDarker
                                    : Colors.white,
                                  borderRadius: 5,
                                }}
                                resizeMode="contain"
                              />
                            )}
                          </View>

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
                  }
                )}
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
    fontFamily: FONTS.leagueRegular,
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
    transform: [{ scale: 1.5 }, { rotate: "0deg" }],
    margin: 20,
    height: 100,
    justifyContent: "center",
    marginVertical: 30,
  },
  statButton: {
    borderRadius: 5,
  },
  statButtonText: {
    borderRadius: 5,
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
    alignSelf: "center",
    backgroundColor: Colors.hudDarker,
    padding: 5,
    width: "100%",
    color: Colors.hud,
    borderWidth: 2,
    borderColor: Colors.hud,
    marginBottom: 10,
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
    marginBottom: 5,
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
    padding: 2,
    margin: 10,
    backgroundColor: Colors.hud,
    padding: 5,
  },
  textHeader: {
    color: Colors.white,
    fontSize: 15,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: FONTS.leagueRegular,
  },
});
