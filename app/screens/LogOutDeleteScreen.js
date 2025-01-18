import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";


export default function LogOutDeleteScreen() {
    const {
        username,
        setUsername
      } = useStarBoundContext();

    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;

    const saveName = async() => {
        try{
       await AsyncStorage.setItem("UserName", username); 
       setUsername(username);   
        } catch(e){
            console.error("Error saving name:", e);
        }
    }

    const getName = async() => {
        try{
            const name = await AsyncStorage.getItem("UserName");
            setUsername(name);
        } catch(e){
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

    const deleteName = async() => {
        try{
            await AsyncStorage.removeItem("UserName");
            setUsername('');
        } catch(e){
            console.error("Error deleting name:", e);
        }
    }

  return (
    <SafeAreaView style={[styles.mainContainer]}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems:'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate("Player")}>
            <Image
              style={styles.image}
              source={require("../../assets/icons/icons8-back-arrow-50.png")}
            />
          </TouchableOpacity>
          <Text style={[styles.text,{left:40}]}>Settings</Text>
        </View>
        <View style={{ flex: 5}}>
            <Text style={{color: "white"}}>Username</Text>
            <TextInput maxLength={12} style={{backgroundColor: "white"}} onChangeText={username => setUsername(username)} placeholder="Enter a UserName"></TextInput>
            <TouchableOpacity onPress={saveName} style={{backgroundColor: "orange"}}><Text>Poosh Me</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { deleteName()}} style={{backgroundColor: "orange"}}><Text>Delete Me</Text></TouchableOpacity>
            {username ? (
                <Text style={{ backgroundColor: "white", color: "black" }}>
                    Name: {username}
                </Text>
            ) : null}
        </View>

        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            heigth: "50%",
          }}
        >
          <Pressable
            onPress={() => FIREBASE_AUTH.signOut()}
            style={({ pressed }) => [
              styles.resetbutton,
              {
                borderColor: pressed
                  ? Colors.darker_green_toggle
                  : Colors.green_toggle,
                backgroundColor: pressed
                  ? Colors.green_toggle
                  : Colors.darker_green_toggle,
              },
            ]}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.resetText,
                  { color: pressed ? Colors.darker_green_toggle : Colors.green_toggle },
                ]}
              >
                Log Out
              </Text>
            )}
          </Pressable>
          <Pressable
            onLongPress={() => {FIREBASE_AUTH.currentUser?.delete(), deleteAsync()}}
            style={({ pressed }) => [
              styles.resetbutton,
              {
                borderColor: pressed
                  ? Colors.deep_red
                  : Colors.lightened_deep_red,
                backgroundColor: pressed
                  ? Colors.lightened_deep_red
                  : Colors.deep_red,
              },
            ]}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.resetText,
                  { color: pressed ? Colors.deep_red : Colors.lightened_deep_red },
                ]}
              >
                Delete Account
              </Text>
            )}
          </Pressable>
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
});
