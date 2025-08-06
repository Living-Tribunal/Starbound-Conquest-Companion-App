import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { Colors } from "@/constants/Colors";
import Toast from "react-native-toast-message";
import { SpecialWeaponDescriptions } from "@/constants/SpecialWeaponDescriptions.js";
import { useStarBoundContext } from "@/components/Global/StarBoundProvider.js";

export default function ChargingButton({
  specialWeapon,
  specialWeaponFunction,
  ship,
  disabled,
}) {
  const { damageDone, setDamageDone } = useStarBoundContext();
  const fillAnim = useRef(new Animated.Value(0)).current;
  const fillDuration = 2000;
  const timeoutRef = useRef(null);
  const [isCharging, setIsCharging] = useState(false);
  const [isValue, setIsValue] = useState(0);

  const rollDice = (sides = 8, numberOfDice = 2) => {
    let total = 0;
    for (let i = 0; i < numberOfDice; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      total += roll;
    }
    return total;
  };

  const startCharging = () => {
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: fillDuration,
      useNativeDriver: false, // layout property!
    }).start();
    let hasFired = false;
    setIsCharging(true);

    timeoutRef.current = setTimeout(() => {
      if (!hasFired && specialWeaponFunction) {
        hasFired = true;
        specialWeaponFunction();
        const result = rollDice(8, 2);
        setIsValue(result);
        setDamageDone(result);
      }
      Toast.show({
        type: "success",
        text1: "Starbound Conquest",
        text2: "Ion Particle Beam Fired!",
        position: "top",
      });
    }, fillDuration);
  };

  const cancelCharging = () => {
    Animated.timing(fillAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    clearTimeout(timeoutRef.current);
    setIsCharging(false);
    setDamageDone(0);
  };

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  //console.log("Special Weapon:", isValue);

  return (
    <View
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
        margin: 10,
      }}
    >
      <Pressable
        onPressIn={!disabled ? startCharging : null}
        onPressOut={!disabled ? cancelCharging : null}
        style={[
          styles.button,
          {
            borderColor: disabled
              ? Colors.hud
              : isCharging
              ? Colors.green_toggle
              : Colors.hud,
            borderWidth: 1,
            opacity: disabled ? 0.25 : 1,
            backgroundColor: disabled
              ? Colors.hud
              : isCharging
              ? Colors.green_toggle
              : Colors.hudDarker,
          },
        ]}
      >
        <Animated.View style={[styles.fill, { width: fillWidth }]} />
        <Text
          style={[
            styles.text,
            {
              color: disabled
                ? Colors.hud
                : isCharging
                ? Colors.darker_green_toggle
                : Colors.hud,
            },
          ]}
        >
          {specialWeapon}
        </Text>
        <Text
          style={[
            styles.text,
            {
              fontSize: 9,
              textAlign: "center",
              padding: 2,
              color: disabled
                ? Colors.hud
                : isCharging
                ? Colors.darker_green_toggle
                : Colors.hud,
              fontFamily: "LeagueSpartan-Light",
            },
          ]}
        >
          {SpecialWeaponDescriptions[specialWeapon]?.text}
        </Text>
      </Pressable>
      <View
        style={[
          styles.valueContainer,
          {
            color: disabled ? Colors.hud : Colors.hudDarker,
            borderColor: disabled ? Colors.hudDarker : Colors.hud,
          },
        ]}
      >
        <Text
          style={[
            styles.valueText,
            {
              color: disabled ? Colors.hudDarker : Colors.hud,
            },
          ]}
        >
          {isValue}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 260,
    height: 60,
    backgroundColor: Colors.hud,
    borderRadius: 5,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.green_toggle,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.hudDarker,
    zIndex: -1,
    width: 260,
    height: 60,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: Colors.hudDarker,
    fontSize: 16,
    fontFamily: "LeagueSpartan-Bold",
  },
  valueContainer: {
    backgroundColor: Colors.dark_gray,
    borderWidth: 1,
    borderColor: Colors.hud,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 5,
    padding: 5,
    height: 60,
    width: 50,
  },
  valueText: {
    color: Colors.hud,
    fontSize: 18,
    fontFamily: "LeagueSpartan-Bold",
    textAlign: "center",
    alignSelf: "center",
    padding: 2,
  },
});
