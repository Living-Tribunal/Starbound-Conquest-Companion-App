import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import 'react-native-gesture-handler';
import 'react-native-gesture-handler';
import Carrier from "@/components/ships/Carrier";
import Destroyer from "@/components/ships/Destroyer";
import Dreadnought from "@/components/ships/Dreadnought";
import Fighter from "@/components/ships/Fighter";
import Cruiser from "@/components/ships/Cruiser";
import Rules from "@/components/rules/Rules";
import Login from "@/components/login/Login";
import CustomDrawer from "@/components/customdrawer/CustomDrawer";
import Fleet_Points from "@/components/yourfleetandpoints/Fleet_Points";
import Your_Fleet from "@/components/yourfleetandpoints/Your_Fleet";
import { Colors } from '@/constants/Colors';
import { useFonts } from 'expo-font';
import { StarBoundProvider, useStarBoundContext } from '../components/Global/StarBoundProvider';

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
            <Drawer.Screen name="Fighter" component={Fighter} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/rookie_64.png')} style={{ height: 45, width: 45, tintColor: focused ? Colors.slate : Colors.dark_gray }}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Destroyer" component={Destroyer} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/destroyer_64.png')} style={{ height: 45, width: 45, tintColor: focused ? Colors.slate : Colors.dark_gray }}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Cruiser" component={Cruiser} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/cruiser_64.png')} style={{ height: 45, width: 45, tintColor: focused ? Colors.slate : Colors.dark_gray}}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Carrier" component={Carrier} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/superCapital_64.png')} style={{ height: 45, width: 45, tintColor: focused ? Colors.slate : Colors.dark_gray }}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Dreadnought" component={Dreadnought} options={{
                drawerIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/titan_64.png')} style={{ height: 45, width: 45, tintColor: focused ? Colors.slate : Colors.dark_gray, }}  resizeMode="contain"/>
                )
            }} />
            <Drawer.Screen name="Login" component={Login} options={{ drawerItemStyle: { display: 'none' }}} />
            <Drawer.Screen name="Fleet Points" component={Fleet_Points} options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="Rules" component={Rules} options={{ drawerItemStyle: { display: 'none' } }} />
            <Drawer.Screen name="Your Fleet" component={Your_Fleet} options={{ drawerItemStyle: { display: 'none' } }} />
       </Drawer.Navigator>
       </StarBoundProvider>
  );
}

