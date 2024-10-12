import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";

export default function ToggleDone({ type, index }) {
  const statDoneKey = `${type}-${index}`;

  const SHIP_TOGGLES_DONE = {
    fighter1: 1,
    destroyer2: 1,
    cruiser3: 1,
    carrier4: 1,
    dreadnought5: 1,
  };

  const [toggleDoneStates, setToggleDoneStates] = useState(
    Array(SHIP_TOGGLES_DONE[type]).fill(false)
  );

  const save = async (toggleDoneIndex, valueToSave) => {
    try {
      const key = `${statDoneKey}-${toggleDoneIndex}`;
      await AsyncStorage.setItem(key, JSON.stringify(valueToSave));
    } catch (err) {
      alert(err);
    }
  };

  const load = async () => {
    try {
      let savedDoneStates = [];;
      for (let i = 0; i < SHIP_TOGGLES_DONE[type]; i++) {
        const savedDoneState = await AsyncStorage.getItem(`${statDoneKey}-${i}`);
        console.log(`Loaded state for toggle ${i}: ${savedDoneState}`);
        savedDoneStates.push(savedDoneState === "true");
      }
      setToggleDoneStates(savedDoneStates);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handlePress = (toggleDoneIndex) => {
    setToggleDoneStates((prevStates) => {
      const updatedToggleDoneStates = [...prevStates];
      updatedToggleDoneStates[toggleDoneIndex] = !updatedToggleDoneStates[toggleDoneIndex];

      // Log the new state before saving
      console.log(
        `Updated toggle states after pressing ${toggleDoneIndex}: ${JSON.stringify(
          updatedToggleDoneStates
        )}`
      );

      // Save the updated value immediately
      save(toggleDoneIndex, updatedToggleDoneStates[toggleDoneIndex]);

      return updatedToggleDoneStates;
    });
  };

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.fleetContainer}>
        <View style={styles.ordersContainer}>
          <Text style={styles.fightersText}>Toggle Turn</Text>
            {Array(SHIP_TOGGLES_DONE[type])
              .fill(null)
              .map((_, toggleDoneIndex) => (
                <Pressable
                  key={toggleDoneIndex}
                  onPress={() => handlePress(toggleDoneIndex)}
                  style={({ pressed }) => [
                    styles.button,
                    {
                      backgroundColor: toggleDoneStates[toggleDoneIndex]
                        ? Colors.deep_red
                        : Colors.darker_green_toggle,
                      borderColor: toggleDoneStates[toggleDoneIndex]
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
    padding: 10,
  },
});
