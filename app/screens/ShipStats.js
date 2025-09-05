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
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ShipAttributes } from "../../constants/ShipAttributes.js";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider.js";
import { doc, or, updateDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import HeaderComponent from "@/components/header/HeaderComponent.js";
import Toast from "react-native-toast-message";
import BattleDice from "@/components/dice/BattleGroundDice.js";
import { getFleetData } from "@/components/API/API.js";
import { FactionImages } from "@/constants/FactionImages.js";
import LoadingComponent from "@/components/loading/LoadingComponent.js";
import SpecialOrderBonuses from "@/components/switch/ShipSpecialOrders.js";
import RecallFightersModal from "@/components/Modals/RecallFightersModal/RecallFighters";
import useMyTurn from "@/components/Functions/useMyTurn";

export default function ShipStats({ route }) {
  const user = FIREBASE_AUTH.currentUser;
  const { shipId, from, isPlayerTurn } = route.params || {};
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localDiceRoll, setLocalDiceRoll] = useState(0);
  const [modalToRollADice, setModalToRollADice] = useState(false);
  const [orderName, setOrderName] = useState("");
  const [orderIcon, setOrderIcon] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [showRecallFightersModal, setShowRecallFightersModal] = useState(false);
  const diceRollRef = useRef(0);
  const shipActionsNames = {
    move: "Move",
    attack: "Attack",
    specialOrder: "Special Order",
  };
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
    myShips,
    playerGameRoomID,
  } = useStarBoundContext();
  const ship = data.find((s) => s.id === shipId);
  const { state: gameState } = useMyTurn(playerGameRoomID);
  const gameStarted = gameState?.started;

  const carrierId = ship?.id;

  // all of *your* ships that are protected by THIS carrier
  const protectedShips = useMemo(
    () =>
      (myShips ?? []).filter(
        (s) =>
          s?.protectedByCarrierID != null &&
          String(s.protectedByCarrierID) === String(carrierId)
      ),
    [myShips, carrierId]
  );

  // just the IDs (fallback to whatever your id field is)
  const protectedIds = protectedShips.map((s) => s.shipId ?? s.id);

  const localImage =
    ship?.factionName && ship?.type
      ? FactionImages[ship.factionName]?.[ship.type]?.classImage
      : null;
  const shipSpecialOrders = ship ? ShipAttributes[ship.type] : null;
  const bonusNameChanged = {
    moveDistanceBonus: "Movement Bonus",
    broadSideBonus: "Broadside Bonus",
    inFighterRangeBonus: "Fighter Range Bonus",
  };
  const cruiserBroadSideBonus =
    ship?.type === "Cruiser" &&
    ship?.bonuses?.broadSideBonus &&
    ship.specialOrders?.["Broadside"] === true;

  const getShipsActionsTakenCount = (ship) => {
    const { move, attack, specialOrder } = ship.shipActions || {};
    const actionsTaken = [move, attack, specialOrder].filter(Boolean).length;
    return actionsTaken;
  };

  useFocusEffect(
    useCallback(() => {
      if (from) {
        setFromGameMap(from);
      }
    }, [from, setFromGameMap])
  );

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

  const toggleTurn = () => {
    setData((prevData) =>
      prevData.map((s) =>
        s.id === shipId ? { ...s, isToggled: !s.isToggled } : s
      )
    );
  };

  /*  useEffect(() => {
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
  }, [ship?.hasRolledDToHit, ship?.isToggled]); */

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
        isPendingDestruction: true,
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

  /*   useEffect(() => {
    // Only navigate if no ship, fromGameMap is valid, and we haven't navigated already
    if (!ship && fromGameMap && !hasNavigationRef.current) {
      hasNavigationRef.current = true;
      setTimeout(() => {
        navigation.navigate(fromGameMap === "GameMap" ? "GameMap" : "Player");
      }, 500);
    }
  }, [ship, fromGameMap]); */

  useEffect(() => {
    if (!ship) {
      setHitPoints(0);
      setDiceValueToShare(0);
      setHit(false);
    }
  }, [ship]);

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
          disabledButtonOnHit={false}
          onRoll={(value, diceId) => {
            diceRollRef.current = value;
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
              const currentRoll = diceRollRef.current;
              await SpecialOrderBonuses({
                orderName,
                ship,
                localDiceRoll: currentRoll,
                user,
                setData,
                setLocalDiceRoll,
                firstDice,
              });
              setModalToRollADice(false);
              //await toggleSpecialOrdersButton(orderName);
              setTimeout(() => {
                getFleetData({ data, setData });
              }, 500);
              setLocalDiceRoll(0);
              await setDiceValueToShare(0);
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

  if (!ship) {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <LoadingComponent whatToSay="Loading ship data..." />
      </SafeAreaView>
    );
  }

  const shipHpRemaining = ship.hp + ship.bonuses.inFighterRangeBonus || 0;
  const shipHpRemainingPercent = Math.round(shipHpRemaining);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar />
      <HeaderComponent
        text="Ship Stats"
        NavToWhere={fromGameMap === "GameMap" ? "GameMap" : "Player"}
        color={Colors.white}
      />
      <ScrollView
        nestedScrollEnabled
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
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
              source={localImage}
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
                backgroundColor: ship.isToggled
                  ? Colors.deep_red
                  : getShipsActionsTakenCount(ship) >= 1
                  ? Colors.goldenrod
                  : Colors.darker_green_toggle,
                borderColor: ship.isToggled
                  ? Colors.lighter_red
                  : getShipsActionsTakenCount(ship) >= 1
                  ? Colors.lightened_gold
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
                  color: ship.isToggled
                    ? Colors.lighter_red
                    : getShipsActionsTakenCount(ship) >= 1
                    ? Colors.lightened_gold
                    : Colors.green_toggle,
                },
              ]}
            >
              {ship.isToggled
                ? "Ended turn - All Actions Used"
                : getShipsActionsTakenCount(ship) >= 1
                ? "Ready to engage - 1/3 Actions Used"
                : "Ready to attack - No actions taken"}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statButton,
            {
              marginTop: 10,
              justifyContent: "center",
              alignSelf: "center",
              width: "95%",
            },
          ]}
        >
          <Text style={styles.statButtonText}>Actions Taken</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              width: "100%",
            }}
          >
            {Object.entries(ship.shipActions).map(([action, value]) => {
              return (
                <View
                  key={action}
                  style={{
                    justifyContent: "center",
                    borderRadius: 5,
                    alignItems: "center",
                    backgroundColor: value
                      ? Colors.darker_green_toggle
                      : Colors.underTextGray,
                    borderWidth: value ? 1 : 0,
                    borderColor: value ? Colors.green_toggle : null,
                    padding: 1,
                    width: "30%",
                    marginTop: 5,
                    marginBottom: 5,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: value ? Colors.green_toggle : Colors.white,
                      fontFamily: "LeagueSpartan-Regular",
                      fontSize: 10,
                    }}
                  >
                    {shipActionsNames[action]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ width: "45%" }}>
            <View style={[styles.statButton]}>
              <TouchableOpacity
                disabled={from !== "GameMap"}
                onPress={openHPModal}
              >
                <View style={{ width: "100%" }}>
                  <Text style={styles.statButtonText}>Hit Point</Text>
                </View>
                <View
                  style={[
                    styles.statTextUnder,
                    { flexDirection: "row", justifyContent: "center" },
                  ]}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: Colors.hud,
                      fontFamily: "monospace",
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {ship.hp}
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      color: Colors.hud,
                      fontFamily: "monospace",
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    /{ship.maxHP}
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
                    ship.bonuses.moveDistanceBonus > 0
                      ? Colors.green_toggle
                      : Colors.white,
                  fontFamily: "monospace",
                  fontSize: 9,
                  marginTop: 2,
                }}
              >
                {cruiserBroadSideBonus
                  ? ship.bonuses.broadSideBonus
                  : ship?.bonuses?.moveDistanceBonus + ship?.moveDistance}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {ship.maxCapacity > 0 && (
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
                    fontSize: 9,
                  }}
                >
                  {ship.maxCapacity}
                </Text>
              </View>
            </View>
          )}
          <View style={{ width: ship.maxCapacity > 0 ? "25%" : "45%" }}>
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
                  fontSize: 9,
                }}
              >
                {ship.pointValue}
              </Text>
            </View>
          </View>
          <View style={{ width: ship.maxCapacity > 0 ? "25%" : "45%" }}>
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
                      : Colors.hud,
                  fontFamily: "monospace",
                  fontSize: 12,
                  marginTop: 2,
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
                        fontSize: 9,
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
                        fontSize: 9,
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
              <Text
                style={[
                  styles.subHeaderText,
                  { marginTop: 0, color: Colors.hud },
                ]}
              >
                ⚠️ Tip: Special Orders work best before attacking or moving —
                unused orders expire at round’s end.
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
                    const anySpecialOrdersUsed =
                      Object.values(ship.specialOrders || {}).some(Boolean) ||
                      Object.values(ship.specialOrdersAttempted || {}).some(
                        Boolean
                      );

                    const isDisabled = anySpecialOrdersUsed;
                    const isUsed = ship.specialOrders?.[orderName];
                    const isAttempted =
                      ship.specialOrdersAttempted?.[orderName];

                    return (
                      <View
                        key={index}
                        style={{
                          marginBottom: 5,
                          padding: 5,
                        }}
                      >
                        <TouchableOpacity
                          disabled={
                            !gameStarted ||
                            !isPlayerTurn ||
                            isDisabled ||
                            getShipsActionsTakenCount(ship) >= 2 ||
                            ship.shipActions.specialOrder
                          }
                          onPress={() => {
                            setOrderName(orderName);
                            if (
                              orderName === "Charge Ion Beams" &&
                              ship.specialWeaponStatus["Ion Particle Beam"] ===
                                false
                            ) {
                              Toast.show({
                                type: "error",
                                text1: "Starbound Conquest",
                                text2:
                                  "Cannot activate, Ion Particle Beam has not fired.",
                                position: "top",
                              });
                              return;
                            } else if (
                              orderName === "Reinforce Shields" &&
                              ship.hp === ship.maxHP
                            ) {
                              Toast.show({
                                type: "error",
                                text1: "Starbound Conquest",
                                text2: "Ship HP is already at max.",
                                position: "top",
                              });
                              return;
                            } else if (
                              orderName === "All Systems Fire" &&
                              ship.hasRolledDToHit === false
                            ) {
                              Toast.show({
                                type: "error",
                                text1: "Starbound Conquest",
                                text2: "No weapons have been fired yet!",
                                position: "top",
                              });
                              return;
                            } else if (
                              orderName === "Broadside" &&
                              ship.shipActions.move !== true
                            ) {
                              Toast.show({
                                type: "error",
                                text1: "Starbound Conquest",
                                text2: "Ship must move before using Broadside.",
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
                            <View
                              style={{
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  color:
                                    isAttempted || isUsed
                                      ? Colors.hudDarker
                                      : Colors.white,
                                  fontFamily: "monospace",
                                  fontSize: 9,
                                  marginBottom: 2,
                                }}
                              >
                                {orderName}
                              </Text>
                              {orderName === "Anti-Fighter Barrage" && (
                                <Text
                                  numberOfLines={2}
                                  style={[
                                    styles.subHeaderText,
                                    {
                                      textAlign: "center",
                                      backgroundColor: "transparent",
                                      color:
                                        isAttempted || isUsed
                                          ? Colors.hudDarker
                                          : Colors.white,
                                      fontFamily: "monospace",
                                      fontSize: 8,
                                    },
                                  ]}
                                >
                                  (This order is only available against a
                                  carrier.)
                                </Text>
                              )}
                            </View>

                            {orderIcon && (
                              <Image
                                source={{ uri: orderIcon }}
                                style={{
                                  width: 34,
                                  height: 34,
                                  tintColor:
                                    isAttempted || isUsed
                                      ? Colors.hudDarker
                                      : Colors.white,
                                  alignSelf: "center",
                                  opacity: isAttempted || isUsed ? 0.3 : 1,
                                  borderWidth: 1,
                                  borderColor:
                                    isAttempted || isUsed
                                      ? Colors.hudDarker
                                      : Colors.white,
                                  borderRadius: 5,
                                }}
                                resizeMode="contain"
                              />
                            )}
                            {orderName === "Launch Fighters" &&
                              ship.specialOrders?.["Launch Fighters"] ===
                                true && (
                                <TouchableOpacity
                                  onPress={() =>
                                    setShowRecallFightersModal(true)
                                  }
                                  style={[
                                    styles.button,
                                    {
                                      backgroundColor:
                                        Colors.darker_green_toggle,
                                      borderColor: Colors.green_toggle,
                                      padding: 3,
                                      marginTop: 0,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.buttonText,
                                      {
                                        color: Colors.green_toggle,
                                        fontFamily: "LeagueSpartan-Bold",
                                      },
                                    ]}
                                  >
                                    Recall Fighters
                                  </Text>
                                </TouchableOpacity>
                              )}
                          </View>

                          <Text
                            style={{
                              fontSize: 9,
                              color:
                                isAttempted || isUsed
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
                  disabled={!isPlayerTurn}
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
        <RecallFightersModal
          showRecallFightersModal={showRecallFightersModal}
          setShowRecallFightersModal={setShowRecallFightersModal}
          ship={ship}
          myShips={myShips}
          protectedIds={protectedIds}
          setData={setData}
        />
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
    fontFamily: "LeagueSpartan-Regular",
    borderBottomColor: Colors.white,
    borderTopColor: "transparent",
  },
  shipTypeText: {
    color: Colors.white,
    fontSize: 30,
    marginBottom: 5,
    marginTop: 5,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Regular",
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
    borderRadius: 5,
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
    fontFamily: "LeagueSpartan-Regular",
  },
});
