import React, { useCallback, useEffect, useState, useRef } from "react";
import Toast from "react-native-toast-message";
import BattleDice from "@/components/dice/BattleGroundDice.js";
import { FactionImages } from "@/constants/FactionImages.js";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
  SafeAreaView,
  FlatList,
  Modal,
} from "react-native";
import { shipBattleDiceMapping } from "../../components/buttons/BattleDice.js";
import HeaderComponent from "@/components/header/HeaderComponent";
import { Colors } from "../../constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { useNavigation } from "@react-navigation/native";
import ChargingButton from "../../components/buttons/ChargingButton";
import { updateShipIsToggled } from "@/components/Functions/updateShipIsToggled.js";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { getDoc } from "firebase/firestore";
import { useFocusEffect } from "expo-router";
import PulsingGlow from "@/components/Pusle/PulsingGlow.js";
import useMyTurn from "@/components/Functions/useMyTurn";

export default function BattleGround(props) {
  const { from } = props.route.params;
  const navigation = useNavigation();
  const { ship, targetedShip, attackingShip } = props.route.params;
  const {
    allUsers,
    setAllUsers,
    allUsersShips,
    setAllUsersShips,
    singleUser,
    setSingleUser,
    singleUserShip,
    setSingleUserShip,
    expandUserShipList,
    setExpandUserShipList,
    hit,
    damageDone,
    setDamageDone,
    weaponId,
    setDiceValueToShare,
    setData,
    setHit,
    setWeaponId,
  } = useStarBoundContext();
  const [modal, setModal] = useState(false);
  const [newHP, setNewHP] = useState(0);
  const [isUser, setIsUser] = useState(null);
  const [liveShip, setLiveShip] = useState(null);
  const [isDisableBackButton, setIsDisableBackButton] = useState(false);
  const [isNavingModal, setIsNavingModal] = useState(false);
  const { state: gameState } = useMyTurn(gameRoomID);
  const gameRoomID = gameState?.id ?? null;

  const user = FIREBASE_AUTH.currentUser;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fromGameMap = from === "GameMap";
  const gameMapAttackingShip = attackingShip || ship;
  const gameMapTargetedShip = targetedShip || singleUserShip;
  const gameMapTargetedShipId = targetedShip?.userId || isUser?.id;
  const localImage =
    gameMapAttackingShip?.factionName && gameMapAttackingShip?.type
      ? FactionImages[gameMapAttackingShip.factionName]?.[
          gameMapAttackingShip.type
        ]?.classImage
      : null;
  const localEnemyImage =
    gameMapTargetedShip?.factionName && gameMapTargetedShip?.type
      ? FactionImages[gameMapTargetedShip.factionName]?.[
          gameMapTargetedShip.type
        ]?.classImage
      : null;

  const selectedShipDice = liveShip ? shipBattleDiceMapping[liveShip.type] : [];
  const hitState = hit === null ? false : hit;
  const showNavingModal = () => {
    setIsNavingModal(true);
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Interpolate scale and opacity
  const buttonScale = scaleAnim.interpolate({
    inputRange: [0.5, 6],
    outputRange: [1, 1.5],
  });

  const buttonOpacity = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 1],
  });

  const handleD20Roll = async (value, id) => {
    if (!gameMapAttackingShip || !user) return;
    setIsDisableBackButton(true);
    try {
      const shipRef = doc(
        FIREBASE_DB,
        "users",
        gameMapAttackingShip.userId,
        "ships",
        gameMapAttackingShip.id
      );
      const isHit = value >= singleUserShip.threatLevel;
      if (isHit) {
        await updateDoc(shipRef, {
          hit: isHit,
          hasRolledDToHit: true,
          miss: false,
          "shipActions.attack": true,
        });

        setData((prevData) =>
          prevData.map((s) =>
            s.id === singleUserShip.id
              ? {
                  ...s,
                  hit: isHit,
                  hasRolledDToHit: true,
                  miss: false,
                  shipActions: {
                    ...(s.shipActions || {}),
                    attack: true,
                  },
                }
              : s
          )
        );
        setDiceValueToShare(0);
      } else {
        await updateDoc(shipRef, {
          miss: true,
          hit: false,
          "shipActions.attack": true,
        });

        setData((prevData) =>
          prevData.map((s) =>
            s.id === singleUserShip.id
              ? {
                  ...s,
                  miss: true,
                  hit: false,
                  shipActions: {
                    ...(s.shipActions || {}),
                    attack: true,
                  },
                }
              : s
          )
        );
        setIsDisableBackButton(false);
      }
      // setIsDisableBackButton(false);
    } catch (e) {
      console.error("❌ Error updating ship after D20 roll:", e);
    }
  };

  const startChargingIonBeam = async (weaponName) => {
    if (!gameMapAttackingShip || !user) return;
    try {
      const shipRef = doc(
        FIREBASE_DB,
        "users",
        gameMapAttackingShip.userId,
        "ships",
        gameMapAttackingShip.id
      );

      const newWeaponStatus = {
        ...gameMapAttackingShip.specialWeaponStatus,
        [weaponName]: true,
      };

      await updateDoc(shipRef, {
        specialWeaponStatus: newWeaponStatus,
        specialWeaponStatusAttempted: newWeaponStatus,
        "shipActions.attack": true,
      });

      setData((prevData) =>
        prevData.map((s) =>
          s.id === gameMapAttackingShip.id
            ? {
                ...s,
                specialWeaponStatus: newWeaponStatus,
                specialWeaponStatusAttempted: newWeaponStatus,
                "shipActions.attack": true,
              }
            : s
        )
      );
      setIsDisableBackButton(false);
    } catch (e) {
      console.error("❌ Error updating ship after D20 roll:", e);
    }
  };

  const setWeaponHasAttacked = async (weaponId) => {
    if (!gameMapAttackingShip || !user) return;
    // setIsDisableBackButton(true);
    try {
      const shipRef = doc(
        FIREBASE_DB,
        "users",
        gameMapAttackingShip.userId,
        "ships",
        gameMapAttackingShip.id
      );

      const shipSnap = await getDoc(shipRef);
      const latestShipData = shipSnap.exists() ? shipSnap.data() : null;
      const currentWeaponStatus = latestShipData.weaponStatus || {};

      // Add or update just this one weapon
      const updatedWeaponStatus = {
        ...currentWeaponStatus,
        [weaponId]: true,
      };

      await updateDoc(shipRef, {
        weaponStatus: updatedWeaponStatus,
      });

      setData((prevData) =>
        prevData.map((s) =>
          s.id === gameMapAttackingShip.id
            ? { ...s, weaponStatus: updatedWeaponStatus }
            : s
        )
      );
      setIsDisableBackButton(false);
    } catch (e) {
      console.error("Error toggling weapon:", e);
    }
  };

  useEffect(() => {
    if (weaponId) {
      setWeaponHasAttacked(weaponId);
      // startChargingIonBeam(weaponName);
      //console.log("WeaponId in BattleGround:", weaponId);
    }
  }, [weaponId]);

  useEffect(() => {
    if (!gameMapAttackingShip || !user) return;

    const shipRef = doc(
      FIREBASE_DB,
      "users",
      gameMapAttackingShip.userId,
      "ships",
      gameMapAttackingShip.id
    );
    const unsubscribe = onSnapshot(shipRef, (docSnap) => {
      if (docSnap.exists()) {
        const updateShip = { id: docSnap.id, ...docSnap.data() };
        setLiveShip({ id: docSnap.id, ...docSnap.data() });
        updateShipIsToggled(user, updateShip, setData);
      }
    });

    return () => unsubscribe();
  }, [gameMapAttackingShip?.id, user?.uid]);

  //function to get all users EXCEPT current user from firestore
  const getAllUsers = async () => {
    try {
      const allUsersArray = [];
      const currentUserEmail = FIREBASE_AUTH.currentUser.email;
      //console.log("Game Room:", gameRoomID);
      //console.log("Game Room:", user.gameRoomID);
      if (!currentUserEmail || !gameRoomID) return [];

      const usersCollection = collection(FIREBASE_DB, "users");
      const myQuery = query(
        usersCollection,
        where("email", "!=", currentUserEmail),
        where("gameRoomID", "==", gameRoomID)
        //where("gameSector", "==", gameSectors)
      );
      const querySnapshot = await getDocs(myQuery);
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      allUsersArray.push(...users);
      setAllUsers(allUsersArray);
      return users;
    } catch (e) {
      console.error("Error getting users:", e);
      return [];
    }
  };
  //console.log("Hit in BattleGround:", hit);

  //useeffec function to update that selected users ships HP with the clampedHP value
  useEffect(() => {
    if (!singleUserShip || !isUser || damageDone == null || hit === false)
      return;

    const updateUserShipHP = async () => {
      const newHP = singleUserShip.hp - damageDone;
      //console.log("New HP in BattleGround:", newHP);
      const clampedHP = Math.max(0, newHP);
      //console.log("Clamped HP in BattleGround:", clampedHP);

      const userShipDocRef = doc(
        FIREBASE_DB,
        "users",
        gameMapTargetedShipId,
        "ships",
        gameMapTargetedShip.id
      );

      try {
        //const { x, y, ...safeData } = singleUserShip;
        const updatedShip = {
          hp: clampedHP,
        };
        if (clampedHP === 0) {
          updatedShip.isPendingDestruction = true;
        }

        await updateDoc(userShipDocRef, updatedShip);
        setNewHP(clampedHP);
        // console.log("Auto-applied damage:", damageDone);
      } catch (e) {
        console.error("Failed to apply damage:", e);
      }
    };

    updateUserShipHP();
  }, [hit, damageDone, singleUserShip?.id, isUser?.id]);

  //useEffect function to listen for changes for the specific user and ship selected in battleGround
  useEffect(() => {
    if (!FIREBASE_AUTH.currentUser || !singleUserShip || !isUser) return;
    const userShipDocRef = doc(
      FIREBASE_DB,
      "users",
      gameMapTargetedShipId,
      "ships",
      gameMapTargetedShip.id
    );
    const unsubscribe = onSnapshot(userShipDocRef, (doc) => {
      if (doc.exists) {
        const updatedShip = { id: doc.id, ...doc.data() };
        setSingleUserShip(updatedShip);
      }
    });
    return () => unsubscribe();
  }, [singleUserShip?.id, isUser?.id, FIREBASE_AUTH.currentUser]);

  useFocusEffect(
    useCallback(() => {
      setHit(null);
      setDiceValueToShare(0);
      setWeaponId(null);
      setDamageDone(0);
    }, [])
  );

  //useEffect function to get ALL users and their ships from firestore
  useEffect(() => {
    if (!FIREBASE_AUTH.currentUser || !gameRoomID) return;
    let unsubscribers = [];

    const getAllUsersAndListen = async () => {
      const users = await getAllUsers();

      for (const user of users) {
        const shipCollection = collection(
          FIREBASE_DB,
          "users",
          gameMapTargetedShipId,
          "ships"
        );

        const unsubscribe = onSnapshot(shipCollection, (snapshot) => {
          const ships = snapshot.docs.map((doc) => ({
            id: doc.id,
            userId: user.id,
            ...doc.data(),
          }));

          // Replace or update user in state
          setAllUsersShips((prev) => {
            const filtered = (prev || []).filter((u) => u.id !== user.id);
            return [...filtered, { ...user, allUsersShips: ships }];
          });
        });

        unsubscribers.push(unsubscribe);
      }
    };

    getAllUsersAndListen();

    // Cleanup listeners on unmount
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [gameRoomID, FIREBASE_AUTH.currentUser?.uid]);

  //useEffect function to clamp the value from going lower than 0 when rolling for damage and setting it to state
  useEffect(() => {
    if (!singleUserShip || damageDone == null) return;

    const newHP = singleUserShip.hp - damageDone;
    const clampedHP = Math.max(0, newHP);
    setNewHP(clampedHP);
  }, [singleUserShip, damageDone]);

  useEffect(() => {
    if (attackingShip && targetedShip) {
      setLiveShip(attackingShip);
      setSingleUserShip(targetedShip);
      setIsUser({ id: targetedShip.userId });
      setSingleUser({ displayName: targetedShip.username || "unknown user" });
    }
  }, [attackingShip?.id, targetedShip?.id]);

  if (!liveShip) return <Text>Loading...</Text>;

  //simple success message to show when a ship is selected in the battleGround
  const successMessage = () => {
    if (singleUser && singleUserShip) {
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              color: Colors.green_toggle,
            }}
          >
            Success! {singleUser} and {singleUserShip?.type} -{" "}
            {singleUserShip?.shipId} have been selected.
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <HeaderComponent
        disabled={isDisableBackButton}
        color={Colors.white}
        text={isDisableBackButton ? "Battle Has Started" : "BattleGround"}
        NavToWhere={{
          name: fromGameMap ? "GameMap" : "Stats",
          params: { shipId: gameMapAttackingShip?.id || null },
        }}
        onPress={() => {
          setDiceValueToShare(0);
          setHit(false);
        }}
      />
      <ScrollView>
        <View style={styles.container}>
          <View
            style={[
              styles.row,
              {
                borderTopWidth: 3,
                borderTopColor: Colors.white,
                margin: 10,
              },
            ]}
          >
            <Text style={[styles.text, { color: Colors.hud }]}>
              {user.displayName}'s Ship
            </Text>
            <Text style={styles.text}>
              {gameMapAttackingShip?.type} - {gameMapAttackingShip?.shipId}
            </Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
              source={localImage}
              style={{ width: 150, height: 150, resizeMode: "contain" }}
            />
          </View>
          <View
            style={{
              margin: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={[
                styles.hitOrMissText,
                {
                  backgroundColor:
                    hit === false
                      ? Colors.deep_red
                      : hit === true
                      ? Colors.darker_green_toggle
                      : Colors.hudDarker,
                  borderRadius: 5,
                  padding: 5,
                  width: "90%",
                  borderWidth: 1,
                  flexDirection: "row",
                  borderColor:
                    hit === false
                      ? Colors.lighter_red
                      : hit === true
                      ? Colors.green_toggle
                      : Colors.hud,
                },
              ]}
            >
              {hit !== null ? (
                <Text
                  style={[
                    styles.hitOrMissText,
                    {
                      color:
                        hit === true ? Colors.green_toggle : Colors.lighter_red,
                    },
                  ]}
                >
                  Result: {hit === true ? "Hit" : "Miss"}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.hitOrMissText,
                    {
                      color: hitState ? Colors.green_toggle : Colors.hud,
                    },
                  ]}
                >
                  Roll the D20 to Begin.
                </Text>
              )}
            </View>
            <View style={styles.hitOrMissTextContainer}>
              <Text style={styles.damageDone}>
                {weaponId} hit for: {damageDone} hp
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              margin: 10,
              gap: 10,
            }}
          >
            <View style={styles.specialWeaponsContainer}>
              <Text style={styles.specialWeapons}>Main Weapons</Text>
            </View>
            {selectedShipDice.map((dice, index) => {
              const destroyerPowerUpMainGuns =
                liveShip.specialOrders?.["Power Up Main Guns"] === true &&
                liveShip.miss === false;
              liveShip.type === "Destroyer";

              const specialWeaponHasBeenAttempted = Object.values(
                liveShip.specialWeaponStatusAttempted || {}
              ).some((fired) => fired === true);

              const anyWeaponFired = Object.values(
                liveShip.weaponStatus || {}
              ).some((fired) => fired === true);

              return (
                <BattleDice
                  key={index}
                  id={dice.id}
                  numberOfDice={dice.numberOfDice}
                  text={dice.text}
                  number1={dice.number1}
                  number2={dice.number2}
                  tintColor={dice.tintColor}
                  textStyle={dice.textStyle}
                  disableDiceModifiers={!destroyerPowerUpMainGuns}
                  borderColor={dice.borderColor}
                  disabledButtonOnHit={
                    (dice.id === "D20" && liveShip.hasRolledDToHit) ||
                    liveShip.miss
                  }
                  //for weapon ONLY dice
                  disabledButton={
                    anyWeaponFired || specialWeaponHasBeenAttempted
                  }
                  onPress={async () => {
                    await setWeaponHasAttacked(dice.id);
                    setWeaponId(dice.id);
                  }}
                  onRoll={(value, id) => {
                    if (id === "D20" && singleUserShip?.threatLevel != null) {
                      handleD20Roll(value, id);
                    }
                  }}
                />
              );
            })}
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View style={styles.specialWeaponsContainer}>
              <Text style={styles.specialWeapons}>Special Weapons</Text>
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {liveShip.type === "Dreadnought" && (
                <Animated.View>
                  {Object.keys(liveShip.specialWeaponStatus || {}).map(
                    (weaponName, index) => {
                      const hasFiredWeapon =
                        liveShip.weaponStatus?.[weaponId] === true;
                      console.log("hasFiredWeapon:", hasFiredWeapon);
                      const hasFired =
                        liveShip.specialWeaponStatus[weaponName] === true;
                      const canFire = liveShip.hit === true;
                      return (
                        <ChargingButton
                          key={index}
                          ship={liveShip}
                          disabled={!canFire || hasFired || hasFiredWeapon}
                          specialWeapon={weaponName}
                          specialWeaponFunction={() =>
                            startChargingIonBeam(weaponName)
                          }
                        />
                      );
                    }
                  )}
                </Animated.View>
              )}
            </View>
          </View>

          <View
            style={{
              borderColor: Colors.white,
              borderWidth: 1,
              margin: 10,
            }}
          />
          <View style={styles.row}>
            <Text style={styles.text}>
              {!singleUser
                ? `Your opponents ship`
                : `${singleUser?.displayName}'s ${singleUserShip?.type} - ${singleUserShip?.shipId}.`}
            </Text>

            <View style={styles.opponentContainer}>
              {singleUserShip ? (
                <>
                  <View
                    style={{
                      marginTop: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <PulsingGlow
                      ship={singleUserShip}
                      size={100}
                      color={"#00f"}
                    />
                    <Image
                      source={localEnemyImage}
                      style={{
                        width: 150,
                        height: 150,
                        resizeMode: "contain",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <View style={styles.statContainerHolder}>
                      <View style={styles.statContainerHeader}>
                        <Text
                          style={[
                            styles.text,
                            {
                              color: Colors.hudDarker,
                              fontSize: 13,
                              fontFamily: "LeagueSpartan-Bold",
                            },
                          ]}
                        >
                          To Hit
                        </Text>
                      </View>

                      <View style={styles.statContainer}>
                        <Text
                          style={[
                            styles.text,
                            { color: Colors.white, fontSize: 15 },
                          ]}
                        >
                          {singleUserShip?.threatLevel}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.statContainerHolder}>
                      <View style={styles.statContainerHeader}>
                        <Text
                          style={[
                            styles.text,
                            {
                              color: Colors.hudDarker,
                              fontSize: 13,
                              fontFamily: "LeagueSpartan-Bold",
                            },
                          ]}
                        >
                          Soak
                        </Text>
                      </View>

                      <View style={styles.statContainer}>
                        <Text
                          style={[
                            styles.text,
                            { color: Colors.white, fontSize: 15 },
                          ]}
                        >
                          {singleUserShip?.damageThreshold}
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              ) : (
                <Text style={[styles.text, { color: Colors.lighter_red }]}>
                  No opponent selected.
                </Text>
              )}
            </View>
          </View>
        </View>
        <Modal visible={modal} animationType="slide">
          <View style={{ flex: 1, backgroundColor: Colors.dark_gray }}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModal(false);
              }}
            >
              <Text style={styles.closeText}>Close Selection</Text>
            </TouchableOpacity>
            {successMessage()}
            <FlatList
              data={allUsersShips}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <View>
                    <TouchableOpacity
                      style={styles.usernameToggle}
                      onPress={() => {
                        setSingleUser(item.displayName);
                        setIsUser(item);

                        setExpandUserShipList((prev) => ({
                          ...prev,
                          [item.id]: !prev[item.id],
                        }));
                      }}
                    >
                      <Text style={styles.usernameText}>
                        {item.displayName}
                      </Text>
                    </TouchableOpacity>
                    {expandUserShipList[item.id] &&
                      Array.isArray(item.allUsersShips) && (
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                          }}
                        >
                          {item.allUsersShips
                            .sort((a, b) =>
                              (a.type || "").localeCompare(b.type || "")
                            )
                            .map((ship) => (
                              <TouchableOpacity
                                disabled={ship.hp === 0}
                                onLongPress={async () => {
                                  setSingleUserShip(ship);
                                  try {
                                    const shipDocRef = doc(
                                      FIREBASE_DB,
                                      "users",
                                      ship.userId,
                                      "ships",
                                      ship.id
                                    );
                                    const { x, y, ...safeData } = ship;
                                    await updateDoc(shipDocRef, {
                                      hasBeenInteractedWith: false,
                                    });
                                  } catch (e) {
                                    console.error(
                                      "Error updating document: ",
                                      e
                                    );
                                  }
                                }}
                                onPress={async () => {
                                  setSingleUserShip(ship);
                                  try {
                                    const shipDocRef = doc(
                                      FIREBASE_DB,
                                      "users",
                                      ship.userId,
                                      "ships",
                                      ship.id
                                    );
                                    const { x, y, ...safeData } = ship;
                                    await updateDoc(shipDocRef, {
                                      hasBeenInteractedWith: true,
                                    });
                                  } catch (e) {
                                    console.error(
                                      "Error updating document: ",
                                      e
                                    );
                                  }
                                }}
                                key={ship.id}
                                style={{
                                  borderWidth: singleUser ? 1 : 5,
                                  borderColor:
                                    ship.hp === 0
                                      ? Colors.lighter_red
                                      : Colors.hud,
                                  backgroundColor:
                                    ship.hp === 0
                                      ? Colors.deep_red
                                      : Colors.hudDarker,
                                  borderRadius: 5,
                                  width: "32%",
                                  marginTop: 10,
                                  marginBottom: 10,
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                  flexDirection: "row",
                                  padding: 5,
                                }}
                              >
                                {ship.image && (
                                  <Image
                                    source={{ uri: ship?.image }}
                                    style={{
                                      width: 40,
                                      height: 40,
                                      resizeMode: "center",
                                    }}
                                  />
                                )}
                                <Text style={styles.shipTextId}>
                                  {ship.shipId}
                                </Text>
                                {ship.hasBeenInteractedWith === true && (
                                  <View
                                    style={{
                                      backgroundColor: "gold",
                                      width: 15,
                                      height: 15,
                                      borderRadius: 50,
                                    }}
                                  />
                                )}
                              </TouchableOpacity>
                            ))}
                        </View>
                      )}
                  </View>
                );
              }}
              ListEmptyComponent={
                <View style={styles.row}>
                  <Text style={styles.text}>No opponents found.</Text>
                </View>
              }
            />
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 20 : 0,
    paddingHorizontal: 20,
    backgroundColor: Colors.dark_gray,
    flex: 1,
  },
  body: {
    paddingHorizontal: 20,
    flex: 1,
  },
  shipTextId: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "monospace",
    color: Colors.white,
    marginRight: 15,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "monospace",
    color: Colors.white,
  },
  flatListRenderItem: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  usernameText: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "monospace",
    color: Colors.white,
  },
  usernameToggle: {
    backgroundColor: Colors.hudDarker,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  statTextUnder: {
    alignSelf: "center",
    margin: 5,
    backgroundColor: Colors.underTextGray,
    width: "100%",
    borderRadius: 2,
  },
  closeButton: {
    top: 0,
    right: 0,
    padding: 10,
    backgroundColor: Colors.hud,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
  },
  closeText: {
    color: Colors.hudDarker,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Bold",
  },
  statContainer: {
    borderRadius: 5,
    backgroundColor: Colors.hudDarker,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.hud,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10,
  },
  statContainerHolder: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    flex: 1,
    width: "100%",
  },
  statContainerHeader: {
    padding: 5,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: Colors.hud,
    borderWidth: 1,
    borderColor: Colors.hudDarker,
    width: "100%",
  },
  hitOrMissTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
    backgroundColor: Colors.hudDarker,
    width: "90%",
    borderRadius: 5,
    padding: 10,
  },
  hitOrMissText: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Bold",
    color: Colors.white,
    justifyContent: "center",
  },
  damageDone: {
    fontSize: 15,
    textAlign: "center",
    fontFamily: "monospace",
    color: Colors.hud,
  },
  button: {
    width: "40%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.hud,
    borderRadius: 3,
    backgroundColor: Colors.hud,
  },
  ionBeamButton: {
    width: "40%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    borderRadius: 3,
    backgroundColor: Colors.goldenrod,
    borderWidth: 1,
    borderColor: Colors.lightened_gold,
  },
  ionBeamText: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-ExtraBold",
    textAlign: "center",
    fontSize: 13,
    padding: 2,
  },
  specialWeapons: {
    color: Colors.white,
    fontFamily: "LeagueSpartan-ExtraBold",
    textAlign: "center",
    fontSize: 17,
    marginBottom: 5,
  },
  specialWeaponsContainer: {
    width: "90%",
    borderBottomWidth: 2,
    borderBottomColor: Colors.hud,
    margin: 5,
  },
});
