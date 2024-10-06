import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";

export default function ToggleAtributeButton({ type, index }) {
  const statKey = `${type}-${index}`;

  const SHIP_TOGGLES = {
    fighter: 3,
    destroyer: 3,
    cruiser: 4,
    carrier: 4,
    dreadnought: 5,
  };

  const shipImages = {
    "fighter": require('../../assets/icons/rookie_64.png'),
    "destroyer": require('../../assets/icons/destroyer_64.png'),
    "cruiser": require('../../assets/icons/cruiser_64.png'),
    "carrier": require('../../assets/icons/superCapital_64.png'),
    "dreadnought": require('../../assets/icons/titan_64.png'),
};

  const [toggleStates, setToggleStates] = useState(
    Array(SHIP_TOGGLES[type]).fill(false)
  );

  const save = async (toggleIndex, valueToSave) => {
    try {
      console.log(`Saving toggle ${toggleIndex}: ${valueToSave}`); // Debug log
      await AsyncStorage.setItem(`${statKey}-${toggleIndex}`, JSON.stringify(valueToSave));
    } catch (err) {
      alert(err);
    }
  };

  const load = async () => {
    try {
      let savedStates = [];
      for (let i = 0; i < SHIP_TOGGLES[type]; i++) {
        const savedState = await AsyncStorage.getItem(`${statKey}-${i}`);
        console.log(`Loaded state for toggle ${i}: ${savedState}`); // Debug log
        savedStates.push(savedState === "true");
      }
      console.log(`Initial toggle states: ${JSON.stringify(savedStates)}`); // Debug log
      setToggleStates(savedStates);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handlePress = (toggleIndex) => {
    setToggleStates((prevStates) => {
      const updatedToggleStates = [...prevStates];
      updatedToggleStates[toggleIndex] = !updatedToggleStates[toggleIndex];

      // Log the new state before saving
      console.log(`Updated toggle states after pressing ${toggleIndex}: ${JSON.stringify(updatedToggleStates)}`);
      
      // Save the updated value immediately
      save(toggleIndex, updatedToggleStates[toggleIndex]);
      
      return updatedToggleStates;
    });
  };

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.fleetContainer}>
        {Array(SHIP_TOGGLES[type])
          .fill(null)
          .map((_, toggleIndex) => (
            <Pressable
              key={toggleIndex}
              onPress={() => handlePress(toggleIndex)}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: toggleStates[toggleIndex]
                    ? Colors.goldenrod
                    : Colors.blue_gray,
                  borderColor: toggleStates[toggleIndex]
                    ? Colors.gold
                    : Colors.slate,
                },
              ]}
            />
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    width: 25,
    height: 25,
    margin: 5,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
