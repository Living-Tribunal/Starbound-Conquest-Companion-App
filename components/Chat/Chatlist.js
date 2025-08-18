import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import ChatItem from "./ChatItem";

export default function Chatlist({ messages, gameRoomID, users, gameState }) {
  const [showPlayerList, setShowPlayerList] = useState(false);

  const handlePress = () => {
    setShowPlayerList((prev) => !prev);
  };

  const testData = [
    {
      displayName: "Cody",
      profile: "https://avatars.githubusercontent.com/u/10049574?v=4",
      userFactionColor: "#12FFFF",
    },
    {
      displayName: "Joe",
      profile: "https://avatars.githubusercontent.com/u/10049574?v=4",
      userFactionColor: "#FF0000",
    },
    {
      displayName: "John",
      profile: "https://avatars.githubusercontent.com/u/10049574?v=4",
      userFactionColor: "#9550FF",
    },
    {
      displayName: "Cody",
      profile: "https://avatars.githubusercontent.com/u/10049574?v=4",
      userFactionColor: "#12FFFF",
    },
    {
      displayName: "Joe",
      profile: "https://avatars.githubusercontent.com/u/10049574?v=4",
      userFactionColor: "#FF0000",
    },
    {
      displayName: "John",
      profile: "https://avatars.githubusercontent.com/u/10049574?v=4",
      userFactionColor: "#9550FF",
    },
    {
      displayName: "Cody",
      profile: "https://avatars.githubusercontent.com/u/10049574?v=4",
      userFactionColor: "#12FFFF",
    },
    {
      displayName: "Joe",
      profile: "https://avatars.githubusercontent.com/u/10049574?v=4",
      userFactionColor: "#FF0000",
    },
    {
      displayName: "John",
      profile: "https://avatars.githubusercontent.com/u/10049574?v=4",
      userFactionColor: "#9550FF",
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.chatHeader}>Players</Text>
      <View
        style={{ borderBottomWidth: 2, borderBottomColor: Colors.hudDarker }}
      >
        {users.length >= 1 ? (
          <FlatList
            data={users}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 5 }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <ChatItem
                item={item}
                index={index}
                noBorder={index + 1 === users.length}
              />
            )}
          />
        ) : (
          <Text
            style={{
              color: Colors.hud,
              fontFamily: "LeagueSpartan-Bold",
              fontSize: 10,
              textAlign: "center",
              padding: 5,
            }}
          >
            No Players in Chat
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatHeader: {
    color: Colors.white,
    fontFamily: "LeagueSpartan-Bold",
    borderRadius: 5,
    fontSize: 12,
    marginLeft: 10,
    textAlign: "left",
    width: "100%",
  },
});
