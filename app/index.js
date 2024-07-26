import { StyleSheet, Text, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import 'react-native-gesture-handler';
import Battleship from "../components/Battleship";
import 'react-native-gesture-handler';
import Carrier from "../components/Carrier";
import Destroyer from "../components/Destroyer";
import Dreadnought from "../components/Dreadnought";
import Frigate from "../components/Frigate";
import Fighter from "../components/Fighter";
import Heavy_Cruiser from "../components/Heavy_Cruiser";
import Light_Cruiser from "../components/Light_Cruiser";
import Rules from "../components/Rules";
import CustomDrawer from "../components/CustomDrawer";
import { Colors } from '@/constants/Colors';
import { useFonts } from 'expo-font';

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
        <Drawer.Navigator drawerContent={props => <CustomDrawer{...props} />} initialRouteName = "Rules"
        screenOptions={{
            drawerStyle: {
            width: 240,
        },
            drawerActiveTintColor: Colors.slate, // drawwer higlhited text color
            headerTintColor: Colors.black, //header text color
            headerTitleStyle: {
                fontFamily: 'aboreto', //header text font family
                backgroundColor:Colors.blue_gray, //header text background color
                fontSize: 25,
                fontWeight: 'bold',
            },
            headerStyle: {
                backgroundColor: Colors.blue_gray, //header background color
                
            },
            drawerContentStyle:{
                backgroundColor: Colors.blue_gray, //drawwer background color
            },
            drawerInactiveTintColor: Colors.black, //drawwers inactive text color
            drawerActiveBackgroundColor: Colors.misty_blue, //drawwer active text background color
            drawerActiveTintColor: Colors.black, //drawwers active text color
            headerTitleAlign: 'center',
            drawerLabelStyle:{
                fontFamily: 'aboreto',
                fontWeight: 'bold'
            }
          }}
          >
            <Drawer.Screen name="Fighter" component={Fighter} />
            <Drawer.Screen name="Frigate" component={Frigate} />
            <Drawer.Screen name="Destroyer" component={Destroyer} />
            <Drawer.Screen name="Light Cruiser" component={Light_Cruiser} />
            <Drawer.Screen name="Heavy Cruiser" component={Heavy_Cruiser} />
            <Drawer.Screen name="Carrier" component={Carrier} />
            <Drawer.Screen name="Battleship" component={Battleship} />
            <Drawer.Screen name="Dreadnought" component={Dreadnought} />
            <Drawer.Screen name="Rules" component={Rules} />
        </Drawer.Navigator>
  );
}

