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
import Toast from "react-native-toast-message";
import { validateInviteCode } from "../../components/API/ValidateInviteCode/ValidateInviteCode";

export default function SetupGameRoom({
  showGameRoomModal,
  setShowGameRoomModal,
  gameRoomId,
  setGameRoomId,
  handleSaveGameRoom,
  isJoiningGameRoom,
  setIsJoiningGameRoom,
  gameValue,
  setGameValue,
}) {
  const [isFocusValue, setIsFocusValue] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(null);

  const disableSaveButton =
    inputValue.trim() === "" || inputValue.trim() === gameRoomId;

  const renderLabelGameValue = () => {
    if (isFocusValue) {
      /*  console.log(isFocus); */
      return (
        <Text style={[styles.label, isFocusValue && { color: Colors.hud }]}>
          Game Value
        </Text>
      );
    }
    return null;
  };

  const renderGameRoomLabel = () => {
    if (isFocusValue && isJoiningGameRoom) {
      /*  console.log(isFocus); */
      return (
        <Text
          style={[
            styles.label,
            isFocusValue && {
              color: Colors.green_toggle,
              borderColor: Colors.green_toggle,
              backgroundColor: Colors.dark_gray,
            },
          ]}
        >
          Game Room ID
        </Text>
      );
    }
    return null;
  };

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
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleUpdateGameRoom = async () => {
    const next = inputValue.trim();
    if (!next) {
      Alert.alert("Game Room ID Required", "Please enter a Game Room ID.");
      return;
    }

    if (next === gameRoomId) {
      Toast.show({
        type: "info",
        text1: "Starbound Conquest",
        text2: "Game Room ID already exists.",
        position: "top",
      });
      return;
    }

    const validRoom = await validateInviteCode(next);
    console.log("Is Valid:", validRoom);
    setIsValid(validRoom);
    console.log("Is Valid:", isValid);

    if (!validRoom) return;

    if (gameRoomId) {
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
    } catch (e) {
      console.error(e);
      Alert.alert("Save failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={showGameRoomModal}
      transparent
      animationType="fade"
      onRequestClose={() => {
        setShowGameRoomModal(false);
        setIsValid(null);
      }}
    >
      <View style={styles.mainContainer}>
        <Image
          style={{ width: 315, height: 161 }}
          source={require("../../assets/images/SC_logo1.png")}
        />
        {!isJoiningGameRoom && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={[styles.text1, { alignSelf: "center" }]}>
                Create a Game Room ID by tapping
              </Text>
              <Image
                style={[
                  styles.image,
                  {
                    width: 25,
                    height: 25,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: Colors.hud,
                    marginLeft: 5,
                    backgroundColor: Colors.hudDarker,
                  },
                ]}
                source={require("../../assets/icons/icons8-random-50.png")}
              />
            </View>

            <Text style={styles.text1}>
              This ID will identify your room and can be shared with other
              players. Also, set your game limit value. Tap Save to confirm and
            </Text>
          </>
        )}
        {isJoiningGameRoom && (
          <Text style={styles.text2}>
            Paste your Game Room ID below to join an existing Game Room.
          </Text>
        )}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View
            style={{
              width: "80%",
              justifyContent: "space-between",
              flexDirection: "row",
              position: "relative",
              gap: 10,
              marginTop: 20,
              borderWidth: 1,
              borderColor: isJoiningGameRoom ? Colors.green_toggle : Colors.hud,
              borderRadius: 5,
              backgroundColor: isJoiningGameRoom
                ? Colors.darker_green_toggle
                : Colors.hudDarker,
            }}
          >
            {renderGameRoomLabel()}
            <TextInput
              editable={isJoiningGameRoom}
              placeholderTextColor={
                !isJoiningGameRoom ? Colors.hud : Colors.green_toggle
              }
              value={inputValue}
              style={[
                styles.textInput,
                { color: isJoiningGameRoom ? Colors.green_toggle : Colors.hud },
              ]}
              onChangeText={setInputValue}
              placeholder={
                !isJoiningGameRoom
                  ? "Game Room ID"
                  : "Paste your Game Room ID here"
              }
              onFocus={() => setIsFocusValue(true)}
              onBlur={() => setIsFocusValue(false)}
            />
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                right: 20,
              }}
              onPress={() => {
                setInputValue("");
              }}
            >
              <Image
                style={[
                  styles.image,
                  {
                    tintColor: isJoiningGameRoom
                      ? Colors.green_toggle
                      : Colors.hud,
                  },
                ]}
                source={require("../../assets/icons/icons8-trash-48.png")}
              />
            </TouchableOpacity>
          </View>
          {!isJoiningGameRoom && (
            <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
              <TouchableOpacity
                style={styles.gameRoomIDButton}
                onPress={randomGameRoomId}
              >
                <Image
                  style={styles.image}
                  source={require("../../assets/icons/icons8-random-50.png")}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {!isJoiningGameRoom && (
          <View
            style={{
              width: "95%",
              marginTop: 20,
              justifyContent: "space-between",
              flexDirection: "row",
              gap: 10,
              borderWidth: 1,
              borderColor: isJoiningGameRoom ? Colors.green_toggle : Colors.hud,
              borderRadius: 5,
              backgroundColor: isJoiningGameRoom
                ? Colors.darker_green_toggle
                : Colors.hudDarker,
            }}
          >
            <View
              style={{
                width: "100%",
                position: "relative",
              }}
            >
              {renderLabelGameValue()}
              <TextInput
                maxLength={12}
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={(text) => {
                  setGameValue(text.trimStart());
                }}
                placeholderTextColor={Colors.hud}
                placeholder={!isFocusValue ? "Max Value" : ""}
                value={gameValue}
                onFocus={() => setIsFocusValue(true)}
                onBlur={() => setIsFocusValue(false)}
              />
            </View>
          </View>
        )}
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => {
              setIsJoiningGameRoom((prev) => !prev);
              setInputValue("");
              setIsValid(null);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  styles.text1,
                  {
                    color: isJoiningGameRoom ? Colors.green_toggle : Colors.hud,
                    borderBottomColor: isJoiningGameRoom
                      ? Colors.green_toggle
                      : Colors.hud,
                  },
                ]}
              >
                {isJoiningGameRoom ? "Join Game Room" : "Create Game Room"}
              </Text>
              <Text
                style={{
                  color: isJoiningGameRoom ? Colors.hud : Colors.green_toggle,
                }}
              >
                /
              </Text>
              <Text
                style={[
                  styles.text1,
                  {
                    color: !isJoiningGameRoom
                      ? Colors.green_toggle
                      : Colors.hud,
                  },
                ]}
              >
                {!isJoiningGameRoom ? "Join Game Room" : "Create Game Room"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          {isValid === false && (
            <Text style={styles.error}>That Invite Code is Invalid</Text>
          )}
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
            disabled={loading || disableSaveButton}
            style={[
              styles.gameRoomButton,
              {
                opacity: disableSaveButton ? 0.5 : 1,
              },
            ]}
            onPress={handleUpdateGameRoom}
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
              setLoading(false);
              setIsJoiningGameRoom(false);
              setInputValue("");
              setShowGameRoomModal(false);
              setIsValid(null);
            }}
          >
            <Text style={styles.gameRoomID}>
              {loading ? <ActivityIndicator size="small" /> : "Close"}
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
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Light",
    fontSize: 11,
    paddingHorizontal: 10,
    width: "90%",
  },
  label: {
    position: "absolute",
    backgroundColor: Colors.dark_gray,
    left: 10,
    top: -15,
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
    fontSize: 15,
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
    padding: 10,
  },
  joinGameRoomButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
    borderRadius: 3,
    backgroundColor: Colors.hudDarker,
    padding: 5,
  },
  error: {
    color: Colors.lighter_red,
    fontFamily: "LeagueSpartan-Bold",
    fontSize: 15,
    textAlign: "center",
  },
});
