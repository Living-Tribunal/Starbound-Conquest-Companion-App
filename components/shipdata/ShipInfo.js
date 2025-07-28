import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { weaponColors } from "@/constants/WeaponColors";
import { FONTS } from "@/constants/fonts";

export default function ShipInfo({ selectedShip, shipPressed }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: shipPressed ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [shipPressed]);

  useEffect(() => {
    console.log("selectedShip", selectedShip);
  }, [selectedShip]);

  return (
    <Animated.View
      style={[
        styles.shipInfoContainer,
        {
          opacity: fadeAnim,
          height: selectedShip.type === "Carrier" ? 210 : 200,
        },
      ]}
    >
      <Text style={styles.shipInfo}>Ship: {selectedShip.shipId}</Text>
      <Text
        style={[
          styles.shipInfo,
          {
            color: selectedShip.bonuses.inFighterRangeBonus
              ? Colors.green_toggle
              : Colors.hud,
          },
        ]}
      >
        HP:{" "}
        {selectedShip.hp ?? 0 + selectedShip.bonuses.inFighterRangeBonus ?? 0} /{" "}
        {selectedShip.maxHP ?? 0}
      </Text>
      <Text style={styles.shipInfo}>Type: {selectedShip.type}</Text>
      <Text style={styles.shipInfo}>
        Rotation: {selectedShip?.rotation?.__getValue()?.toFixed(0) ?? 0}°
      </Text>
      {selectedShip.type === "Carrier" && (
        <>
          <Text style={[styles.shipInfo]}>
            Protecting: {selectedShip.numberOfShipsProtecting}
          </Text>
          <Text style={[styles.shipInfo]}>Ship Color</Text>
          <View
            style={{
              width: 100,
              height: 20,
              backgroundColor: selectedShip.color,
              borderRadius: 5,
              marginTop: 5,
            }}
          />
        </>
      )}
      <Text style={styles.shipInfo}>Weapons:</Text>
      {/*  {selectedShip?.weaponType?.map((weapon, index) => (
        <TouchableOpacity key={index} onPress={() => console.log(weapon)}>
          <Text
            key={index}
            style={[
              styles.shipInfo,
              {
                borderRadius: 5,
                padding: 2,
                margin: 2,
                fontFamily: FONTS.leagueBold,
                fontWeight: "bold",
                fontSize: 9,
                textAlign: "center",
                color: Colors.dark_gray,
                backgroundColor: weaponColors[weapon] || Colors.hud,
              },
            ]}
          >
            {weapon}
          </Text>
        </TouchableOpacity>
      ))} */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shipInfo: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Light",
    fontSize: 12,
    zIndex: 10000,
  },
  shipInfoContainer: {
    position: "absolute",
    zIndex: 10000,
    width: 150,
    padding: 10,
    backgroundColor: "#284b54b8",
    height: 200,
    top: 10,
    left: 100,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "left",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
  },
});
