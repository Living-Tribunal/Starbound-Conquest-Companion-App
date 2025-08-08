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
  const [animatedValue, setAnimatedValue] = useState(0);
  const diceIntervalRef = useRef(null);

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
      useNativeDriver: false,
    }).start();

    setIsCharging(true);
    let hasFired = false;

    // Start fake dice rolling animation
    diceIntervalRef.current = setInterval(() => {
      const fakeRoll = Math.floor(Math.random() * 16) + 2; // 2d8 fake value
      setAnimatedValue(fakeRoll);
    }, 100);

    timeoutRef.current = setTimeout(() => {
      if (!hasFired && specialWeaponFunction) {
        hasFired = true;
        const result = rollDice(8, 2); // actual result
        specialWeaponFunction();
        setDamageDone(result);
        setIsValue(result);
        setAnimatedValue(result); // show final result
        setIsCharging(false);

        // Stop animation and reset fill
        clearInterval(diceIntervalRef.current);
        Animated.timing(fillAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }).start();

        Toast.show({
          type: "success",
          text1: "Starbound Conquest",
          text2: "Ion Particle Beam Fired!",
          position: "top",
        });
      }
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
              ? Colors.darker_green_toggle
              : Colors.hudDarker,
            borderWidth: 1,
            opacity: disabled ? 0.25 : 1,
            backgroundColor: disabled
              ? Colors.hudDarker
              : isCharging
              ? Colors.hudDarker
              : Colors.hudDarker,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              width: fillWidth,
              backgroundColor: disabled
                ? Colors.hudDarker
                : Colors.darker_green_toggle,
            },
          ]}
        />
        <Text
          style={[
            styles.text,
            {
              color: disabled
                ? Colors.hud
                : isCharging
                ? Colors.green_toggle
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
                ? Colors.green_toggle
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
          {isCharging ? animatedValue : isValue}
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
