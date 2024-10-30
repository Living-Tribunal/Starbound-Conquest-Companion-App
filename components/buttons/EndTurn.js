import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";


export default function EndTurn() {
    const resetAllToggles = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const toggleKeys = keys.filter((key) => key.includes("-"));
  
      await Promise.all(toggleKeys.map((key) => AsyncStorage.setItem(key, JSON.stringify(true))));
    };
    
    return (
        <Pressable
        onLongPress={resetAllToggles}
        style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? Colors.gold : Colors.deep_red,
              borderColor: pressed ? Colors.lightened_gold : Colors.lightened_deep_red,
            },
          ]}
        >
            {({ pressed }) => (
              <Text
                style={{
                  color: pressed ? Colors.dark_gray : Colors.white,
                  fontFamily: "monospace",
                  fontSize: 10,
                }}
              >
                End Turn
              </Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        width: 125,
        paddingVertical: 2,
        paddingHorizontal: 2,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
      },
});