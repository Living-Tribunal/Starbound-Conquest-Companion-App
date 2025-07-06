import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Colors } from "@/constants/Colors";

export default function LoadingComponent({ whatToSay }) {
  return (
    <View style={styles.loadingContainer}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.dark_gray,
          width: "100%",
          height: "100%",
        }}
      >
        <Image
          style={{ width: 315, height: 161 }}
          source={require("../../assets/images/SC_logo1.png")}
        />
        <Text style={[styles.text1, { fontSize: 20 }]}>{whatToSay}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark_gray,
  },
  text1: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Light",
    fontSize: 12,
    padding: 5,
    textAlign: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
    backgroundColor: Colors.hudDarker,
    marginBottom: 10,
    marginTop: 10,
  },
});
