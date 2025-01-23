import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { FONTS } from "@/constants/fonts";
import Toast from "react-native-toast-message";

export default function LogOutDeleteScreen() {
  const { username, setUsername } = useStarBoundContext();
  const [text, setText] = useState("");
  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "StarBound Conquest",
      text2: "Your Username Has Been Set As: " + `${username}`,
    });
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

  const getName = async () => {
    try {
      const name = await AsyncStorage.getItem("UserName");
      setUsername(name);
    } catch (e) {
      console.error("Error getting name:", e);
    }
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
  }, []);

  const deleteName = async () => {
    try {
      await AsyncStorage.removeItem("UserName");
      setUsername("");
    } catch (e) {
      console.error("Error deleting name:", e);
    }
  };

  const emptyInput = () => {
    setUsername(" ");
  };

  return (
    <SafeAreaView style={[styles.mainContainer]}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Player")}>
            <Image
              style={styles.image}
              source={require("../../assets/icons/icons8-back-arrow-50.png")}
            />
          </TouchableOpacity>
          <Text style={[styles.text, { left: 40 }]}>Settings</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              top: 5,
              bottom: 20,
              flexDirection: "row",
            }}
          >
            <Text style={styles.subHeaderText}>
              Enter your username here and tap "Save" to update it. You can also
              remove your username if needed. Additionally, you have the option
              to log out or permanently delete your account. Please note that
              once your account is deleted, it cannot be recovered.{" "}
            </Text>
          </View>
        </View>
        <View
          style={{ flex: 5, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: Colors.hud, marginBottom: 10 }}>
            Choose Your Username
          </Text>
          <TextInput
            maxLength={12}
            style={styles.textInput}
            onChangeText={(username) => setUsername(username)}
            placeholder="Enter a UserName"
          />
          <View style={styles.heroModalContainerButtons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                saveName();
                showToast();
                emptyInput("");
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
            <TouchableOpacity style={styles.button} onLongPress={deleteName}>
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

          <TouchableOpacity
            onLongPress={() => {
              FIREBASE_AUTH.currentUser?.delete(), deleteAsync();
            }}
            style={styles.deleteButton}
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
    padding: 5,
  },
  textInput: {
    height: 40,
    borderColor: Colors.hud,
    borderWidth: 1,
    marginBottom: 10,
    color: Colors.hud,
    fontFamily: "monospace",
    fontSize: 16,
    borderRadius: 2,
    backgroundColor: Colors.hudDarker,
    paddingHorizontal: 10,
    width: "80%",
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
});
