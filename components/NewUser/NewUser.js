import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "expo-router";

export default function NewUser({ acknowledgement, setAcknowledgement }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark_gray,
        flexDirection: "column",
      }}
    >
      <Image
        style={{ width: 315, height: 161 }}
        source={require("../../assets/images/SC_logo1.png")}
      />
      <Text
        style={{
          fontSize: 20,
          padding: 10,
          textAlign: "center",
          fontFamily: "LeagueSpartan-Light",
          color: Colors.hud,
        }}
      >
        Welcome to Starbound Conquest! Looks like this is your first time here.
        To get started, you’ll need to set up your profile in Settings (bottom
        right or the button below).
      </Text>
      <Text
        style={{
          fontSize: 20,
          padding: 10,
          textAlign: "center",
          fontFamily: "LeagueSpartan-Light",
          color: Colors.green_toggle,
        }}
      >
        Want to look around first? Just tap Continue and set things up later.
      </Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity
          onPress={() => setAcknowledgement(true)}
          style={{
            backgroundColor: Colors.hud,
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            width: 100,
          }}
        >
          <Text
            style={{
              color: Colors.hudDarker,
              fontSize: 15,
              fontFamily: "LeagueSpartan-Bold",
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={{
            backgroundColor: Colors.hudDarker,
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            borderWidth: 1,
            borderColor: Colors.hud,
          }}
        >
          <Text
            style={{
              color: Colors.hud,
              fontSize: 15,
              fontFamily: "LeagueSpartan-Bold",
            }}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
