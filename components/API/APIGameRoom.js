import { collection, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "@/FirebaseConfig";

export const getAllShipsInGameRoom = async ({
  gameRoom,
  setData,
  setLoading,
  gameSectors,
}) => {
  const user = FIREBASE_AUTH.currentUser;
  console.log("Game Sectors in API:", gameSectors);
  if (!user || !gameRoom) return;

  try {
    setLoading(true);
    const usersQuery = query(
      collection(FIREBASE_DB, "users"),
      where("gameRoom", "==", gameRoom)
    );

    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const allShips = [];

    for (const user of users) {
      const shipCollection = collection(FIREBASE_DB, "users", user.id, "ships");
      const shipsSnapshot = await getDocs(shipCollection);

      const userShips = shipsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          userId: user.id,
          displayName: user.displayName,
          factionName: user.factionName,
          factionColor: user.userFactionColor,
          ...doc.data(),
        }))
        .filter((ship) => ship.gameSector === gameSectors);

      allShips.push(...userShips);
    }

    setData(allShips);
    //console.log("✅ Loaded ships for all players in room:", allShips.length);
  } catch (e) {
    console.error("❌ Failed to get all ships:", e);
  } finally {
    setLoading(false);
  }
};
