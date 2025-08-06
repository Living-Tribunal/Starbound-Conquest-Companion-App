import React, { useRef } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";

export default function ChargingButton({ specialWeapon }) {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const fillDuration = 2000; // ms to fully charge
  const timeoutRef = useRef(null);

  const startCharging = () => {
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: fillDuration,
      useNativeDriver: false, // layout property!
    }).start();

    timeoutRef.current = setTimeout(() => {
      console.log("💥 Fully Charged! Fire weapon!");
      // call your action here
    }, fillDuration);
  };

  const cancelCharging = () => {
    Animated.timing(fillAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    clearTimeout(timeoutRef.current);
  };

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Pressable
      onPressIn={startCharging}
      onPressOut={cancelCharging}
      style={styles.button}
    >
      <Animated.View style={[styles.fill, { width: fillWidth }]} />
      <Text style={styles.text}>{specialWeapon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 250,
    height: 50,
    backgroundColor: Colors.hudDarker,
    borderRadius: 5,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    /*  borderWidth: 2,
    borderColor: Colors.hud, */
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.darker_green_toggle,
    zIndex: -1,
    width: 200,
    height: 50,
    borderRadius: 5,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.green_toggle,
    borderWidth: 2,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "LeagueSpartan-Medium",
  },
});
