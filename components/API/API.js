import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { collection, getDocs, getCountFromServer } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getFleetData = async ({ data, setData }) => {
  const user = FIREBASE_AUTH.currentUser;

  if (user) {
    try {
      const shipReference = collection(FIREBASE_DB, "users", user.uid, "ships");
      const querySnapshot = await getDocs(shipReference);
      const ships = querySnapshot.docs.map((doc) => doc.data());
      //console.log("Ships: ", JSON.stringify(ships, null, 2));
      setData(ships);
      if (JSON.stringify(ships) !== JSON.stringify(data)) {
        // Store in AsyncStorage
        await AsyncStorage.setItem(
          `fleetData_${user.uid}`,
          JSON.stringify(ships)
        );
      }
      // console.log("Saved to AsyncStorage: ", JSON.stringify(ships, null, 2));
      const totalShips = await getCountFromServer(shipReference);
      // console.log("Total ships: ", totalShips.data().count);
    } catch (e) {
      console.error("Error fetching fleet data: ", e);
    }
  }
};
