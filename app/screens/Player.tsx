import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";

export default function Player() {
  const { username, setUsername } = useStarBoundContext(); 


  useEffect(() => {
    const loadUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error("Error loading username from AsyncStorage:", error);
      }
    };

    loadUsername();
  }, [setUsername]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {username || "Commander"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark_gray,
  },
  text: {
    fontSize: 18,
    color: Colors.white,
  },
});
