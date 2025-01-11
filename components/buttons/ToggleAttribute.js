import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import {
  SHIP_CAPACITY,
  SHIP_TOGGLES,
  SHIP_TOGGLES_DONE,
} from "@/constants/Ships";

export default function ToggleAtributeButton({ type, index }) {
  const orderKey = `toggle-order-${type}-${index}`;
  const capacityKey = `toggle-capacity-${type}-${index}`;
  const doneKey = `toggle-done-${type}-${index}`;

  const [toggleOrders, setToggleOrders] = useState(
    Array(SHIP_TOGGLES[type]).fill(false)
  );

  const [toggleCapacity, setToggleCapacity] = useState(
    Array(SHIP_CAPACITY[type]).fill(false)
  );

  const [toggleDoneState, setToggleDoneState] = useState(
    Array(SHIP_TOGGLES_DONE[type]).fill(false)
  );

  const save = async (toggleIndex, valueToSave, toggleType) => {
    try {
      let key;
      if (toggleType === "capacity") {
        key = capacityKey;
      } else if (toggleType === "order") {
        key = orderKey;
      } else {
        key = doneKey;
      }
      await AsyncStorage.setItem(
        `${key}-${toggleIndex}`,
        JSON.stringify(valueToSave),
        console.log("Key:",key, "Toggled Type:", toggleType, "Index:", index, "Saved Value:", valueToSave)
      );
    } catch (err) {
      alert(err);
    }
  };

  const load = async () => {
    try {
      let savedOrders = [];
      let savedCapacityStates = [];
      let savedDoneStates = [];
      
      for ( let i = 0; i <SHIP_TOGGLES_DONE[type]; i++) {
        const savedDoneState = await AsyncStorage.getItem(`${doneKey}-${i}`);
        savedDoneStates.push(savedDoneState === 'true');
      }

      for (let i = 0; i < SHIP_TOGGLES[type]; i++) {
        const savedOrder = await AsyncStorage.getItem(`${orderKey}-${i}`);
        savedOrders.push(savedOrder === "true");
      }

      for (let i = 0; i < SHIP_CAPACITY[type]; i++) {
        const savedCapacityState = await AsyncStorage.getItem(`${capacityKey}-${i}`);
        savedCapacityStates.push(savedCapacityState === "true");
      }
      setToggleOrders(savedOrders);
      setToggleCapacity(savedCapacityStates);
      setToggleDoneState(savedDoneStates);

      console.log(type, savedOrders, savedDoneStates);

    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleLongPress = () => {
  // Reset state arrays to their initial state
  setToggleOrders(Array(SHIP_TOGGLES[type]).fill(false));
  setToggleCapacity(Array(SHIP_CAPACITY[type]).fill(false));
  setToggleDoneState(Array(SHIP_TOGGLES_DONE[type]).fill(false));

  // Clear AsyncStorage for the associated keys
  const clearAsyncStorage = async () => {
    try {
      for (let i = 0; i < SHIP_TOGGLES[type]; i++) {
        await AsyncStorage.removeItem(`${orderKey}-${i}`);
      }
      for (let i = 0; i < SHIP_CAPACITY[type]; i++) {
        await AsyncStorage.removeItem(`${capacityKey}-${i}`);
      }
      for (let i = 0; i < SHIP_TOGGLES_DONE[type]; i++) {
        await AsyncStorage.removeItem(`${doneKey}-${i}`);
      }
      console.log("All states reset and AsyncStorage cleared!");
    } catch (err) {
      alert("Failed to clear storage: " + err);
    }
  };

  clearAsyncStorage();
};

  const handleToggleDone = (toggleIndex) =>{
    setToggleDoneState((prevState) =>{
        const updatedToggleDoneStates = {...prevState };
        updatedToggleDoneStates[toggleIndex] =!updatedToggleDoneStates[toggleIndex];

        save(toggleIndex, updatedToggleDoneStates[toggleIndex], 'done');

        return updatedToggleDoneStates;
    })
  }

  const handlePress = (toggleIndex) => {
    setToggleOrders((prevStates) => {
      const updatedToggleOrders = [...prevStates];
      updatedToggleOrders[toggleIndex] = !updatedToggleOrders[toggleIndex];

      save(toggleIndex, updatedToggleOrders[toggleIndex], "order");
      console.log(type, updatedToggleOrders);

      return updatedToggleOrders;
    });
  };
  const handleCapacityPress = (toggleIndex) => {
    setToggleCapacity((prevStates) => {
      const updatedCapacityToggleStates = [...prevStates];
      updatedCapacityToggleStates[toggleIndex] =
        !updatedCapacityToggleStates[toggleIndex];

      save(toggleIndex, updatedCapacityToggleStates[toggleIndex], "capacity");

      return updatedCapacityToggleStates;
    });
  };

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.fleetContainer}>
      <View style={styles.ordersContainer}>
          <Text style={styles.fightersText}>Toggle Turn</Text>
          <View
            style={[
              styles.ordersButtons,
              {
                flexDirection:
                  type === "carrier" || type === "dreadnought" ? "row" : "row",
              },
            ]}
          >
            {Array(SHIP_TOGGLES_DONE[type])
              .fill(null)
              .map((_, toggleIndex) => (
                <Pressable
                  key={toggleIndex}
                  onLongPress={() => handleLongPress(toggleIndex)}
                  onPress={() => handleToggleDone(toggleIndex)}
                  style={({ pressed }) => [
                    styles.button,
                    {
                      backgroundColor: toggleDoneState[toggleIndex]
                        ? Colors.goldenrod
                        : Colors.blue_gray,
                      borderColor: toggleDoneState[toggleIndex]
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
                      backgroundColor: toggleOrders[toggleIndex]
                        ? Colors.goldenrod
                        : Colors.blue_gray,
                      borderColor: toggleOrders[toggleIndex]
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
                              backgroundColor: toggleCapacity[toggleIndex]
                                ? Colors.goldenrod
                                : Colors.blue_gray,
                              borderColor: toggleCapacity[toggleIndex]
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
