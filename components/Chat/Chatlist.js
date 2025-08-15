import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import ChatBubble from "./ChatBubble";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../Global/StarBoundProvider";
import ChatItem from "./ChatItem";

export default function Chatlist({ messages, gameRoomID, users, gameState }) {
  const { data, setData, userFactionColor } = useStarBoundContext();

  const [text, setText] = useState("");

  /*   useEffect(() => {
    console.log("Chat:", text);
    console.log("User:", userFactionColor);
    console.log("GameRoomID:", gameRoomID);
    console.log("PlayersInChat:", users);
  }, [text]); */

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={users}
        keyExtractor={(item) => Math.random().toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "center",

            }}
          >
            <ChatItem item={item} index={index} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
