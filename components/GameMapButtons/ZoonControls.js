import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { useEffect, useRef } from "react";
import { Colors } from "@/constants/Colors";

export default function ZoomControls({
  ships,
  shipPressed,
  handleShipRotation,
  setShowFiringArcs,
  navigateToStats,
  updatingRotation,
  setShowAllFiringArcs,
  updatingMovement,
  targetedShip,
  navigateToBattleGround,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: shipPressed ? 1 : 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [shipPressed]);

  const selectedShip = ships.find((s) => s.id === shipPressed);
  const shipType = selectedShip?.type === "Carrier";
  return (
    <View style={styles.zoomControls}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {shipPressed && !targetedShip && (
          <Animated.View
            style={{ flexDirection: "row", gap: 10, opacity: fadeAnim }}
          >
            <TouchableOpacity
              style={[styles.zoomButton]}
              onPress={() => handleShipRotation(shipPressed, -45)}
              onLongPress={() => handleShipRotation(shipPressed, -90)}
              disabled={
                updatingRotation ||
                updatingMovement ||
                selectedShip?.hasRolledDToHit === true
              }
            >
              <Image
                style={{ tintColor: Colors.hud, width: 30, height: 30 }}
                source={require("../../assets/icons/icons8-rotate-left-50.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.zoomButton]}
              onPress={() => handleShipRotation(shipPressed, 45)}
              onLongPress={() => handleShipRotation(shipPressed, 90)}
              disabled={
                updatingRotation ||
                updatingMovement ||
                selectedShip?.hasRolledDToHit === true
              }
            >
              <Image
                style={{ tintColor: Colors.hud, width: 30, height: 30 }}
                source={require("../../assets/icons/icons8-rotate-right-50.png")}
              />
            </TouchableOpacity>
          </Animated.View>
        )}
        {shipPressed && !targetedShip && (
          <Animated.View
            style={{
              flexDirection: "column",
              marginTop: 10,
              opacity: fadeAnim,
            }}
          >
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => navigateToStats(shipPressed)}
            >
              <Text style={styles.buttonText}>Enter Ship</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setShowFiringArcs((prev) => !prev)}
              disabled={selectedShip?.hasRolledDToHit === true}
            >
              <Text style={styles.buttonText}>Firing Arcs</Text>
            </TouchableOpacity>
            {shipType && (
              <TouchableOpacity
                style={styles.controlButton}
                disabled={selectedShip?.hasRolledDToHit === true}
                onPress={
                  shipType
                    ? () => setShowAllFiringArcs((prev) => !prev)
                    : undefined
                }
              >
                <Text style={[styles.buttonText, { fontSize: 8 }]}>
                  Fighter Range
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  zoomControls: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 100,
    gap: 10,
  },
  zoomButton: {
    backgroundColor: Colors.hudDarker,
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.hud,
    justifyContent: "center",
    alignItems: "center",
  },
  controlButton: {
    backgroundColor: Colors.hudDarker,
    borderRadius: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
    marginTop: 10,
    width: 100,
  },
  buttonText: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-ExtraBold",
    textAlign: "center",
    fontSize: 12,
  },
});
