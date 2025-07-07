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
  setPendingBattle,
}) {
  const [confirming, setConfirming] = useState(false);

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
          <Text style={styles.modalText}>
            Attacker: {pendingBattle?.attackingShip.displayName}
          </Text>
          <Text style={styles.modalTextInfo}>
            {" "}
            Ship: {pendingBattle?.attackingShip.shipId}
            {" - "}
            {pendingBattle?.attackingShip.type}
          </Text>
          <Text style={styles.modalText}>
            Target: {pendingBattle?.targetedShip.displayName}
          </Text>
          <Text style={styles.modalTextInfo}>
            {" "}
            Ship: {pendingBattle?.targetedShip.shipId} {" - "}
            {pendingBattle?.targetedShip.type}
          </Text>

          <View style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
            <TouchableOpacity
              onPress={() => {
                setShowConfirmModal(false);
                setShipPressed(null);
                setTargetedShip(null);
              }}
              style={[styles.zoomButton, { backgroundColor: Colors.hudDarker }]}
            >
              <Text style={[styles.buttonText, { color: Colors.hud }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (confirming) return;
                setConfirming(true);
                navigateToBattleGround(
                  pendingBattle.attackingShip,
                  pendingBattle.targetedShip
                );

                setTimeout(() => {
                  setShipPressed(null);
                  setTargetedShip(null);
                }, 500);
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
    backgroundColor: Colors.dark_gray,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.hud,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gold,
  },
  zoomButton: {
    backgroundColor: Colors.hud,
    width: 100,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.hud,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.hudDarker,
    fontFamily: "LeagueSpartan-ExtraBold",
    textAlign: "center",
    fontSize: 12,
  },
  modalText: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-ExtraBold",
    textAlign: "center",
    fontSize: 18,
  },
  modalTextInfo: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Light",
    textAlign: "center",
    fontSize: 12,
    backgroundColor: Colors.hudDarker,
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
});
