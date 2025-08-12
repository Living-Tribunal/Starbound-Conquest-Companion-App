import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Colors } from "@/constants/Colors";
import uuid from "react-native-uuid";
import Clipboard from "@react-native-clipboard/clipboard";
import LoadingComponent from "@/components/loading/LoadingComponent";

export default function SetupGameRoom({
  showGameRoomModal,
  setShowGameRoomModal,
  gameRoomId,
  setGameRoomId,
  handleSaveGameRoom,
}) {
  const [isFocusValue, setIsFocusValue] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const disableSaveButton =
    inputValue.trim() === "" || inputValue.trim() === gameRoomId;

  const randomGameRoomId = () => {
    const id = String(uuid.v4());
    setInputValue(id);
  };

  useEffect(() => {
    if (showGameRoomModal) {
      setInputValue(gameRoomId || "");
      setCopiedText(false);
    }
  }, [showGameRoomModal]);

  const copyToClipboard = () => {
    try {
      Clipboard.setString(gameRoomId);
      setCopiedText(true);
      setTimeout(() => {
        setShowGameRoomModal(false);
      }, 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleUpdateGameRoom = async () => {
    const next = inputValue.trim();
    console.log("Next:", next);
    if (!next) {
      Alert.alert("Game Room ID Required", "Please enter a Game Room ID.");
      return;
    }

    if (next === gameRoomId) {
      setShowGameRoomModal(false);
      return;
    }

    if (gameRoomId) {
      console.log("Next in alert:", next);
      console.log("Game Room ID Already Exists:", gameRoomId);
      Alert.alert(
        "Game Room Exists",
        "You already have a Game Room ID. Do you want to change it?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            onPress: async () => {
              setLoading(true);
              try {
                await handleSaveGameRoom(next);
                setGameRoomId(next);
                setShowGameRoomModal(false);
              } catch (e) {
                console.error("Error saving game room:", e);
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
      return;
    }

    // No existing room: save directly
    setLoading(true);
    try {
      await handleSaveGameRoom(next);
      setGameRoomId(next);
      setTimeout(() => setShowGameRoomModal(false), 300);
    } catch (e) {
      console.error(e);
      Alert.alert("Save failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderLabelGameValue = () => {
    if (isFocusValue) {
      /*  console.log(isFocus); */
      return (
        <Text style={[styles.label, isFocusValue && { color: Colors.hud }]}>
          Game Room ID
        </Text>
      );
    }
    return null;
  };

  return (
    <Modal
      visible={showGameRoomModal}
      transparent
      animationType="fade"
      onRequestClose={() => {
        setShowGameRoomModal(false);
      }}
    >
      <View style={styles.mainContainer}>
        <Image
          style={{ width: 315, height: 161 }}
          source={require("../../assets/images/SC_logo1.png")}
        />
        <Text style={styles.text1}>
          Create a Game Room by entering a unique Game Room ID. This ID will
          identify your room and can be shared with other players. Tap Save to
          confirm and apply your changes.
        </Text>
        <Text style={styles.text2}>
          (If you already have a Game Room ID, you can paste it below instead of
          creating a new one. Just make sure you tap save!)
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {renderLabelGameValue()}
          <TextInput
            placeholderTextColor={Colors.hud}
            value={inputValue}
            style={styles.textInput}
            onChangeText={setInputValue}
            placeholder={!isFocusValue ? "Game Room ID" : ""}
            onFocus={() => setIsFocusValue(true)}
            onBlur={() => setIsFocusValue(false)}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={styles.gameRoomIDButton}
              onPress={randomGameRoomId}
            >
              <Image
                style={styles.image}
                source={require("../../assets/icons/icons8-random-50.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.gameRoomIDButton}
              onPress={() => {
                setInputValue("");
              }}
            >
              <Image
                style={styles.image}
                source={require("../../assets/icons/icons8-trash-48.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text
            style={{ fontFamily: "LeagueSpartan-Regular", color: Colors.hud }}
          >
            {loading ? "Hang Tight, Creating Game Room..." : ""}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            disabled={loading}
            style={[
              styles.gameRoomButton,
              { opacity: disableSaveButton ? 0.5 : 1 },
            ]}
            onPress={handleUpdateGameRoom}
            disabled={disableSaveButton}
          >
            <Text style={styles.gameRoomID}>
              {loading ? <ActivityIndicator size="small" /> : "Save"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={loading}
            style={[
              styles.gameRoomButton,
              { backgroundColor: Colors.dark_gray },
            ]}
            onPress={() => {
              setShowGameRoomModal(false);
              setLoading(false);
            }}
          >
            <Text style={styles.gameRoomID}>
              {loading ? <ActivityIndicator size="small" /> : "Cancel"}
            </Text>
          </TouchableOpacity>
        </View>
        {gameRoomId && (
          <View
            style={{
              flexDirection: "column",
              gap: 10,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Text style={styles.text2}>
              Tap below to copy your Game Room ID to your clipboard.
            </Text>
            <View>
              <TouchableOpacity
                style={[styles.gameRoomButton, { width: "100%", padding: 10 }]}
                onPress={copyToClipboard}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={styles.image}
                    source={require("../../assets/icons/icons8-copy-50.png")}
                  />
                  <Text
                    style={[styles.text1, { fontSize: 12 }]}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {gameRoomId}
                  </Text>
                </View>
              </TouchableOpacity>
              {copiedText && (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.text2, { fontSize: 15 }]}>
                    Successfully Copied to clipboard!
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text1: {
    color: Colors.hud,
    fontSize: 15,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Bold",
    padding: 5,
  },
  gameRoomID: {
    color: Colors.hud,
    fontSize: 15,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Bold",
  },
  gameRoomButton: {
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
    borderRadius: 3,
    backgroundColor: Colors.hudDarker,
    padding: 5,
    marginBottom: 10,
  },
  textInput: {
    height: 50,
    borderColor: Colors.hud,
    borderWidth: 1,
    color: Colors.hud,
    fontFamily: "monospace",
    fontSize: 9,
    borderRadius: 2,
    backgroundColor: Colors.hudDarker,
    paddingHorizontal: 10,
    width: "75%",
    alignSelf: "center",
  },
  label: {
    position: "absolute",
    backgroundColor: Colors.dark_gray,
    left: 20,
    top: -10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 12,
    borderWidth: 3,
    borderRadius: 3,
    borderColor: Colors.hud,
    color: Colors.hud,
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 8,
  },
  text2: {
    color: Colors.green_toggle,
    fontSize: 12,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Bold",
    marginBottom: 10,
    padding: 5,
  },
  image: {
    width: 25,
    height: 25,
    tintColor: Colors.hud,
  },
  gameRoomIDButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.hud,
    backgroundColor: Colors.hudDarker,
    borderRadius: 3,
  },
});
