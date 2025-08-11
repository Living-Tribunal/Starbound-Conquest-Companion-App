import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { Colors } from "@/constants/Colors";

export default function RecallFightersModal({
  showRecallFightersModal,
  setShowRecallFightersModal,
  ship,
  myShips,
  shipId,
  protectedIds,
}) {
  return (
    <Modal
      visible={showRecallFightersModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowRecallFightersModal(false)}
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
          <Text style={styles.textValue}>
            Are you sure you want to Recall Fighters?
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 10,
              backgroundColor: Colors.hudDarker,
              padding: 5,
              borderRadius: 5,
            }}
          >
            <Text style={styles.shipIdText}>
              {ship.type} - {ship.shipId} is protecting{" "}
              {ship.numberOfShipsProtecting} ship(s).
            </Text>

            {protectedIds.map((id) => (
              <Text
                key={id}
                style={{
                  fontFamily: "LeagueSpartan-Regular",
                  color: Colors.hud,
                }}
              >
                • {id}
              </Text>
            ))}
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Text style={styles.headerText}>
              (This will remove the fighter protection and any applied bonuses.{" "}
              <Text
                style={[
                  styles.headerText,
                  {
                    fontFamily: "LeagueSpartan-Bold",
                    color: Colors.lighter_red,
                  },
                ]}
              >
                This action cannot be undone.)
              </Text>
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => {
                //handleEndRoundPress();
                setShowRecallFightersModal(false);
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
                Recall Fighters
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowRecallFightersModal(false)}
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
                Cancel
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
    fontSize: 17,
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Bold",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 5,
  },
  headerText: {
    color: Colors.gold,
    fontSize: 11,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Light",
    textAlign: "center",
    padding: 10,
  },
  shipIdText: {
    color: Colors.dark_gray,
    fontSize: 15,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Bold",
    borderBottomWidth: 2,
    borderBottomColor: Colors.dark_gray,
  },
});
