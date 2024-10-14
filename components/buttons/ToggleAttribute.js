import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";

export default function ToggleAtributeButton({ type, index }) {
  const statKey = `${type}-${index}`;
  const capacityKey = `${type}-${index}`;

  const SHIP_TOGGLES = {
    fighter: 3,
    destroyer: 3,
    cruiser: 4,
    carrier: 4,
    dreadnought: 5,
  };

  const SHIP_CAPACITY = {
    fighter: 0,
    destroyer: 0,
    cruiser: 0,
    carrier: 20,
    dreadnought: 20,
  };

  const [toggleStates, setToggleStates] = useState(
    Array(SHIP_TOGGLES[type]).fill(false)
  );

  const [toggleCapacity, setToggleCapacity] = useState(
    Array(SHIP_CAPACITY[type]).fill(false)
  );

  const save = async (toggleIndex, valueToSave, keyType) => {
    try {
      const key = keyType === "capacity" ? capacityKey : statKey;
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
      let savedStates = [];
      let savedCapacityStates = [];
      for (let i = 0; i < SHIP_TOGGLES[type]; i++) {
        const savedState = await AsyncStorage.getItem(`${statKey}-${i}`);
        console.log(`Loaded state for toggle ${i}: ${savedState}`);
        savedStates.push(savedState === "true");
      }
      for (let i = 0; i < SHIP_CAPACITY[type]; i++) {
        const savedCapacityState = await AsyncStorage.getItem(
          `${capacityKey}-${i}`
        );
        console.log(`Loaded state for toggle ${i}: ${savedCapacityState}`);
        savedCapacityStates.push(savedCapacityState === "true");
      }
      console.log(`Initial toggle states: ${JSON.stringify(savedStates)}`);
      console.log(
        `Initial toggle states: ${JSON.stringify(savedCapacityStates)}`
      );
      setToggleStates(savedStates);
      setToggleCapacity(savedCapacityStates);
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
  const handleCapacityPress = (toggleIndex) => {
    setToggleCapacity((prevStates) => {
      const updatedCapacityToggleStates = [...prevStates];
      updatedCapacityToggleStates[toggleIndex] =
        !updatedCapacityToggleStates[toggleIndex];

      // Log the new state before saving
      console.log(
        `Updated toggle states after pressing ${toggleIndex}: ${JSON.stringify(
          updatedCapacityToggleStates
        )}`
      );

      // Save the updated value immediately
      save(toggleIndex, updatedCapacityToggleStates[toggleIndex]);

      return updatedCapacityToggleStates;
    });
  };

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.fleetContainer}>
        <View style={styles.ordersContainer}>
          <Text style={styles.fightersText}>Orders</Text>
          <View
          style={[
            styles.ordersButtons,
            {
              flexDirection: type === "carrier" || type === "dreadnought" ? "row" : "row",
            },
          ]}
        >
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
        <View style={styles.fightersContainer}>
          {(type === "carrier" || type === "dreadnought") && (
            <Text style={styles.fightersText}>Fighters</Text>
          )}
          {Array(Math.ceil(SHIP_CAPACITY[type] / 5))
            .fill(null)
            .map((_, rowIndex) => (
              <View key={rowIndex} style={styles.fighterRow}>
                {Array(5)
                  .fill(null)
                  .map((_, colIndex) => {
                    const toggleIndex = rowIndex * 5 + colIndex;
                    if (toggleIndex < SHIP_CAPACITY[type]) {
                      return (
                        <Pressable
                          key={toggleIndex}
                          onPress={() => handleCapacityPress(toggleIndex)}
                          style={({ pressed }) => [
                            styles.buttonFighters,
                            {
                              backgroundColor: toggleCapacity[toggleIndex]
                                ? Colors.goldenrod
                                : Colors.blue_gray,
                              borderColor: toggleCapacity[toggleIndex]
                                ? Colors.gold
                                : Colors.slate,
                            },
                          ]}
                        />
                      );
                    }
                  })}
              </View>
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
    marginTop: 10,
    marginLeft: 10,
    justifyContent: 'center',
  },
  ordersButtons: {
    alignContent: 'center',
    justifyContent: "space-around",
    flex: 1,
  },
  fightersContainer: {
    marginTop: 10,
    marginLeft: 10,
    flex: 1,
    alignItems: "center",
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
  buttonFighters: {
    width: 25,
    height: 25,
    margin: 5,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  fightersText: {
    color: Colors.white,
    textAlign: "center",
  },
  fighterRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
});
