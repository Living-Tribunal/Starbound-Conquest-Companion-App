import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import HeaderComponent from "../../components/header/HeaderComponent";
import useMyTurn from "../../components/Functions/useMyTurn";
import {
  collection,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  addDoc,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import ChatBubble from "../../components/Chat/ChatBubble";
import { getCombinedGameRoomID } from "../../components/Functions/getCombinedGameRoomID";

export default function PrivateChat({ route }) {
  const { item } = route.params || {};
  const { gameRoomID, setGameRoomID, userFactionColor } = useStarBoundContext();
  const { state: gameState } = useMyTurn(gameRoomID);
  const user = FIREBASE_AUTH.currentUser;
  const [isSendMessage, setIsSendMessage] = useState(false);
  const [messages, setMessages] = useState([]);
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

  //console.log("Item:", item?.displayName, user?.displayName);
  //console.log("Game Room ID:", gameRoomID);
  /* console.log("User Faction Color:", userFactionColor);
  console.log("Game State:", gameState);
  console.log("User:", user);
  console.log("Messages:", messages);
  console.log("Item:", item);*/

  const createPrivateChatRoom = async () => {
    let text = textRef.current.trim();
    let combinedGameRoomID = getCombinedGameRoomID({ user, item });
    try {
      setIsSendMessage(true);
      if (!gameRoomID || !text) return;
      textRef.current = "";
      if (textInputRef) textInputRef.current.clear();
      await setDoc(
        doc(
          FIREBASE_DB,
          "gameRooms",
          gameRoomID,
          "privateChat",
          combinedGameRoomID
        ),
        {
          participants: [user.uid, item.uid],
          participantMap: { [user.uid]: true, [item.uid]: true },
          createdBy: user.uid,
          createdAt: serverTimestamp(),
          lastMessage: text,
          lastMessageAt: serverTimestamp(),
          lastSenderId: user.uid,
        },
        { merge: true }
      );

      await addDoc(
        collection(
          FIREBASE_DB,
          "gameRooms",
          gameRoomID,
          "privateChat",
          combinedGameRoomID,
          "messages"
        ),
        {
          text,
          sentFrom: user.uid,
          sentTo: item.uid,
          createdAt: serverTimestamp(),
          userName: user.displayName,
          userProfilePicture: user.photoURL,
          userFactionColor,
        }
      );

      setIsSendMessage(false);
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (!gameRoomID) return;
    let combinedGameRoomID = getCombinedGameRoomID({ user, item });
    const messageRef = collection(
      FIREBASE_DB,
      "gameRooms",
      gameRoomID,
      "privateChat",
      combinedGameRoomID,
      "messages"
    );
    const q = query(messageRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (docSnap) => {
      let messages = docSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(messages);
    });
    return unsubscribe;
  }, [gameRoomID, user, item]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <HeaderComponent
        text={item.displayName}
        NavToWhere="Chat"
        color={item.userFactionColor}
        image={item.profile}
      />
      <View
        style={{
          width: "95%",
          height: 2,
          alignSelf: "center",
          backgroundColor: Colors.underTextGray,
        }}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          ref={scrollViewRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item.text}
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
          onPress={async () => await createPrivateChatRoom()}
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
