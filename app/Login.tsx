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
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

const Login = () => {
  const { type } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/");
    } catch (error: any) {
      console.log(error);
      alert(
        "Sign in failed. Have you registered for an account?" + error.message
      );
    }
    setLoading(false);
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/");
    } catch (error: any) {
      console.log(error);
      alert(
        "Sign up failed, please enter an email and password." + error.message
      );
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
              {isPressed ? "Welcome, Commander" : "Create an Account"}{" "}
            </Text>
          </View>

          <View style={{ marginBottom: 20 }}>
            <TextInput
              autoCapitalize="none"
              placeholder="Email"
              style={styles.inputField}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              autoCapitalize="none"
              placeholder="Password"
              style={styles.inputField}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setIsPressed(!isPressed)}
            >
              <Text style={styles.btnPrimaryText}>
                {isPressed ? (
                  <>
                    Login or{" "}
                    <Text style={{ color: Colors.gold }}>Sign Up</Text>
                  </>
                ) : (
                  <>
                    <Text style={{ color: Colors.green_toggle }}>Login</Text> or Sign Up
                  </>
                )}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={isPressed ? signUp : signIn}
            style={styles.loginButton}
          >
            <Text style={styles.btnPrimaryText}>
              {isPressed ? "Sign Up" : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.white,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
  },
  btnPrimary: {
    backgroundColor: "#007bff",
    marginVertical: 4,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 16,
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
    height: 320,
    width: 320,
    resizeMode: "contain", // Keeps the logo's aspect ratio intact
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.slate,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.slate,
    padding: 10,
    borderRadius: 4,
    color: Colors.dark_gray,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  loginButton: {
    padding: 12,
    borderRadius: 4,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
    borderColor: Colors.slate,
    backgroundColor: Colors.slate,
  },
  toggleButton: {},
  loginText: {
    fontWeight: "bold",
  },
});

export default Login;
