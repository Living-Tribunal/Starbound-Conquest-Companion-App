import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";

export default function ScanBattleField({
  isPlayerTurn,
  isScanningBattleField,
  isScanning,
  gameState,
}) {
  const insets = useSafeAreaInsets();

  const scanningPressed = () => {
    isScanning((prev) => !prev);
  };
  const gameStarted = gameState?.started;

  return (
    <>
      {gameStarted ? (
        <TouchableOpacity
          onPress={scanningPressed}
          style={{
            position: "absolute", // pin it
            bottom: insets.bottom + 10, // push to bottom
            alignSelf: "center", // center horizontally
            color: Colors.hud,
            fontSize: 12,
            fontFamily: "monospace",
            textAlign: "center",
            justifyContent: "center",
            backgroundColor: Colors.hudDarker,
            borderRadius: 5,
            padding: 5,
            zIndex: 10000,
          }}
        >
          <Text
            style={{
              color: Colors.hud,
              fontSize: 12,
              fontFamily: "monospace",
              textAlign: "center",
            }}
          >
            Scan Battle Field
          </Text>
        </TouchableOpacity>
      ) : (
        <Text
          style={{
            color: Colors.hud,
            fontSize: 12,
            fontFamily: "monospace",
            textAlign: "center",
            position: "absolute", // pin it
            bottom: insets.bottom + 10, // push to bottom
            alignSelf: "center",
            zIndex: 10000,
          }}
        >
          Game not started, you can freely move your ships. Just make sure to
          confirm their movement.
        </Text>
      )}
    </>
  );
}
