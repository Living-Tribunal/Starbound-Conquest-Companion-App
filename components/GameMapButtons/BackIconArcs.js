import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WaitingForTurn from "@/components/WaitingForTurn/WaitingForTurn";
import ScanBattleField from "@/components/GameMapButtons/ScanBattleField";
import useMyTurn from "@/components/Functions/useMyTurn";
import { useStarBoundContext } from "../Global/StarBoundProvider";

export default function BackIconArcs({
  navigation,
  setTempDisableMovementRestriction,
  tempDisableMovementRestriction,
  setRemoveAllIcons,
  removeAllIcons,
  ships,
  user,
  isPlayerTurn,
  isScanningBattleField,
  isScanning,
}) {
  /*   console.log(
    "backIconArcs:",
    ships.map((s) => s.type)
  ); */
  const shipAbbreviations = {
    Destroyer: "De",
    Cruiser: "Cr",
    Carrier: "Ca",
    Dreadnought: "Dr",
  };
  const { gameRoomID } = useStarBoundContext();

  const { state: gameState } = useMyTurn(gameRoomID);
  const gameStarted = gameState?.started;
  console.log("Game Started in Battle:", gameStarted);

  const playerShips = ships.filter((s) => s.user === user.uid);

  const typeCounts = playerShips.reduce((acc, ship) => {
    acc[ship.type] = (acc[ship.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <ScanBattleField
        isPlayerTurn={isPlayerTurn}
        isScanningBattleField={isScanningBattleField}
        isScanning={isScanning}
        gameState={gameState}
      />
      {!isPlayerTurn && gameStarted && <WaitingForTurn />}
      <TouchableOpacity
        onPress={() => navigation.navigate("Map")}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          padding: 0,
          margin: 0,
          backgroundColor: "transparent",
          zIndex: 10000,
        }}
      >
        <Image
          style={styles.image}
          source={require("../../assets/icons/icons8-back-arrow-50.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setRemoveAllIcons((prev) => {
            const next = !prev;
            Toast.show({
              type: "success",
              text1: "StarBound Conquest",
              text2: next ? "Icons Enabled" : "Hiding Icons",
              position: "top",
              visibilityTime: 2000,
            });
            return next;
          });
        }}
        style={{
          position: "absolute",
          top: 50,
          left: 10,
          padding: 0,
          margin: 0,
          backgroundColor: "transparent",
          zIndex: 10000,
          borderWidth: 1.5,
          borderColor: removeAllIcons
            ? Colors.green_toggle
            : Colors.lighter_red,
          borderRadius: 50,
        }}
      >
        <Image
          style={[
            styles.image,

            {
              width: 35,
              height: 35,
              tintColor: removeAllIcons
                ? Colors.green_toggle
                : Colors.lighter_red,
            },
          ]}
          source={
            removeAllIcons
              ? require("../../assets/icons/showicon.png")
              : require("../../assets/icons/hideicon.png")
          }
        />
      </TouchableOpacity>
      {playerShips &&
        Object.entries(typeCounts).map(([type, count], index) => (
          <Text
            key={type}
            style={[
              styles.shipTypeTag,
              {
                top: 100 + index * 35, // space between lines
                borderColor: Colors.green_toggle,
                color: Colors.green_toggle,
              },
            ]}
          >
            {shipAbbreviations[type]}: {count}
          </Text>
        ))}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: Colors.hud,
    zIndex: 10000,
  },
  shipTypeTag: {
    position: "absolute",
    top: 135,
    left: 10,
    zIndex: 10000,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 10,
    fontFamily: "monospace", // or your League Spartan if consistent
    overflow: "hidden",
  },
});
