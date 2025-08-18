import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FIREBASE_DB } from "../../FirebaseConfig";
import Toast from "react-native-toast-message";

export const startGame = async (gameRoomID, playersInGameRoom) => {
  console.log("Saving game:", gameRoomID);
  if (playersInGameRoom.length <= 1) {
    Toast.show({
      type: "error",
      text1: "StarBound Conquest",
      text2: "You need at least 2 players to start a game.",
      position: "top",
    });
    return;
  }
  try {
    const gameRoomRef = doc(FIREBASE_DB, "gameRooms", gameRoomID);
    await updateDoc(gameRoomRef, {
      started: true,
      startTime: serverTimestamp(),
    });
    Toast.show({
      type: "success",
      text1: "StarBound Conquest",
      text2: "Game Started!",
      position: "top",
      visibilityTime: 2000,
    });
  } catch (e) {
    console.error("Error updating game room ID:", e);
  }
};
