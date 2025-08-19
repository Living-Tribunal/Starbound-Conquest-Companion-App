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
import { validateInviteCode } from "../../components/API/ValidateInviteCode/ValidateInviteCode";
import useMyTurn from "@/components/Functions/useMyTurn";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { useStarBoundContext } from "@/components/Global/StarBoundProvider";

export default function SetupGameRoom({
  showGameRoomModal,
  setShowGameRoomModal,
  handleSaveGameRoom,
  isJoiningGameRoom,
  setIsJoiningGameRoom,
  gameValue,
  setGameValue,
  setGameRoomUserID,
}) {
  const [isFocusValue, setIsFocusValue] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [showGameRoomJoined, setShowGameRoomJoined] = useState(false);
  const [showGameRoomCreated, setShowGameRoomCreated] = useState(false);
  const [gameRoomIDWarning, setGameRoomIDWarning] = useState(false);
  const uid = FIREBASE_AUTH.currentUser?.uid;
  const { gameRoomID, setGameRoomID } = useStarBoundContext();
  const { state: gameState } = useMyTurn(gameRoomID);

  /*   const disableSaveButton =
    inputValue.trim() === "" || inputValue.trim() === gameRoomID; */

  const handleIsJoiningGameRoom = () => {
    setIsJoiningGameRoom((prev) => !prev);
    console.log("Is joinh game room:", isJoiningGameRoom);
  };

  /*   console.log("Game Value:", gameValue);
  console.log("gameRoomID in setup:", gameRoomID); */
  /* console.log("GameRoomIDWarning:", gameRoomIDWarning); */

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
    /*  if (gameRoomID === inputValue.trim()) {
      setGameRoomIDWarning(true);
      return;
    } */
    const id = String(uuid.v4());
    setInputValue(id);
  };

  useEffect(() => {
    if (showGameRoomModal) {
      setInputValue(gameRoomID || "");
      setCopiedText(false);
    }
  }, [showGameRoomModal]);

  const copyToClipboard = () => {
    try {
      Clipboard.setString(gameRoomID);
      setCopiedText(true);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleUpdateGameRoom = async () => {
    const next = !isJoiningGameRoom ? uid : inputValue.trim();
    console.log("Game Value in UpdateGameRoom:", gameValue);

    if (!next) {
      Alert.alert("Game Room ID Required", "Please enter a Game Room ID.");
      return;
    }

    /*  if (next === gameRoomID) {
      setGameRoomIDWarning(true);
      return;
    } */

    if (isJoiningGameRoom) {
      const validRoom = await validateInviteCode(next);
      console.log("Is Valid:", validRoom);
      setIsValid(validRoom);
      console.log("Is Valid:", isValid);

      if (!validRoom) return;
    }

    console.log("Game Value in UpdateGameRoom:", gameValue);

    if (!isJoiningGameRoom && gameValue) {
      Alert.alert(
        "Game Room Exists",
        "Are you sure you want to create a game room with this information?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            onPress: async () => {
              setLoading(true);
              try {
                await handleSaveGameRoom(next);
                setGameRoomUserID(next);
                //setShowGameRoomModal(false);
              } catch (e) {
                console.error("Error saving game room:", e);
              } finally {
                setLoading(false);
                if (!isJoiningGameRoom) setShowGameRoomCreated(true);
                if (isJoiningGameRoom) setShowGameRoomJoined(true);
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
      setGameRoomUserID(next);
    } catch (e) {
      console.error(e);
      Alert.alert("Save failed", "Please try again.");
    } finally {
      setLoading(false);
      if (!isJoiningGameRoom) setShowGameRoomCreated(true);
      if (isJoiningGameRoom) setShowGameRoomJoined(true);
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
            {/*  <View
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
            </View> */}

            <Text style={styles.text1}>
              You user ID will identify your room and can be shared with other
              players. Also, set your game limit value. Tap Save to confirm and
              create your game room.
            </Text>
          </>
        )}
        {isJoiningGameRoom && (
          <Text style={styles.text2}>
            Paste your Game Room ID below to join an existing Game Room.
          </Text>
        )}
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Text style={[styles.subHeaderText, { marginBottom: 10 }]}>
            ⚠️Info: Once a game has started, you can't change your game limit
            value
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View
            style={{
              width: "95%",
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
              value={!isJoiningGameRoom ? uid : inputValue}
              style={[
                styles.textInput,
                { color: isJoiningGameRoom ? Colors.green_toggle : Colors.hud },
              ]}
              onChangeText={(text) => {
                setInputValue(text);
                if (isValid === false) setIsValid(null);
                if (gameRoomIDWarning) setGameRoomIDWarning(false);
              }}
              placeholder={
                !isJoiningGameRoom
                  ? "Game Room ID"
                  : "Paste your Game Room ID here"
              }
              onFocus={() => setIsFocusValue(true)}
              onBlur={() => setIsFocusValue(false)}
            />
            {/*  for now remove this and let the user ID be the game room ID making only one room per user */}
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
          </View>
          {/*  for now remove this and let the user ID be the game room ID making only one room per user */}
          {/* {!isJoiningGameRoom && (
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
          )} */}
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
                editable={gameState?.gameValue === "" || null}
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
              handleIsJoiningGameRoom();
              setInputValue("");
              setIsValid(null);
              setIsFocusValue(false);
              setGameRoomIDWarning(false);
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
          {isValid === false ? (
            <Text style={styles.error}>That Invite Code is Invalid</Text>
          ) : (
            ""
          )}
          {showGameRoomJoined ? (
            <Text
              style={[styles.text2, { fontFamily: "LeagueSpartan-Regular" }]}
            >
              Game Room Joined!
            </Text>
          ) : null}
          {showGameRoomCreated ? (
            <Text
              style={[styles.text2, { fontFamily: "LeagueSpartan-Regular" }]}
            >
              Game Room Created!
            </Text>
          ) : null}
        </View>
        <View style={{}}>
          <Text
            style={{ fontFamily: "LeagueSpartan-Regular", color: Colors.hud }}
          >
            {!isJoiningGameRoom && loading
              ? "Hang Tight, Creating Game Room..."
              : ""}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            disabled={
              (!isJoiningGameRoom && !gameRoomID && !gameValue) ||
              loading ||
              isValid === false ||
              showGameRoomJoined ||
              (isJoiningGameRoom && !inputValue)
            }
            style={[
              styles.gameRoomButton,
              {
                opacity:
                  (!isJoiningGameRoom && !gameRoomID && !gameValue) ||
                  loading ||
                  isValid === false ||
                  showGameRoomJoined ||
                  (isJoiningGameRoom && !inputValue)
                    ? 0.5
                    : 1,
              },
            ]}
            onPress={handleUpdateGameRoom}
          >
            <Text style={[styles.gameRoomID, { color: Colors.hudDarker }]}>
              {loading ? (
                <ActivityIndicator size="small" />
              ) : isJoiningGameRoom ? (
                "Join Game Room"
              ) : (
                "Create Game Room"
              )}
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
              setGameRoomIDWarning(false);
              setIsFocusValue(false);
              setShowGameRoomJoined(false);
              setShowGameRoomCreated(false);
            }}
          >
            <Text style={styles.gameRoomID}>
              {loading ? <ActivityIndicator size="small" /> : "Close"}
            </Text>
          </TouchableOpacity>
        </View>
        {showGameRoomCreated && (
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
                    style={[
                      styles.text1,
                      { fontSize: 12, color: Colors.hudDarker },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {gameRoomID}
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
    fontSize: 14,
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
    backgroundColor: Colors.hud,
    padding: 5,
    marginBottom: 10,
  },
  textInput: {
    height: 50,
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Light",
    fontSize: 11,
    paddingHorizontal: 10,
    width: "95%",
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
    tintColor: Colors.hudDarker,
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
  subHeaderText: {
    fontFamily: "monospace",
    color: Colors.white,
    fontSize: 9,
    textAlign: "center",
    backgroundColor: Colors.underTextGray,
    borderRadius: 5,
    padding: 5,
  },
});
