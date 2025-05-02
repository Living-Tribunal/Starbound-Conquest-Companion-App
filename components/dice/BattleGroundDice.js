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
import { useStarBoundContext } from "../Global/StarBoundProvider";

export default function BattleDice({
  text,
  number1,
  number2,
  tintColor,
  textStyle,
  borderColor,
  howManyDice,
}) {
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
  console.log("First Dice:", firstDice);

  return (
    <View
      style={{
        flexDirection: "row",
        width: "45%",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <View style={styles.diceContainer}>
        <Text style={[styles.weapon, textStyle]}>{text}</Text>
        <TouchableOpacity onPress={rollDiceOnTap} style={[styles.button]}>
          <Text style={[styles.rollDiceBtnText, textStyle]}>
            {howManyDice}D{number2}
          </Text>
          <Image
            style={[styles.image, { tintColor }]}
            source={require("../../assets/images/inchud.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.resultContainer, borderColor]}>
        <Text style={[styles.diceText, textStyle]}>{firstDice}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  diceContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  diceText: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.hud,
    textAlign: "center",
  },
  rollDiceBtnText: {
    color: Colors.white,
    fontSize: 8,
    position: "absolute",
    marginTop: 13,
  },
  button: {
    alignItems: "center",
  },
  weapon: {
    fontSize: 8,
    fontWeight: "bold",
    color: Colors.hud,
    textAlign: "center",
  },
  resultContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
    width: "30%",
    justifyContent: "center",
    marginHorizontal: 5,
    alignContent: "flex-end",
  },
  image: {
    width: 45,
    height: 45,
  },
});
