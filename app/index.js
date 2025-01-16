import { Image, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import "react-native-gesture-handler";
import ShipStats from "./tabs/ShipStats";
import Rules from "./tabs/Rules";
import Fleet_Points from "./tabs/Fleet_Points";
import Login from "./Login";
import LogOutDeleteScreen from "./screens/LogOutDeleteScreen";
import Player from "./screens/Player";
import index from "./screens/Your_Fleet";
import { Colors } from "../constants/Colors";
import {
  StarBoundProvider,
  useStarBoundContext,
} from "../components/Global/StarBoundProvider";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { LoadFonts, FONTS } from "../constants/fonts";

/* const Drawer = createDrawerNavigator(); */
const Tab = createBottomTabNavigator();

export default function Index() {
  //custom tabBarButton
  const TabBarAdvancedButton = ({ focused, ...props }) => {
    const fontsLoaded = LoadFonts();
    useEffect(() => {
        if (fontsLoaded) {
          SplashScreen.hideAsync();
        }
      }, [fontsLoaded]);
      
      if (!fontsLoaded) {
        console.log("Loading fonts failed");
        return null; // Return `null` for React components, not `undefined`.
      } 
    return (
      <View style={styles.container} pointerEvents="box-none">
        <TouchableOpacity style={styles.button} onPress={props.onPress}>
          <Image
            source={require("../assets/images/sbcqnotext.png")}
            style={{
              height: 65,
              width: 60,
              tintColor: focused ? Colors.gold : Colors.white, // Change color when focused
              backgroundColor: Colors.dark_gray,
              borderRadius: 55,
            }}
          />
          <Image
            source={
              focused
                ? require("../assets/icons/icons8-imperial-star-destroyer-48.png")
                : ""
            }
            style={{
              height: 25,
              width: 25,
              tintColor: focused ? Colors.gold : Colors.white, // Change color when focused
              backgroundColor: Colors.dark_gray,
              borderRadius: 55,
              position: "absolute",
              bottom: 22,
              right: 11,
            }}
          />
          <Text
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: focused ? Colors.gold : Colors.white, // Change color when focused
              paddingTop: 5,
            }}
          >
            Player
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      position: "relative",
      width: "100%",
      alignItems: "center",
    },
    background: {
      position: "absolute",
      top: 0,
    },
    button: {
      top: -25,
      justifyContent: "center",
      alignItems: "center",
      width: 50,
      height: 50,
      borderRadius: 27,
    },
    buttonIcon: {
      fontSize: 16,
      color: "#F6F7EB",
    },
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const navigation = useNavigation();

  getAuth().onAuthStateChanged((user) => {
    setIsLoading(false);
    /* console.log("Logged In", user); */
    if (!user) {
      navigation.navigate("Login");
      console.log("Logged out");
    }
  });

/*   useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []); */

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark_gray }}>
      <StarBoundProvider>
        <Tab.Navigator
          sceneContainerStyle={{ backgroundColor: "transparent" }}
          initialRouteName="Player"
          screenOptions={{
            headerTintColor: Colors.white, //header text color
            headerTitleStyle: {
              fontFamily: "aboreto", //header text font family
              backgroundColor: Colors.dark_gray, //header text background color
              fontSize: 25,
              fontWeight: "bold",
              textAlign: "left",
            },
            headerStyle: {
              backgroundColor: Colors.dark_gray, //header background color
            },
            headerTitleAlign: "center",
            headerShown: false,

            //text in the tab nav
            tabBarActiveTintColor: Colors.hud,
            tabBarInactiveTintColor: Colors.white,
            //modify the text below the icon
            tabBarLabelStyle: { fontFamily: "monospace", fontSize: 8 },

            //the nav tab container
            tabBarStyle: {
              backgroundColor: Colors.dark_gray,
              height: 65,
              borderRadius: 20,
              borderTopWidth: 2,
              position: "relative",
              margin: 5,
              borderWidth: 2,
              borderColor: Colors.hud,
            },
            tabBarItemStyle: {
              paddingVertical: 1,
              borderRadius: 40,
            },
          }}
        >
          <Tab.Screen
            name="Stats"
            component={ShipStats}
            options={{
              tabBarIcon: ({ focused, size }) => (
                <Image
                  source={require("../assets/icons/icons8-stats-64.png")}
                  style={{
                    height: 25,
                    width: 25,
                    tintColor: focused ? Colors.hud : Colors.white,
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Info"
            component={Rules}
            options={{
              tabBarIcon: ({ focused, size }) => (
                <Image
                  source={
                    focused
                      ? require("../assets/icons/icons8-book-50.png")
                      : require("../assets/icons/icons8-bookclosed-50.png")
                  }
                  style={{
                    height: 25,
                    width: 25,
                    tintColor: focused ? Colors.hud : Colors.white,
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Player"
            component={Player}
            options={{
              tabBarButton: (props) => (
                <TabBarAdvancedButton
                  focused={props.accessibilityState.selected}
                  bgColor={"blue"}
                  {...props}
                />
              ),
              tabBarIcon: ({ focused, size }) => (
                <Image
                  style={{
                    height: 25,
                    width: 25,
                    tintColor: focused ? Colors.hud : Colors.white,
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Points"
            component={Fleet_Points}
            options={{
              tabBarIcon: ({ focused, size }) => (
                <Image
                  source={require("../assets/icons/icons8-score-50.png")}
                  style={{
                    height: 25,
                    width: 25,
                    tintColor: focused ? Colors.hud : Colors.white,
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Rules"
            component={Rules}
            options={{
              tabBarIcon: ({ focused, size }) => (
                <Image
                  source={
                    focused
                      ? require("../assets/icons/icons8-rules-50.png")
                      : require("../assets/icons/icons8-graduation-scroll-50.png")
                  }
                  style={{
                    height: 25,
                    width: 25,
                    tintColor: focused ? Colors.hud : Colors.white,
                  }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Login"
            component={Login}
            options={{ tabBarItemStyle: { display: "none" } }}
          />
          <Tab.Screen
            name="Logout"
            component={LogOutDeleteScreen}
            options={{
              tabBarItemStyle: { display: "none" },
              tabBarStyle: { display: "none" },
              headerShown: false,
            }}
            screenOptions={{ headerShown: false }}
          />
          <Tab.Screen
            name="Fleet"
            component={index}
            options={{
              tabBarItemStyle: { display: "none" },
              tabBarStyle: { display: "none" },
              headerShown: false,
            }}
            screenOptions={{ headerShown: false }}
          />
        </Tab.Navigator>
      </StarBoundProvider>
    </SafeAreaView>
  );
}
