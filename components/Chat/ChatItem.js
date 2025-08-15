import React, { useState, useEffect, useCallback } from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../Global/StarBoundProvider";
import ChatBubble from "./ChatBubble";

export default function ChatItem({ item, index }) {
  const { data, setData, userFactionColor } = useStarBoundContext();
  console.log("ChatItem:", item.profile);
  return (
    <TouchableOpacity>
      <View
        style={{
          gap: 10,
          justifyContent: "center",
          flexDirection: "row",
          backgroundColor: Colors.hudDarker,
        }}
      >
        <Image
          style={{ width: 25, height: 25 }}
          source={{ uri: item.profile }}
        />
        <Text>{item.displayName}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.blue_gray,
  },
});
