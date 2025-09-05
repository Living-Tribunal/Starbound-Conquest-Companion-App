import { useState, useEffect, useRef, useCallback } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { useFocusEffect } from "@react-navigation/native";
import { collection, doc, getDoc, query, where } from "firebase/firestore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function sendPushNotification(
  expoPushToken: string,
  playerGameRoomID: string,
  user: any
) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Starbound Conquest",
    body: `${user?.displayName} has ended their turn! in game room ${playerGameRoomID}`,
    data: { someData: "goes here" },
  };
  console.log(
    `${JSON.stringify(message, null, 2)} to ${
      user?.displayName
    } in game room ${playerGameRoomID}`
  );

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

export default function PushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const { playerGameRoomID } = useStarBoundContext();
  const user = FIREBASE_AUTH.currentUser;
  console.log("User:", user);
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  useFocusEffect(
    useCallback(() => {
      //setGameSectors(null);

      const getUserData = async () => {
        try {
          const user = FIREBASE_AUTH.currentUser;
          if (!user) return;

          const shipsRef = query(
            collection(FIREBASE_DB, "users", user.uid, "ships"),
            where("playerGameRoomID", "==", playerGameRoomID)
          );
          const docRef = doc(FIREBASE_DB, "users", user.uid);
          //console.log("Ship Counts:", numberOfShips);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Profile Image In Player:", data.playerGameRoomID);
          }
        } catch (error) {
          console.error("Failed to retrieve user data:", error);
        }
      };
      getUserData();
    }, [])
  );

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}
    >
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken, playerGameRoomID, user);
        }}
      />
    </View>
  );
}
