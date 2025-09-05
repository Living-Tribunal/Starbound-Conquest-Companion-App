import { collection, query, where, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "@/FirebaseConfig";
import { useEffect, useState } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function useAllUsersAndDataFromGameRoom(playerGameRoomID) {
  const [playersInGameRoom, setPlayersInGameRoom] = useState([]);
  const [getAllUsersShipToggled, setGetAllUsersShipToggled] = useState([]);
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (!user) return;
    if (!playerGameRoomID) return;

    const userShipUnsubs = [];
    const allShipMap = {};

    const usersRef = collection(FIREBASE_DB, "users");
    const unsubscribeUsers = onSnapshot(usersRef, (userSnapshot) => {
      // Clear previous listeners
      userShipUnsubs.forEach((unsub) => unsub());
      userShipUnsubs.length = 0;

      // Reset temp storage
      Object.keys(allShipMap).forEach((key) => delete allShipMap[key]);

      const activePlayers = [];

      userSnapshot.docs.forEach((userDoc) => {
        const uid = userDoc.id;
        const userData = userDoc.data();
        if (userData.playerGameRoomID === playerGameRoomID) {
          activePlayers.push({
            uid,
            displayName: userData.displayName,
            userFactionColor: userData.userFactionColor || "#FFFFFF",
            photoURL: userData.photoURL || "",
          });
        }

        const shipsRef = collection(FIREBASE_DB, "users", uid, "ships");
        const shipsQuery = query(
          shipsRef,
          where("playerGameRoomID", "==", playerGameRoomID)
        );

        const unsub = onSnapshot(shipsQuery, (shipsSnap) => {
          const userShips = shipsSnap.docs.map((doc) => doc.data());

          allShipMap[uid] = userShips;

          // Flatten and update
          const allShips = Object.values(allShipMap).flat();
          setGetAllUsersShipToggled(allShips);
        });

        userShipUnsubs.push(unsub);
      });
      setPlayersInGameRoom(activePlayers);
    });
    return () => {
      unsubscribeUsers();
      userShipUnsubs.forEach((unsub) => unsub());
    };
  }, [playerGameRoomID]);
  return { playerGameRoomID, playersInGameRoom, getAllUsersShipToggled };
}
