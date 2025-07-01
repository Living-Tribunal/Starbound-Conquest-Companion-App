import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { getAllShipsInGameRoom } from "@/components/API/APIGameRoom";
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
import { useStarBoundContext } from "@/components/Global/StarBoundProvider";
import {
  doc,
  updateDoc,
  writeBatch,
  collection,
  onSnapshot,
  query,
  where,
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
import TraveledDistance from "@/components/TravelDistance/TravelDistance";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { useMapImageContext } from "@/components/Global/MapImageContext";
import Toast from "react-native-toast-message";
import { getFleetData } from "@/components/API/API";

export default function FleetMap() {
  const navigation = useNavigation();
  const { gameSectors, setGameSectors } = useMapImageContext();
  const { data, setData, gameRoom } = useStarBoundContext();
  const [ships, setShips] = useState([]);
  const [shipPressed, setShipPressed] = useState(null);
  const [showFiringArcs, setShowFiringArcs] = useState(false);
  const [showAllFiringArcs, setShowAllFiringArcs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingRotation, setUpdatingRotation] = useState(false);
  const [movementDistanceCircle, setMovementDistanceCircle] = useState(null);
  const [tempDisableMovementRestriction, setTempDisableMovementRestriction] =
    useState(false);
  const [shipInFighterRange, setShipInFighterRange] = useState(false);
  const [circleBorderColor, setCircleBorderColor] = useState(
    "rgba(0,200,255,0.5)"
  );
  const [circleBackgroundColor, setCircleBackgroundColor] = useState(
    "rgba(0,200,255,0.1)"
  );
  const user = FIREBASE_AUTH.currentUser;
  const scale = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(1);
  const WORLD_WIDTH = 1400 * 2;
  const WORLD_HEIGHT = 2900 * 2;
  const zoomRef = useRef(1);
  const selectedShip = ships.find((ships) => ships.id === shipPressed);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

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
        setShips(updatedShips);
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
  const updatingPosition = async (shipId, x, y, rotation, distanceTraveled) => {
    if (!ships || !user) return;
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
  };

  const isInFighterRangeToFirebase = async (updatedShipsData) => {
    if (!user) return;

    const batch = writeBatch(FIREBASE_DB);

    // Iterate through the ships whose status might have changed
    updatedShipsData.forEach((shipToUpdate) => {
      if (user.uid === shipToUpdate.user) {
        const shipRef = doc(
          FIREBASE_DB,
          "users",
          user.uid,
          "ships",
          shipToUpdate.id
        );
        batch.update(shipRef, {
          isInFighterRange: shipToUpdate.isInFighterRange,
        });
      }
    });

    try {
      await batch.commit();
      console.log("Batch update for fighter range successful.");
      // No need to call getFleetData here if you're using a real-time listener for 'data'
    } catch (e) {
      console.error("Error batch updating fighter range:", e);
      Toast.show({
        type: "error",
        text1: "Failed to update fighter range",
        text2: e.message,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      getFleetData({ data, setData });
      //console.log("getFleetData in GameMap:", data);
    }, [])
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
    if (!user) return;

    setLoading(true);
    // Query for ships belonging to the current user
    const q = query(
      collection(FIREBASE_DB, "users", user.uid, "ships"),
      where("gameRoom", "==", gameRoom)
      // You might add a where clause if ships are filtered by gameRoom or other criteria,
      // but for a user's fleet, their ship collection is usually sufficient.
      // If you need all ships in the game room, you'd listen to a different collection
      // like `gameRooms/{gameRoom.id}/ships` if you structure it that way.
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedShips = snapshot.docs.map((doc) => {
          const data = doc.data();
          // Re-initialize Animated values only if they don't exist
          const existingShip = ships.find((s) => s.id === doc.id);
          const position =
            existingShip?.position ||
            new Animated.ValueXY({ x: data.x ?? 100, y: data.y ?? 100 });
          const rotation =
            existingShip?.rotation ||
            new Animated.Value(data.rotation_angle ?? 0);

          // Update existing Animated values if data changed
          if (
            existingShip &&
            (existingShip.position.__getValue().x !== data.x ||
              existingShip.position.__getValue().y !== data.y)
          ) {
            position.setValue({ x: data.x ?? 100, y: data.y ?? 100 });
          }
          if (
            existingShip &&
            existingShip.rotation.__getValue() !== data.rotation_angle
          ) {
            rotation.setValue(data.rotation_angle ?? 0);
          }

          return {
            id: doc.id,
            ...data,
            position,
            rotation,
          };
        });
        setShips(fetchedShips);
        setLoading(false);
        console.log("Real-time ships update received.");
      },
      (error) => {
        console.error("Error listening to ships:", error);
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Failed to load ship data",
          text2: error.message,
        });
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [user, gameRoom]); // Depend on user and gameRoom if the query is dynamic

  useEffect(() => {
    const listener = scale.addListener(({ value }) => {
      scaleValue.current = value;
    });
    return () => scale.removeListener(listener);
  }, []);

  useEffect(() => {
    if (!Array.isArray(data)) return;
    // Initialize animated values for ship positions
    const initialized = data.map((ship) => {
      const pos = new Animated.ValueXY({ x: ship.x ?? 100, y: ship.y ?? 100 });
      const rotation = new Animated.Value(ship.rotation_angle ?? 0);
      return { ...ship, position: pos, rotation };
    });
    setShips(initialized);
  }, [data]);

  if (loading) {
    return <LoadingComponent whatToSay="Entering the battle..." />;
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Map")}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          padding: 0,
          margin: 0,
          backgroundColor: "transparent",
          zIndex: 10000,
        }}
      >
        <Image
          style={styles.image}
          source={require("../../assets/icons/icons8-back-arrow-50.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onLongPress={() => {
          setTempDisableMovementRestriction((prev) => {
            const next = !prev;
            Toast.show({
              type: "success",
              text1: next
                ? "Movement restriction disabled"
                : "Movement restriction enabled",
              position: "bottom",
              visibilityTime: 1500,
            });
            return next;
          });
        }}
        style={{
          position: "absolute",
          top: 50,
          left: 10,
          padding: 0,
          margin: 0,
          backgroundColor: "transparent",
          zIndex: 10000,
        }}
      >
        <Image
          style={[
            styles.image,
            {
              tintColor: tempDisableMovementRestriction
                ? Colors.lighter_red
                : Colors.green_toggle,
            },
          ]}
          source={
            tempDisableMovementRestriction
              ? require("../../assets/icons/icons8-cancel-50.png")
              : require("../../assets/icons/icons8-check-mark-50.png")
          }
        />
      </TouchableOpacity>

      <ZoomControls
        scale={scale}
        updatingRotation={updatingRotation}
        shipPressed={shipPressed}
        handleShipRotation={handleShipRotation}
        setShowFiringArcs={setShowFiringArcs}
        showFiringArcs={showFiringArcs}
        setShipPressed={setShipPressed}
        navigateToStats={navigateToStats}
        setShowAllFiringArcs={setShowAllFiringArcs}
        ships={ships}
      />
      {shipPressed && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            position: "absolute",
            zIndex: 10000,
            width: 150,
            padding: 10,
            backgroundColor: "#284b54b8",
            height: 100,
            top: 10,
            left: 60,
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "left",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.hud,
          }}
        >
          <Text
            style={{
              color: Colors.hud,
              fontSize: 12,
              fontFamily: "LeagueSpartan-Light",
              zIndex: 10000,
            }}
          >
            Ship: {selectedShip.shipId}
          </Text>
          <Text
            style={{
              color: Colors.hud,
              fontFamily: "LeagueSpartan-Light",
              fontSize: 12,
              zIndex: 10000,
            }}
          >
            HP: {selectedShip.hp} / {selectedShip.maxHP}
          </Text>
          <Text
            style={{
              color: Colors.hud,
              fontFamily: "LeagueSpartan-Light",
              fontSize: 12,
              zIndex: 10000,
            }}
          >
            Type: {selectedShip.type}
          </Text>
          <Text
            style={{
              color: Colors.hud,
              fontFamily: "LeagueSpartan-Light",
              fontSize: 12,
              zIndex: 10000,
            }}
          >
            Rotation: {selectedShip?.rotation?.__getValue()?.toFixed(0) ?? 0}°
          </Text>
        </Animated.View>
      )}

      <ReactNativeZoomableView
        ref={zoomRef}
        maxZoom={2}
        minZoom={0.1}
        initialZoom={0.5}
        longPressDuration={10}
        onLongPress={() => {
          setShipPressed(null);
          setMovementDistanceCircle(null);
          // ADD THESE LINES to reset color when all ships are deselected
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

        {ships.map((ship) => {
          const isUserShip = user.uid === ship.user;

          const fightersLaunched =
            ship.specialOrders?.["Launch Fighters"] === true;

          const panResponder = isUserShip
            ? PanResponder.create({
                onStartShouldSetPanResponder: () => true,

                onPanResponderGrant: () => {
                  ship.position.extractOffset(); // Store current position
                  setShipPressed(ship.id);

                  const { x, y } = ship.position.__getValue();
                  // Set the persisted circle data on grant
                  if (!shipPressed || ship.id !== shipPressed) {
                    setShipPressed(ship.id);
                    setMovementDistanceCircle({
                      x,
                      y,
                      moveDistance:
                        ship.moveDistance +
                        ship.moveDistanceBonus +
                        ship.broadSideBonus, // Capture moveDistance here
                    });
                    setCircleBorderColor("rgba(0,200,255,0.5)");
                    setCircleBackgroundColor("rgba(0,200,255,0.1)");
                  }

                  console.log("ship coordinates:", x, y);
                  if (
                    ship.type === "Carrier" &&
                    ship.specialOrders?.["Launch Fighters"] === true
                  ) {
                    const radius =
                      (ship.moveDistance + ship.moveDistanceBonus) * 9;
                    const center = { x, y };
                    //filter out carriers
                    const shipsInRange = ships.filter(
                      (s) =>
                        s.id !== ship.id &&
                        s.type !== "Carrier" &&
                        checkIfInFighterRange(s, radius, center)
                    );
                    console.log(
                      "ships in range:",
                      shipsInRange.map((s) => s.shipId)
                    );
                    setShipInFighterRange(shipsInRange);
                  }
                },

                // Inside your PanResponder.create's onPanResponderMove function:

                onPanResponderMove: (e, gestureState) => {
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
                  ship.position.flattenOffset();
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
                  const shipsWithUpdatedFighterRange = ships
                    .map((s) => {
                      let newIsInFighterRange = false;
                      // Check if this ship is in range of ANY carrier that has launched fighters
                      ships.forEach((carrier) => {
                        if (
                          carrier.type === "Carrier" &&
                          carrier.specialOrders?.["Launch Fighters"] === true
                        ) {
                          const center = carrier.position.__getValue(); // Use current animated position
                          // Ensure you're using the correct radius for fighter range
                          const radius =
                            (carrier.moveDistance + carrier.moveDistanceBonus) *
                            9;
                          if (checkIfInFighterRange(s, radius, center)) {
                            newIsInFighterRange = true;
                          }
                        }
                      });

                      // Only return if the status actually changed to avoid unnecessary updates
                      if (s.isInFighterRange !== newIsInFighterRange) {
                        return { ...s, isInFighterRange: newIsInFighterRange };
                      }
                      return null; // No change for this ship
                    })
                    .filter(Boolean); // Filter out nulls

                  // Update local state with the new isInFighterRange status
                  if (
                    shipsWithUpdatedFighterRange.length > 0 &&
                    user.uid === ship.user
                  ) {
                    setShips((currentShips) =>
                      currentShips.map((s) => {
                        const updatedShip = shipsWithUpdatedFighterRange.find(
                          (us) => us.id === s.id
                        );
                        return updatedShip ? updatedShip : s;
                      })
                    );
                    // Now, send only the *changed* statuses to Firebase using a batch
                    await isInFighterRangeToFirebase(
                      shipsWithUpdatedFighterRange
                    );
                  }
                },
              })
            : undefined;

          return (
            <React.Fragment key={ship.id}>
              {shipPressed === ship.id && movementDistanceCircle && (
                <View
                  pointerEvents="none"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    top:
                      movementDistanceCircle.y -
                      (ship.moveDistance + ship.moveDistanceBonus) / 4,
                    left:
                      movementDistanceCircle.x -
                      (ship.moveDistance + ship.moveDistanceBonus) / 16,
                    width: (ship.moveDistance + ship.moveDistanceBonus) * 12,
                    height: (ship.moveDistance + ship.moveDistanceBonus) * 12,
                    borderRadius:
                      (ship.moveDistance + ship.moveDistanceBonus) * 6,
                    borderWidth: 2,
                    borderColor: circleBorderColor,
                    backgroundColor: circleBackgroundColor,
                    zIndex: 0,
                  }}
                />
              )}
              <Animated.View
                key={ship.id}
                pointerEvents={ship.isToggled ? "none" : "auto"}
                {...(isUserShip ? panResponder.panHandlers : {})}
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
                          borderWidth: 1,
                          top: "50%",
                          left: "50%",
                          marginTop: -400, // half of height
                          marginLeft: -400, // half of width
                          zIndex: 5,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 10,
                          color: fightersRangeStatus(ship),
                          textAlign: "center",
                          top: -360,
                          position: "absolute",
                          width: 150,
                        }}
                      >
                        Max Fighter Range
                      </Text>
                    </>
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
                    source={{ uri: ship.image }}
                    style={{
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
                    {shipPressed && isUserShip && ship.id === shipPressed && (
                      <>
                        <ShipSwitch
                          ship={ship}
                          showFiringArcs={showFiringArcs}
                        />
                      </>
                    )}
                  </View>
                </Animated.View>
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
                        marginTop: 5,
                        color:
                          ship.id === shipPressed ? Colors.gold : Colors.hud,
                        backgroundColor:
                          ship.id === shipPressed
                            ? Colors.goldenrod
                            : Colors.hudDarker,
                        borderColor:
                          ship.id === shipPressed ? Colors.gold : Colors.hud,
                      },
                    ]}
                  >
                    {ship.shipId}
                  </Text>
                  <Image
                    source={factionIcons[ship.type.toLowerCase()]}
                    style={{
                      width: 35,
                      height: 35,
                      position: "absolute",
                      bottom: 0,
                      marginTop: 5,
                      left: 70,
                      tintColor: ship.isToggled
                        ? Colors.gold
                        : ship.factionColor,
                    }}
                    resizeMode="contain"
                  />
                  {ship.type !== "Carrier" && (
                    <Image
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 30,
                        alignSelf: "center",
                        position: "absolute",
                        left: -40,
                        marginTop: 5,
                        tintColor: checkIfShipIsInRangeShowIndicator(ship),
                      }}
                      source={{
                        uri: "https://firebasestorage.googleapis.com/v0/b/starbound-conquest-a1adc.firebasestorage.app/o/maneuverIcons%2Fstrafe.png?alt=media&token=9a1bc896-f4c1-4a07-abc1-f71e6bbe9c5b",
                      }}
                    />
                  )}
                </View>
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
});
