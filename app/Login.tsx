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
} from "firebase/auth";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { FONTS } from "../constants/fonts";


const Login = () => {
    /* const {username} = useStarBoundContext();
    console.log(username); */
  const { type } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [getUsername, setGetUsername ] = useState<any | null>(null);
  const auth = FIREBASE_AUTH;

   // State variable to track password visibility
   const [showPassword, setShowPassword] = useState(false);

   // Function to toggle the password visibility state
   const toggleShowPassword = () => {
       setShowPassword(!showPassword);
   };


  useEffect(() => {
    const getUserName = async () => {
        try {
            const username = await AsyncStorage.getItem("UserName");
            if (username) {
                setGetUsername(username); // Only set if a username exists
              } else {
                setGetUsername("Commander");
          }
        } catch (error) {
          // Error retrieving data
        }
      };
      getUserName();
  },[]);

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
            {isPressed ? "Create an Account" : `Welcome, ${getUsername || "Commander"}`}
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
            <View style={{right: 50}}>
            <TouchableOpacity
                  onPress={toggleShowPassword}>
                    <Image style={styles.toggleEye} source={ showPassword? require("../assets/icons/icons8-hide-30.png") : require("../assets/icons/icons8-show-30.png") }/>
                </TouchableOpacity>    
            </View>
            
            </View>
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
            <Text style={[styles.btnPrimaryText, {color: isPressed? Colors.lightened_gold:Colors.green_toggle, fontFamily: "monospace"}]}>
              {isPressed ? "Sign Up" : "Login"}
            </Text>
            <Image style={[styles.loginImage,{tintColor: isPressed? Colors.gold:Colors.green_toggle}]} source={require("../assets/images/hud2.png")} />
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
    color: Colors.hud
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
  toggleButton: {},
  loginText: {
    fontWeight: "bold",
  },
  showContainer: {
    flexDirection: 'row',
    alignItems: "center",
  },
  toggleEye:{
    tintColor: Colors.hud
  },
  loginImage: {
    position: "absolute",
    resizeMode: "contain",
    alignSelf: "center",
    width: 300,
    height: 65,
    zIndex: -100
  }
});

export default Login;
