import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Colors } from "@/constants/Colors";

export default function EndTurnModal({
  showEndTurnModal,
  setShowEndTurnModal,
  endYourTurnAndSendMessage,
  myToggledOrDestroyingShips,
  myToggledShipsCount,
  myUntoggledShipsCount,
  myShipsBySectorNotToggled,
  isEndingTurn,
}) {
  //flatten the data so the flatlist can render it
  console.log("isEndingTurn:", isEndingTurn);
  const sectorData = Object.entries(myShipsBySectorNotToggled).map(
    ([sector, ships]) => ({
      sector,
      ships,
    })
  );

  return (
    <Modal
      visible={showEndTurnModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowEndTurnModal(false)}
    >
      {!isEndingTurn ? (
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
              source={require("../../../assets/images/SC_logo1.png")}
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
              Number of deployed ships: {myToggledShipsCount}
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
              Number of ships left to deploy: {myUntoggledShipsCount}
            </Text>
            <FlatList
              style={{ maxHeight: 200, width: "100%" }}
              data={sectorData}
              keyExtractor={(item) => item.sector}
              renderItem={({ item }) => (
                <View
                  style={{
                    marginBottom: 10,
                    backgroundColor: Colors.hudDarker,
                    padding: 5,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "LeagueSpartan-Bold",
                      fontSize: 15,
                      color: Colors.dark_gray,
                      textAlign: "center",
                      borderBottomWidth: 2,
                      borderBottomColor: Colors.dark_gray,
                    }}
                  >
                    Sector {item.sector}: {item.ships.length} ship(s)
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    {item.ships.map((ship) => (
                      <Text
                        key={ship.id}
                        style={{
                          fontFamily: "LeagueSpartan-Regular",
                          color: Colors.hud,
                        }}
                      >
                        • {ship.shipId}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            />
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
      ) : (
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
            <ActivityIndicator size="large" color={Colors.hud} />
            <Text
              style={[
                styles.textValue,
                {
                  color: Colors.hud,
                  fontSize: 15,
                },
              ]}
            >
              Ending Turn...
            </Text>
          </View>
        </View>
      )}
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
