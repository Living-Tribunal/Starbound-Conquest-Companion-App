import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { SHIP_TOGGLES_DONE, SHIP_CAPACITY, SHIP_TOGGLES } from '@/constants/Ships';

export default function ToggleAtributeButton({ type, index }) {
    const statKey = `toggle-stat-${type}-${index}`;
    const capacityKey = `toggle-capacity-${type}-${index}`;
    const doneKey = `toggle-done-${type}-${index}`;

    const [toggleStates, setToggleStates] = useState(
        Object.fromEntries(Object.keys(SHIP_TOGGLES).map(key => [key, Array(SHIP_TOGGLES[key]).fill(false)]))
      );
      
      const [toggleCapacity, setToggleCapacity] = useState(
        Object.fromEntries(Object.keys(SHIP_CAPACITY).map(key => [key, Array(SHIP_CAPACITY[key]).fill(false)]))
      );
      
      const [toggleDone, setToggleDone] = useState(
        Object.fromEntries(Object.keys(SHIP_TOGGLES_DONE).map(key => [key, Array(SHIP_TOGGLES_DONE[key]).fill(false)]))
      );
      
      const save = async (toggleIndex, valueToSave, keyType = "stat") => {
        try {
          const key =
            keyType === "capacity"
              ? capacityKey
              : keyType === "done"
              ? doneKey
              : statKey;
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
      const savedStates = {};
      const savedCapacityStates = {};
      const savedDoneStates = {};
  
      for (const key of Object.keys(SHIP_TOGGLES)) {
        savedStates[key] = [];
        for (let i = 0; i < SHIP_TOGGLES[key]; i++) {
          const savedState = await AsyncStorage.getItem(`toggle-stat-${key}-${i}`);
          savedStates[key].push(savedState === "true");
        }
      }
  
      for (const key of Object.keys(SHIP_CAPACITY)) {
        savedCapacityStates[key] = [];
        for (let i = 0; i < SHIP_CAPACITY[key]; i++) {
          const savedCapacityState = await AsyncStorage.getItem(`toggle-capacity-${key}-${i}`);
          savedCapacityStates[key].push(savedCapacityState === "true");
        }
      }
  
      for (const key of Object.keys(SHIP_TOGGLES_DONE)) {
        savedDoneStates[key] = [];
        for (let i = 0; i < SHIP_TOGGLES_DONE[key]; i++) {
          const savedDoneState = await AsyncStorage.getItem(`toggle-done-${key}-${i}`);
          savedDoneStates[key].push(savedDoneState === "true");
        }
      }
  
      setToggleStates(savedStates);
      setToggleCapacity(savedCapacityStates);
      setToggleDone(savedDoneStates);
    } catch (err) {
      alert(err);
    }
  };

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
      updatedCapacityToggleStates[toggleIndex] = !updatedCapacityToggleStates[toggleIndex];
      
        save(toggleIndex, updatedCapacityToggleStates[toggleIndex]);

      return updatedCapacityToggleStates;
    });
  };

  const handleDonePress = (toggleIndex) => {
    setToggleDone((prevState) => {
      const updatedToggleDoneStates = { ...prevState };
      updatedToggleDoneStates[toggleIndex] = !updatedToggleDoneStates[toggleIndex];

      save(toggleIndex, updatedToggleDoneStates[type][toggleIndex], "done");

      return updatedToggleDoneStates;
    });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.fleetContainer}>
        <View style={styles.ordersContainer}>
        <Text style={styles.fightersText}>Toggle Turn</Text>
          <View
            style={[
              styles.ordersButtons,
              {
                flexDirection: "row",
              },
            ]}
          >
            {Array(SHIP_TOGGLES_DONE[type])
                .fill(null)
                .map((_, toggleIndex) => (
                    <Pressable
                    key={toggleIndex}
                    onPress={() => handleDonePress(toggleIndex)}
                    style={({ pressed }) => [
                        styles.button,
                        {
                        backgroundColor: toggleDone[type]?.[toggleIndex]
                            ? Colors.deep_red
                            : Colors.darker_green_toggle,
                        borderColor: toggleDone[type]?.[toggleIndex]
                            ? Colors.lightened_deep_red
                            : Colors.green_toggle,
                        },
                    ]}
                    >
                    <Text style={styles.toggleText}>{toggleIndex + 1}</Text>
                    </Pressable>
                ))}
          </View>
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