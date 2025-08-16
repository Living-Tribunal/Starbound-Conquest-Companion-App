import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import Chatlist from "../../components/Chat/Chatlist";
import useMyTurn from "../../components/Functions/useMyTurn";
import { collection, onSnapshot } from "firebase/firestore";

export default function Chat() {
  const userName = FIREBASE_AUTH.currentUser?.displayName;
  const { gameRoomID, setGameRoomID } = useStarBoundContext();
  const { myTurn, state: gameState } = useMyTurn(gameRoomID);
  const user = FIREBASE_AUTH.currentUser;
  const { data, setData, userFactionColor } = useStarBoundContext();
  const [playersInChat, setPlayersInChat] = useState([]);
  const [isLoadingActivePlayers, setIsLoadingActivePlayers] = useState(false);
  const [text, setText] = useState("");

  /*   useEffect(() => {
    console.log("Chat:", text);
    console.log("User:", userName);
    console.log("User:", userFactionColor);
    console.log("GameRoomID:", gameRoomID);
    console.log("PlayersInChat:", playersInChat.displayName);
  }, [text, gameRoomID]); */

  useEffect(() => {
    const auth = FIREBASE_AUTH;
    if (!auth.currentUser) return;
    if (!gameRoomID) return;
    setIsLoadingActivePlayers(true);

    const usersRef = collection(FIREBASE_DB, "users");
    const unsubscribeUsers = onSnapshot(usersRef, (userSnapshot) => {
      const activePlayers = [];

      userSnapshot.docs.forEach((userDoc) => {
        const uid = userDoc.id;
        const userData = userDoc.data();
        if (userData.gameRoomID === gameRoomID) {
          activePlayers.push({
            uid,
            displayName: userData.displayName,
            profile: userData.photoURL,
          });
        }
      });
      setPlayersInChat(activePlayers);
      console.log("Players in Chat:", activePlayers);
    });
    setIsLoadingActivePlayers(false);
    return () => {
      unsubscribeUsers();
    };
  }, [gameRoomID, FIREBASE_AUTH.currentUser]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: "left" }}>
          <Chatlist
            gameRoomID={gameRoomID}
            users={playersInChat}
            gameState={gameState}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            borderRadius: 10,
            backgroundColor: Colors.hudDarker,
            borderColor: Colors.hud,
            borderWidth: 1,
            width: "95%",
            marginBottom: 10,
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            style={{
              width: "95%",
              color: Colors.hud,
              fontFamily: "monospace",
              fontSize: 13,
              height: 55,
              marginLeft: 15,
            }}
            placeholder="Enter your message here"
            placeholderTextColor={Colors.hud}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Image
              style={{
                width: 35,
                height: 35,
                tintColor: Colors.hudDarker,
                backgroundColor: Colors.hud,
                borderWidth: 1,
                borderColor: Colors.hudDarker,
                borderRadius: 10,
                padding: 5,
              }}
              source={require("../../assets/icons/icons8-send-50.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.blue_gray,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
    alignItems: "flex-start",
    margin: 5,
    borderRadius: 5,
    boxShadow: `0px 0px 5px ${Colors.hud}`,
  },
  chatMessage: {
    color: Colors.hud,
    fontFamily: "monospace",
    fontSize: 15,
    textAlign: "center",
    padding: 5,
  },
  sendButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
