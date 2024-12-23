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

const Drawer = createDrawerNavigator();

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
        <Drawer.Navigator drawerContent={props => <CustomDrawer{...props} />} initialRouteName = "Login"
        screenOptions={{
            drawerStyle: {
            width: 250,
        },
            drawerActiveTintColor: Colors.slate, // drawwer higlhited text color
            headerTintColor: Colors.white, //header text color
            headerTitleStyle: {
                fontFamily: 'aboreto', //header text font family
                backgroundColor:Colors.dark_gray, //header text background color
                fontSize: 25,
                fontWeight: 'bold',
                textAlign: 'left',
            },
            headerStyle: {
                backgroundColor: Colors.dark_gray, //header background color
                
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
            <Drawer.Screen name="Ship Stats" component={ShipStats} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/icons8-battleship-top-view-50.png')} style={{ height: 45, width: 45, tintColor: focused ? Colors.slate : Colors.dark_gray }}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Your Fleet" component={Your_Fleet} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/icons8-sergeant-major-of-army-sma-50.png')} style={{ height: 45, width: 45, tintColor: focused ? Colors.slate : Colors.dark_gray }}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Fleet Points" component={Fleet_Points} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/icons8-score-50.png')} style={{ height: 45, width: 45, tintColor: focused ? Colors.slate : Colors.dark_gray }}  resizeMode="contain"/>
                )
            }} />
            
            <Drawer.Screen name="Login" component={Login} options={{ drawerItemStyle: { display: 'none' }}} />
            <Drawer.Screen name="Rules" component={Rules} options={{ drawerItemStyle: { display: 'none' } }} />
       </Drawer.Navigator>
       </StarBoundProvider>
  );
}

