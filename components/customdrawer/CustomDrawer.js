import React, { useEffect } from "react";
import { View, Text, ImageBackground, Image } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { Colors } from "../../constants/Colors";
import { useFonts } from "expo-font";
import { ImagePaths } from "../../constants/ImagePaths.js";


const CustomDrawer = (props) => {
  const [fontsLoaded] = useFonts({
    aboreto: require("../../assets/fonts/Aboreto-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return null;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          backgroundColor: Colors.blue_gray,
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <ImageBackground
          source={require("../../assets/images/sbc.jpg")}
          style={{
            width: "100%",
            height: 150,
            borderRadius: 10,
            overflow: "hidden",
          }}
        />
        <View style={{ backgroundColor: Colors.blue_gray }}>
          <DrawerItemList {...props} />
        </View>
        <View style={{ backgroundColor: Colors.dark_gray, borderRadius: 20, padding: 10 }}>
          {[
            /* { label: "Your Fleet", screen: "Your Fleet"},
            { label: "Fleet Points", screen: "Fleet Points"}, */
            { label: "Rules", screen: "Rules"},
          ].map((item, index) => {
            const isFocused = props.state.routes[props.state.index]?.name === item.screen;

            return (
              <DrawerItem
                key={index}
                label={item.label}
                labelStyle={{
                  fontFamily: "aboreto",
                  fontWeight: "bold",
                  color: isFocused ? Colors.dark_gray : Colors.white,
                  fontSize: 14,
                }}
                style={{
                  backgroundColor: isFocused ? Colors.slate : Colors.dark_gray,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
                icon={() => (
                  <Image
                    source={ImagePaths[item.screen]}
                    style={{
                      width: 35,
                      height: 35,
                      tintColor: isFocused ? Colors.dark_gray : Colors.white,
                    }}
                    resizeMode="contain"
                  />
                )}
                onPress={() => props.navigation.navigate(item.screen)}
              />
            );
          })}
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;
