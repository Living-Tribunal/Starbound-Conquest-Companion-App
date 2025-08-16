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
  ];

  const AnimatedItem = ({ item, index }) => {
    const translateY = useRef(new Animated.Value(-10)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (showPlayerList) {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            delay: index * 80, // stagger dela6
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            delay: index * 80,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // reset when hiding
        translateY.setValue(-10);
        opacity.setValue(0);
      }
    }, [showPlayerList]);

    return (
      <Animated.View style={{ transform: [{ translateY }], opacity }}>
        <View style={{ padding: 5, width: "100%" }}>
          <ChatItem
            item={item}
            index={index}
            noBorder={index + 1 === users.length}
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View
        style={{
          flexDirection: "column",
          backgroundColor: Colors.hudDarker,
          borderRadius: 5,
          gap: 10,
        }}
      >
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.chatHeader}>Players</Text>
        </TouchableOpacity>

        {testData.length > 0 ? (
          showPlayerList && (
            <FlatList
              data={testData}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <AnimatedItem item={item} index={index} />
              )}
            />
          )
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
  mainContainer: {
    flex: 1,
  },
  chatHeader: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Bold",
    borderWidth: 2,
    borderColor: Colors.hud,
    borderRadius: 5,
    fontSize: 20,
    textAlign: "center",
    padding: 5,
    borderBottomColor: Colors.hud,
    borderBottomWidth: 2,
    backgroundColor: Colors.hudDarker,
  },
});
