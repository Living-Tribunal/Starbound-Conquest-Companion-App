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

export default function Dice({ text, number1, number2 }) {
  const [firstDice, setFirstDice] = React.useState(1);

  const randomNum = (min = number1, max = number2) =>
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
      <View>
        <Text style={styles.weapon}>{text}</Text>
      </View>
      <TouchableOpacity onPress={rollDiceOnTap} style={styles.button}>
        <Text style={styles.rollDiceBtnText}>D{number2}</Text>
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
  weapon: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.hud,
  },
});
