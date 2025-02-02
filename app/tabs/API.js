import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useStarBoundContext } from "@/components/Global/StarBoundProvider";

export default function API() {
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const { data, setData } = useStarBoundContext();

  const auth = getAuth();

  // Get authenticated user's email
  useEffect(() => {
    const userInformation = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email);
        setUsername(user.email);
        console.log("User email:", user.email);

        // Load saved fleet data
        const savedData = await AsyncStorage.getItem(`fleetData_${user.email}`);
        if (savedData) {
          setData(JSON.parse(savedData)); // Set cached data
        }

        // Fetch fresh data
        getUserFleetData();
      } else {
        setEmail(null);
        setUsername(null);
        setData([]); // Clear data on logout
      }
    });

    return () => userInformation();
  }, []);

  // Fetch fleet data and store in AsyncStorage
  const getUserFleetData = useCallback(async () => {
    if (!username) return;

    const userShipsURL = `https://starboundconquest.com/user-ships/${username}`;

    try {
      const response = await fetch(userShipsURL);
      const json = await response.json();

      if (JSON.stringify(json.ships) !== JSON.stringify(data)) {
        setData(json.ships);

        // Store in AsyncStorage
        await AsyncStorage.setItem(`fleetData_${username}`, JSON.stringify(json.ships));
      }
    } catch (error) {
      console.error("Error fetching user fleet data:", error);
    } 
  }, [username, data]);

  // Fetch periodically (every 5 seconds)
  useEffect(() => {
    if (!username) return;

    const intervalCall = setInterval(getUserFleetData, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalCall); // Cleanup interval
  }, [username, data]);

  return null; // Your UI components here
}

