import React, { useState, useEffect, useCallback, useRef } from "react";
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
  SafeAreaView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import Chatlist from "../../components/Chat/Chatlist";
import ChatBubble from "../../components/Chat/ChatBubble";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  doc,
  query,
  limit,
} from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import useMyTurn from "@/components/Functions/useMyTurn";

//to prevent re-renders and flickers move the component outside of the chat component
const PlayersList = React.memo(({ users, gameState, gameRoomID }) => {
  return (
    <View style={styles.chatListContainer}>
      <Chatlist gameRoomID={gameRoomID} users={users} gameState={gameState} />
    </View>
  );
});

export default function Chat() {
  const { gameRoomID, setGameRoomID, userFactionColor } = useStarBoundContext();
  const { state: gameState } = useMyTurn(gameRoomID);
  const user = FIREBASE_AUTH.currentUser;
  const [playersInChat, setPlayersInChat] = useState([]);
  const [isLoadingActivePlayers, setIsLoadingActivePlayers] = useState(false);
  const [isSendMessage, setIsSendMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  /*   const [text, setText] = useState(""); */
  const textRef = useRef("");
  const textInputRef = useRef(null);
  const scrollViewRef = useRef();

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
  }, []);

  // whenever the messages array length changes, stick to bottom
  useEffect(() => {
    if (messages.length) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);
  //console.log("Chat:", messages);

  const createPublicChatRoom = async () => {
    let text = textRef.current.trim();
    try {
      setIsSendMessage(true);
      if (!gameRoomID || !text) return;
      textRef.current = "";
      if (textInputRef) textInputRef.current.clear();
      const publicChatRef = collection(
        FIREBASE_DB,
        "gameRooms",
        gameRoomID,
        "publicChat"
      );

      await addDoc(publicChatRef, {
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        userName: user.displayName,
        userProfilePicture: user.photoURL,
        userFactionColor,
        message: text,
      });

      setIsSendMessage(false);
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (!gameRoomID) return;
    const messageRef = collection(
      FIREBASE_DB,
      "gameRooms",
      gameRoomID,
      "publicChat"
    );
    const q = query(messageRef, orderBy("createdAt", "desc"), limit(50));

    const unsubscribe = onSnapshot(q, (docSnap) => {
      let messages = docSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(messages);
    });
    return unsubscribe;
  }, [gameRoomID]);

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
            userFactionColor: userData.userFactionColor,
          });
        }
      });
      setPlayersInChat(activePlayers);
      //console.log("Players in Chat:", JSON.stringify(activePlayers, null, 2));
    });
    setIsLoadingActivePlayers(false);
    return () => {
      unsubscribeUsers();
    };
  }, [gameRoomID, FIREBASE_AUTH.currentUser]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <PlayersList
        gameRoomID={gameRoomID}
        users={playersInChat}
        gameState={gameState}
      />

      <View style={{ flex: 1 }}>
        <FlatList
          ref={scrollViewRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item.message}
              userName={item.userName}
              photoURL={item.userProfilePicture}
              userFactionColor={item.userFactionColor}
            />
          )}
          inverted
          // Good defaults for chat; prevents jumpiness when items prepend
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10, // small threshold is fine
          }}
          onLayout={scrollToBottom}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
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
          editable={!gameRoomID || !isSendMessage}
          ref={textInputRef}
          onChangeText={(value) => (textRef.current = value)}
          style={{
            width: "82%",
            color: Colors.hud,
            fontFamily: "monospace",
            fontSize: 13,
            height: 55,
            marginLeft: 15,
          }}
          placeholder="Enter your message here"
          placeholderTextColor={Colors.hud}
        />
        <TouchableOpacity
          onPress={async () => await createPublicChatRoom()}
          style={[
            styles.sendButton,
            { opacity: !gameRoomID || isSendMessage ? 0.5 : 1 },
          ]}
          disabled={isSendMessage || !gameRoomID}
        >
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatListContainer: {},
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.green_toggle,
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
