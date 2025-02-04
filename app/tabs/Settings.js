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
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { getAuth, updateProfile, deleteUser  } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider.js";
import Toast from "react-native-toast-message";
import DropdownComponent from "../../components/dropdown/DropdownComponent.js";
import ImagePicker from "../../components/picker/ImagePicker.js";

export default function Settings() {
  const { username, setUsername, faction, setFaction, profile, setProfile } =
    useStarBoundContext();
  const [isFocus, setIsFocus] = useState(false);

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "StarBound Conquest",
      text2: "Username, Faction, and Profile Picture were Saved",
    });
  };

  const showErrorToast = () => {
    Toast.show({
      type: "error",
      text1: "StarBound Conquest",
      text2: "Check Your Fields.",
    });
  };

  const checkForUsernamePhotoFaction = () => {
    if (!username || !faction || !profile) { // Check for empty fields
      showErrorToast(); // Show error if any field is empty
      return false;
    } else {
      showToast();
      saveName();
      saveFaction();
      saveProfile();
      saveUsername();
      return true;
    }
  };

  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  const saveName = async () => {
    try {
      await AsyncStorage.setItem("UserName", username);
      setUsername(username);
    } catch (e) {
      console.error("Error saving name:", e);
    }
  };

  const deleteAuthUser = async () => {
    deleteUser(user)
      .then(() => {
        // User deleted.
      })
      .catch((error) => {
        // An error ocurred
        // ...
      });
  };

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
    if (faction) {
      // Ensure faction is not null or undefined
      try {
        await AsyncStorage.setItem("Faction", faction);
        /* console.log(faction, "was saved"); */
      } catch (e) {
        console.error("Error saving faction:", e);
      }
    } else {
      console.warn("Faction is null or undefined, not saving.");
    }
  };

  const getFaction = async () => {
    try {
      const factionName = await AsyncStorage.getItem("Faction");
      setFaction(factionName || "Nova Raiders"); // Default fallback value
    } catch (e) {
      console.error("Error getting faction:", e);
    }
  };

  const getProfile = async () => {
    try {
      const profilePicture = await AsyncStorage.getItem("ProfilePicture");
      setProfile(profilePicture);
      /* console.log(profilePicture, "was fetched"); */
    } catch (e) {
      console.error("Error getting name:", e);
    }
  };

  const getName = async () => {
    try {
      const name = await AsyncStorage.getItem("UserName");
      setUsername(name);
      console.log(name, "was fetched");
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
    getFaction();
    getProfile();
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

  console.log("profile picture is in Logout Screen:", profile);

  return (
    <SafeAreaView style={[styles.mainContainer]}>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="never"
      >
        <View style={styles.container}>
          {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.navigate("Player")}>
              <Image
                style={styles.image}
                source={require("../../assets/icons/icons8-back-arrow-50.png")}
              />
            </TouchableOpacity>
            <Text style={[styles.text, { left: 40 }]}>Settings</Text>
          </View> */}
          <View style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
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
            style={{ flex: 5, justifyContent: "center", alignItems: "center", bottom: -15 }}
          >
            <ImagePicker />
            <View style={{ width: "80%", position: "relative" }}>
              {renderLabel()}
              <TextInput
                maxLength={12}
                style={styles.textInput}
                onChangeText={(text) => {
                  setUsername(text.trimStart());
                }}
                placeholder={!isFocus ? "Enter a Username" : ""}
                value={username}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
              />
            </View>
            <View style={{ width: "100%" }}>
              <DropdownComponent />
            </View>

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
                onLongPress={() => {
                  deleteFaction();
                  deleteName();
                  deleteProfilePicture();
                  deleteAuthUser();
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
              onPress={() => FIREBASE_AUTH.signOut()}
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

            <TouchableOpacity onLongPress={handleAccountDeletion} style={styles.deleteButton}>

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
});
