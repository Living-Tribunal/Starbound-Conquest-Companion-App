import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { SHIP_TOGGLES_DONE } from "@/constants/Ships";
import { useStarBoundContext } from "../Global/StarBoundProvider";


  
export default function ToggleDone({ type, index }) {
  const statDoneKey = `${type}-${index}`;

 /*  const { toggleDoneStates, setToggleDoneStates } = useStarBoundContext(); */

  const [toggleDoneStates, setToggleDoneStates] = useState(Array(SHIP_TOGGLES_DONE[type]).fill(false));

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
      let savedDoneStates = [];
      for (let i = 0; i < SHIP_TOGGLES_DONE[type]; i++) {
        const savedDoneState = await AsyncStorage.getItem(`${statDoneKey}-${i}`);
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

  //fucntion to toggle button toggle
  const handlePress = (toggleDoneIndex) => {
    //setToggleDoneStates recieves the new state from function call (from what it was initialized as)
    setToggleDoneStates((prevStates) => {
    //prevState now has the new toggled state
      const updatedToggleDoneStates = [...prevStates];
      //toggles the state of the specific button
      updatedToggleDoneStates[toggleDoneIndex] = !updatedToggleDoneStates[toggleDoneIndex];
      //saves state to storage
      save(toggleDoneIndex, updatedToggleDoneStates[toggleDoneIndex]);
      //return the updated state array, which updates the state.
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
                  ]}>
                 </Pressable>
              ))}
          </View>
        </View>
        </View>
  );
}


const styles = StyleSheet.create({
  ordersContainer: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    width: 25,
    height: 25,
    borderRadius: 20,
    borderWidth: 2,
  },
  fightersText: {
    color: Colors.white,
    padding: 10,
  },
});
