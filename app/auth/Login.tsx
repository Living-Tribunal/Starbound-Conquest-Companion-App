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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig";
import FactionAvatars from "../../constants/FactionAvatars.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { Colors } from "@/constants/Colors";
import { FONTS } from "../../constants/fonts";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { collection, addDoc, getDoc, doc, setDoc } from "firebase/firestore";
import DropdownComponent from "../../components/dropdown/DropdownComponent";
import Toast from "react-native-toast-message";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";

GoogleSignin.configure({
  webClientId:
    "633304307229-acjrh8tpf2eddgdjcutludsg7vqf1pru.apps.googleusercontent.com",
  scopes: ["email", "profile"],
});

const Login = () => {
  const navigation = useNavigation();
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [getUsername, setGetUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);
  const { faction, setFaction, profile, setProfile } = useStarBoundContext();

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      //console.log("Auth state changed:", user);

      if (authInProgress) {
        console.log("Manual auth in progress, not navigating.");
        return;
      }

      if (user && user.emailVerified) {
        navigation.replace("MainTabs", { screen: "Player" });
      } else {
        navigation.navigate("Login");
      }
    });

    return unsubscribe;
  }, [authInProgress]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const saveFaction = async () => {
    try {
      await AsyncStorage.setItem("Faction", faction);
      console.log(faction, "was saved");
    } catch (e) {
      console.error("Error saving faction:", e);
    }
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

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();
      console.log("SignIn Result:", signInResult);

      let idToken = signInResult?.idToken;

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
      console.log("User Credential:", userCredential);

      // Check if the user is new or existing
      if (userCredential.additionalUserInfo?.isNewUser) {
        console.log("New user created:", userCredential.user.uid);
      } else {
        console.log("Existing user logged in:", userCredential.user.uid);
      }

      navigation.replace("MainTabs", { screen: "Player" });
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Google Sign-In Failed");
    }
  }

  const signIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error", // 'success' | 'error' | 'info'
        text1: "Starbound Conquest",
        text2: "Please enter an email, and password.",
        position: "top", // optional, 'top' | 'bottom'
      });
      return;
    }

    setAuthInProgress(true);
    setLoadingSignIn(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Verified:", user.emailVerified);

      if (user.emailVerified) {
        const storedUsername = user.displayName || "Guest";
        await AsyncStorage.setItem("UserName", storedUsername);
        navigation.replace("MainTabs", { screen: "Player" }); // immediate nav
      } else {
        Toast.show({
          type: "error", // 'success' | 'error' | 'info'
          text1: "Starbound Conquest",
          text2: "Please verify your email first.",
          position: "top", // optional, 'top' | 'bottom'
        });
        await FIREBASE_AUTH.signOut();
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error", // 'success' | 'error' | 'info'
        text1: "Starbound Conquest",
        text2: "Sign In Failed. Check your login and try again.",
        position: "top", // optional, 'top' | 'bottom'
      });
    }
    setLoadingSignIn(false);
    setAuthInProgress(false);
  };

  /* console.log("Faction selected:", faction);
  console.log("Faction image URL:", FactionAvatars[faction]?.image); */

  const signUp = async () => {
    if (!email || password !== confirmPassword || !username) {
      Toast.show({
        type: "error", // 'success' | 'error' | 'info'
        text1: "Starbound Conquest",
        text2: "Please enter a username, email, and password.",
        position: "top", // optional, 'top' | 'bottom'
      });
      return;
    }
    setLoadingSignUp(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      console.log("✅ User created:", userCredential.user);

      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      await AsyncStorage.setItem("UserName", username);
      await saveFaction();
      console.log("User Name:" + JSON.stringify(user.displayName));

      const userReference = doc(FIREBASE_DB, "users", user?.uid);
      const userSnapshot = await getDoc(userReference);
      //check if user is already in firestore
      if (!userSnapshot.exists()) {
        try {
          await setDoc(doc(FIREBASE_DB, "users", user.uid), {
            email: user.email,
            displayName: user.displayName,
            id: user.uid,
            factionName: faction,
          });
          console.log("User document written with ID:", user.uid);
          console.log("Users Profile:", user);
        } catch (e) {
          console.error("Error adding document:", e);
        }
      }

      sendEmailVerification(user).then(() => {
        Alert.alert(
          "Verification Email Sent",
          "Please check your inbox and verify your email.",
          [
            {
              text: "OK",
              onPress: () => {
                setIsPressed(false);
                user.reload();
              },
            },
          ]
        );
      });
      console.log(
        "🚀 Sign-up successful! AppNavigation will handle redirection."
      );
    } catch (error) {
      Toast.show({
        type: "error", // 'success' | 'error' | 'info'
        text1: "Starbound Conquest",
        text2: "Sign Up Failed",
        position: "top", // optional, 'top' | 'bottom'
      });
    }
    setLoadingSignUp(false);
  };

  if (loadingSignIn) {
    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/SC_logo1.png")}
        />
        <Text style={styles.loadingText}>Hang on, we're logging you in...</Text>
      </SafeAreaView>
    );
  }

  if (loadingSignUp) {
    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/SC_logo1.png")}
        />
        <Text style={styles.loadingText}>
          Hang on, we're creating your account...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={1}
      >
        <View
          style={{
            justifyContent: "center",
            flex: 1,
            backgroundColor: Colors.dark_gray,
            padding: 24,
          }}
        >
          {!isPressed && (
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/SC_logo1.png")}
                style={styles.logo}
              />
            </View>
          )}

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
                      !showPassword
                        ? require("../../assets/icons/icons8-hide-30.png")
                        : require("../../assets/icons/icons8-show-30.png")
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
                    placeholder="Confirm Password"
                    style={styles.inputField}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!confirmPassword}
                  />
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Username"
                    style={styles.inputField}
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  {faction && FactionAvatars[faction] && (
                    <View style={styles.shipItem}>
                      <TouchableOpacity
                        style={styles.touchable}
                        onPress={() => {
                          navigation.navigate("Preview", {
                            factionName: faction,
                            factionImage: FactionAvatars[faction].image,
                            description: FactionAvatars[faction].description,
                            ship: FactionAvatars[faction].ship,
                          });
                        }}
                      >
                        <Image
                          source={{ uri: FactionAvatars[faction].image }}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View style={{ width: "100%" }}>
                  <DropdownComponent />
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
              isPressed ? signUp() : signIn();
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
              source={require("../../assets/images/hud2.png")}
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
                source={require("../../assets/icons/google.png")}
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
    fontFamily: "LeagueSpartan-Bold",
    textAlign: "center",
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
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: 320,
    width: 320,
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
    width: 200,
    height: 60,
    zIndex: -100,
  },
  loadingText: {
    fontSize: 20,
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Bold",
    textAlign: "center",
  },
  factionText: {
    fontSize: 20,
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Bold",
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    borderRadius: 5,
    marginTop: 10,
  },
  infoContainer: {
    backgroundColor: Colors.hudDarker,
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    borderRadius: 5,
  },
  typeText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "monospace",
  },
  shipItem: {
    margin: 2,
  },
  touchable: {
    alignItems: "center",
  },
});

export default Login;
