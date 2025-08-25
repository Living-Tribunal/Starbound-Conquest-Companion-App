import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Image,
  StyleSheet,
  PanResponder,
  Animated,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getAllShipsInGameRoom } from "@/components/API/APIGameRoom";
import { useStarBoundContext } from "@/components/Global/StarBoundProvider";
import { unstable_batchedUpdates } from "react-native";
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
import { FactionImages } from "@/constants/FactionImages";
import { useFocusEffect } from "expo-router";
import TileBackground from "../../components/background/Background";
import LoadingComponent from "@/components/loading/LoadingComponent";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import ShipSwitch from "@/components/switch/ShipSwitch";
import ZoomControls from "@/components/GameMapButtons/ZoonControls";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { useMapImageContext } from "@/components/Global/MapImageContext";
import BackIconArcs from "@/components/GameMapButtons/BackIconArcs";
import Toast from "react-native-toast-message";
import BattleModal from "@/components/Modals/BattleModal/BattleModal";
import { updateShipIsToggled } from "../../components/Functions/updateShipIsToggled";
import ShipInfo from "@/components/shipdata/ShipInfo";
import { factionIcons } from "../../constants/shipIcons";
import useMyTurn from "@/components/Functions/useMyTurn";

export default function FleetMap() {
  const navigation = useNavigation();
  const user = FIREBASE_AUTH.currentUser;
  const { gameSectors, setGameSectors } = useMapImageContext();
  const { data, setData, gameRoomID } = useStarBoundContext();
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
  const [originalShipPosition, setOriginalShipPosition] = useState(null);
  const [isScanBattleField, setIsScanBattleField] = useState(false);
  const [resetingPosition, setResetingPosition] = useState(false);
  const [tempDisableMovementRestriction, setTempDisableMovementRestriction] =
    useState(false);

  const { state: gameState, myTurn } = useMyTurn(gameRoomID);

  const gameStarted = gameState?.started;

  const isPlayerTurn = myTurn;

  const [removeAllIcons, setRemoveAllIcons] = useState(true);
  const [circleBorderColor, setCircleBorderColor] = useState(
    "rgba(0,200,255,0.5)"
  );
  const [circleBackgroundColor, setCircleBackgroundColor] = useState(
    "rgba(0,200,255,0.1)"
  );
  const scale = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(1);
  const WORLD_WIDTH = 1400 * 2;
  const WORLD_HEIGHT = 2900 * 2;
  const MAX_PROTECTED = 4;
  const zoomRef = useRef(1);
  const selectedShip = ships.find((ships) => ships.id === shipPressed);
  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const shipAnim = useRef(new Animated.Value(0)).current;
  const filteredShips = ships.filter(
    (s) => s.gameRoomID === gameRoomID && s.gameSector === gameSectors
  );

  //console.log("scanning battle field in gamemap:", isScanBattleField);

  const BACKGROUND_WIDTH = WORLD_WIDTH;
  const BACKGROUND_HEIGHT = WORLD_HEIGHT;

  const checkIfInFighterRange = (shipToCheck, radius, center) => {
    const { x, y } = shipToCheck.position.__getValue();
    const dx = x - center.x;
    const dy = y - center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= radius;
  };

  const getShipsActionsTakenCount = (ship) => {
    const { move, attack, specialOrder } = ship.shipActions || {};
    const actionsTaken = [move, attack, specialOrder].filter(Boolean).length;
    return actionsTaken;
  };

  const fightersRangeStatus = (ship) => {
    if (
      ship.specialOrders?.["Launch Fighters"] === true &&
      ship.currentCapacity / ship.maxCapacity > 0.5
    ) {
      return Colors.green_toggle;
    } else if (ship.currentCapacity / ship.maxCapacity > 0.25) {
      return Colors.lightened_gold;
    } else {
      return "transparent";
    }
  };

  const shipHasUsedItsTwoMoves = (ship, index) => {
    if (!gameStarted) return;
    if (ship.user === user.uid) {
      const actions = [
        ship.shipActions?.move,
        ship.shipActions?.attack,
        ship.shipActions?.specialOrder,
      ];

      const totalUsed = actions.filter(Boolean).length;

      if (actions[index]) {
        return totalUsed >= 2 ? Colors.gold : Colors.green_toggle;
      } else {
        return Colors.blue_gray; // unused slot
      }
    }
    return Colors.dark_gray; // for enemy or unknown
  };

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
          carrier.currentCapacity > 0 &&
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
              s.gameRoomID === gameRoomID &&
              s.gameSector === gameSectors &&
              checkIfInFighterRange(s, radius, center)
          );

          updatedMap[carrier.id] = shipsInRange;
          allInRange.push(...shipsInRange);
        }
        setLoading(false);
      });

      setShipInFighterRange(updatedMap);

      const batch = writeBatch(FIREBASE_DB);

      Object.entries(updatedMap).forEach(([carrierId, shipsInRange]) => {
        const carrier = ships.find((s) => s.id === carrierId);
        if (!carrier && user.uid !== carrierId) return;
        //const carrierRef = doc(FIREBASE_DB, "users", user.uid, "ships", s.id);
        const carrierRef = doc(
          FIREBASE_DB,
          "users",
          user.uid,
          "ships",
          carrier.id
        );
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

  const FIREBASE_UPDATES_ENABLED = false;
  const handleShipRotation = (shipId, deltaDegrees = 15) => {
    const shipIndex = ships.findIndex((s) => s.id === shipId);
    if (shipIndex === -1) return;

    setUpdatingRotation(true);

    const updatedShips = [...ships];
    const ship = updatedShips[shipIndex];

    const current = ship.rotation.__getValue();
    const next = (current + deltaDegrees) % 360;
    console.log("Rotating ship:", ship.id, "by:", deltaDegrees);

    Animated.timing(ship.rotation, {
      toValue: next,
      duration: 400,
      useNativeDriver: false,
    }).start(async () => {
      try {
        if (FIREBASE_UPDATES_ENABLED) {
          await updateDoc(
            doc(FIREBASE_DB, "users", user.uid, "ships", shipId),
            {
              rotation_angle: next,
            }
          );
        }
        //setShips(updatedShips); // If you're updating local state
      } catch (e) {
        console.error("Error updating rotation:", e);
      } finally {
        setUpdatingRotation(false);
      }
    });
  };

  const navigateToStats = (shipId) => {
    //console.log("Navigating with shipId:", shipId);
    navigation.navigate("Stats", {
      shipId,
      from: "GameMap",
      isPlayerTurn,
      gameStarted,
    });
  };

  const removeNonSerializableProperties = (ship) => {
    const { position, rotation, ...safeShip } = ship;
    return safeShip;
  };

  const navigateToBattleGround = (attackingShip, targetedShip) => {
    if (
      getShipsActionsTakenCount(attackingShip) >= 2 ||
      !attackingShip ||
      !targetedShip
    )
      return;

    const alreadyExists = shipsEnteringBattle.some(
      (entry) =>
        entry.attackingShip?.id === attackingShip.id &&
        entry.targetedShip?.id === targetedShip?.id
    );

    if (alreadyExists) return;

    unstable_batchedUpdates(() => {
      setShipsEnteringBattle((prev) => [
        ...prev,
        { attackingShip, targetedShip },
      ]);
      console.log("Doing Stuff in Maps");

      setShipPressed(null);
      setTargetedShip(null);
      setShowConfirmModal(false);
      setPendingBattle(null);
    });

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
        "shipActions.move": gameStarted ? true : false,
      });
      setData((prevData) =>
        prevData.map((s) =>
          s.id === selectedShip.id
            ? {
                ...s,
                rotation_angle: rotation,
                distanceTraveled: distanceTraveled,
                shipActions: {
                  ...(s.shipActions || {}),
                  move: true,
                },
              }
            : s
        )
      );
      const updatedShip = {
        ...selectedShip,
        shipActions: {
          ...selectedShip.shipActions,
          move: true,
        },
      };
      if (gameStarted) {
        await updateShipIsToggled(user, updatedShip, setData);
      }
    } catch (e) {
      console.error("Error updating document: ", e);
    }
    setUpdateMovement(false);
  };

  const shipHasMovedButNotConfirmed = useMemo(() => {
    return (
      selectedShip &&
      !selectedShip.shipActions?.move &&
      (selectedShip.position.__getValue().x !== selectedShip.x ||
        selectedShip.position.__getValue().y !== selectedShip.y)
    );
  }, [selectedShip]);

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
        carrier.currentCapacity > 0 &&
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

          if (carrier.numberOfShipsProtecting > 0) {
            s.bonuses.inFighterRangeBonus = Math.floor(
              carrier.currentCapacity / carrier.numberOfShipsProtecting
            );
          } else {
            s.bonuses.inFighterRangeBonus = 0;
          }

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

  /*   useFocusEffect(
    useCallback(() => {
      setShipsEnteringBattle([]);
      setShipPressed(null);
      setTargetedShip(null);
      setPendingBattle(null);
      setShowConfirmModal(false);

      if (!user || !gameRoomID || !gameSectors) return;
      setShips([]); // Clear animated ships
      setData([]);
      setLoading(true);

      const fetchUserShips = async () => {
        try {
          const q = query(
            collection(FIREBASE_DB, "users", user.uid, "ships"),
            where("gameRoomID", "==", gameRoomID),
            where("gameSector", "==", gameSectors)
          );

          const querySnapshot = await getDocs(q);
          const userShips = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setData(userShips);
        } catch (e) {
          console.error("❌ Failed to fetch user ships:", e);
        }
      };

      fetchUserShips();
      setLoading(false);
    }, [user?.uid, gameRoomID, gameSectors])
  ); */

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadFleetData = async () => {
        setLoading(true);

        // Reset local battle/selection UI state
        unstable_batchedUpdates(() => {
          setShipsEnteringBattle([]);
          setShipPressed(null);
          setTargetedShip(null);
          setPendingBattle(null);
          setShowConfirmModal(false);
          setShips([]); // Clear animated ship instances
          setData([]); // Clear context data
        });

        // Validate inputs
        if (!user?.uid || !gameRoomID || !gameSectors) {
          setLoading(false);
          return;
        }

        try {
          // Step 1: Fetch user's own ships
          const userQuery = query(
            collection(FIREBASE_DB, "users", user.uid, "ships"),
            where("gameRoomID", "==", gameRoomID),
            where("gameSector", "==", gameSectors)
          );
          const userSnapshot = await getDocs(userQuery);
          const userShips = userSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Optional: store separately if needed later
          const userShipIds = userShips.map((s) => s.id);

          // Step 2: Set user's ships into context
          if (isMounted) setData(userShips);

          // Step 3: Fetch all ships in this room/sector (includes user's and opponents')
          await getAllShipsInGameRoom({
            setData,
            setLoading,
            gameSectors,
            gameRoomID,
          });
        } catch (e) {
          console.error("❌ Error loading fleet data:", e);
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      loadFleetData();

      return () => {
        isMounted = false;
      };
    }, [user?.uid, gameRoomID, gameSectors])
  );

  useEffect(() => {
    const listener = scale.addListener(({ value }) => {
      scaleValue.current = value;
    });
    return () => scale.removeListener(listener);
  }, []);

  const shipBeingTargeted = (ship) => {
    if (
      shipHasMovedButNotConfirmed ||
      ship.isPendingDestruction === true ||
      !isPlayerTurn ||
      ship.user === user.uid
    )
      return;
    setTargetedShip(ship);
    console.log("Targeting ship:", ship.shipId);
  };

  const attackingShip = (ship) => {
    if (!gameStarted) return;
    if (ship.isToggled) return;
    if (ship.user !== user.uid) return;
    setShipPressed(ship.id);
    /*    console.log("Attacking ship:", ship.shipId);
    console.log("Pressed:"); */
  };

  useEffect(() => {
    if (shipPressed && targetedShip) {
      const attackerShip = ships.find((s) => s.id === shipPressed);
      if (attackerShip.isToggled) return;
      if (
        !attackerShip ||
        attackerShip.user !== user.uid ||
        attackerShip.isToggled
      )
        return;
      if (!attackerShip || attackerShip.id === targetedShip.id) return;

      const isDestroyer = attackerShip.type === "Destroyer";
      const hasAFB = attackerShip.specialOrders?.["Anti-Fighter Barrage"];
      const isTargetCarrier = targetedShip.type === "Carrier";
      const targetLaunchedFighters =
        targetedShip.specialOrders?.["Launch Fighters"];

      // 1. AFB can only be used against a Carrier
      if (isDestroyer && hasAFB && !isTargetCarrier) {
        Toast.show({
          type: "error",
          text1: "Starbound Conquest",
          text2: "Anti-Fighter Barrage can only be used against a carrier.",
          position: "top",
        });
        setPendingBattle(null);
        setShowConfirmModal(false);
        return;
      }

      // 2. Carrier must have launched fighters for AFB to apply
      if (isDestroyer && hasAFB && isTargetCarrier && !targetLaunchedFighters) {
        Toast.show({
          type: "error",
          text1: "Starbound Conquest",
          text2: "The enemy carrier must have launched fighters first.",
          position: "top",
        });
        setPendingBattle(null);
        setShowConfirmModal(false);
        return;
      }

      // 3. All good — allow the battle
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
            ...existingShip, // preserve Animated values
            ...incomingShip, // incoming Firestore data should overwrite stale local data
            position: existingShip.position,
            rotation: existingShip.rotation,
          });
        } else {
          // New ship, create new Animated values
          const pos = new Animated.ValueXY({
            x: incomingShip.x ?? 100,
            y: incomingShip.y ?? 100,
          });
          pos.setOffset({ x: 0, y: 0 });
          pos.setValue({ x: incomingShip.x ?? 100, y: incomingShip.y ?? 100 });
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

  /*   if (resetingPosition) {
    return <LoadingComponent whatToSay="Resetting position..." />;
  } */
  // console.log("Original Ship Position:", originalShipPosition);

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
        isPlayerTurn={isPlayerTurn || false}
        isScanningBattleField={isScanBattleField}
        isScanning={setIsScanBattleField}
        gameState={gameState}
      />
      {selectedShip?.hasRolledDToHit === false &&
        gameStarted &&
        getShipsActionsTakenCount(selectedShip) < 2 && (
          <BattleModal
            pendingBattle={pendingBattle}
            showConfirmModal={showConfirmModal}
            setShowConfirmModal={setShowConfirmModal}
            navigateToBattleGround={navigateToBattleGround}
            setShipPressed={setShipPressed}
            setTargetedShip={setTargetedShip}
          />
        )}
      {selectedShip &&
        getShipsActionsTakenCount(selectedShip) < 2 &&
        user.uid === selectedShip.user && (
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
            originalShipPosition={originalShipPosition}
            setOriginalShipPosition={setOriginalShipPosition}
            setMovementDistanceCircle={setMovementDistanceCircle}
            setTargetedShip={setTargetedShip}
            isPlayerTurn={isPlayerTurn}
            gameStarted={gameStarted}
            resetingPosition={resetingPosition}
            setResetingPosition={setResetingPosition}
          />
        )}

      {selectedShip && !targetedShip && selectedShip.user === user.uid && (
        <ShipInfo
          selectedShip={selectedShip}
          shipPressed={shipPressed}
          shipActionCountTaken={getShipsActionsTakenCount(selectedShip)}
        />
      )}

      <ReactNativeZoomableView
        ref={zoomRef}
        maxZoom={2}
        minZoom={0.2}
        initialZoom={0.5}
        longPressDuration={5}
        onLongPress={async () => {
          if (shipHasMovedButNotConfirmed) {
            Toast.show({
              type: "info",
              text1: "Starbound Conquest",
              text2: "You must confirm your movement.",
              position: "top",
            });
            return;
          } else {
            setShipPressed(null);
            setMovementDistanceCircle(null);
            setTargetedShip(null);
            setCircleBorderColor("rgba(0,200,255,0.5)");
            setCircleBackgroundColor("rgba(0,200,255,0.1)");
          }
        }}
        contentWidth={BACKGROUND_WIDTH}
        contentHeight={BACKGROUND_HEIGHT}
        bindToBorders={true}
        panBoundaryPadding={1}
        onDoubleTapBefore={() => false}
      >
        <TileBackground panX={panX} panY={panY} />

        {filteredShips.map((ship) => {
          if (loading) {
            return (
              <ActivityIndicator
                key={ship.id}
                size="large"
                color={Colors.gold}
              />
            );
          }
          const localImage =
            ship?.factionName && ship?.type
              ? FactionImages[ship.factionName]?.[ship.type]?.classImage
              : null;
          const isUserShip = user.uid === ship.user;
          const isTargetedShip = ship.user !== user.uid;

          const fightersLaunched =
            ship.specialOrders?.["Launch Fighters"] === true;

          const antiFighterBarrage =
            ship.specialOrders?.["Anti-Fighter Barrage"] === true;

          const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
              if (isUserShip) {
                //first set the original position and prevent if its NOT the original position
                if (selectedShip && !originalShipPosition) {
                  const { x, y } = selectedShip.position.__getValue();
                  const originalRotation = selectedShip.rotation.__getValue();

                  setOriginalShipPosition({
                    x,
                    y,
                    rotation: originalRotation,
                  });
                }

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
                    moveDistance: ship.specialOrders?.["Broadside"]
                      ? ship.bonuses.broadSideBonus
                      : ship.moveDistance + ship.bonuses.moveDistanceBonus,
                  });
                  if (!ship.shipActions?.move) {
                    setCircleBorderColor("rgba(0,200,255,0.5)");
                    setCircleBackgroundColor("rgba(0,200,255,0.1)");
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
                        s.gameRoomID === gameRoomID &&
                        s.gameSector === gameSectors &&
                        checkIfInFighterRange(s, radius, center)
                    );
                    setShipInFighterRange(shipsInRange);
                    //setFighterRangeBonus(inFighterRangeBonus);
                  }
                }
              } else if (isTargetedShip && shipPressed) {
                const attackingShip = ships.find((s) => s.id === shipPressed);
                if (attackingShip?.miss === true) return;
                if (!attackingShip || attackingShip.user !== user.uid) return;
                if (attackingShip?.hasRolledDToHit === true) return;
                shipBeingTargeted(ship);
                //attackingShip(ship);
              } else {
                // fallback for selecting enemy ship (to show pulse or highlight)
                setShipPressed(ship.id); // set the pressed ship
              }
            },

            // Inside your PanResponder.create's onPanResponderMove function:

            onPanResponderMove: (e, gestureState) => {
              if (!isPlayerTurn && gameStarted) return;
              const actionsTaken = getShipsActionsTakenCount(ship);

              if (actionsTaken >= 2) return;
              if (!isUserShip) return;
              if (ship.shipActions?.move === true) return;
              //if (ship.hasRolledDToHit === true) return;
              //if (ship.miss === true) return;
              const scaleFactor = zoomRef.current?.zoomLevel ?? 1;

              // The ship whose pan responder is currently active.
              const currentPanShipId = ship.id;

              // Only apply constraints and color logic if this is the currently selected ship
              // AND if there's an active movement circle to constrain to.
              if (
                shipPressed === currentPanShipId &&
                movementDistanceCircle &&
                gameStarted
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
              if (ship.shipActions?.move === true) return;
              if (ship.hasRolledDToHit === true) return;
              if (ship.miss === true) return;

              // Flatten the position to commit the current offset
              ship.position.flattenOffset();

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
              {shipPressed === ship.id &&
                movementDistanceCircle &&
                ship.user === user.uid && (
                  <View
                    pointerEvents="none"
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      top:
                        movementDistanceCircle.y -
                        (ship.specialOrders?.["Broadside"]
                          ? ship.bonuses.broadSideBonus
                          : ship.moveDistance +
                            ship.bonuses.moveDistanceBonus) /
                          4,

                      left:
                        movementDistanceCircle.x -
                        (ship.specialOrders?.["Broadside"]
                          ? ship.bonuses.broadSideBonus
                          : ship.moveDistance +
                            ship.bonuses.moveDistanceBonus) /
                          16,

                      width:
                        (ship.specialOrders?.["Broadside"]
                          ? ship.bonuses.broadSideBonus
                          : ship.moveDistance +
                            ship.bonuses.moveDistanceBonus) * 12,

                      height:
                        (ship.specialOrders?.["Broadside"]
                          ? ship.bonuses.broadSideBonus
                          : ship.moveDistance +
                            ship.bonuses.moveDistanceBonus) * 12,

                      borderRadius:
                        (ship.specialOrders?.["Broadside"]
                          ? ship.bonuses.broadSideBonus
                          : ship.moveDistance +
                            ship.bonuses.moveDistanceBonus) * 6,

                      borderWidth: 2,
                      borderColor: circleBorderColor,
                      backgroundColor: circleBackgroundColor,
                      zIndex: 0,
                    }}
                  />
                )}
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
                  ship.id === shipPressed &&
                  fightersLaunched &&
                  ship.user === user.uid && (
                    <View
                      pointerEvents="none"
                      style={{
                        position: "absolute",
                        width: 800,
                        height: 800,
                        borderRadius: 10000,
                        borderColor: fightersRangeStatus(ship) || undefined,
                        borderWidth: 2,
                        top: "50%",
                        left: "50%",
                        marginTop: -400,
                        marginLeft: -400,
                        zIndex: 5,
                      }}
                    />
                  )}
                {ship.type === "Destroyer" &&
                  ship.id === shipPressed &&
                  antiFighterBarrage && (
                    <>
                      <View
                        pointerEvents="none"
                        style={{
                          position: "absolute",
                          width: 400, // diameter
                          height: 400,
                          borderRadius: 10000,
                          borderColor: Colors.green_toggle,
                          backgroundColor: "#18751023",
                          borderWidth: 2,
                          top: "50%",
                          left: "50%",
                          marginTop: -200, // half of height
                          marginLeft: -200, // half of width
                          zIndex: -5,
                        }}
                      />
                    </>
                  )}
                {/* preventing user ship info from rotating */}
                {removeAllIcons && ship.user === user.uid && (
                  <>
                    {/*   {isPlayerTurn && ( */}
                    <Image
                      source={
                        factionIcons[ship.type.toLowerCase()] ||
                        require("../../assets/icons/icons8-chevron-50.png")
                      }
                      style={{
                        width: 25,
                        height: 25,
                        position: "absolute",
                        top: 0,
                        marginTop: 5,
                        left: 80,
                        tintColor: Colors.green_toggle,
                      }}
                      resizeMode="contain"
                    />
                    {/*   )} */}

                    <View
                      style={{
                        flexDirection: "row",
                        position: "absolute",
                        bottom: 0,
                        left: ship.width / 2,
                      }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <View
                          key={i}
                          style={{
                            width: 10,
                            height: 10,
                            marginHorizontal: 1,
                            backgroundColor: shipHasUsedItsTwoMoves(ship, i),
                            borderRadius: 1,
                          }}
                        />
                      ))}
                    </View>
                  </>
                )}
                {removeAllIcons && ship.isPendingDestruction === true && (
                  <Text
                    style={{
                      color: Colors.lighter_red,
                      fontSize: 8,
                      textAlign: "center",
                      backgroundColor: Colors.deep_red,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: Colors.lighter_red,
                    }}
                  >
                    Critical
                  </Text>
                )}
                {removeAllIcons && (
                  <View
                    style={{
                      backgroundColor: ship.protectingCarriersColor,
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      position: "absolute",
                      bottom: ship.height / 2,
                      left: ship.width / 2,
                    }}
                  />
                )}
                {removeAllIcons && ship.type === "Carrier" && (
                  <View
                    style={{
                      backgroundColor: ship.color,
                      width: 20,
                      height: 10,
                      borderRadius: 5,
                      position: "absolute",
                      bottom: ship.height / 2,
                      left: ship.width / 2,
                    }}
                  />
                )}
                {/* Rotating Ship Image */}
                <Animated.View
                  style={{
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
                    source={localImage}
                    style={{
                      borderRadius: 20,
                      width: ship.width / 2,
                      height: ship.height / 2,
                    }}
                    resizeMode="center"
                  />

                  <View
                    style={{
                      left: ship.width / 4,
                    }}
                  >
                    {(isScanBattleField ||
                      (shipPressed && ship.id === shipPressed)) && (
                      <ShipSwitch
                        ship={ship}
                        showFiringArcs={showFiringArcs}
                        currentUserId={user.uid}
                        isUsersTurn={isPlayerTurn}
                        isScanning={isScanBattleField}
                      />
                    )}
                  </View>
                </Animated.View>
              </Animated.View>
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
