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
import { doc, updateDoc } from "firebase/firestore";
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

export default function FleetMap() {
  const navigation = useNavigation();
  const { gameSectors, setGameSectors } = useMapImageContext();
  /*  const route = useRoute();
  const { sector } = route.params; */
  const { data, setData, gameRoom } = useStarBoundContext();
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [ships, setShips] = useState([]);
  const [shipPressed, setShipPressed] = useState(null);
  const [showFiringArcs, setShowFiringArcs] = useState(true);
  const [showAllFiringArcs, setShowAllFiringArcs] = useState(false);
  const [distanceReset, setDistanceReset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updatingRotation, setUpdatingRotation] = useState(false);
  const [movementDistanceCircle, setMovementDistanceCircle] = useState(null);
  const [distance, setDistance] = useState(0);
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
  const distancePerShipRef = useRef({});
  const selectedShip = ships.find((ships) => ships.id === shipPressed);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  const BACKGROUND_WIDTH = WORLD_WIDTH;
  const BACKGROUND_HEIGHT = WORLD_HEIGHT;

  const [isDraggingShip, setIsDraggingShip] = useState(false);
  //console.log("GameRoom in GameMap:", gameRoom);
  //console.log("Ships in GameMap:", JSON.stringify(ships.length, null, 2));
  //console.log("ship pressed:", shipPressed);

  const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
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

  const resetShipDistance = async (shipId) => {
    const ship = ships.find((s) => s.id === shipId);
    if (ship) {
      ship.netDistance = 0;
      setDistanceReset((prev) => prev + 1); // trigger TraveledDistance reset

      try {
        const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", shipId);
        await updateDoc(shipRef, {
          distanceTraveled: 0, // ✅ Save reset value to Firebase
        });
        console.log(`Reset distance for ship ${shipId} in Firestore.`);
      } catch (e) {
        console.error("Error resetting ship distance in Firebase:", e);
      }
    }
  };

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

  useFocusEffect(
    useCallback(() => {
      //console.log("Calling API with:", { gameRoom, gameSectors });
      if (!gameRoom || !gameSectors) return;
      getAllShipsInGameRoom({
        setData,
        setLoading,
        gameSectors,
        gameRoom,
      });
    }, [gameRoom, gameSectors])
  );

  /*   useEffect(() => {
    console.log("panOffset updated:", panOffset);
  }, [panOffset]);
 */
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
  /*   console.log("User in GameMap:", user.uid);*/
  //console.log("Ship ID in GameMap:", shipPressed);

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

      <ZoomControls
        scale={scale}
        updatingRotation={updatingRotation}
        shipPressed={shipPressed}
        handleShipRotation={handleShipRotation}
        setShowFiringArcs={setShowFiringArcs}
        showFiringArcs={showFiringArcs}
        setShipPressed={setShipPressed}
        setIsDraggingShip={setIsDraggingShip}
        navigateToStats={navigateToStats}
        resetShipDistance={resetShipDistance}
        showAllFiringArcs={showAllFiringArcs}
        setShowAllFiringArcs={setShowAllFiringArcs}
        ships={ships}
      />
      {shipPressed && (
        <Animated.View
          style={{
            opacity: fadeAnim,
            position: "absolute",
            zIndex: 10000,
          }}
        >
          <Text
            style={{
              borderLeftWidth: 1,
              padding: 7,
              borderColor: Colors.hud,
              borderRadius: 1,
              borderTopLeftRadius: 10,
              borderTopWidth: 1,
              color: Colors.hud,
              fontSize: 10,
              position: "absolute",
              fontFamily: "LeagueSpartan-Light",
              top: 10,
              left: 60,
              zIndex: 10000,
            }}
          >
            Ship: {selectedShip.shipId}
          </Text>
          <Text
            style={{
              color: Colors.hud,
              borderLeftWidth: 1,
              padding: 7,
              borderColor: Colors.hud,
              borderRadius: 1,
              fontFamily: "LeagueSpartan-Light",
              fontSize: 10,
              position: "absolute",
              top: 30,
              left: 60,
              zIndex: 10000,
            }}
          >
            HP: {selectedShip.hp} / {selectedShip.maxHP}
          </Text>
          <Text
            style={{
              color: Colors.hud,
              borderLeftWidth: 1,
              padding: 7,
              borderColor: Colors.hud,
              fontFamily: "LeagueSpartan-Light",
              fontSize: 10,
              position: "absolute",
              top: 50,
              left: 60,
              zIndex: 10000,
            }}
          >
            Type: {selectedShip.type}
          </Text>
          <Text
            style={{
              color: Colors.hud,
              borderLeftWidth: 1,
              padding: 7,
              borderColor: Colors.hud,
              borderBottomLeftRadius: 10,
              fontFamily: "LeagueSpartan-Light",
              fontSize: 10,
              position: "absolute",
              top: 70,
              left: 60,
              zIndex: 10000,
              borderBottomWidth: 1,
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
          const panResponder = isUserShip
            ? PanResponder.create({
                onStartShouldSetPanResponder: () => true,

                onPanResponderGrant: () => {
                  ship.position.extractOffset(); // Store current position
                  setIsDraggingShip(true);
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
                    movementDistanceCircle
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

                      /*   // Set colors to indicate it hit the boundary (red)
                      setCircleBorderColor("rgba(255,0,0,0.7)");
                      setCircleBackgroundColor("rgba(255,0,0,0.2)");
                    } else {
                      // The ship is inside or exactly on the circle.
                      // Set colors to indicate it's within range (blue)
                      setCircleBorderColor("rgba(0,200,255,0.5)");
                      setCircleBackgroundColor("rgba(0,200,255,0.1)"); */
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
                onPanResponderRelease: () => {
                  ship.position.flattenOffset(); // Commit the new offset
                  setIsDraggingShip(false);

                  const { x, y } = ship.position.__getValue();
                  const rotation = ship.rotation.__getValue();

                  updatingPosition(
                    ship.id,
                    x,
                    y,
                    rotation,
                    ship.netDistance ?? 0
                  );
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
                      /*   borderRadius: 10,

                    borderWidth: ship.id === shipPressed ? 0 : 2,
                    borderColor: ship.isToggled
                      ? Colors.gold
                      : ship.factionColor || Colors.hud, */
                    }}
                    resizeMode="center"
                  />
                  <View
                    style={{
                      left: ship.width / 4,
                    }}
                  >
                    {((showAllFiringArcs === true && ship.type === "Carrier") ||
                      (shipPressed &&
                        isUserShip &&
                        ship.id === shipPressed)) && (
                      <>
                        <ShipSwitch
                          ship={ship}
                          showFiringArcs={showFiringArcs}
                          showAllFiringArcs={showAllFiringArcs}
                        />
                      </>
                    )}
                  </View>
                </Animated.View>
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    top: 10,
                  }}
                >
                  <Text
                    style={[
                      styles.info,
                      {
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
                  {/* <TraveledDistance
                    ship={ship}
                    user={user}
                    shipPressed={shipPressed}
                    position={ship.position}
                    resetTrigger={distanceReset}
                    reportedDistance={(id, dist) => {
                      distancePerShipRef.current[id] = dist;
                    }}
                  /> */}
                  <Image
                    source={factionIcons[ship.type.toLowerCase()]}
                    style={{
                      width: 35,
                      height: 35,
                      position: "absolute",
                      bottom: 0,
                      left: 70,
                      tintColor: ship.isToggled
                        ? Colors.gold
                        : ship.factionColor,
                    }}
                    resizeMode="contain"
                  />
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
