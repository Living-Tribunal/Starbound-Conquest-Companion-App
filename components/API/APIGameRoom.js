import { collection, query, where, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "@/FirebaseConfig";

export const getAllShipsInGameRoom = async ({
  playerGameRoomID,
  gameSectors,
  setData,
  setLoading,
}) => {
  const user = FIREBASE_AUTH.currentUser;
  if (!user) return;
  if (!playerGameRoomID) return;

  if (setLoading) setLoading(true);
  const shipUnsubs = [];

  const usersQuery = query(
    collection(FIREBASE_DB, "users"),
    where("playerGameRoomID", "==", playerGameRoomID)
  );

  // Store all ships per userId to rebuild a clean combined array
  const allShipsMap = new Map();

  const unsubscribeUsers = onSnapshot(usersQuery, (userSnapshot) => {
    shipUnsubs.forEach((u) => u());
    shipUnsubs.length = 0;

    userSnapshot.forEach((userDoc) => {
      const uid = userDoc.id;
      const userData = userDoc.data();
      const usernames = userSnapshot.docs.map((doc) => doc.data().displayName);
      //console.log("All players in room:", usernames);

      const shipsQuery = query(
        collection(FIREBASE_DB, "users", uid, "ships"),
        where("gameSector", "==", gameSectors)
      );

      const unsub = onSnapshot(shipsQuery, (shipsSnap) => {
        const userShips = shipsSnap.docs.map((doc) => ({
          id: doc.id,
          userId: uid,
          displayName: userData.displayName,
          factionName: userData.factionName,
          factionColor: userData.userFactionColor,
          ...doc.data(),
        }));

        // Save or update this user's ships
        allShipsMap.set(uid, userShips);

        // Combine all values from allShipsMap
        const combinedShips = Array.from(allShipsMap.values()).flat();
        setData(combinedShips);
        if (setLoading) setLoading(false);
      });

      shipUnsubs.push(unsub);
    });
  });

  return () => {
    unsubscribeUsers();
    shipUnsubs.forEach((u) => u());
  };
};
