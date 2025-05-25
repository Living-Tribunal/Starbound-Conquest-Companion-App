import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import ShipStats from "./screens/ShipStats";
import Rules from "./tabs/Rules";
import Login from "./auth/Login";
import Settings from "./tabs/Settings";
import Player from "./tabs/Player";
import SpecialOrdersScreen from "./screens/SpecialOrdersScreen";
import WeaponTypes from "./screens/WeaponTypes";
import GameLore from "./screens/GameLore";
import FactionInfoScreen from "./screens/FactionInfoScreen";
import DiceRoller from "./tabs/Dice";
import FactionInfoPreview from "./screens/FactionInfoPreview";
import BattleGround from "./screens/BattleGround";
import GameMap from "./screens/GameMap";
import Map from "./tabs/Map";
import { Colors } from "../constants/Colors";
import { StarBoundProvider } from "../components/Global/StarBoundProvider";
import { MapImageProvider } from "../components/Global/MapImageContext";
import { DiceProvider } from "../components/Global/DiceContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import Toast from "react-native-toast-message";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <View style={styles.container}>
      <StarBoundProvider>
        <MapImageProvider>
          <DiceProvider>
            <Tab.Navigator
              sceneContainerStyle={{ backgroundColor: Colors.dark_gray }}
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
                  height: 60,
                  borderRadius: 5,
                  borderTopWidth: 2,
                  position: "relative",
                  margin: 5,
                  borderWidth: 2,
                  borderColor: Colors.hud,
                },
              }}
            >
              <Tab.Screen
                name="Player"
                component={Player}
                options={{
                  tabBarIcon: ({ focused, size }) => (
                    <Image
                      source={
                        focused
                          ? require("../assets/icons/icons8-darth-vader-50.png")
                          : require("../assets/icons/icons8-imperial-star-destroyer-48.png")
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
                name="Map"
                component={Map}
                options={{
                  tabBarIcon: ({ focused, size }) => (
                    <Image
                      source={
                        focused
                          ? require("../assets/icons/icons8-galaxy-50.png")
                          : require("../assets/icons/icons8-map-80.png")
                      }
                      style={{
                        height: 30,
                        width: 30,
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
                name="Dice"
                component={DiceRoller}
                options={{
                  tabBarIcon: ({ focused, size }) => (
                    <Image
                      source={
                        focused
                          ? require("../assets/icons/icons8-dice-80.png")
                          : require("../assets/icons/icons8-dice-cubes-64.png")
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
                name="Settings"
                component={Settings}
                options={{
                  tabBarIcon: ({ focused, size }) => (
                    <Image
                      source={
                        focused
                          ? require("../assets/icons/icons8-gear-50-1.png")
                          : require("../assets/icons/icons8-gear-50.png")
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
                name="SpecialOrdersScreen"
                component={SpecialOrdersScreen}
                options={{
                  tabBarItemStyle: { display: "none" },
                  tabBarStyle: { display: "none" },
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="WeaponTypes"
                component={WeaponTypes}
                options={{
                  tabBarItemStyle: { display: "none" },
                  tabBarStyle: { display: "none" },
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="GameMap"
                component={GameMap}
                options={{
                  tabBarItemStyle: { display: "none" },
                  tabBarStyle: { display: "none" },
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="Faction Info"
                component={FactionInfoScreen}
                options={{
                  tabBarItemStyle: { display: "none" },
                  tabBarStyle: { display: "none" },
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="Game Lore"
                component={GameLore}
                options={{
                  tabBarItemStyle: { display: "none" },
                  tabBarStyle: { display: "none" },
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="Stats"
                component={ShipStats}
                options={{
                  tabBarItemStyle: { display: "none" },
                  tabBarStyle: { display: "none" },
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="BattleGround"
                component={BattleGround}
                options={{
                  tabBarItemStyle: { display: "none" },
                  tabBarStyle: { display: "none" },
                  headerShown: false,
                }}
              />
            </Tab.Navigator>
          </DiceProvider>
        </MapImageProvider>
      </StarBoundProvider>
    </View>
  );
}

// Main App Navigator
export default function AppNavigator() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark_gray }}>
        <StatusBar />
        <StarBoundProvider>
          <MapImageProvider>
            <DiceProvider>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
                initialRouteName={
                  FIREBASE_AUTH.currentUser &&
                  FIREBASE_AUTH.currentUser.emailVerified
                    ? "MainTabs"
                    : "Login"
                }
              >
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="MainTabs"
                  component={MainTabs}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Preview"
                  animation="fade"
                  component={FactionInfoPreview}
                  options={{
                    headerShown: false,
                    animation: "fade_from_bottom",
                  }}
                />
              </Stack.Navigator>
            </DiceProvider>
          </MapImageProvider>
        </StarBoundProvider>
        <Toast />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
});
