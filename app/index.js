import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import 'react-native-gesture-handler';
import 'react-native-gesture-handler';
/* import Carrier from "@/components/ships/Carrier";
import Destroyer from "@/components/ships/Destroyer";
import Dreadnought from "@/components/ships/Dreadnought"; */
import ShipStats from "../components/ships/ShipStats";
/* import Cruiser from "@/components/ships/Cruiser"; */
import Rules from "../components/rules/Rules";
import Login from "../components/login/Login";
import CustomDrawer from "../components/customdrawer/CustomDrawer";
import Fleet_Points from "../components/yourfleetandpoints/Fleet_Points";
import Your_Fleet from "../components/yourfleetandpoints/Your_Fleet";
import { Colors } from '../constants/Colors';
import { useFonts } from 'expo-font';
import { StarBoundProvider, useStarBoundContext } from '../components/Global/StarBoundProvider';
import { ImagePaths } from "../constants/ImagePaths";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/* const Drawer = createDrawerNavigator(); */
const Tab = createBottomTabNavigator()

export default function Index() {
    const [fontsLoaded] = useFonts({
        'aboreto': require('../assets/fonts/Aboreto-Regular.ttf')
    });

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);

    if (!fontsLoaded) {
        return undefined;
    } else {
        SplashScreen.hideAsync();
    }
  return (
    <StarBoundProvider>
        <Tab.Navigator  initialRouteName = "Login"
        screenOptions={{
            headerTintColor: Colors.white, //header text color
            headerTitleStyle: {
                fontFamily: 'aboreto', //header text font family
                backgroundColor:Colors.dark_gray, //header text background color
                fontSize: 25,
                fontWeight: 'bold',
                textAlign: 'left',
                justifyContent: 'center',
            },
            tabBarLabelStyle:{ //text for tab nav  below icons
                color: Colors.dark_gray,
            },
            headerStyle: {
                backgroundColor: Colors.dark_gray, //header background color
            },
            tabBarIconStyle:{
                
            },
            drawerContentStyle:{
                backgroundColor: Colors.dark_gray, //drawwer background color
            },
            drawerInactiveTintColor: Colors.dark_gray, //drawwers inactive text color
            drawerActiveBackgroundColor: Colors.dark_gray, //drawwer active text background color
            drawerActiveTintColor: Colors.slate, //drawwers active text color
            headerTitleAlign: 'center',
            drawerLabelStyle:{
                fontFamily: 'aboreto',
                fontWeight: 'bold'
            },
            drawerItemStyle:{
                borderRadius: 10,

            }
          }}
          >
            <Tab.Screen name="Ship Stats" component={ShipStats} options={{
                tabBarIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/icons8-battleship-top-view-50.png')} style={{ height: 25, width: 25, tintColor: focused ? Colors.slate : Colors.dark_gray }}  resizeMode="contain"/>
                )
            }} />
            <Tab.Screen name="Your Fleet" component={Your_Fleet} options={{
                tabBarIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/icons8-sergeant-major-of-army-sma-50.png')} style={{ height: 25, width: 25, tintColor: focused ? Colors.slate : Colors.dark_gray }}  resizeMode="contain"/>
                )
            }} />
            <Tab.Screen name="Points" component={Fleet_Points} options={{
                tabBarIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/icons8-score-50.png')} style={{ height: 25, width: 25, tintColor: focused ? Colors.slate : Colors.dark_gray }}  resizeMode="contain"/>
                )
            }} />
            <Tab.Screen name="Rules" component={Rules} options={{
                tabBarIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/icons8-score-50.png')} style={{ height: 25, width: 25, tintColor: focused ? Colors.slate : Colors.dark_gray }}  resizeMode="contain"/>
                )
            }} />
            
            <Tab.Screen name="Login" component={Login} options={{ drawerItemStyle: { display: 'none' }}} />
            </Tab.Navigator>
       </StarBoundProvider>
  );
}

