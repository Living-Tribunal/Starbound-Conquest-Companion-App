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
                <ImageBackground source={require('../assets/images/sbc.jpg')} style={{width: 240, height: 150, justifyContent: 'center', alignItems: 'center'}}>
                {/* <Text style={{color: Colors.white, fontSize: 12, fontFamily: 'aboreto'}}>Starbound Conquest</Text> */}
                </ImageBackground>
                <View style={{backgroundColor: Colors.slate}}>
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
                            marginTop: -5,
                            marginLeft: -15,            
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
                            marginTop: -5,
                            marginLeft: -15,            
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
                            marginTop: -5,
                            marginLeft: -15,             
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