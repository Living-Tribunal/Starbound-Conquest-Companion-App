import React, { useEffect } from "react";
import { View, Text, ImageBackground, Image} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { DrawerContentScrollView, DrawerItemList, DrawerItem  } from "@react-navigation/drawer";
import { Colors } from "@/constants/Colors";
import { useFonts } from 'expo-font';

const CustomDrawer = (props) => {
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
        <View style={{flex: 1, backgroundColor: Colors.dark_gray, borderColor: Colors.dark_gray}}>
            <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: Colors.dark_gray}}>
                <ImageBackground source={require('../assets/images/ships.jpg')} style={{width: 250, height: 75, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: Colors.white, fontSize: 14, fontFamily: 'aboreto'}}>Starbound Conquest</Text>
                </ImageBackground>
                <View style={{backgroundColor: Colors.slate}}>
                    <DrawerItemList {...props} />
                </View> 
                <View>
                   <DrawerItem
                        label="Rules"
                        labelStyle={{
                            fontFamily: 'aboreto',
                            fontWeight: 'bold',
                            color: Colors.white,
                            fontSize: 15,
                            marginTop: 10,            
                        }}
                        
                        onPress={() => props.navigation.navigate("Rules")}
                    /> 
                </View>
                
            </DrawerContentScrollView>
        </View>
    )
};

export default CustomDrawer;