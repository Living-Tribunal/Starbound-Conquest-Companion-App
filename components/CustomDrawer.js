import React from "react";
import { View, Text, ImageBackground, Image} from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem  } from "@react-navigation/drawer";
import { Colors } from "@/constants/Colors";

const CustomDrawer = (props) => {
    return (
        <View style={{flex: 1, backgroundColor: Colors.blue_gray}}>
            <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: Colors.blue_gray}}>
                <ImageBackground source={require('../assets/images/ships.jpg')} style={{padding:50}}></ImageBackground>
                <View style={{backgroundColor: Colors.slate}}>
                    <DrawerItemList {...props} />
                    <DrawerItem
                        label="Rules"
                        labelStyle={{
                            fontFamily: 'aboreto',
                            fontWeight: 'bold',
                            color: Colors.black
                        }}
                        onPress={() => props.navigation.navigate("Rules")}
                    />
                </View>
            </DrawerContentScrollView>
        </View>
    )
};

export default CustomDrawer;