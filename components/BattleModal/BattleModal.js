import { Modal, TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/Colors";

export default function BattleModal({
  showConfirmModal,
  setShowConfirmModal,
  pendingBattle,
  navigateToBattleGround,
  setShipPressed,
  setTargetedShip,
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showConfirmModal}
      onRequestClose={() => setShowConfirmModal(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Battle</Text>
          <Text>Attacker: {pendingBattle?.attackingShip.displayName}</Text>
          <Text>
            {" "}
            Ship: {pendingBattle?.attackingShip.shipId}{" "}
            {pendingBattle?.attackingShip.type}
          </Text>
          <Text>Target: {pendingBattle?.targetedShip.displayName}</Text>
          <Text>
            {" "}
            Ship: {pendingBattle?.targetedShip.shipId}{" "}
            {pendingBattle?.targetedShip.type}
          </Text>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TouchableOpacity
              onPress={() => {
                setShowConfirmModal(false);
                setShipPressed(null);
                setTargetedShip(null);
              }}
              style={styles.zoomButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigateToBattleGround(pendingBattle.attackingShip.id);
                setShowConfirmModal(false);
                setShipPressed(null);
                setTargetedShip(null);
              }}
              style={styles.zoomButton}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: Colors.hudDarker,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gold,
  },
  zoomButton: {
    backgroundColor: Colors.hudDarker,
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.hud,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-ExtraBold",
    textAlign: "center",
    fontSize: 12,
  },
});
