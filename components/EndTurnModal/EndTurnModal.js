import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { Colors } from "@/constants/Colors";

export default function EndRoundModal({
  showEndTurnModal,
  setShowEndTurnModal,
  endYourTurnAndSendMessage,
  myToggledOrDestroyingShips,
  myToggledShipsCount,
  myUntoggledShipsCount,
}) {
  return (
    <Modal
      visible={showEndTurnModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowEndTurnModal(false)}
    >
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
          alignContent: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            width: "100%",
            paddingVertical: 30,
            paddingHorizontal: 20,
            backgroundColor: Colors.dark_gray,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: "center",
            borderWidth: 1,
            borderColor: Colors.hud,
          }}
        >
          <Image
            style={{
              width: 315,
              height: 161,
              resizeMode: "contain",
            }}
            source={require("../../assets/images/SC_logo1.png")}
          />
          <Text style={[styles.text1, { fontSize: 15 }]}>
            {myToggledOrDestroyingShips
              ? "Ready to end your turn?"
              : "You CAN end your turn, but you have ships left to deploy."}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: "LeagueSpartan-Regular",
              color: Colors.hud,
              textAlign: "center",
              padding: 10,
            }}
          >
            Number of ships left to deploy: {myToggledShipsCount}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: "LeagueSpartan-Regular",
              color: Colors.hud,
              textAlign: "center",
              padding: 10,
            }}
          >
            Number of ships: {myUntoggledShipsCount}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={async () => {
                await endYourTurnAndSendMessage();
                setShowEndTurnModal(false);
              }}
              style={[
                styles.editContainer,
                {
                  borderWidth: 1,
                  width: "45%",
                  borderWidth: 1,
                  borderColor: Colors.hud,
                  backgroundColor: Colors.hud,
                  borderRadius: 5,
                },
              ]}
            >
              <Text
                style={[
                  styles.textValue,
                  {
                    color: Colors.dark_gray,
                    fontSize: 12,
                  },
                ]}
              >
                End Turn
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowEndTurnModal(false)}
              style={[
                styles.editContainer,
                {
                  borderWidth: 1,
                  width: "45%",
                  borderColor: Colors.hud,
                  backgroundColor: Colors.dark_gray,
                  borderRadius: 5,
                },
              ]}
            >
              <Text
                style={[
                  styles.textValue,
                  {
                    color: Colors.hud,
                    fontSize: 12,
                  },
                ]}
              >
                Not Yet
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  text1: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Bold",
    fontSize: 12,
    padding: 5,
    textAlign: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
    backgroundColor: Colors.hudDarker,
    marginBottom: 10,
    marginTop: 10,
  },
  editContainer: {
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
  textValue: {
    fontSize: 15,
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Bold",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 5,
  },
});
