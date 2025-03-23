import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { FONTS } from "../constants/fonts";
import auth from "@react-native-firebase/auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
const Login = () => {
  const { type } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [getUsername, setGetUsername] = useState("");

  GoogleSignin.configure({
    webClientId:
      "633304307229-acjrh8tpf2eddgdjcutludsg7vqf1pru.apps.googleusercontent.com",
  });

  const [showPassword, setShowPassword] = useState(false);

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
      const userCredential = await signInWithCredential(
        FIREBASE_AUTH,
        googleCredential
      );

      // Check if the user is new or existing
      if (userCredential.additionalUserInfo?.isNewUser) {
        console.log("New user created:", userCredential.user.uid);
      } else {
        console.log("Existing user logged in:", userCredential.user.uid);
      }

      router.replace("/");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Google Sign-In Failed");
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const getUserName = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("UserName");
        setGetUsername(storedUsername || "Commander");
      } catch (error) {
        console.error("Failed to retrieve username:", error);
      }
    };
    getUserName();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user;
      const storedUsername = user.displayName || "Commander";
      await AsyncStorage.setItem("UserName", storedUsername);
      router.replace("/");
    } catch (error) {
      Alert.alert("Sign In Failed. Check your login and try again.");
    }
    setLoading(false);
  };

  const signUp = async () => {
    if (!email || !password || !username) {
      Alert.alert(
        "Sign Up Error",
        "Please enter a username, email, and password."
      );
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      await AsyncStorage.setItem("UserName", username);
      router.replace("/");
    } catch (error) {
      Alert.alert("Sign Up Failed");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={1}
      >
        {loading && (
          <View>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        <View
          style={{
            justifyContent: "center",
            flex: 1,
            backgroundColor: Colors.dark_gray,
            padding: 24,
          }}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/sbcq.png")}
              style={styles.logo}
            />
          </View>
          <View style={{ paddingTop: 20 }}>
            <Text style={styles.title}>
              {isPressed
                ? "Create an Account"
                : `Welcome, ${getUsername || "Commander"}`}
            </Text>
          </View>

          <View style={{ marginBottom: 20 }}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Email"
              style={styles.inputField}
              value={email}
              onChangeText={setEmail}
            />
            <View style={styles.showContainer}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Password"
                style={styles.inputField}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <View style={{ right: 50 }}>
                <TouchableOpacity onPress={toggleShowPassword}>
                  <Image
                    style={styles.toggleEye}
                    source={
                      showPassword
                        ? require("../assets/icons/icons8-hide-30.png")
                        : require("../assets/icons/icons8-show-30.png")
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            {isPressed && (
              <>
                <View>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Username"
                    style={styles.inputField}
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>
              </>
            )}
          </View>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={() => setIsPressed(!isPressed)}>
              <Text style={styles.btnPrimaryText}>
                {isPressed ? (
                  <>
                    Login or <Text style={{ color: Colors.gold }}>Sign Up</Text>
                  </>
                ) : (
                  <>
                    <Text style={{ color: Colors.green_toggle }}>Login</Text> or
                    Sign Up
                  </>
                )}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              isPressed ? signUp() : signIn(); // Call signUp or signIn
            }}
            style={styles.loginButton}
          >
            <Text
              style={[
                styles.btnPrimaryText,
                {
                  color: isPressed
                    ? Colors.lightened_gold
                    : Colors.green_toggle,
                  fontFamily: "monospace",
                },
              ]}
            >
              {isPressed ? "Sign Up" : "Login"}
            </Text>
            <Image
              style={[
                styles.loginImage,
                { tintColor: isPressed ? Colors.gold : Colors.green_toggle },
              ]}
              source={require("../assets/images/hud2.png")}
            />
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={onGoogleButtonPress}
              style={styles.loginButton2}
            >
              <Image
                style={styles.googleImage}
                source={require("../assets/icons/google.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    alignSelf: "center",
    color: Colors.hud,
    fontFamily: FONTS.leagueBold,
  },
  inputField: {
    width: "100%",
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.hud,
    borderRadius: 2,
    padding: 10,
    backgroundColor: Colors.hudDarker,
    color: Colors.hud,
  },
  btnPrimaryText: {
    color: Colors.hud,
    fontSize: 20,
    fontFamily: FONTS.leagueBold,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  logoContainer: {
    alignItems: "center",
    padding: 24,
    justifyContent: "center",
  },
  logo: {
    height: 220,
    width: 220,
    resizeMode: "contain",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.hud,
  },
  loginButton: {
    padding: 12,
    borderRadius: 4,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton2: {
    padding: 12,
    borderRadius: 4,
    marginTop: 16,
  },
  toggleButton: {},
  loginText: {
    fontWeight: "bold",
  },
  showContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleEye: {
    tintColor: Colors.hud,
  },
  loginImage: {
    position: "absolute",
    resizeMode: "contain",
    alignSelf: "center",
    width: 300,
    height: 65,
    zIndex: -100,
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
  },
  googleImage: {
    resizeMode: "contain",
    alignSelf: "center",
    width: 160,
    height: 33,
    zIndex: -100,
  },
});

export default Login;
