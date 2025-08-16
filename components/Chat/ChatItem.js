import React, { useState, useEffect, useCallback } from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../Global/StarBoundProvider";
import ChatBubble from "./ChatBubble";

export default function ChatItem({ item, index }) {
  const { data, setData, userFactionColor } = useStarBoundContext();
  //console.log("ChatItem:", item.profile);
  return (
    <TouchableOpacity>
      <View
        style={{
          gap: 5,
          justifyContent: "center",
          flexDirection: "row",
          backgroundColor: Colors.hudDarker,
          alignItems: "center",
          borderBottomWidth: 2,
          borderBottomColor: Colors.blue_gray,
        }}
      >
        <Image
          style={{ width: 20, height: 20, borderRadius: 50 }}
          source={{ uri: item.profile }}
        />
        <Text
          style={[
            styles.playerName,
            {
              color: item.userFactionColor ? item.userFactionColor : Colors.hud,
            },
          ]}
        >
          {item.displayName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.blue_gray,
  },
  playerName: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Regular",
    fontSize: 10,
    textAlign: "center",
    padding: 5,
  },
});
