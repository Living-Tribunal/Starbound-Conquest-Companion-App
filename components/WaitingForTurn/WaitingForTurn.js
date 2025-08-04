import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "react-native";
import { Colors } from "@/constants/Colors";

export default function WaitingForTurn() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Text
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
        Waiting for your turn...
      </Text>
    </>
  );
}
