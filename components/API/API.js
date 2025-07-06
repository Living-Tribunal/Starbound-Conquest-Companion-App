import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getFleetData = ({ data, setData }) => {
  const user = FIREBASE_AUTH.currentUser;

  if (user) {
    try {
      const shipReference = collection(FIREBASE_DB, "users", user.uid, "ships");

      const unsubscribe = onSnapshot(shipReference, async (querySnapshot) => {
        const ships = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        //console.log("Ships: ", JSON.stringify(ships, null, 2));
        setData(ships);
        if (JSON.stringify(ships) !== JSON.stringify(data)) {
          // Store in AsyncStorage
          await AsyncStorage.setItem(
            `fleetData_${user.uid}`,
            JSON.stringify(ships)
          );
        }
      });
      // console.log("Saved to AsyncStorage: ", JSON.stringify(ships, null, 2));
      return unsubscribe;
      // console.log("Total ships: ", totalShips.data().count);
    } catch (e) {
      console.error("Error fetching fleet data: ", e);
    }
  }
};
