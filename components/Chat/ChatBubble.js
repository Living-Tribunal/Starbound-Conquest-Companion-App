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

export default function ChatBubble({
  message,
  userName,
  photoURL,
  userFactionColor,
}) {
  const user = FIREBASE_AUTH.currentUser;
  const currentUser = user.displayName === userName;

  return (
    <View style={{ alignItems: currentUser ? "flex-end" : "flex-start" }}>
      <View
        style={[
          styles.bubbleContainer,
          {
            borderColor: userFactionColor ? userFactionColor : Colors.hud,
            backgroundColor: Colors.hudDarker,
            boxShadow: `0px 0px 10px ${
              userFactionColor ? userFactionColor : Colors.hud
            }`,
          },
        ]}
      >
        <View
          style={[
            styles.userNameContainer,
            {
              borderColor: userFactionColor ? userFactionColor : Colors.hud,
              justifyContent: "center",
              left: currentUser ? 30 : 15,
              backgroundColor: Colors.hudDarker,
            },
          ]}
        >
          <Image
            style={{ width: 30, height: 30, borderRadius: 50 }}
            source={{ uri: photoURL }}
          />
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignSelf: "center",
          }}
        >
          <Text style={styles.chatMessage}>{message}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    backgroundColor: Colors.dark_gray,
    borderWidth: 1,
    borderColor: Colors.hud,
    width: "50%",
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    flexDirection: "column",
    marginBottom: 20,
    marginTop: 30,
    boxShadow: `0px 0px 10px ${Colors.hud}`,
  },
  chatMessage: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Regular",
    fontSize: 14,
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
    bottom: 25,
    width: "80%",
    backgroundColor: Colors.hudDarker,
    borderWidth: 1,
    borderColor: Colors.hud,
    borderRadius: 10,
    padding: 5,
    flexDirection: "row",
  },
});
