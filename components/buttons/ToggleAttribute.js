import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import {
  SHIP_CAPACITY,
  SHIP_TOGGLES,
  SHIP_TOGGLES_DONE,
} from "@/constants/Ships";

export default function ToggleAtributeButton({ shipType, index }) {

  const orderKey = `toggle-order-${shipType}-${index}`;
  const capacityKey = `toggle-capacity-${shipType}-${index}`;
  const doneKey = `toggle-done-${shipType}-${index}`;

  const [toggleOrders, setToggleOrders] = useState(
    Array(SHIP_TOGGLES[shipType]).fill(false)
  );

  const [toggleCapacity, setToggleCapacity] = useState(
    Array(SHIP_CAPACITY[shipType]).fill(false)
  );

  const [toggleDoneState, setToggleDoneState] = useState(
    Array(SHIP_TOGGLES_DONE[shipType]).fill(false)
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
        console.log("INITIAL STATES: ","Key: ",key,"||", "Toggled Type: ", toggleType," |", "Index: ", index, "||", "Saved Value:", valueToSave)
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
      
      for ( let i = 0; i <SHIP_TOGGLES_DONE[shipType]; i++) {
        const savedDoneState = await AsyncStorage.getItem(`${doneKey}-${i}`);
        savedDoneStates[i] = savedDoneState === "true";
      }

      for (let i = 0; i < SHIP_TOGGLES[shipType]; i++) {
        const savedOrder = await AsyncStorage.getItem(`${orderKey}-${i}`);
        savedOrders[i] = savedOrder === "true";
      }

      for (let i = 0; i < SHIP_CAPACITY[shipType]; i++) {
        const savedCapacityState = await AsyncStorage.getItem(`${capacityKey}-${i}`);
        savedCapacityStates[i] = savedCapacityState === "true";
      }
      setToggleOrders(savedOrders);
      setToggleCapacity(savedCapacityStates);
      setToggleDoneState(savedDoneStates);

      console.log("LOADED STATE: ", "Type of ship:", shipType, "||", "Ships Index:", index, "||", "Loaded Order State:", savedOrders, "||", "Loaded Turn Done State:", savedDoneStates, "||",  "Loaded Ship Capacity:", savedCapacityStates);

    } catch (err) {
      alert(err);
    }
  };

  const handleLongPress = () => {
  // Reset state arrays to their initial state
  setToggleOrders(Array(SHIP_TOGGLES[shipType]).fill(false));
  setToggleCapacity(Array(SHIP_CAPACITY[shipType]).fill(false));
  setToggleDoneState(Array(SHIP_TOGGLES_DONE[shipType]).fill(false));

  // Clear AsyncStorage for the associated keys
  const clearAsyncStorage = async () => {
    try {
      for (let i = 0; i < SHIP_TOGGLES[shipType]; i++) {
        await AsyncStorage.removeItem(`${orderKey}-${i}`);
      }
      for (let i = 0; i < SHIP_CAPACITY[shipType]; i++) {
        await AsyncStorage.removeItem(`${capacityKey}-${i}`);
      }
      for (let i = 0; i < SHIP_TOGGLES_DONE[shipType]; i++) {
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
    setToggleDoneState((prevToggleDoneState) =>{
        // Create a new array to avoid direct mutation
        const updatedToggleDoneStates = [...prevToggleDoneState ];
        // Toggle the specific index
        updatedToggleDoneStates[toggleIndex] =!updatedToggleDoneStates[toggleIndex];
        // Call save to persist the change
        save(toggleIndex, updatedToggleDoneStates[toggleIndex], 'done');
        console.log("SAVED STATES: ", "Ship Type:", shipType, "||", "Ship Type Index:", index, "||", "Toggled Order State:", updatedToggleDoneStates,"||","Toggled Index:", toggleIndex);
        // Return the updated state
        return updatedToggleDoneStates;
    })
  }

  const handlePress = (toggleIndex) => {
    console.log("handlePress called for toggleIndex:", toggleIndex);
    setToggleOrders((prevToggleOrders) => {
      const updatedToggleOrders = [...prevToggleOrders];
      console.log("Previous Toggled Orders:", prevToggleOrders);
      updatedToggleOrders[toggleIndex] = !updatedToggleOrders[toggleIndex];

      save(toggleIndex, updatedToggleOrders[toggleIndex], "order");
      console.log("SAVED STATES: ", "Ship Type:", shipType, "||", "Ship Type Index:", index, "||", "Toggled Order State:", updatedToggleOrders);

      return updatedToggleOrders;
    });
  };
  const handleCapacityPress = (toggleIndex) => {
    setToggleCapacity((prevToggleCapacity) => {
      const updatedCapacityToggleStates = [...prevToggleCapacity];
      updatedCapacityToggleStates[toggleIndex] = !updatedCapacityToggleStates[toggleIndex];

      save(toggleIndex, updatedCapacityToggleStates[toggleIndex], "capacity");
      console.log("SAVED STATES: ", "Ship Type:", shipType, "||", "Ship Type Index:", index, "||", "Toggled Order State:", updatedCapacityToggleStates);

      return updatedCapacityToggleStates;
    });
  };

  useEffect(() => {
    load();
  }, []);

  /* console.log(orderKey, capacityKey, doneKey) */

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
                shipType === "carrier" || shipType === "dreadnought" ? "row" : "row",
              },
            ]}
          >
            {Array(SHIP_TOGGLES_DONE[shipType])
              .fill(null)
              .map((_, toggleIndex) => (
                <Pressable
                  key={toggleIndex}
                  onLongPress={handleLongPress}
                  onPress={() => handleToggleDone(toggleIndex)}
                  style={({ pressed }) => [
                    styles.toggleButton,
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
                  <Text style={styles.toggleButtonText}>{toggleDoneState[toggleIndex]? "\u2713" : "X"}</Text>
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
                shipType === "carrier" || shipType === "dreadnought" ? "row" : "row",
              },
            ]}
          >
            {Array(SHIP_TOGGLES[shipType])
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
          {(shipType === "carrier" || shipType === "dreadnought") && (
            <Text style={styles.fightersText}>Fighters</Text>
          )}
          {Array(Math.ceil(SHIP_CAPACITY[shipType] / 5))
            .fill(null)
            .map((_, rowIndex) => (
              <View key={rowIndex} style={styles.fighterRow}>
                {Array(5)
                  .fill(null)
                  .map((_, colIndex) => {
                    const toggleIndex = rowIndex * 5 + colIndex;
                    if (toggleIndex < SHIP_CAPACITY[shipType]) {
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
  toggleButton:{
    marginTop: 3,
    borderRadius: 10,
    borderWidth: 2,
    width: 40,
    height: 25,
  },
  toggleButtonText:{
    color: Colors.white,
    fontSize: 12,
    textAlign: "center",
  }
});
