import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  PanResponder,
  Animated,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { getAllShipsInGameRoom } from "@/components/API/APIGameRoom";
import { useStarBoundContext } from "@/components/Global/StarBoundProvider";
import {
  doc,
  updateDoc,
  writeBatch,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "@/FirebaseConfig";
import { useFocusEffect } from "expo-router";
import TileBackground from "../../components/background/Background";
import { factionIcons } from "../../constants/shipIcons";
import LoadingComponent from "@/components/loading/LoadingComponent";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import ShipSwitch from "@/components/switch/ShipSwitch";
import ZoomControls from "@/components/GameMapButtons/ZoonControls";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { useMapImageContext } from "@/components/Global/MapImageContext";
import BackIconArcs from "@/components/GameMapButtons/BackIconArcs";
import { FONTS } from "@/constants/fonts";
import { WeaponColors as weaponColors } from "@/constants/WeaponColors";
import Toast from "react-native-toast-message";
import { navigate } from "expo-router/build/global-state/routing";
import BattleModal from "@/components/BattleModal/BattleModal";

export default function FleetMap() {
  const navigation = useNavigation();
  const { gameSectors, setGameSectors } = useMapImageContext();
  const { data, setData, gameRoom } = useStarBoundContext();
  const [ships, setShips] = useState([]);
  const [shipPressed, setShipPressed] = useState(null);
  const [showFiringArcs, setShowFiringArcs] = useState(true);
  const [showAllFiringArcs, setShowAllFiringArcs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingRotation, setUpdatingRotation] = useState(false);
  const [updateMovement, setUpdateMovement] = useState(false);
  const [movementDistanceCircle, setMovementDistanceCircle] = useState(null);
  const [fighterRangeLength, setFighterRangeLength] = useState(0);
  const [shipInFighterRange, setShipInFighterRange] = useState(false);
  const [targetedShip, setTargetedShip] = useState(null);
  const [pendingBattle, setPendingBattle] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [shipsEnteringBattle, setShipsEnteringBattle] = useState([]);

  const [tempDisableMovementRestriction, setTempDisableMovementRestriction] =
    useState(false);
  const [removeAllIcons, setRemoveAllIcons] = useState(true);
  const [circleBorderColor, setCircleBorderColor] = useState(
    "rgba(0,200,255,0.5)"
  );
  const [circleBackgroundColor, setCircleBackgroundColor] = useState(
    "rgba(0,200,255,0.1)"
  );
  const [protectedShipColor, setProtectedShipColor] = useState(null);
  const user = FIREBASE_AUTH.currentUser;
  const scale = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(1);
  const WORLD_WIDTH = 1400 * 2;
  const WORLD_HEIGHT = 2900 * 2;
  const MAX_PROTECTED = 4;
  const zoomRef = useRef(1);
  const selectedShip = ships.find((ships) => ships.id === shipPressed);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const filteredShips = ships.filter(
    (s) => s.gameRoom === gameRoom && s.gameSector === gameSectors
  );

  const BACKGROUND_WIDTH = WORLD_WIDTH;
  const BACKGROUND_HEIGHT = WORLD_HEIGHT;

  const checkIfInFighterRange = (shipToCheck, radius, center) => {
    const { x, y } = shipToCheck.position.__getValue();
    const dx = x - center.x;
    const dy = y - center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= radius;
  };

  const checkIfShipIsInRangeShowIndicator = (ship) =>
    ship.type !== "Carrier" && ship.isInFighterRange && ship.user === user.uid
      ? Colors.green_toggle
      : Colors.blue_gray;

  const fightersRangeStatus = (ship) => {
    if (
      ship.specialOrders?.["Launch Fighters"] === true &&
      ship.capacity / ship.maxCapacity > 0.5
    ) {
      return Colors.green_toggle;
    } else if (ship.capacity / ship.maxCapacity > 0.25) {
      return Colors.lightened_gold;
    } else {
      return Colors.null;
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: shipPressed ? 1 : 0, // fade in if ship selected, fade out if not
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [shipPressed]);

  useEffect(() => {
    let raf;
    const loop = () => {
      const x = zoomRef.current?.offsetX ?? 0;
      const y = zoomRef.current?.offsetY ?? 0;

      panX.setValue(x);
      panY.setValue(y);

      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Calculate ALL ships' fighter range automatically
  useEffect(() => {
    if (!ships.length || !user?.uid) return;
    setLoading(true);

    const runFighterRangeUpdate = async () => {
      const updatedMap = {};
      const allInRange = [];

      ships.forEach((carrier) => {
        if (
          carrier.type === "Carrier" &&
          carrier.specialOrders?.["Launch Fighters"] === true &&
          carrier.capacity > 0 &&
          carrier.user === user.uid
        ) {
          const center = carrier.position.__getValue();
          const radius =
            (carrier.moveDistance + carrier.bonuses.moveDistanceBonus) * 9;

          const shipsInRange = ships.filter(
            (s) =>
              s.id !== carrier.id &&
              s.type !== "Carrier" &&
              s.user === user.uid &&
              s.gameRoom === gameRoom &&
              s.gameSector === gameSectors &&
              checkIfInFighterRange(s, radius, center)
          );

          updatedMap[carrier.id] = shipsInRange;
          allInRange.push(...shipsInRange);
        }
        setLoading(false);
      });

      setShipInFighterRange(updatedMap);
      //setFighterRangeLength(allInRange.length);

      const batch = writeBatch(FIREBASE_DB);

      Object.entries(updatedMap).forEach(([carrierId, shipsInRange]) => {
        const carrier = ships.find((s) => s.id === carrierId);
        if (!carrier && user.uid !== carrierId) return;
        const carrierRef = doc(FIREBASE_DB, "users", user.uid, "ships", s.id);
        batch.update(carrierRef, {
          numberOfShipsProtecting: shipsInRange.length,
        });
      });

      try {
        await batch.commit();
        //console.log("🔥 Firebase batch committed for numberOfShipsProtecting");
      } catch (e) {
        console.error("❌ Error committing batch:", e);
      }
    };

    runFighterRangeUpdate();
  }, [ships, user?.uid]);

  const handleShipRotation = (shipId, deltaDegrees = 15) => {
    const shipIndex = ships.findIndex((s) => s.id === shipId);
    if (shipIndex === -1) return;

    setUpdatingRotation(true);

    const updatedShips = [...ships];
    const ship = updatedShips[shipIndex];

    const current = ship.rotation.__getValue();
    const next = (current + deltaDegrees) % 360;

    Animated.timing(ship.rotation, {
      toValue: next,
      duration: 150,
      useNativeDriver: false,
    }).start(async () => {
      try {
        await updateDoc(doc(FIREBASE_DB, "users", user.uid, "ships", shipId), {
          rotation_angle: next,
        });
        //setShips(updatedShips);
      } catch (e) {
        console.error("Error updating rotation:", e);
      } finally {
        setUpdatingRotation(false);
      }
    });
  };

  const navigateToStats = (shipId) => {
    //console.log("Navigating with shipId:", shipId);
    navigation.navigate("Stats", { shipId, from: "GameMap" });
  };

  const removeNonSerializableProperties = (ship) => {
    const { position, rotation, ...safeShip } = ship;
    return safeShip;
  };

  const navigateToBattleGround = (attackingShip, targetedShip) => {
    if (!attackingShip || !targetedShip) return;

    //console.log("Attacking ship in navigateToBattleGround:", attackingShip);
    //console.log("Targeted ship in navigateToBattleGround:", targetedShip);

    /*   console.log(
      "Navigating to BattleGround with shipId:",
      attackingShip.id,
      targetedShip.id
    ); */

    const alreadyExists = shipsEnteringBattle.some(
      (entry) =>
        entry.attackingShip?.id === attackingShip.id &&
        entry.targetedShip?.id === targetedShip?.id
    );

    if (alreadyExists) return;

    setShipsEnteringBattle((prev) => [
      ...prev,
      { attackingShip, targetedShip },
    ]);

    setShipPressed(null);
    setTargetedShip(null);
    setShowConfirmModal(false);
    setPendingBattle(null);

    // Uncomment to navigate immediately:
    navigation.navigate("BattleGround", {
      attackingShip: removeNonSerializableProperties(attackingShip),
      targetedShip: removeNonSerializableProperties(targetedShip),
      from: "GameMap",
    });
  };

  const updatingPosition = async (shipId, x, y, rotation, distanceTraveled) => {
    if (!ships || !user) return;
    setUpdateMovement(true);
    try {
      const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", shipId);
      await updateDoc(shipRef, {
        x,
        y,
        rotation_angle: rotation,
        distanceTraveled: distanceTraveled,
      });
      //console.log("Updated ship position:", x, y);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
    setUpdateMovement(false);
  };

  const updateFighterProtection = async (
    ships,
    user,
    setShips,
    setFighterRangeLength,
    setShipInFighterRange
  ) => {
    if (!user?.uid || !ships?.length) return;

    // Step 1: Separate user ships from opponent ships
    const userShips = ships.filter((s) => s.user === user.uid);
    const opponentShips = ships.filter((s) => s.user !== user.uid);

    // Step 2: Reset only user ships
    const updatedUserShips = userShips.map((s) => ({
      ...s,
      position: s.position,
      rotation: s.rotation,
      isInFighterRange: false,
      protectedByCarrierID: "Not being protected by a carrier",
      protectingCarriersColor: null,
      bonuses: {
        ...s.bonuses,
        inFighterRangeBonus: 0,
      },
    }));

    // Step 3: Loop through user carriers and assign protection up to MAX_PROTECTED
    const updatedMap = {};
    const allInRange = [];

    userShips.forEach((carrier) => {
      if (
        carrier.type === "Carrier" &&
        carrier.specialOrders?.["Launch Fighters"] === true &&
        carrier.capacity > 0 &&
        user.uid === carrier.user
      ) {
        const center = carrier.position.__getValue();
        const radius =
          (carrier.moveDistance + carrier.bonuses.moveDistanceBonus) * 9;

        const candidates = updatedUserShips
          .filter(
            (s) =>
              s.id !== carrier.id &&
              s.type !== "Carrier" &&
              s.user === user.uid &&
              checkIfInFighterRange(s, radius, center) &&
              (s.protectedByCarrierID === "Not being protected by a carrier" ||
                s.protectedByCarrierID === carrier.id)
          )
          .sort((a, b) => {
            // Prioritize previously protected ships
            const aWasProtected = a.protectedByCarrierID === carrier.id;
            const bWasProtected = b.protectedByCarrierID === carrier.id;
            return bWasProtected - aWasProtected;
          });

        updatedMap[carrier.id] = [];

        for (let i = 0; i < Math.min(candidates.length, MAX_PROTECTED); i++) {
          const s = candidates[i];
          s.isInFighterRange = true;
          s.protectedByCarrierID = carrier.id;
          s.protectingCarriersColor = carrier.color;
          s.bonuses.inFighterRangeBonus =
            Math.floor(carrier.maxCapacity / carrier.numberOfShipsProtecting) ||
            0;

          updatedMap[carrier.id].push(s);
          allInRange.push(s);
        }
      }
    });

    // Step 4: Update carrier numberOfShipsProtecting
    Object.entries(updatedMap).forEach(([carrierId, shipsInRange]) => {
      const carrierIndex = updatedUserShips.findIndex(
        (s) => s.id === carrierId
      );
      if (carrierIndex !== -1) {
        updatedUserShips[carrierIndex] = {
          ...updatedUserShips[carrierIndex],
          numberOfShipsProtecting: shipsInRange.length,
        };
      }
    });

    // Step 5: Combine updated user ships with unchanged opponent ships
    const finalShipsArray = [...updatedUserShips, ...opponentShips];
    //console.log("🔥 finalShipsArray:", finalShipsArray.length);
    // Update local state with the combined array
    // Note: You might want to uncomment this line if you need to update local state
    setShips(finalShipsArray);

    setFighterRangeLength(allInRange.length);
    setShipInFighterRange(updatedMap);

    // Step 6: Update Firestore in batch (only for user ships)
    const batch = writeBatch(FIREBASE_DB);

    updatedUserShips.forEach((s) => {
      if (s.user !== user.uid) return;
      const ref = doc(FIREBASE_DB, "users", s.user, "ships", s.id);
      batch.update(ref, {
        isInFighterRange: s.isInFighterRange,
        protectedByCarrierID:
          s.protectedByCarrierID ?? "Not being protected by a carrier",
        protectingCarriersColor: s.protectingCarriersColor,
        "bonuses.inFighterRangeBonus": s.bonuses.inFighterRangeBonus,
        numberOfShipsProtecting: s.numberOfShipsProtecting || 0,
      });
    });

    try {
      await batch.commit();
      //console.log("✅ updateFighterProtection batch committed");
    } catch (e) {
      console.error("❌ Failed batch update:", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setShipsEnteringBattle([]);
      setShipPressed(null);
      setTargetedShip(null);
      setPendingBattle(null);
      setShowConfirmModal(false);

      if (!user || !gameRoom || !gameSectors) return;
      setShips([]); // Clear animated ships
      setData([]);
      setLoading(true);

      const fetchUserShips = async () => {
        try {
          const q = query(
            collection(FIREBASE_DB, "users", user.uid, "ships"),
            where("gameRoom", "==", gameRoom),
            where("gameSector", "==", gameSectors)
          );

          const querySnapshot = await getDocs(q);
          const userShips = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          /* console.log(
            "✅ User ships loaded:",
            userShips.length,
            "in sector" + gameSectors
          ); */
          setData(userShips);
        } catch (e) {
          console.error("❌ Failed to fetch user ships:", e);
        }
      };

      fetchUserShips();
      setLoading(false);
    }, [user?.uid, gameRoom, gameSectors])
  );

  useFocusEffect(
    useCallback(() => {
      if (!gameRoom || !gameSectors) return;
      getAllShipsInGameRoom({
        setData,
        setLoading,
        gameSectors,
        gameRoom,
      });
    }, [gameRoom, gameSectors])
  );

  useEffect(() => {
    const listener = scale.addListener(({ value }) => {
      scaleValue.current = value;
    });
    return () => scale.removeListener(listener);
  }, []);

  const targetingShip = (ship) => {
    setTargetedShip(ship);
    console.log("Targeting ship:", ship.shipId);
  };
  
  const attackingShip = (ship) => {
    setShipPressed(ship.id);
    console.log("Attacking ship:", ship.shipId);
  };

  useEffect(() => {
    if (shipPressed && targetedShip) {
      const attackerShip = ships.find((s) => s.id === shipPressed);
      console.log("Attacker Ship in UseEffect:", attackerShip.id);
      console.log("Targeted Ship in UseEffect:", targetedShip.id);
      if (!attackerShip && attackingShip.id === targetedShip.id) return;
      setPendingBattle({ attackingShip: attackerShip, targetedShip });
      setShowConfirmModal(true);
    }
  }, [shipPressed, targetedShip]);

  useEffect(() => {
    if (!Array.isArray(data)) return;

    setShips((prevShips) => {
      const newShipsMap = new Map(prevShips.map((ship) => [ship.id, ship]));

      data.forEach((incomingShip) => {
        const existingShip = newShipsMap.get(incomingShip.id);

        if (existingShip) {
          // Ship already exists, update its static properties
          // but preserve the Animated.ValueXY and Animated.Value instances
          // and update their underlying values if they've changed in Firebase.
          if (
            existingShip.position.__getValue().x !== incomingShip.x ||
            existingShip.position.__getValue().y !== incomingShip.y
          ) {
            existingShip.position.setValue({
              x: incomingShip.x,
              y: incomingShip.y,
            });
          }
          if (
            existingShip.rotation.__getValue() !== incomingShip.rotation_angle
          ) {
            existingShip.rotation.setValue(incomingShip.rotation_angle);
          }
          newShipsMap.set(incomingShip.id, {
            ...incomingShip,
            ...existingShip,
            position: existingShip.position, // Keep the existing Animated.ValueXY
            rotation: existingShip.rotation, // Keep the existing Animated.Value
          });
        } else {
          // New ship, create new Animated values
          const pos = new Animated.ValueXY({
            x: incomingShip.x ?? 100,
            y: incomingShip.y ?? 100,
          });
          const rotation = new Animated.Value(incomingShip.rotation_angle ?? 0);
          newShipsMap.set(incomingShip.id, {
            ...incomingShip,
            position: pos,
            rotation,
          });
        }
      });

      return Array.from(newShipsMap.values());
    });
  }, [data]);

  if (loading) {
    return <LoadingComponent whatToSay="Entering the battle..." />;
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <BackIconArcs
        navigation={navigation}
        setTempDisableMovementRestriction={setTempDisableMovementRestriction}
        tempDisableMovementRestriction={tempDisableMovementRestriction}
        setRemoveAllIcons={setRemoveAllIcons}
        removeAllIcons={removeAllIcons}
        ships={data}
        user={user}
      />
      {selectedShip?.hasRolledDToHit === false && (
        <BattleModal
          pendingBattle={pendingBattle}
          showConfirmModal={showConfirmModal}
          setShowConfirmModal={setShowConfirmModal}
          navigateToBattleGround={navigateToBattleGround}
          setShipPressed={setShipPressed}
          setTargetedShip={setTargetedShip}
        />
      )}
      <ZoomControls
        scale={scale}
        updatingRotation={updatingRotation}
        updatingPosition={updatingPosition}
        shipPressed={shipPressed}
        handleShipRotation={handleShipRotation}
        setShowFiringArcs={setShowFiringArcs}
        showFiringArcs={showFiringArcs}
        setShipPressed={setShipPressed}
        navigateToStats={navigateToStats}
        setShowAllFiringArcs={setShowAllFiringArcs}
        ships={ships}
        targetedShip={targetedShip}
        navigateToBattleGround={navigateToBattleGround}
      />
      {selectedShip && !targetedShip && (
        <Animated.View
          style={[
            styles.shipInfoContainer,
            {
              opacity: fadeAnim,
              height: selectedShip.type === "Carrier" ? 210 : 200,
            },
          ]}
        >
          <Text style={styles.shipInfo}>Ship: {selectedShip.shipId}</Text>
          <Text style={styles.shipInfo}>
            HP: {selectedShip.hp} / {selectedShip.maxHP}
          </Text>
          <Text style={styles.shipInfo}>Type: {selectedShip.type}</Text>
          <Text style={styles.shipInfo}>
            Rotation: {selectedShip?.rotation?.__getValue()?.toFixed(0) ?? 0}°
          </Text>
          {selectedShip.type === "Carrier" && (
            <>
              <Text style={[styles.shipInfo]}>
                Protected: {selectedShip.numberOfShipsProtecting}
              </Text>
              <Text style={[styles.shipInfo]}>Ship Color</Text>
              <View
                style={{
                  width: 100,
                  height: 20,
                  backgroundColor: selectedShip.color,
                  borderRadius: 5,
                  marginTop: 5,
                }}
              />
            </>
          )}
          <Text style={styles.shipInfo}>Weapons:</Text>
          {selectedShip?.weaponType?.map((weapon, index) => (
            <TouchableOpacity key={index} onPress={() => console.log(weapon)}>
              <Text
                key={index}
                style={[
                  styles.shipInfo,
                  {
                    borderRadius: 5,
                    padding: 2,
                    margin: 2,
                    fontFamilt: FONTS.leagueBold,
                    fontWeight: "bold",
                    fontSize: 9,
                    textAlign: "center",
                    color: Colors.dark_gray,
                    backgroundColor: weaponColors[weapon] || Colors.hud,
                  },
                ]}
              >
                {weapon}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      <ReactNativeZoomableView
        ref={zoomRef}
        maxZoom={2}
        minZoom={0.2}
        initialZoom={0.5}
        longPressDuration={5}
        onLongPress={() => {
          setShipPressed(null);
          setMovementDistanceCircle(null);
          setTargetedShip(null);
          setCircleBorderColor("rgba(0,200,255,0.5)");
          setCircleBackgroundColor("rgba(0,200,255,0.1)");
        }}
        contentWidth={BACKGROUND_WIDTH}
        contentHeight={BACKGROUND_HEIGHT}
        bindToBorders={true}
        panBoundaryPadding={1}
        onDoubleTapBefore={() => false}
      >
        <TileBackground panX={panX} panY={panY} />
        {filteredShips.map((ship) => {
          const isUserShip = user.uid === ship.user;
          const isTargetedShip = ship.user !== user.uid;

          const fightersLaunched =
            ship.specialOrders?.["Launch Fighters"] === true;

          const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
              {
                /*       setShipPressed(ship.id);
              setMovementDistanceCircle(null);
              setCircleBorderColor("transparent");
              setCircleBackgroundColor("transparent"); */
              }

              if (isUserShip) {
                ship.position.extractOffset();
                if (shipPressed !== ship.id) {
                  // Store current position
                  setShipPressed(ship.id);
                  attackingShip(ship);
                  setMovementDistanceCircle(null);
                  setCircleBorderColor("transparent");
                  setCircleBackgroundColor("transparent");

                  const { x, y } = ship.position.__getValue();
                  setMovementDistanceCircle({
                    x,
                    y,
                    moveDistance:
                      ship.moveDistance +
                      ship.bonuses.moveDistanceBonus +
                      ship.bonuses.broadSideBonus,
                  });
                  setCircleBorderColor("rgba(0,200,255,0.5)");
                  setCircleBackgroundColor("rgba(0,200,255,0.1)");
                  {
                    /*    } */
                  }

                  if (
                    ship.type === "Carrier" &&
                    ship.specialOrders?.["Launch Fighters"] === true &&
                    user.uid === ship.user
                  ) {
                    const radius =
                      (ship.moveDistance + ship.moveDistanceBonus) * 9;
                    const center = { x, y };
                    //filter out carriers
                    const shipsInRange = ships.filter(
                      (s) =>
                        s.id !== ship.id &&
                        s.type !== "Carrier" &&
                        s.gameRoom === gameRoom &&
                        s.gameSector === gameSectors &&
                        checkIfInFighterRange(s, radius, center)
                    );
                    setShipInFighterRange(shipsInRange);
                    //setFighterRangeBonus(inFighterRangeBonus);
                  }
                }
              } else if (
                isTargetedShip &&
                shipPressed &&
                !ships.find((s) => s.id === shipPressed?.hasRolledDToHit)
              ) {
                targetingShip(ship);
                //attackingShip(ship);
              }
            },

            // Inside your PanResponder.create's onPanResponderMove function:

            onPanResponderMove: (e, gestureState) => {
              if (!isUserShip) return;
              if (ship.hasRolledDToHit === true) return;
              const scaleFactor = zoomRef.current?.zoomLevel ?? 1;

              // The ship whose pan responder is currently active.
              const currentPanShipId = ship.id;

              // Only apply constraints and color logic if this is the currently selected ship
              // AND if there's an active movement circle to constrain to.
              if (
                shipPressed === currentPanShipId &&
                movementDistanceCircle &&
                !tempDisableMovementRestriction
              ) {
                const circleX = movementDistanceCircle.x;
                const circleY = movementDistanceCircle.y;
                // The radius is half of the width/height you set for the circle (moveDistance * 12 / 2)
                const radius = movementDistanceCircle.moveDistance * 6;

                // Calculate the potential absolute new position of the ship if allowed to move freely.
                // ship.position.x._offset holds the ship's last committed absolute position.
                // gestureState.dx/dy are the *total* accumulated movement from the start of the drag.
                const potentialShipAbsoluteX =
                  ship.position.x._offset + gestureState.dx / scaleFactor;
                const potentialShipAbsoluteY =
                  ship.position.y._offset + gestureState.dy / scaleFactor;

                // Calculate distance from the circle's center to the potential new ship position
                const deltaX = potentialShipAbsoluteX - circleX;
                const deltaY = potentialShipAbsoluteY - circleY;
                const distanceToCenter = Math.sqrt(
                  deltaX * deltaX + deltaY * deltaY
                );

                let finalShipAbsoluteX = potentialShipAbsoluteX;
                let finalShipAbsoluteY = potentialShipAbsoluteY;

                if (distanceToCenter > radius) {
                  // The ship is trying to go outside the circle.
                  // Constrain its position to the perimeter of the circle.

                  // Calculate the angle from the circle's center to the potential point
                  const angle = Math.atan2(deltaY, deltaX);

                  // Set the final position to be exactly on the circle's edge
                  finalShipAbsoluteX = circleX + radius * Math.cos(angle);
                  finalShipAbsoluteY = circleY + radius * Math.sin(angle);
                }

                // Convert the constrained absolute position back to relative dx, dy for Animated.setValue
                // Animated.setValue expects the change relative to its last offset.
                const constrainedDx =
                  finalShipAbsoluteX - ship.position.x._offset;
                const constrainedDy =
                  finalShipAbsoluteY - ship.position.y._offset;

                // Update the ship's animated position
                ship.position.setValue({
                  x: constrainedDx,
                  y: constrainedDy,
                });
              } else {
                // If this ship is not the currently selected one, or there's no circle to constrain,
                // allow normal movement. (Note: pointerEvents="none" for non-user ships might already prevent this)
                ship.position.setValue({
                  x: gestureState.dx / scaleFactor,
                  y: gestureState.dy / scaleFactor,
                });
              }
            },
            // In onPanResponderRelease, after ship.position.flattenOffset() and updatingPosition:
            onPanResponderRelease: async () => {
              if (!isUserShip) return;
              // Flatten the position to commit the current offset
              ship.position.flattenOffset();
              // Get the current position of the ship
              const { x, y } = ship.position.__getValue();
              const rotation = ship.rotation.__getValue();

              // Update the current ship's position in Firebase
              await updatingPosition(
                ship.id,
                x,
                y,
                rotation,
                ship.netDistance ?? 0
              );

              // --- Calculate ALL ships' fighter range status LOCALLY first ---

              await updateFighterProtection(
                ships,
                user,
                setShips,
                setFighterRangeLength,
                setShipInFighterRange
              );
            },
          });

          return (
            <React.Fragment key={`${ship.id}-${ship.type}`}>
              {shipPressed === ship.id && movementDistanceCircle && (
                <View
                  pointerEvents="none"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    top:
                      movementDistanceCircle.y -
                      (ship.moveDistance + ship.bonuses.moveDistanceBonus) / 4,
                    left:
                      movementDistanceCircle.x -
                      (ship.moveDistance + ship.bonuses.moveDistanceBonus) / 16,
                    width:
                      (ship.moveDistance + ship.bonuses.moveDistanceBonus) * 12,
                    height:
                      (ship.moveDistance + ship.bonuses.moveDistanceBonus) * 12,
                    borderRadius:
                      (ship.moveDistance + ship.bonuses.moveDistanceBonus) * 6,
                    borderWidth: 2,
                    borderColor: circleBorderColor,
                    backgroundColor: circleBackgroundColor,
                    zIndex: 0,
                  }}
                />
              )}
              {ship.hp !== 0 && (
                <Animated.View
                  key={ship.id}
                  {...panResponder.panHandlers}
                  pointerEvents="auto"
                  style={[
                    styles.ship,
                    {
                      transform: ship.position.getTranslateTransform(),
                      zIndex: ship.id === shipPressed ? 1000 : 1, // No rotation here
                    },
                  ]}
                >
                  {ship.type === "Carrier" &&
                    (showAllFiringArcs ||
                      (ship.id === shipPressed && fightersLaunched)) && (
                      <>
                        <View
                          pointerEvents="none"
                          style={{
                            position: "absolute",
                            width: 800, // diameter
                            height: 800,
                            borderRadius: 10000,
                            borderColor: fightersRangeStatus(ship),
                            borderWidth: 2,
                            top: "50%",
                            left: "50%",
                            marginTop: -400, // half of height
                            marginLeft: -400, // half of width
                            zIndex: 5,
                          }}
                        />
                      </>
                    )}
                  {/* Rotating Ship Image */}

                  <Animated.View
                    style={{
                      borderRadius: 10,
                      transform: [
                        {
                          rotate: ship.rotation.interpolate({
                            inputRange: [0, 360],
                            outputRange: ["0deg", "360deg"],
                          }),
                        },
                      ],
                    }}
                  >
                    <Image
                      source={{ uri: ship.image }}
                      style={{
                        borderRadius: 20,
                        width: ship.width / 2,
                        height: ship.height / 2,
                        tintColor:
                          ship.isToggled && ship.hasRolledDToHit
                            ? Colors.gold
                            : null,
                      }}
                      resizeMode="center"
                    />

                    <View
                      style={{
                        left: ship.width / 4,
                      }}
                    >
                      {shipPressed &&
                        isUserShip &&
                        ship.id === shipPressed &&
                        ship.hasRolledDToHit === false && (
                          <>
                            <ShipSwitch
                              ship={ship}
                              showFiringArcs={showFiringArcs}
                            />
                          </>
                        )}
                    </View>
                  </Animated.View>
                  {removeAllIcons && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={[
                          styles.info,
                          {
                            fontFamily: "LeagueSpartan-Bold",
                            marginTop: 5,
                            color: ship.protectingCarriersColor
                              ? Colors.white
                              : ship.id === shipPressed &&
                                targetedShip?.id === ship.id
                              ? Colors.green_toggle
                              : targetedShip?.id === ship.id
                              ? Colors.green_toggle
                              : ship.id === shipPressed
                              ? Colors.gold
                              : Colors.hud,

                            backgroundColor: ship.protectingCarriersColor
                              ? ship.protectingCarriersColor
                              : ship.id === shipPressed &&
                                targetedShip?.id === ship.id
                              ? Colors.darker_green_toggle
                              : targetedShip?.id === ship.id
                              ? Colors.darker_green_toggle
                              : ship.id === shipPressed
                              ? Colors.goldenrod
                              : Colors.hudDarker,

                            borderColor: ship.protectingCarriersColor
                              ? ship.protectingCarriersColor
                              : ship.id === shipPressed &&
                                targetedShip?.id === ship.id
                              ? Colors.green_toggle
                              : targetedShip?.id === ship.id
                              ? Colors.green_toggle
                              : ship.id === shipPressed
                              ? Colors.gold
                              : Colors.hud,
                          },
                        ]}
                      >
                        {ship.shipId}
                      </Text>
                      {ship.type === "Carrier" && ship.user === user.uid && (
                        <Text
                          style={[
                            styles.info,
                            {
                              marginTop: 5,
                              marginLeft: 5,
                              color:
                                ship.id === shipPressed
                                  ? Colors.gold
                                  : Colors.hud,
                              backgroundColor:
                                ship.id === shipPressed
                                  ? Colors.goldenrod
                                  : Colors.hudDarker,
                              borderColor:
                                ship.id === shipPressed
                                  ? Colors.gold
                                  : Colors.hud,
                            },
                          ]}
                        >
                          {ship.numberOfShipsProtecting}
                        </Text>
                      )}
                      {ship.type === "Dreadnought" &&
                        ship.weaponStatus?.["Ion Particle Beam"] === false &&
                        ship.user === user.uid && (
                          <Image
                            pointerEvents="none"
                            resizeMode="contain"
                            style={{
                              width: 30,
                              height: 30,
                              alignSelf: "center",
                              position: "absolute",
                              left: -80,
                              marginTop: 5,
                              tintColor: Colors.green_toggle,
                            }}
                            source={{
                              uri: "https://firebasestorage.googleapis.com/v0/b/starbound-conquest-a1adc.firebasestorage.app/o/maneuverIcons%2Fsinusoidal-beam.png?alt=media&token=96d76ac5-5426-4bbb-835c-f541f7ba3023",
                            }}
                          />
                        )}
                      <Image
                        source={factionIcons[ship.type.toLowerCase()]}
                        style={{
                          width: 35,
                          height: 35,
                          position: "absolute",
                          bottom: 0,
                          marginTop: 5,
                          left: ship.type !== "Carrier" ? 60 : 85,
                          tintColor: ship.isToggled
                            ? Colors.gold
                            : ship.factionColor,
                        }}
                        resizeMode="contain"
                      />
                      {ship.type !== "Carrier" && ship.user === user.uid && (
                        <>
                          <Image
                            pointerEvents="none"
                            resizeMode="contain"
                            style={{
                              width: 30,
                              height: 30,
                              alignSelf: "center",
                              position: "absolute",
                              left: -40,
                              marginTop: 5,
                              tintColor:
                                checkIfShipIsInRangeShowIndicator(ship),
                            }}
                            source={{
                              uri: "https://firebasestorage.googleapis.com/v0/b/starbound-conquest-a1adc.firebasestorage.app/o/maneuverIcons%2Fstrafe.png?alt=media&token=9a1bc896-f4c1-4a07-abc1-f71e6bbe9c5b",
                            }}
                          />
                          {ship.isInFighterRange ? (
                            <Text
                              pointerEvents="none"
                              style={{
                                position: "absolute",
                                color: checkIfShipIsInRangeShowIndicator(ship),
                                fontSize: 10,
                                left: -40,
                                bottom: 40,
                              }}
                            >
                              +{ship.bonuses.inFighterRangeBonus} hp
                            </Text>
                          ) : null}
                        </>
                      )}
                    </View>
                  )}
                </Animated.View>
              )}
            </React.Fragment>
          );
        })}
      </ReactNativeZoomableView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  ship: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  info: {
    color: Colors.hud,
    backgroundColor: Colors.hudDarker,
    fontSize: 12,
    fontFamily: "monospace",
    textAlign: "center",
    borderWidth: 1,
    borderColor: Colors.hud,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: Colors.hud,
    zIndex: 10000,
  },
  shipInfo: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Light",
    fontSize: 12,
    zIndex: 10000,
  },
  shipInfoContainer: {
    position: "absolute",
    zIndex: 10000,
    width: 150,
    padding: 10,
    backgroundColor: "#284b54b8",
    height: 200,
    top: 10,
    left: 100,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "left",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
  },
});
