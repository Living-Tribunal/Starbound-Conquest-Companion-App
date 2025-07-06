import { collection, query, where, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "@/FirebaseConfig";

export const getAllShipsInGameRoom = ({
  gameRoom,
  gameSectors,
  setData,
  setLoading,
}) => {
  const user = FIREBASE_AUTH.currentUser;
  if (!user || !gameRoom) return;

  if (setLoading) setLoading(true);
  const shipUnsubs = [];

  const usersQuery = query(
    collection(FIREBASE_DB, "users"),
    where("gameRoom", "==", gameRoom)
  );

  const unsubscribeUsers = onSnapshot(usersQuery, (userSnapshot) => {
    // Cleanup old listeners
    shipUnsubs.forEach((u) => u());
    shipUnsubs.length = 0;

    let allShips = [];

    userSnapshot.forEach((userDoc) => {
      const uid = userDoc.id;
      const userData = userDoc.data();

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

        // Replace any previous ships from this user
        allShips = allShips.filter((s) => s.userId !== uid).concat(userShips);
        setData([...allShips]);
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
