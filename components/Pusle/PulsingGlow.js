import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet } from "react-native";

export default function PulsingRing({ size = 100, color = "#00f", ship }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  //console.log("PulsingGlow:", ship.hp);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 0, // snap back
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Interpolate scale and opacity
  const ringScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  const ringOpacity = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 0],
  });

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor:
            ship.hp / ship.maxHP > 0.5
              ? "limegreen"
              : ship.hp / ship.maxHP > 0.25
              ? "yellow"
              : "red",
          transform: [{ scale: ringScale }],
          opacity: ringOpacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    borderWidth: 5,
  },
});
