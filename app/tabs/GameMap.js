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
} from "react-native";
import { getAllShipsInGameRoom } from "@/components/API/APIGameRoom";
import { useStarBoundContext } from "@/components/Global/StarBoundProvider";
import { doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "@/FirebaseConfig";
import { useFocusEffect } from "expo-router";
import TileBackground from "../../components/background/Background";
import LoadingComponent from "@/components/loading/LoadingComponent";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function FleetMap() {
  const { data, setData, gameRoom } = useStarBoundContext();
  const [ships, setShips] = useState([]);
  const [shipPressed, setShipPressed] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = FIREBASE_AUTH.currentUser;
  console.log("GameRoom in GameMap:", gameRoom);
  console.log("Ships in GameMap:", JSON.stringify(ships.length, null, 2));

  const updatingPosition = async (shipId, x, y) => {
    if (!ships || !user) return;
    try {
      const shipRef = doc(FIREBASE_DB, "users", user.uid, "ships", shipId);
      await updateDoc(shipRef, {
        x,
        y,
      });
      console.log("Updated ship position:", x, y);
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
    if (!Array.isArray(data)) return;
    // Initialize animated values for ship positions
    const initialized = data.map((ship) => {
      const pos = new Animated.ValueXY({ x: ship.x ?? 100, y: ship.y ?? 100 });
      return { ...ship, position: pos };
    });
    setShips(initialized);
  }, [data]);

  if (loading) {
    return <LoadingComponent whatToSay="Entering the battle..." />;
  }
  console.log("User in GameMap:", user.uid);
  console.log("Ship ID in GameMap:", ships.id);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={StyleSheet.absoluteFill}>
        <TileBackground />
      </View>
      <View style={styles.container}>
        {ships.map((ship) => {
          const isUserShip = user.uid === ship.userId;
          const panResponder = isUserShip
            ? PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderGrant: () => {
                  ship.position.extractOffset();
                },
                onPanResponderMove: Animated.event(
                  [null, { dx: ship.position.x, dy: ship.position.y }],
                  { useNativeDriver: false }
                ),
                onPanResponderRelease: () => {
                  ship.position.extractOffset();
                  const { x, y } = ship.position.__getValue();
                  console.log(`Ship ${ship.id} moved to`, x, y);
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
              <Image
                source={{ uri: ship.image }}
                style={{
                  opacity: shipPressed === ship.id ? 0.25 : 1,
                  width: ship.width / 4,
                  height: ship.height / 4,
                }}
                resizeMode="contain"
              />
            </Animated.View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
});
