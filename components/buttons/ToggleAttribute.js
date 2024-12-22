import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { SHIP_CAPACITY, SHIP_TOGGLES } from "@/constants/Ships";

export default function ToggleAtributeButton({ type, index }) {
  const statKey = `${type}-${index}`;
  const capacityKey = `${type}-${index}`;

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
        savedStates.push(savedState === "true");
      }
      for (let i = 0; i < SHIP_CAPACITY[type]; i++) {
        const savedCapacityState = await AsyncStorage.getItem(
          `${capacityKey}-${i}`
        );
        savedCapacityStates.push(savedCapacityState === "true");
      }
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
      
      save(toggleIndex, updatedToggleStates[toggleIndex]);

      return updatedToggleStates;
    });
  };
  const handleCapacityPress = (toggleIndex) => {
    setToggleCapacity((prevStates) => {
      const updatedCapacityToggleStates = [...prevStates];
      updatedCapacityToggleStates[toggleIndex] =
        !updatedCapacityToggleStates[toggleIndex];
      
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
                  ]}>
                    <Text style={styles.toggleText}>{toggleIndex + 1}</Text>
                </Pressable>
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
                          ]}>
                        <Text style={styles.toggleText}>{toggleIndex + 1}</Text>
                        </Pressable>
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
  toggleText:{
    color: Colors.white,
    fontSize: 8,
  },
  fighterRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
});
