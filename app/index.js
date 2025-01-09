
import { Image } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import 'react-native-gesture-handler';
import ShipStats from "../components/ships/ShipStats";
import Rules from "../components/rules/Rules";
import Fleet_Points from "../components/yourfleetandpoints/Fleet_Points";
import Your_Fleet from "../components/yourfleetandpoints/Your_Fleet";
import { Colors } from '../constants/Colors';
import { useFonts } from 'expo-font';
import { StarBoundProvider, useStarBoundContext } from '../components/Global/StarBoundProvider';
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
        <Tab.Navigator  
        initialRouteName = "Ship Stats"
        screenOptions={{
            headerTintColor: Colors.white, //header text color
            headerTitleStyle: {
                fontFamily: 'aboreto', //header text font family
                backgroundColor:Colors.dark_gray, //header text background color
                fontSize: 25,
                fontWeight: 'bold',
                textAlign: 'left',
            },
            tabBarLabelStyle:{ color: Colors.dark_gray, fontFamily: 'alberto'},
            headerStyle: {
                backgroundColor: Colors.dark_gray //header background color
            },
            headerTitleAlign: 'center',
            tabBarItemStyle: {backgroundColor: Colors.misty_blue },
            headerShown:true,
            
          }}
          >
            <Tab.Screen name="Ship Stats" component={ShipStats} options={{
                tabBarIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/icons8-imperial-star-destroyer-48.png')} style={{ height: 25, width: 25, tintColor: focused ? Colors.blue_gray : Colors.dark_gray  }}  resizeMode="contain"/>
                )
            }} />
            <Tab.Screen name="Your Fleet" component={Your_Fleet} options={{
                tabBarIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/icons8-sergeant-major-of-army-sma-50.png')} style={{ height: 25, width: 25, tintColor: focused ? Colors.blue_gray : Colors.dark_gray }}  resizeMode="contain"/>
                )
            }} />
            <Tab.Screen name="Fleet Points" component={Fleet_Points} options={{
                tabBarIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/icons8-score-50.png')} style={{ height: 25, width: 25, tintColor: focused ? Colors.blue_gray : Colors.dark_gray }}  resizeMode="contain"/>
                )
            }} />
            <Tab.Screen name="Rules" component={Rules} options={{
                tabBarIcon: ({ focused, size }) => (
                    <Image source={require('../assets/icons/icons8-rules-50.png')} style={{ height: 25, width: 25, tintColor: focused ? Colors.blue_gray : Colors.dark_gray }}  resizeMode="contain"/>
                )
            }} />
            
            {/* <Tab.Screen name="Login" component={Login} options={{ drawerItemStyle: { display: 'hidden' }}} /> */}
            </Tab.Navigator>
       </StarBoundProvider>
  );
}

