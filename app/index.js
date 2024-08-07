import { StyleSheet, Text, View, Image } from "react-native";
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
import Fleet_Points from "../components/Fleet_Points";
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
            width: 245,
        },
            drawerActiveTintColor: Colors.slate, // drawwer higlhited text color
            headerTintColor: Colors.white, //header text color
            headerTitleStyle: {
                fontFamily: 'aboreto', //header text font family
                backgroundColor:Colors.dark_gray, //header text background color
                fontSize: 15,
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
            drawerLabelStyle:{
                marginLeft: -25,
            }
          }}
          >
            <Drawer.Screen name="Fighter" component={Fighter} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/fighterb.png')} style={{ height: 45, width: 45 }}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Frigate" component={Frigate} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/frigateb.png')} style={{ height: 45, width: 45 }}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Destroyer" component={Destroyer} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/destroyerb.png')} style={{ height: 45, width: 45 }}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Light Cruiser" component={Light_Cruiser} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/lcruiserb.png')} style={{ height: 45, width: 45}}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Heavy Cruiser" component={Heavy_Cruiser} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/hcruiserb.png')} style={{ height: 45, width: 45 }}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Carrier" component={Carrier} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/carrierb.png')} style={{ height: 45, width: 45 }}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Battleship" component={Battleship} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/battleshipb.png')} style={{ height: 45, width: 45 }}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Dreadnought" component={Dreadnought} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/dreadnoughtb.png')} style={{ height: 45, width: 45 }}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Points" component={Fleet_Points} options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="Rules" component={Rules} options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer.Navigator>
  );
}

