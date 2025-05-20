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
  Pressable,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function FleetMap() {
  const navigation = useNavigation();
  const { data, setData, gameRoom } = useStarBoundContext();
  const [ships, setShips] = useState([]);
  const [shipPressed, setShipPressed] = useState(null);
  const [showFiringArcs, setShowFiringArcs] = useState(true);
  const [loading, setLoading] = useState(false);
  const user = FIREBASE_AUTH.currentUser;
  const scale = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(1);

  const worldPan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [isDraggingShip, setIsDraggingShip] = useState(false);
  //console.log("GameRoom in GameMap:", gameRoom);
  //console.log("Ships in GameMap:", JSON.stringify(ships.length, null, 2));
  console.log("ship pressed:", shipPressed);

  const worldPanResponder = PanResponder.create({
    //onStartShouldSetPanResponder: () => !isDraggingShip,
    //onMoveShouldSetPanResponder: () => !isDraggingShip,
    onStartShouldSetPanResponder: (evt, gestureState) => {
      return gestureState.numberActiveTouches === 1 && !isDraggingShip;
    },
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return gestureState.numberActiveTouches === 1 && !isDraggingShip;
    },
    onPanResponderGrant: () => {
      console.log("Pan start1");
      worldPan.extractOffset();
    },
    onPanResponderMove: Animated.event(
      [null, { dx: worldPan.x, dy: worldPan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      worldPan.flattenOffset();
    },
  });

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
  const updatingPosition = async (shipId, x, y, rotation) => {
    if (!ships || !user) return;
    try {
      const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", shipId);
      await updateDoc(shipRef, {
        x,
        y,
        rotation_angle: rotation,
      });
      //console.log("Updated ship position:", x, y);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getAllShipsInGameRoom({ gameRoom, setData, setLoading });
    }, [gameRoom])
  );

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
  console.log("Ship ID in GameMap:", ships.id); */

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ZoomControls
        scale={scale}
        shipPressed={shipPressed}
        handleShipRotation={handleShipRotation}
        setShowFiringArcs={setShowFiringArcs}
        showFiringArcs={showFiringArcs}
        setShipPressed={setShipPressed}
        setIsDraggingShip={setIsDraggingShip}
        navigateToStats={navigateToStats}
      />
      <Animated.View
        style={[
          styles.container,
          {
            transform: [...worldPan.getTranslateTransform(), { scale: scale }],
          },
        ]}
        {...worldPanResponder.panHandlers}
      >
        <TileBackground />
        {ships.map((ship) => {
          const isUserShip = user.uid === ship.user;
          const isSelected = shipPressed === ship.id;
          const panResponder = isUserShip
            ? PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderGrant: () => {
                  console.log("Pan start");
                  setIsDraggingShip(true);
                  ship.position.extractOffset();
                  setShipPressed(ship.id);
                },
                onPanResponderMove: (e, gestureState) => {
                  const scaleFactor = scale.__getValue();
                  ship.position.setValue({
                    x: gestureState.dx / scaleFactor,
                    y: gestureState.dy / scaleFactor,
                  });
                },
                onPanResponderRelease: () => {
                  setIsDraggingShip(false);
                  ship.position.flattenOffset();
                  const { x, y } = ship.position.__getValue();
                  const rotation = ship.rotation.__getValue();
                  console.log("Rotation:", rotation);
                  updatingPosition(ship.id, x, y, rotation);
                },
              })
            : undefined;

          return (
            <Animated.View
              key={ship.id}
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
              <View
                style={{
                  height: 5,
                  width: `${(ship.hp / ship.maxHP) * 100}%`,
                  backgroundColor:
                    ship.hp / ship.maxHP > 0.5
                      ? "limegreen"
                      : ship.hp / ship.maxHP > 0.25
                      ? "yellow"
                      : "red",
                  borderRadius: 2,
                }}
              />
              <View
                style={{
                  marginTop: 5,
                  padding: 5,
                }}
              >
                <Image
                  source={{ uri: ship.image }}
                  style={{
                    width: ship.width / 3,
                    height: ship.height / 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  resizeMode="contain"
                />
                {shipPressed && isUserShip && ship.id === shipPressed && (
                  <ShipSwitch
                    ship={ships.find((s) => s.id === shipPressed)}
                    showFiringArcs={showFiringArcs}
                  />
                )}
              </View>
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
            </Animated.View>
          );
        })}
      </Animated.View>
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
    opacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
});
