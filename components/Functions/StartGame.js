import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FIREBASE_DB } from "../../FirebaseConfig";
import Toast from "react-native-toast-message";

export const stopGame = async (playerGameRoomID, getAllUsersShipToggled) => {
  // console.log("Get All Users Ship Toggled in Stop:", getAllUsersShipToggled);
  if (getAllUsersShipToggled.length >= 1) {
    Toast.show({
      type: "error",
      text1: "StarBound Conquest",
      text2: "Unable to stop a game with ships on the field.",
      position: "top",
    });
    return;
  }
  try {
    const gameRoomRef = doc(FIREBASE_DB, "gameRooms", playerGameRoomID);
    await updateDoc(gameRoomRef, {
      started: false,
      startTime: serverTimestamp(),
    });
    Toast.show({
      type: "success",
      text1: "StarBound Conquest",
      text2: "Game Stopped!",
      position: "top",
      visibilityTime: 2000,
    });
  } catch (e) {
    console.error("Error updating game room ID:", e);
  }
};

export const startGame = async (playerGameRoomID, playersInGameRoom) => {
  console.log("Saving game:", playerGameRoomID);
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
    const gameRoomRef = doc(FIREBASE_DB, "gameRooms", playerGameRoomID);
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
