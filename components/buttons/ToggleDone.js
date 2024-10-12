import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";

export default function ToggleDone({ type, index }) {
  const statKey = `${type}-${index}`;

  const SHIP_TOGGLES = {
    fighter: 1,
    destroyer: 1,
    cruiser: 1,
    carrier: 1,
    dreadnought: 1,
  };

  const [toggleStates, setToggleStates] = useState(
    Array(SHIP_TOGGLES[type]).fill(false)
  );

  const save = async (toggleIndex, valueToSave, keyType) => {
    try {
      const key = statKey;
      await AsyncStorage.setItem(
        `${key}-${toggleIndex}`,
        JSON.stringify(valueToSave)
      );
    } catch (err) {
      alert(err);
    }
  };

  const load = async () => {
    try {
      let savedStates = [];;
      for (let i = 0; i < SHIP_TOGGLES[type]; i++) {
        const savedState = await AsyncStorage.getItem(`${statKey}-${i}`);
        console.log(`Loaded state for toggle ${i}: ${savedState}`);
        savedStates.push(savedState === "true");
      }
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
      console.log(
        `Updated toggle states after pressing ${toggleIndex}: ${JSON.stringify(
          updatedToggleStates
        )}`
      );

      // Save the updated value immediately
      save(toggleIndex, updatedToggleStates[toggleIndex]);

      return updatedToggleStates;
    });
  };

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.fleetContainer}>
        <View style={styles.ordersContainer}>
          <Text style={styles.fightersText}>Toggle Turn</Text>
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
                        ? Colors.deep_red
                        : Colors.darker_green_toggle,
                      borderColor: toggleStates[toggleIndex]
                        ? Colors.lightened_deep_red
                        : Colors.green_toggle,
                    },
                  ]}
                />
              ))}
          </View>
        </View>
        </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 5,
  },
  ordersContainer: {
    marginTop: 5,
    marginLeft: 5,
    flex: 1,
    alignItems: "center",
  },
  button: {
    width: 20,
    height: 20,
    margin: 5,
    borderRadius: 20,
    borderWidth: 2,
  },
  fightersText: {
    color: Colors.white,
  },
});
