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
import { getAuth } from "firebase/auth";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import DropdownComponentFactions from "../../components/dropdown/DropdownComponentFactions";
import DropdownComponentCampaigns from "../../components/dropdown/DropdownComponentCampaigns";
import { FIREBASE_AUTH, FIREBASE_STORE, FIREBASE_DB } from "@/FirebaseConfig";
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
    email,
    serverConnected,
    gameValue,
    setGameValue,
    userProfilePicture,
    setUserProfilePicture,
    data,
    gameRoom,
    setGameRoom,
    userFactionColor,
    setUserFactionColor,
  } = useStarBoundContext();
  const [isFocus, setIsFocus] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [isFocusValue, setIsFocusValue] = useState(false);
  /*   console.log("User Selected Profile Picture In Settings:", userProfilePicture);
  console.log("Characther Creation Picture In Settings:", profile); */

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "StarBound Conquest",
      text2: "Saved!",
    });
  };

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
      text2: "Check Your Fields!",
    });
  };

  const checkForUsernamePhotoFaction = async () => {
    if (!username) {
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
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) return;

          const docRef = doc(FIREBASE_DB, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            //console.log("User Data:", data);
            setUsername(data.displayName || "");
            setProfile(data.photoURL || "");
            setFaction(data.factionName || "");
            setGameValue(data.gameValue || "");
            setGameRoom(data.gameRoom || "");
            setUserFactionColor(data.userFactionColor || "");
            console.log("User in Settings:", JSON.stringify(data, null, 2));
          }
        } catch (error) {
          console.error("Failed to retrieve user data:", error);
        }
      };

      //console.log("User profile Image: ", profile);

      getUserData();
    }, [])
  );

  //updating the logged in user profile
  const updateUserProfile = async () => {
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

      await updateDoc(userDocRef, {
        displayName: username,
        photoURL: finalPhotourl,
        factionName: String(faction),
        gameValue: String(gameValue),
        email: user.email,
        gameRoom: gameRoom,
        userFactionColor: userFactionColor,
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
      /*  console.log(isFocus); */
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

  const renderLabelGameValue = () => {
    if (isFocusValue) {
      /*  console.log(isFocus); */
      return (
        <Text style={[styles.label, isFocusValue && { color: Colors.hud }]}>
          Game Value
        </Text>
      );
    }
    return null;
  };

  const handleSignOut = async () => {
    try {
      console.log("Signing out...");
      await FIREBASE_AUTH.signOut();
      await AsyncStorage.clear();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  /* console.log("profile picture is in Logout Screen:", profile); */

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
                Enter or update your information below, then tap 'Save' to apply
                the changes. Make sure to select your faction, game room, and
                faction color, set your game value, and choose a profile
                picture.
              </Text>
            </View>
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {gameRoom ? (
              <Text style={styles.text1}>Game Room: {gameRoom}</Text>
            ) : (
              <Text style={styles.text1}>
                Game Room not selected, head over to Settings to pick one
              </Text>
            )}
            <ImagePicker />
            {!data.length ? (
              <View
                width="100%"
                style={{
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <ColorPickerComponent />
                <DropdownComponentFactions />
                <DropdownComponentCampaigns />
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

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ width: "68%", position: "relative" }}>
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
              <View style={{ width: "25%", position: "relative" }}>
                {renderLabelGameValue()}
                <TextInput
                  maxLength={12}
                  keyboardType="numeric"
                  style={styles.textInput}
                  onChangeText={(text) => {
                    setGameValue(text.trimStart());
                  }}
                  placeholder={!isFocusValue ? "Max Value" : ""}
                  value={gameValue}
                  onFocus={() => setIsFocusValue(true)}
                  onBlur={() => setIsFocusValue(false)}
                />
              </View>
            </View>

            <View style={styles.heroModalContainerButtons}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  checkForUsernamePhotoFaction();
                }}
              >
                <Text style={styles.title}>Save User Info</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.TouchableOpacityContainer}>
            <TouchableOpacity
              onPress={handleSignOut}
              style={styles.deleteButton}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontFamily: "monospace",
                  fontSize: 15,
                  textAlign: "center",
                  padding: 10,
                  top: 30,
                  zIndex: 100,
                }}
              >
                Logout
              </Text>
              <Image
                style={{
                  width: 160,
                  height: 100,
                  position: "absolute",
                }}
                source={require("../../assets/images/logout.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onLongPress={handleAccountDeletion2}
              style={styles.deleteButton}
              onPress={toastNotification}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontFamily: "monospace",
                  fontSize: 15,
                  textAlign: "center",
                  padding: 10,
                  top: 35,
                  zIndex: 100,
                }}
              >
                Delete
              </Text>
              <Image
                style={{ width: 130, height: 90, position: "absolute" }}
                source={require("../../assets/images/delete.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
    paddingBottom: 20,
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
  },
  textInput: {
    height: 50,
    borderColor: Colors.hud,
    borderWidth: 1,
    marginBottom: 10,
    color: Colors.hud,
    fontFamily: "monospace",
    fontSize: 16,
    borderRadius: 2,
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
    width: 100,
    alignItems: "center",
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
    borderWidth: 1,
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
});
