import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getFleetData = async ({
  data,
  setData,
  gameRoom,
  gameSectors,
}) => {
  const user = FIREBASE_AUTH.currentUser;

  if (!user || !gameRoom || !gameSectors) return;

  try {
    const shipQuery = query(
      collection(FIREBASE_DB, "users", user.uid, "ships"),
      where("gameRoomID", "==", gameRoom),
      where("gameSector", "==", gameSectors)
    );

    const querySnapshot = await getDocs(shipQuery);

    const ships = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setData(ships);

    // Store in AsyncStorage if changed
    if (JSON.stringify(ships) !== JSON.stringify(data)) {
      await AsyncStorage.setItem(
        `fleetData_${user.uid}`,
        JSON.stringify(ships)
      );
    }
  } catch (e) {
    console.error("Error fetching fleet data: ", e);
  }
};
