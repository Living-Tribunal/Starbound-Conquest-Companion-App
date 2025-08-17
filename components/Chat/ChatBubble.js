import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { useStarBoundContext } from "../Global/StarBoundProvider";

export default function ChatBubble({ message, userName, photoURL }) {
  const user = FIREBASE_AUTH.currentUser;
  const currentUser = user.displayName === userName;

  return (
    <View style={{ alignItems: currentUser ? "flex-end" : "flex-start" }}>
      <View style={[styles.bubbleContainer]}>
        <View
          style={[
            styles.userNameContainer,
            {
              justifyContent: currentUser ? "flex-end" : "flex-start",
            },
          ]}
        >
          <Image
            style={{ width: 30, height: 30, borderRadius: 50 }}
            source={{ uri: photoURL }}
          />
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <Text style={styles.chatMessage}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    backgroundColor: Colors.dark_gray,
    borderWidth: 1,
    borderColor: Colors.hud,
    width: "60%",
    marginLeft: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: "column",
    marginBottom: 20,
    marginTop: 20,
  },
  chatMessage: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Regular",
    fontSize: 15,
    textAlign: "center",
    padding: 5,
  },
  userName: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Bold",
    fontSize: 15,
    textAlign: "center",
  },
  userNameContainer: {
    postion: "absolute",
    gap: 10,
    bottom: 15,
    width: "100%",
    backgroundColor: Colors.hudDarker,
    borderWidth: 1,
    borderColor: Colors.hud,
    borderRadius: 10,
    padding: 5,
    flexDirection: "row",
  },
});
