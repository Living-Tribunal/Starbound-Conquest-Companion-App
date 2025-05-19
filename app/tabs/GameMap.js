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
    navigation.navigate("Stats", { shipId, from: "GameMap" });
    //console.log("Navigated to Stats:", shipId);
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
        <TouchableOpacity
          onPress={() => {
            scale.setValue(Math.min(scale._value + 0.3, 2));
          }}
          style={styles.zoomButton}
        >
          <Text style={styles.zoomText}>➕</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            scale.setValue(Math.max(scale._value - 0.3, 0.25));
          }}
          style={styles.zoomButton}
        >
          <Text style={styles.zoomText}>➖</Text>
        </TouchableOpacity>
      </View>
      <PinchGestureHandler
        onGestureEvent={Animated.event(
          [{ nativeEvent: { scale: pinchScale } }],
          { useNativeDriver: false }
        )}
        onHandlerStateChange={(event) => {
          console.log("Pinch event:", event.nativeEvent);
          if (event.nativeEvent.state === State.END) {
            let newScale = scaleValue.current * event.nativeEvent.scale;
            newScale = Math.max(0.5, Math.min(newScale, 2));
            scale.setValue(newScale);
            scaleValue.current = newScale;
            pinchScale.setValue(1); // reset after gesture ends
          }
        }}
      >
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
            const isUserShip = user.uid === ship.userId;
            const panResponder = isUserShip
              ? PanResponder.create({
                  onStartShouldSetPanResponder: () => true,
                  onPanResponderGrant: () => {
                    setIsDraggingShip(true);
                    ship.position.extractOffset();
                    //navigateToStats(ship.id);
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
                    updatingPosition(ship.id, x, y);
                  },
                })
              : undefined;

            return (
              <TouchableOpacity key={ship.id}>
                <Animated.View
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
                  <Image
                    source={{ uri: ship.image }}
                    style={{
                      width: ship.width / 4,
                      height: ship.height / 4,
                    }}
                    resizeMode="contain"
                  />
                  <Text style={[styles.info]}>{ship.shipId}</Text>
                  {shipPressed === ship.id && (
                    <View>
                      <Text style={{ color: Colors.gold }}>Pressed</Text>
                    </View>
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </PinchGestureHandler>
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
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  zoomText: {
    color: "white",
    fontSize: 18,
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
  },
});
