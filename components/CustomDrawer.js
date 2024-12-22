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
        <View style={{flex: 1}}>
            <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor:Colors.blue_gray, justifyContent: 'space-between', height: "100%"}}>
                <ImageBackground source={require('../assets/images/sbc.jpg')} style={{width: "100%", height: 150}}>
                {/* <Text style={{color: Colors.white, fontSize: 12, fontFamily: 'aboreto'}}>Starbound Conquest</Text> */}
                </ImageBackground>
                <View style={{backgroundColor: Colors.blue_gray}}>
                    <DrawerItemList {...props} />
                </View> 
                <View>
                <DrawerItem
                        label="Your Fleet"
                        labelStyle={{
                            fontFamily: 'aboreto',
                            fontWeight: 'bold',
                            color: Colors.white,
                            fontSize: 15,          
                        }}
                        icon={({}) => (
                            <Image
                                source={require('../assets/icons/icons8-sergeant-major-of-army-sma-50.png')}
                                style={{ width: 35, height: 35}}
                                resizeMode="contain"
                            />
                        )}
                        
                        onPress={() => props.navigation.navigate("Your Fleet")}
                    /> 
                <DrawerItem
                        label="Fleet Points"
                        labelStyle={{
                            fontFamily: 'aboreto',
                            fontWeight: 'bold',
                            color: Colors.white,
                            fontSize: 15,          
                        }}
                        icon={({}) => (
                            <Image
                                source={require('../assets/icons/icons8-score-50.png')}
                                style={{ width: 35, height: 35}}
                                resizeMode="contain"
                            />
                        )}
                        onPress={() => props.navigation.navigate("Fleet Points")}
                    />
                   <DrawerItem
                        label="Rules"
                        labelStyle={{
                            fontFamily: 'aboreto',
                            fontWeight: 'bold',
                            color: Colors.white,
                            fontSize: 15,        
                        }}
                        icon={({}) => (
                            <Image
                                source={require('../assets/icons/icons8-rules-50.png')}
                                style={{ width: 35, height: 35}}
                                resizeMode="contain"
                            />
                        )}
                        
                        onPress={() => props.navigation.navigate("Rules")}
                    /> 
                   
                </View>
            </DrawerContentScrollView>
        </View>
    )
};

export default CustomDrawer;