import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { useStarBoundContext } from "../Global/StarBoundProvider";

export default function ChatBubble({ message, userName }) {
  const user = FIREBASE_AUTH.currentUser;
  const { data, setData, userFactionColor } = useStarBoundContext();
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("Chat:", text);
    console.log("User:", userName);
  }, [text]);

  return (
    <View
      style={[
        styles.bubbleContainer,
        { borderColor: userFactionColor || Colors.hudDarker, borderWidth: 5 },
      ]}
    >
      <View style={styles.userNameContainer}>
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <Text style={styles.chatMessage}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    backgroundColor: Colors.hudDarker,
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    width: "80%",
    height: "auto",
    flexDirection: "column",
  },
  chatMessage: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Regular",
    fontSize: 15,
    textAlign: "center",
    padding: 5,
  },
  userName: {
    color: Colors.hudDarker,
    fontFamily: "LeagueSpartan-Bold",
    fontSize: 15,
    textAlign: "center",
  },
  userNameContainer: {
    width: "100%",
    backgroundColor: Colors.missiles,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
