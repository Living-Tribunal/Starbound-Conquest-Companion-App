import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FIREBASE_DB } from "../../FirebaseConfig";
import Toast from "react-native-toast-message";

export const startGame = async (gameRoomID) => {
  console.log("Saving game:", gameRoomID);
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
