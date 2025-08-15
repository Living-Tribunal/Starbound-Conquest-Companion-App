import React from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DiceRoller() {
  const [sides, setSides] = React.useState(6); // Default to 6-sided dice
  const [numberOfDice, setNumberOfDice] = React.useState(1); // Default to 1 die
  const [firstDice, setFirstDice] = React.useState([]);

  const rollDiceOnTap = () => {
    if (sides <= 0 || numberOfDice <= 0) return;

    let interval = setInterval(() => {
      const rolls = Array.from(
        { length: numberOfDice },
        () => Math.floor(Math.random() * sides) + 1
      );
      setFirstDice(rolls); // Update state with random numbers
    }, 100); // Change numbers rapidly every 100ms

    setTimeout(() => {
      clearInterval(interval); // Stop randomizing after 1 second
      const finalRolls = Array.from(
        { length: numberOfDice },
        () => Math.floor(Math.random() * sides) + 1
      );
      setFirstDice(finalRolls); // Set final dice roll result
    }, 1000);
  };

  const increaseSides = () => setSides((prev) => Math.max(prev + 1, 1));
  const decreaseSides = () => setSides((prev) => Math.max(prev - 1, 1));

  const increaseDice = () => setNumberOfDice((prev) => Math.max(prev + 1, 1));
  const decreaseDice = () => setNumberOfDice((prev) => Math.max(prev - 1, 1));

  const resetbutton = () => {
    setFirstDice([]);
    setSides(6);
    setNumberOfDice(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textHeader}>Dice Roller</Text>
      <View style={styles.diceContainer}>
        <TouchableOpacity
          onPress={rollDiceOnTap}
          onLongPress={resetbutton}
          style={styles.button}
        >
          <Text style={styles.rollDiceBtnText}>
            {numberOfDice}D{sides}
          </Text>
          <Image
            style={styles.image}
            source={require("../../assets/images/inchud.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.resultContainer}>
        {firstDice.length > 0 ? (
          firstDice.map((num, index) => (
            <Text key={index} style={[styles.diceText]}>
              {num}
            </Text>
          ))
        ) : (
          <Text style={styles.diceText}>Roll to see results</Text>
        )}
      </View>

      <View style={styles.controls}>
        <View style={styles.controlColumn}>
          <Text style={styles.textHeader1}>Number of Dice</Text>
          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.touchStyle} onPress={increaseDice}>
              <Text style={styles.controlText}>+1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchStyle} onPress={decreaseDice}>
              <Text style={styles.controlText}>-1</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.controlColumn}>
          <Text style={styles.textHeader1}>Number of Sides</Text>
          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.touchStyle} onPress={increaseSides}>
              <Text style={styles.controlText}>+1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchStyle} onPress={decreaseSides}>
              <Text style={styles.controlText}>-1</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  diceContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  diceText: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.hud,
    textAlign: "center",
    marginHorizontal: 5,
  },
  rollDiceBtnText: {
    color: Colors.gold,
    fontSize: 15,
    position: "absolute",
    marginTop: 52,
    fontWeight: "bold",
  },
  button: {
    alignItems: "center",
  },
  resultContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
    padding: 10,
  },
  image: {
    width: 140,
    height: 140,
    tintColor: Colors.goldenrod,
  },
  textHeader: {
    color: Colors.hud,
    fontSize: 25,
  },
  textHeader1: {
    color: Colors.hud,
    fontSize: 15,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    marginTop: 10,
  },
  controlColumn: {
    width: "50%",
    alignItems: "center",
  },
  controlRow: {
    flexDirection: "row",
  },
  touchStyle: {
    width: 50,
    height: 50,
    backgroundColor: Colors.hud,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  controlText: {
    color: Colors.dark_gray,
    fontSize: 18,
  },
});
