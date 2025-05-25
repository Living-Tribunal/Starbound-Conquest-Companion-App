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
import { useStarBoundContext } from "@/components/Global/StarBoundProvider";
import { doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "@/FirebaseConfig";
import { useFocusEffect } from "expo-router";
import TileBackground from "../../components/background/Background";
import LoadingComponent from "@/components/loading/LoadingComponent";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import ShipSwitch from "@/components/switch/ShipSwitch";
import ZoomControls from "@/components/GameMapButtons/ZoonControls";
import TraveledDistance from "@/components/TravelDistance/TravelDistance";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { useMapImageContext } from "@/components/Global/MapImageContext";
import { BlurView } from "expo-blur";

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
  const [distanceReset, setDistanceReset] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = FIREBASE_AUTH.currentUser;
  const scale = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(1);
  const WORLD_WIDTH = 1400;
  const WORLD_HEIGHT = 2900;
  const zoomRef = useRef(1);

  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  const BACKGROUND_WIDTH = WORLD_WIDTH;
  const BACKGROUND_HEIGHT = WORLD_HEIGHT;

  const [isDraggingShip, setIsDraggingShip] = useState(false);
  //console.log("GameRoom in GameMap:", gameRoom);
  //console.log("Ships in GameMap:", JSON.stringify(ships.length, null, 2));
  //console.log("ship pressed:", shipPressed);

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

  const handleShipRotation = async (shipId, deltaDegrees = 15) => {
    const shipIndex = ships.findIndex((s) => s.id === shipId);
    if (shipIndex === -1) return;

    const updatedShips = [...ships];
    const ship = updatedShips[shipIndex];

    const current = ship.rotation.__getValue();
    const next = (current + deltaDegrees) % 360;

    Animated.timing(ship.rotation, {
      toValue: next,
      duration: 150,
      useNativeDriver: false,
    }).start();
    await updateDoc(doc(FIREBASE_DB, "users", user.uid, "ships", shipId), {
      rotation_angle: next,
    });

    setShips(updatedShips);
  };

  const navigateToStats = (shipId) => {
    console.log("Navigating with shipId:", shipId);
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
      console.log("Calling API with:", { gameRoom, gameSectors });
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
    console.log("panOffset updated:", panOffset);
  }, [panOffset]);

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
      const rotation = new Animated.Value(ship.rotation_angle ?? 0); // NEW
      return { ...ship, position: pos, rotation };
    });
    setShips(initialized);
  }, [data]);

  if (loading) {
    return <LoadingComponent whatToSay="Entering the battle..." />;
  }
  /*   console.log("User in GameMap:", user.uid);
  console.log("Ship ID in GameMap:", ships.id);*/

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
        shipPressed={shipPressed}
        handleShipRotation={handleShipRotation}
        setShowFiringArcs={setShowFiringArcs}
        showFiringArcs={showFiringArcs}
        setShipPressed={setShipPressed}
        setIsDraggingShip={setIsDraggingShip}
        navigateToStats={navigateToStats}
        resetShipDistance={resetShipDistance}
      />

      <ReactNativeZoomableView
        ref={zoomRef}
        maxZoom={2}
        minZoom={0.5}
        initialZoom={0.5}
        longPressDuration={10}
        onLongPress={() => setShipPressed(null)}
        contentWidth={BACKGROUND_WIDTH}
        contentHeight={BACKGROUND_HEIGHT}
        bindToBorders={true}
        panBoundaryPadding={1}
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
                },

                onPanResponderMove: (e, gestureState) => {
                  const scaleFactor = zoomRef.current?.zoomLevel ?? 1;
                  //console.log("🔥 Scale factor:", scaleFactor);

                  const dx = gestureState.dx / scaleFactor;
                  const dy = gestureState.dy / scaleFactor;

                  ship.position.setValue({ x: dx, y: dy });
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
            <Animated.View
              key={ship.id}
              pointerEvents={ship.isToggled ? "none" : "auto"}
              {...(isUserShip ? panResponder.panHandlers : {})}
              style={[
                styles.ship,

                {
                  transform: [
                    ...ship.position.getTranslateTransform(),
                    {
                      rotate: ship.rotation.interpolate({
                        inputRange: [0, 360],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Image
                source={{ uri: ship.image }}
                style={{
                  width: ship.width / 4,
                  height: ship.height / 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                resizeMode="contain"
              />
              <BlurView experimentalBlurMethod={true} intensity={100} tint={80}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: ship.isToggled
                      ? Colors.lighter_red
                      : Colors.green_toggle,
                    borderRadius: 10,
                    position: "absolute",
                    top: 2,
                    left: 2,
                  }}
                />
                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: ship.factionColor || Colors.hud,
                    borderRadius: 10,
                    position: "absolute",
                    top: 2,
                    right: 4,
                  }}
                />
              </BlurView>
              {shipPressed && isUserShip && ship.id === shipPressed && (
                <>
                  <ShipSwitch
                    ship={ships.find((s) => s.id === shipPressed)}
                    showFiringArcs={showFiringArcs}
                  />
                </>
              )}
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
                      color: ship.id === shipPressed ? Colors.gold : Colors.hud,
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
                <TraveledDistance
                  ship={ship}
                  user={user}
                  shipPressed={shipPressed}
                  position={ship.position}
                  resetTrigger={distanceReset}
                />
              </View>
            </Animated.View>
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
  container: {
    flex: 1,
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
