import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useCallback, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useStarBoundContext } from "@/components/Global/StarBoundProvider";

export default function API() {
  const {
    data,
    setData,
    email,
    setEmail,
    serverConnected,
    setServerConnected,
  } = useStarBoundContext();

  const auth = getAuth();

  // Get authenticated user's email
  useEffect(() => {
    const userInformation = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.uid);

        // Load saved fleet data
        const savedData = await AsyncStorage.getItem(`fleetData_${user.uid}`);
        if (savedData) {
          setData(JSON.parse(savedData)); // Set cached data
        }

        // Fetch fresh data
        getUserFleetData(user.uid);
      } else {
        setEmail(null);
        setData([]); // Clear data on logout
      }
    });

    return () => userInformation();
  }, []);

  // Fetch fleet data and store in AsyncStorage
  const getUserFleetData = useCallback(
    async (userID) => {
      if (!userID) return;

      const userShipsURL = `https://starboundconquest.com/user-ships/${userID}`;
      /* console.log("Your email in the API:", userID); */

      try {
        const response = await fetch(userShipsURL);
        const json = await response.json();

        if (JSON.stringify(json.ships) !== JSON.stringify(data)) {
          setData(json.ships);

          // Store in AsyncStorage
          await AsyncStorage.setItem(
            `fleetData_${userID}`,
            JSON.stringify(json.ships)
          );
        }
        setServerConnected(true);
      } catch (error) {
        console.error("Error fetching user fleet data:", error);
        setServerConnected(false);
      }
    },
    [data]
  );

  // Fetch periodically (every 5 seconds)
  useEffect(() => {
    if (!email) return;

    const intervalCall = setInterval(() => getUserFleetData(email), 500000); // Fetch every 5 seconds

    return () => clearInterval(intervalCall); // Cleanup interval
  }, [email, data]);

  return null; // Your UI components here
}
