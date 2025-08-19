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
    <>
      <View
        style={{
          flexDirection: "column",
          gap: 10,
          justifyContent: currentUser ? "flex-end" : "flex-start",
          marginVertical: 5,
          alignItems: currentUser ? "flex-end" : "flex-start",
          padding: 5,
        }}
      >
        <View
          style={{
            flexDirection: currentUser ? "row-reverse" : "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              alignSelf: "left",
            }}
            source={{ uri: photoURL }}
          />
          <Text
            style={[
              styles.userName,
              {
                color: userFactionColor ? userFactionColor : Colors.hud,
                textAlign: !currentUser ? "right" : "left",
              },
            ]}
          >
            {userName}
          </Text>
        </View>

        <View
          style={{
            alignSelf: "left",
            flexDirection: "column",
          }}
        >
          <Text
            style={[
              styles.chatMessage,
              { textAlign: currentUser ? "right" : "left", padding: 5 },
            ]}
          >
            {message}
          </Text>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#26c2ed47",
          height: 1,
          width: "90%",
          borderRadius: 5,
          boxShadow: `0px 0px 5px #26c2ed43`,
          alignSelf: currentUser ? "flex-end" : "flex-start",
          margin: 5,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  chatMessage: {
    color: Colors.white,
    fontFamily: "LeagueSpartan-Light",
    fontSize: 14,
  },
  userName: {
    fontFamily: "LeagueSpartan-Bold",
    fontSize: 17,
    textAlign: "left",
  },
});
