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
import React, { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import DropdownComponent from "../../components/dropdown/DropdownComponent";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { getAuth, updateProfile, deleteUser } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider.js";
import Toast from "react-native-toast-message";
import ImagePicker from "../../components/picker/ImagePicker.js";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";

export default function Settings() {
  const auth = getAuth();
  const user = auth.currentUser;
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
  } = useStarBoundContext();
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusValue, setIsFocusValue] = useState(false);

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

  const checkForUsernamePhotoFaction = () => {
    if (!username || !profile) {
      // Check for empty fields
      showErrorToast(); // Show error if any field is empty
      return false;
    } else {
      showToast();
      saveName();
      saveProfile();
      saveUsername();
      saveGameValue();
      saveFaction();
      return true;
    }
  };

  const saveName = async () => {
    try {
      await AsyncStorage.setItem("UserName", username);
      setUsername(username);
    } catch (e) {
      console.error("Error saving name:", e);
    }
  };

  const dataWarning = () => {
    if (!serverConnected) {
      return (
        <View style={{ marginBottom: 5, marginTop: 5, flexDirection: "row" }}>
          <Text style={styles.TextStatus}>Server Status: </Text>
          <Text style={styles.statusOffline}>Disconnected</Text>
        </View>
      );
    } else {
      return (
        <View style={{ marginBottom: 5, marginTop: 5, flexDirection: "row" }}>
          <Text style={styles.TextStatus}>Server Status: </Text>
          <Text style={styles.statusOnline}>Connected</Text>
        </View>
      );
    }
  };

  /*   const deleteAuthUser = async () => {
    deleteUser(user)
      .then(() => {
        // User deleted.
      })
      .catch((error) => {
        // An error ocurred
        // ...
      });
  }; */

  const saveUsername = async () => {
    if (!auth.currentUser) {
      console.warn("No user is authenticated.");
      return;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: profile,
      });
      console.log(profile, username, "were saved to Auth");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem("ProfilePicture", profile);
      console.log(profile, "was saved");
    } catch (e) {
      console.error("Error saving name:", e);
    }
  };

  const saveFaction = async () => {
    try {
      await AsyncStorage.setItem("Faction", faction);
      console.log(faction, "was saved");
    } catch (e) {
      console.error("Error saving faction:", e);
    }
  };

  const saveGameValue = async () => {
    // Ensure faction is not null or undefined
    try {
      await AsyncStorage.setItem("GameValue", gameValue);
      console.log(gameValue, "was saved");
    } catch (e) {
      console.error("Error saving faction:", e);
    }
  };

  const getGameValue = async () => {
    try {
      const gameMaxValue = await AsyncStorage.getItem("GameValue");
      setGameValue(gameMaxValue || 0);
    } catch (e) {
      console.error("Error getting faction:", e);
    }
  };
  const getFaction = async () => {
    try {
      const faction = await AsyncStorage.getItem("Faction");
      setFaction(faction);
    } catch (e) {
      console.error("Error getting faction:", e);
    }
  };

  const getProfile = async () => {
    try {
      const profilePicture = await AsyncStorage.getItem("ProfilePicture");
      setProfile(profilePicture);
    } catch (e) {
      console.error("Error getting name:", e);
    }
  };

  const getName = async () => {
    try {
      const name = await AsyncStorage.getItem("UserName");
      setUsername(name);
    } catch (e) {
      console.error("Error getting name:", e);
    }
    ProfilePicture;
  };

  const deleteAsync = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error("Error deleting data:", e);
    }
  };

  useEffect(() => {
    getName();
    getGameValue();
    getProfile();
    getFaction();
  }, []);

  const deleteName = async () => {
    try {
      await AsyncStorage.removeItem("UserName");
      setUsername(""); // Reset state
    } catch (e) {
      console.error("Error deleting name:", e);
    }
  };

  const deleteFaction = async () => {
    try {
      await AsyncStorage.removeItem("Faction");
      setFaction("Nova Raiders"); // Default fallback
    } catch (e) {
      console.error("Error deleting faction:", e);
    }
  };

  const deleteProfilePicture = async () => {
    try {
      await AsyncStorage.removeItem("ProfilePicture");
      setProfile(""); // Reset profile state
    } catch (e) {
      console.error("Error deleting profile picture:", e);
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

  const renderLabelGameValue = () => {
    if (isFocusValue) {
      /*  console.log(isFocus); */
      return (
        <Text style={[styles.label, isFocusValue && { color: Colors.hud }]}>
          Enter Max Value
        </Text>
      );
    }
    return null;
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
                Enter or update your username below and tap 'Save' to update it.
                You can also remove your username if necessary. Don’t forget to
                select your profile picture. Additionally, you have the option
                to log out or permanently delete your account. Please note that
                once deleted, your account cannot be recovered.
              </Text>
            </View>
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {dataWarning()}
            <Text style={styles.text1}>Logged In Email: {email}</Text>
            <ImagePicker />
            <View width="100%">
              <DropdownComponent />
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ width: "45%", position: "relative" }}>
                {renderLabel()}
                <TextInput
                  maxLength={18}
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
              <View style={{ width: "45%", position: "relative" }}>
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
            {/* <View style={{ width: "100%" }}>
              <DropdownComponent />
            </View> */}

            <View style={styles.heroModalContainerButtons}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  checkForUsernamePhotoFaction();
                }}
              >
                <Image
                  source={require("../../assets/icons/icons8-save-50.png")}
                  style={{
                    width: 25,
                    height: 25,
                    marginTop: 5,
                  }}
                />
                <Image
                  style={{ width: 60, height: 60, position: "absolute" }}
                  source={require("../../assets/images/edithud.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={toastNotification}
                onLongPress={() => {
                  deleteFaction();
                  deleteName();
                  deleteProfilePicture();
                  /*  deleteAuthUser(); */
                }}
              >
                <Image
                  source={require("../../assets/icons/delete50.png")}
                  style={{
                    width: 25,
                    height: 25,
                    marginTop: 5,
                  }}
                />
                <Image
                  style={{ width: 60, height: 60, position: "absolute" }}
                  source={require("../../assets/images/edithud.png")}
                />
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
    color: Colors.white,
    fontSize: 28,
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
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
    width: 75,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: "center",
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
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.hud,
    color: Colors.hud,
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 8,
  },
  text1: {
    color: Colors.hud,
    fontFamily: "monospace",
    fontSize: 12,
    padding: 5,
    textAlign: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
    backgroundColor: Colors.hudDarker,
    marginBottom: 20,
  },
  statusOnline: {
    fontSize: 12,
    color: Colors.hud,
    fontFamily: "monospace",
    textAlign: "center",
    fontWeight: "bold",
    borderRadius: 5,
    borderWidth: 1,
    color: Colors.darker_green_toggle,
    borderColor: Colors.darker_green_toggle,
    backgroundColor: Colors.green_toggle,
    padding: 3,
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  statusOffline: {
    fontSize: 12,
    color: Colors.deep_red,
    backgroundColor: Colors.lightened_deep_red,
    fontWeight: "bold",
    fontFamily: "monospace",
    textAlign: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.deep_red,
    padding: 3,
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
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
});
