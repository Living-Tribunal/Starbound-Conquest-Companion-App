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
  showEndRoundModal,
  setShowEndRoundModal,
  handleEndRoundPress,
}) {
  return (
    <Modal
      visible={showEndRoundModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowEndRoundModal(false)}
    >
      <View style={styles.loadingContainer}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.dark_gray,
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            style={{ width: 315, height: 161 }}
            source={require("../../../assets/images/SC_logo1.png")}
          />
          <Text style={[styles.text1, { fontSize: 20 }]}>
            The round has ended.
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
            Would you like to end the round?
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => {
                handleEndRoundPress();
                setShowEndRoundModal(false);
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
                End Round
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowEndRoundModal(false)}
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
    fontFamily: "LeagueSpartan-Light",
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
    shadowColor: Colors.hud,
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
