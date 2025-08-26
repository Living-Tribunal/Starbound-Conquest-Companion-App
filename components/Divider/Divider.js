import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default function Divider() {
  return (
    <View
      style={{
        width: 350,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: Colors.underTextGray,
        margin: 10,
        borderRadius: 10,
      }}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: 1,
    marginVertical: 10,
  },
});
