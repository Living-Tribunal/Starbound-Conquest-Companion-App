import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Colors } from "@/constants/Colors";
import useMyTurn from "../../components/Functions/useMyTurn";
import {
  updateDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownComponentFactions from "../../components/dropdown/DropdownComponentFactions";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { updateProfile } from "firebase/auth";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider.js";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import ImagePicker from "../../components/picker/ImagePicker.js";
import {
  GoogleAuthProvider,
  signInWithCredential,
  reload,
} from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ColorPickerComponent from "../../components/ColorPicker/ColorPicker";
import SetupGameRoom from "../../app/screens/SetupGameRoom";

export default function Settings() {
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();
  GoogleSignin.configure({
    webClientId:
      "633304307229-acjrh8tpf2eddgdjcutludsg7vqf1pru.apps.googleusercontent.com",
  });

  const {
    username,
    setUsername,
    faction,
    setFaction,
    profile,
    setProfile,
    gameValue,
    setGameValue,
    userProfilePicture,
    data,
    userFactionColor,
    setUserFactionColor,
    gameRoomID,
    setGameRoomID,
  } = useStarBoundContext();
  const [isFocus, setIsFocus] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [showGameRoomModal, setShowGameRoomModal] = useState(false);
  const [isJoiningGameRoom, setIsJoiningGameRoom] = useState(false);
  const [gameRoomUserID, setGameRoomUserID] = useState("");
  const { state: gameState } = useMyTurn(gameRoomID);

  const toastNotification = () => {
    Toast.show({
      type: "error",
      text1: "StarBound Conquest",
      text2: "If you are sure LongPress the button to delete.",
      duration: 3000,
      text1Style1: { fontFamily: "monospace", fontSize: 40 },
      text2Style1: { fontFamily: "monospace", fontSize: 15 },
      autoHide: true,
    });
  };

  const showErrorToast = () => {
    Toast.show({
      type: "error",
      text1: "StarBound Conquest",
      text2: "You must select a profile picture, faction, and color.",
    });
  };

  const showErrorLogout = () => {
    Toast.show({
      type: "error",
      text1: "StarBound Conquest",
      text2: "Long Press the button to logout.",
    });
  };

  const checkForUsernamePhotoFaction = async () => {
    console.log(
      "Profile, Faction, and Faction Color:",
      userProfilePicture,
      faction,
      userFactionColor
    );
    if (!userProfilePicture || !faction || !userFactionColor) {
      showErrorToast();
      return false;
    } else {
      updateUserProfile();
      return true;
    }
  };

  //getting the logged in user data
  useFocusEffect(
    useCallback(() => {
      const getUserData = async () => {
        try {
          if (!user) return;

          const docRef = doc(FIREBASE_DB, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            //console.log("User Data:", data);
            setUsername(data.displayName || "");
            setProfile(data.photoURL || "");
            setFaction(data.factionName || "");
            setUserFactionColor(data.userFactionColor || "");
            setGameRoomUserID(data.gameRoomID || "");
            /* console.log(
              "User in GameRoomID Settings:",
              JSON.stringify(gameRoomUserID, null, 2)
            ); */
            //console.log("User in game roomm id in Settings:", gameRoomID);
          }
        } catch (error) {
          console.error("Failed to retrieve user data:", error);
        }
      };

      //console.log("User profile Image: ", profile);

      getUserData();
    }, [])
  );

  async function updateGameRoomId(gameRoomID) {
    const uid = FIREBASE_AUTH.currentUser?.uid;
    if (!uid) return;

    /*     const trimmedNewId = String(newId).trim();
    if (!trimmedNewId) return; */

    try {
      const userRef = doc(FIREBASE_DB, "users", FIREBASE_AUTH.currentUser.uid);
      await updateDoc(userRef, {
        gameRoomID: gameRoomID,
        gameRoomAdmin: !isJoiningGameRoom,
      });

      const gameRoomRef = doc(FIREBASE_DB, "gameRooms", gameRoomID);
      //console.log("Game Room Ref:", gameRoomRef);
      const snap = await getDoc(gameRoomRef);
      //console.log("Snap:", snap.exists());

      //if this fails, it means the game room already exists
      //it will do this the first time a game room is created
      //this is also the path for a new game room
      if (!snap.exists()) {
        await setDoc(gameRoomRef, {
          createdBy: uid,
          createdAt: serverTimestamp(),
          started: false,
          turnOrder: [uid],
          currentTurnIndex: 0,
          currentTurnUid: { uid, username },
          gameValue: String(gameValue ?? ""),
          turnOrder: [{ uid, username, profile, userFactionColor }],
        });
      } else {
        //this is the path for someone to join an existing game room
        await updateDoc(gameRoomRef, {
          turnOrder: arrayUnion({ uid, username, profile, userFactionColor }),
        });
      }
      console.log("Game Room Created:", gameRoomID);
    } catch (e) {
      console.error("Error updating game room ID:", e);
    }
  }
  const updateUserProfile = async (gameRoomID) => {
    if (!user) return;
    setUpdatingProfile(true);
    try {
      await reload(user);

      const finalPhotourl = userProfilePicture?.trim()
        ? userProfilePicture
        : profile;

      await updateProfile(user, {
        displayName: username,
        photoURL: finalPhotourl,
      });

      const userDocRef = doc(
        FIREBASE_DB,
        "users",
        FIREBASE_AUTH.currentUser.uid
      );
      //console.log("Game Room ID Being Saved:", gameRoomID);
      await updateDoc(userDocRef, {
        displayName: username ?? "",
        photoURL: finalPhotourl ?? "",
        factionName: String(faction ?? ""),
        email: user.email ?? "",
        userFactionColor: userFactionColor ?? "",
      });
      setUpdatingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const deleteAsync = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error("Error deleting data:", e);
    }
  };

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();
      console.log("SignIn Result:", signInResult);

      let idToken = signInResult.data?.idToken;

      if (!idToken) {
        console.error("No ID Token found");
        throw new Error("No ID Token found");
      }

      // Create credential with the modular SDK
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Use your existing FIREBASE_AUTH from config
      return signInWithCredential(FIREBASE_AUTH, googleCredential);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Google Sign-In Failed");
    }
  }

  const handleAccountDeletion2 = async () => {
    Alert.alert(
      "Warning",
      "Before you can delete your account, please reauthenticate your account before proceeding with deletion. Remember, this cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Delete", onPress: () => handleAccountDeletion() },
        { text: "Reauthenticate", onPress: () => onGoogleButtonPress() },
      ]
    );
  };

  const handleAccountDeletion = async () => {
    try {
      if (FIREBASE_AUTH.currentUser) {
        await FIREBASE_AUTH.currentUser.delete();
      }
      await deleteAsync();
      console.log("Account deleted successfully.");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const renderLabel = () => {
    if (isFocus) {
      console.log(isFocus);
      return (
        <Text style={[styles.label, isFocus && { color: Colors.hud }]}>
          Enter a Username
        </Text>
      );
    }
    return null;
  };

  if (updatingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          style={{ width: "80%", height: "22%" }}
          source={require("../../assets/images/SC_logo1.png")}
        />
        <Text style={[styles.text1, { fontSize: 20 }]}>
          Updating your profile...
        </Text>
      </View>
    );
  }

  //instead of just opening the modal, prompt the user to change the game room id
  const handleOpenGameRoom = () => {
    if (gameRoomID) {
      Alert.alert(
        "Game Room Exists",
        "You already have a Game Room. Do you want to modify it?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Yes", onPress: () => setShowGameRoomModal(true) },
        ]
      );
    } else {
      setShowGameRoomModal(true);
      setIsJoiningGameRoom(false);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log("Signing out...");
      await FIREBASE_AUTH.signOut();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  /* console.log("profile picture is in Logout Screen:", profile); 
  console.log("User Faction Color Here:", userFactionColor);*/

  return (
    <SafeAreaView style={[styles.mainContainer]}>
      <ScrollView keyboardShouldPersistTaps="never">
        <View style={styles.container}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                height: "100%",
              }}
            >
              <Text style={styles.subHeaderText}>
                Fill in or update your details below, then{" "}
                <Text
                  style={{
                    color: Colors.green_toggle,
                    fontWeight: "bold",
                    fontSize: 9,
                  }}
                >
                  tap Save to confirm your changes.
                </Text>{" "}
                Be sure to choose your faction, game room, and faction color,
                set your game limit value, and select a profile picture.
              </Text>
            </View>
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ImagePicker factionColor={userFactionColor} />
            {!data.length ? (
              <View
                width="100%"
                style={{
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <ColorPickerComponent
                  userFactionColor={userFactionColor}
                  setUserFactionColor={setUserFactionColor}
                />
                <View
                  style={{
                    gap: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    style={styles.gameRoomButton}
                    onPress={handleOpenGameRoom}
                  >
                    <Text
                      style={[
                        styles.gameRoomID,
                        { fontSize: gameRoomID ? 10 : 15 },
                      ]}
                    >
                      {gameRoomID
                        ? "Game Room ID: " + gameRoomID
                        : "Tap to create/join a game room"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <DropdownComponentFactions />

                {/* <DropdownComponentCampaigns /> */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "center",
                  }}
                >
                  <View style={{ width: "95%", position: "relative" }}>
                    {renderLabel()}
                    <TextInput
                      autoCorrect={false}
                      spellCheck={false}
                      style={styles.textInput}
                      onChangeText={(text) => {
                        setUsername(text.trimStart());
                      }}
                      placeholder={!isFocus ? "Username" : ""}
                      value={username}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.text1}>
                  You have a fleet! You can't change your faction, game room or
                  color until you remove all ships and try again.
                </Text>
              </View>
            )}
            <View style={styles.heroModalContainerButtons}>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  await checkForUsernamePhotoFaction();
                }}
              >
                <Text style={[styles.title]}>Save User Info</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.TouchableOpacityContainer}>
            <TouchableOpacity
              onPress={showErrorLogout}
              onLongPress={handleSignOut}
              style={styles.logoutButton}
            >
              <Text
                style={{
                  color: Colors.green_toggle,
                  fontFamily: "LeagueSpartan-Bold",
                  fontSize: 20,
                  textAlign: "center",
                  padding: 5,
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onLongPress={handleAccountDeletion2}
              style={styles.deleteButton}
              onPress={toastNotification}
            >
              <Text
                style={{
                  color: Colors.lighter_red,
                  fontFamily: "LeagueSpartan-Bold",
                  fontSize: 20,
                  textAlign: "center",
                  padding: 5,
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <SetupGameRoom
          showGameRoomModal={showGameRoomModal}
          handleOpenGameRoom={handleOpenGameRoom}
          setShowGameRoomModal={setShowGameRoomModal}
          handleSaveGameRoom={updateGameRoomId}
          setIsJoiningGameRoom={setIsJoiningGameRoom}
          isJoiningGameRoom={isJoiningGameRoom}
          gameValue={gameValue}
          setGameValue={setGameValue}
          gameRoomUserID={gameRoomUserID}
          setGameRoomUserID={setGameRoomUserID}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  title: {
    color: Colors.hudDarker,
    fontSize: 15,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Bold",
  },
  text: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "aboreto",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
    justifyContent: "center",
    alignContent: "center",
  },
  resetText: {
    fontSize: 16,
    fontFamily: "monospace",
    fontWeight: "bold",
    textAlign: "center",
  },
  resetbutton: {
    justifyContent: "space-evenly",
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    margin: 10,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: Colors.white,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  subHeaderText: {
    fontFamily: "monospace",
    color: Colors.white,
    fontSize: 9,
    textAlign: "center",
    backgroundColor: Colors.underTextGray,
    borderRadius: 5,
    padding: 5,
  },
  textInput: {
    height: 50,
    borderColor: Colors.hud,
    borderWidth: 1,
    marginBottom: 10,
    color: Colors.hud,
    fontFamily: "monospace",
    fontSize: 13,
    borderRadius: 5,
    backgroundColor: Colors.hudDarker,
    paddingHorizontal: 10,
  },
  button: {
    width: "50%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.hud,
    borderRadius: 3,
    backgroundColor: Colors.hud,
  },
  heroModalContainerButtons: {
    flexDirection: "row",
    backgroundColor: Colors.dark_gray,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  TouchableOpacityContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 50,
  },
  deleteButton: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.lighter_red,
    borderRadius: 3,
    backgroundColor: Colors.deep_red,
    width: "45%",
  },
  logoutButton: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.green_toggle,
    borderRadius: 3,
    backgroundColor: Colors.darker_green_toggle,
    width: "45%",
  },
  label: {
    position: "absolute",
    backgroundColor: Colors.dark_gray,
    left: 10,
    top: -15,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 12,
    borderWidth: 3,
    borderRadius: 3,
    borderColor: Colors.hud,
    color: Colors.hud,
    borderWidth: 2,
    borderRadius: 3,
    paddingHorizontal: 8,
  },
  text1: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Light",
    fontSize: 12,
    padding: 5,
    textAlign: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
    backgroundColor: Colors.hudDarker,
    marginBottom: 10,
    marginTop: 10,
  },
  TextStatus: {
    fontSize: 12,
    color: Colors.hud,
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark_gray,
  },
  buttonDisabled: {
    width: "50%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.hud,
    borderRadius: 3,
    backgroundColor: Colors.hudDarker,
    opacity: 0.5,
  },
  titleDisabled: {
    color: Colors.hud,
    fontSize: 15,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Bold",
  },
  title: {
    color: Colors.hudDarker,
    fontSize: 15,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Bold",
  },
  gameRoomID: {
    color: Colors.hudDarker,
    fontSize: 10,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Bold",
  },
  gameRoomButton: {
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
    borderRadius: 3,
    backgroundColor: Colors.hud,
    padding: 5,
    marginBottom: 15,
  },
});
