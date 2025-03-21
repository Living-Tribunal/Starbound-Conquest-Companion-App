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

export default function Dice({
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

  return (
    <View
      style={{
        flexDirection: "row",
        margin: 5,
      }}
    >
      <View style={styles.diceContainer}>
        <View>
          <Text style={[styles.weapon, textStyle]}>{text}</Text>
        </View>
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 5,
    flex: 1,
  },
  diceText: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.hud,
    textAlign: "center",
  },
  rollDiceBtnText: {
    color: Colors.white,
    fontSize: 10,
    position: "absolute",
    marginTop: 23,
  },
  button: {
    alignItems: "center",
  },
  weapon: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.hud,
    textAlign: "left",
  },
  resultContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
    width: "40%",
    justifyContent: "center",
    marginHorizontal: 10,
    alignContent: "flex-end",
  },
  image: {
    width: 70,
    height: 70,
    position: "relative",
  },
});
