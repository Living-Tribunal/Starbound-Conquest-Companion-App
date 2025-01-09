import React, { useEffect } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../Global/StarBoundProvider";
import { SHIP_TOGGLES_DONE, SHIP_CAPACITY, SHIP_TOGGLES } from '@/constants/Ships';

export default function ToggleAtributeButton({ type, index }) {
  const statKey = `toggle-stat-${type}-${index}`;
  const capacityKey = `toggle-capacity-${type}-${index}`;
  const doneKey = `toggle-done-${type}-${index}`;
  
  const { toggleStates, setToggleStates, toggleDone, setToggleDone, toggleCapacity, setToggleCapacity } = useStarBoundContext();

  const save = async (toggleIndex, valueToSave, keyType) => {
    try {
      const key =
        keyType === "capacity"
          ? capacityKey
          : keyType === "stat"
          ? statKey
          : doneKey;
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
      let savedDoneStates = [];
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
      for (let i = 0; i < SHIP_TOGGLES_DONE[type]; i++) {
        const savedDoneState = await AsyncStorage.getItem(`${doneKey}-${i}`);
        savedDoneStates.push(savedDoneState === "true");
      }

      // Update state for the specific type
      setToggleStates((prevState) => ({
        ...prevState,
        [type]: savedStates,
      }));
      setToggleCapacity((prevState) => ({
        ...prevState,
        [type]: savedCapacityStates,
      }));
      setToggleDone((prevState) => ({
        ...prevState,
        [type]: savedDoneStates,
      }));
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDonePress = (toggleIndex) => {
    setToggleDone((prevState) => {
      const updatedToggleDoneStates = { ...prevState };
      updatedToggleDoneStates[type][toggleIndex] =
        !updatedToggleDoneStates[type][toggleIndex];

      save(toggleIndex, updatedToggleDoneStates[type][toggleIndex], "done");

      return updatedToggleDoneStates;
    });
  };

  const handlePress = (toggleIndex) => {
    setToggleStates((prevState) => {
      const updatedToggleStates = { ...prevState };
      updatedToggleStates[type][toggleIndex] =
        !updatedToggleStates[type][toggleIndex];

      save(toggleIndex, updatedToggleStates[type][toggleIndex], "stat");

      return updatedToggleStates;
    });
  };

  const handleCapacityPress = (toggleIndex) => {
    setToggleCapacity((prevState) => {
      const updatedCapacityToggleStates = { ...prevState };
      updatedCapacityToggleStates[type][toggleIndex] =
        !updatedCapacityToggleStates[type][toggleIndex];

      save(toggleIndex, updatedCapacityToggleStates[type][toggleIndex], "capacity");

      return updatedCapacityToggleStates;
    });
  };

  const handleLongPress = async () => {
    // Reset all toggle states to false for every ship type
    const resetDoneStates = {};
    const resetStatStates = {};
    const resetCapacityStates = {};
  
    // Iterate through all ship types and reset each state
    Object.keys(SHIP_TOGGLES_DONE).forEach((shipType) => {
      resetDoneStates[shipType] = Array(SHIP_TOGGLES_DONE[shipType]).fill(false);
      resetStatStates[shipType] = Array(SHIP_TOGGLES[shipType]).fill(false);
      resetCapacityStates[shipType] = Array(SHIP_CAPACITY[shipType]).fill(false);
    });
  
    // Save the reset states in AsyncStorage
    Object.keys(SHIP_TOGGLES_DONE).forEach((shipType) => {
      resetDoneStates[shipType].forEach((_, index) => save(index, false, "done"));
      resetStatStates[shipType].forEach((_, index) => save(index, false, "stat"));
      resetCapacityStates[shipType].forEach((_, index) => save(index, false, "capacity"));
    });

    
    // Update the state with reset values for all ship types
    setToggleDone(resetDoneStates);
    setToggleStates(resetStatStates);
    setToggleCapacity(resetCapacityStates);

  
    // Show confirmation of reset action
    ToastAndroid.showWithGravity(
      'All Turns Reset!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
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
                  onLongPress={handleLongPress}
                  onPress={() => handleDonePress(toggleIndex)}
                  style={({ pressed }) => [
                    styles.button,
                    {
                      backgroundColor: toggleDone[type][toggleIndex]
                        ? Colors.deep_red
                        : Colors.darker_green_toggle,
                      borderColor: toggleDone[type][toggleIndex]
                        ? Colors.lightened_deep_red
                        : Colors.green_toggle,
                    },
                  ]}
                >
                  <Text style={styles.toggleText}>{toggleIndex + 1}</Text>
                </Pressable>
              ))}
          </View>
        </View>
        <View style={styles.ordersContainer}>
          <Text style={styles.fightersText}>Orders</Text>
          <View
            style={[
              styles.ordersButtons,
              {
                flexDirection:
                  type === "carrier" || type === "dreadnought" ? "row" : "row",
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
                      backgroundColor: toggleStates[type][toggleIndex]
                        ? Colors.goldenrod
                        : Colors.blue_gray,
                      borderColor: toggleStates[type][toggleIndex]
                        ? Colors.gold
                        : Colors.slate,
                    },
                  ]}
                >
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
                              backgroundColor: toggleCapacity[type][toggleIndex]
                                ? Colors.goldenrod
                                : Colors.blue_gray,
                              borderColor: toggleCapacity[type][toggleIndex]
                                ? Colors.gold
                                : Colors.slate,
                            },
                          ]}
                        >
                          <Text style={styles.toggleText}>
                            {toggleIndex + 1}
                          </Text>
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
    justifyContent: "center",
  },
  ordersButtons: {
    alignContent: "center",
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
  toggleText: {
    color: Colors.white,
    fontSize: 8,
  },
  fighterRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
});
