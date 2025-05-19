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
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import {
  PinchGestureHandler,
  GestureHandlerRootView,
  State,
} from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function FleetMap() {
  const navigation = useNavigation();
  const { data, setData, gameRoom } = useStarBoundContext();
  const [ships, setShips] = useState([]);
  const [shipPressed, setShipPressed] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = FIREBASE_AUTH.currentUser;
  const pinchScale = useRef(new Animated.Value(1)).current; // live scale during gesture
  const scale = useRef(new Animated.Value(1)).current; // base scale
  const scaleValue = useRef(1);
  const animatedScale = Animated.multiply(scale, pinchScale);

  const worldPan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [isDraggingShip, setIsDraggingShip] = useState(false);
  //console.log("GameRoom in GameMap:", gameRoom);
  //console.log("Ships in GameMap:", JSON.stringify(ships.length, null, 2));
  console.log("ship pressed:", shipPressed);

  const updateZoom = (delta) => {
    const newScale = Math.max(0.5, Math.min(scaleValue.current + delta, 2));
    baseScale.setValue(newScale);
  };

  const worldPanResponder = PanResponder.create({
    //onStartShouldSetPanResponder: () => !isDraggingShip,
    //onMoveShouldSetPanResponder: () => !isDraggingShip,
    onStartShouldSetPanResponder: (e, gs) =>
      !isDraggingShip && gs.numberActiveTouches === 1,
    onMoveShouldSetPanResponder: (e, gs) =>
      !isDraggingShip && gs.numberActiveTouches === 1,
    onPanResponderGrant: () => {
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

  const navigateToStats = (shipId) => {
    console.log("Navigating with shipId:", shipId);
    navigation.navigate("Stats", { shipId, from: "GameMap" });
  };
  const updatingPosition = async (shipId, x, y) => {
    if (!ships || !user) return;
    try {
      const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", shipId);
      await updateDoc(shipRef, {
        x,
        y,
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
      const rotation = new Animated.Value(ship.rotation ?? 0); // NEW
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
      <View style={styles.zoomControls}>
        {shipPressed && (
          <View style={styles.statsOverlay}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.hudDarker,
                borderRadius: 5,
                padding: 5,
                borderWidth: 1,
                borderColor: Colors.hud,
              }}
              onPress={() => navigateToStats(shipPressed)}
            >
              <Text
                style={{
                  color: Colors.hud,
                  fontFamily: "LeagueSpartan-ExtraBold",
                  textAlign: "center",
                  fontSize: 12,
                }}
              >
                Ship Stats
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              scale.setValue(Math.min(scale._value + 0.3, 2));
            }}
            style={styles.zoomButton}
          >
            <Text style={styles.zoomText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              scale.setValue(Math.max(scale._value - 0.3, 0.25));
            }}
            style={styles.zoomButton}
          >
            <Text style={styles.zoomText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Animated.View
            style={[
              styles.container,
              {
                transform: [
                  ...worldPan.getTranslateTransform(),
                  { scale: scale },
                ],
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
                      setIsDraggingShip(true);
                      ship.position.extractOffset();
                      setShipPressed(ship.id);
                      //navigateToStats(ship.id)
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
                      updatingPosition(ship.id, x, y);
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
                      transform: ship.position.getTranslateTransform(),
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
                      borderWidth: isSelected ? 1 : 2,
                      borderColor: isSelected ? Colors.hud : null,
                      borderRadius: 5,
                      backgroundColor: "black",
                      marginTop: 5,
                      padding: 5,
                    }}
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
                    <Text style={styles.info}>{ship.shipId}</Text>
                  </View>
                </Animated.View>
              );
            })}
          </Animated.View>
        </View>
      </View>
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
    backgroundColor: "red",
  },
  ship: {
    position: "absolute",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  zoomControls: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 100,
    gap: 10,
  },
  zoomButton: {
    backgroundColor: Colors.goldenrod,
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  zoomText: {
    color: Colors.gold,
    fontSize: 15,
    textAlign: "center",
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
  touchButton: {
    borderWidth: 1,
    borderColor: Colors.lightened_gold,
    borderRadius: 5,
    backgroundColor: Colors.goldenrod,
    marginTop: 5,
    padding: 5,
    opacity: 0.5,
  },
});
