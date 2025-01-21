import React from "react";
import {
  Text,
  View,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";

export default function D12Dice() {
  const [firstDice, setFirstDice] = React.useState(1);

  const randomNum = (min = 1, max = 4) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getDiceNum = (prev) => {
    let num = randomNum();
    if (prev === num) {
      return randomNum();
    }
    return num;
  };

  const rollDiceOnTap = () => {
    setFirstDice((prev) => getDiceNum(prev));
  };

  return (
    <View style={styles.diceContainer}>
      <TouchableOpacity onPress={rollDiceOnTap} style={styles.button}>
        <Text style={styles.rollDiceBtnText}>D4</Text>
        <Image
          style={{ width: 60, height: 60, position: "relative" }}
          source={require("../../assets/images/inchud.png")}
        />
      </TouchableOpacity>
      <Text style={styles.diceText}>{firstDice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  diceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  diceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.slate,
  },
  rollDiceBtnText: {
    color: Colors.white,
    fontSize: 10,
    position: "absolute",
    marginTop: 18,
  },
  button: {
    alignItems: "center",
  },
});
