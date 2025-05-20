import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import { Colors } from "@/constants/Colors";

export default function ZoomControls({
  scale,
  shipPressed,
  handleShipRotation,
  setShowFiringArcs,
  showFiringArcs,
  setShipPressed,
  setIsDraggingShip,
  navigateToStats,
}) {
  return (
    <View style={styles.zoomControls}>
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
            scale.setValue(Math.max(scale._value - 0.3, 0.25));
          }}
          style={styles.zoomButton}
        >
          <Image
            style={{ tintColor: Colors.hud, width: 30, height: 30 }}
            source={require("../../assets/icons/icons8-minus-100.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            scale.setValue(Math.min(scale._value + 0.3, 2));
          }}
          style={styles.zoomButton}
        >
          <Image
            style={{ tintColor: Colors.hud, width: 30, height: 30 }}
            source={require("../../assets/icons/icons8-plus-100.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {shipPressed && (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={[styles.zoomButton]}
              onPress={() => handleShipRotation(shipPressed, -45)} // rotate 15 degrees
            >
              <Image
                style={{ tintColor: Colors.hud, width: 30, height: 30 }}
                source={require("../../assets/icons/icons8-rotate-left-50.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.zoomButton]}
              //adjust the rotation of the ship HERE!!
              onPress={() => handleShipRotation(shipPressed, 45)}
            >
              <Image
                style={{ tintColor: Colors.hud, width: 30, height: 30 }}
                source={require("../../assets/icons/icons8-rotate-right-50.png")}
              />
            </TouchableOpacity>
          </View>
        )}
        {shipPressed && (
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.hudDarker,
                borderRadius: 5,
                padding: 5,
                borderWidth: 1,
                borderColor: Colors.hud,
                width: 100,
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
                Enter Ship
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {shipPressed && (
          <View style={{ flexDirection: "column", marginTop: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.hudDarker,
                borderRadius: 5,
                padding: 5,
                borderWidth: 1,
                borderColor: Colors.hud,
                marginTop: 10,
                width: 100,
              }}
              onPress={() => {
                console.log("Manually deselecting ship");
                setShipPressed(null);
                setIsDraggingShip(false);
              }}
            >
              <Text
                style={{
                  color: Colors.hud,
                  fontFamily: "LeagueSpartan-ExtraBold",
                  textAlign: "center",
                  fontSize: 12,
                }}
              >
                Deselect
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.hudDarker,
                borderRadius: 5,
                padding: 5,
                borderWidth: 1,
                borderColor: Colors.hud,
                marginTop: 10,
                width: 100,
              }}
              onPress={() => {
                console.log("Firing Arcs:", showFiringArcs);
                setShowFiringArcs((prev) => !prev);
              }}
            >
              <Text
                style={{
                  color: Colors.hud,
                  fontFamily: "LeagueSpartan-ExtraBold",
                  textAlign: "center",
                  fontSize: 12,
                }}
              >
                Firing Arcs
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  zoomControls: {
    position: "absolute",
    top: 20,
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
  zoomText: {
    color: Colors.gold,
    fontSize: 15,
    textAlign: "center",
  },
});
