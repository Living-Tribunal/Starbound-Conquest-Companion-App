import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { FONTS } from "@/constants/fonts";
import { useNavigation } from "@react-navigation/native";
import { useMapImageContext } from "@/components/Global/MapImageContext";

export default function HeaderComponent({
  text,
  NavToWhere,
  onPress,
  disabled,
  color,
  image,
}) {
  const navigation = useNavigation();
  const { gameSectors } = useMapImageContext();
  //console.log("Game Sectors in HeaderComponent:", gameSectors);

  const goBack = () => {
    navigation.navigate(NavToWhere);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          goBack();
          onPress?.();
        }}
      >
        <Image
          style={[styles.image, { tintColor: color || Colors.hud }]}
          source={require("../../assets/icons/icons8-back-arrow-50.png")}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "70%",
        }}
      >
        <Image
          style={[styles.profileImage, { left: 30 }]}
          source={{ uri: image }}
        />
        <Text
          style={[styles.headerText, { left: 40, color: color || Colors.hud }]}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: Colors.white,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  headerText: {
    color: Colors.white,
    fontSize: 25,
    textAlign: "center",
    fontFamily: FONTS.leagueRegular,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
});
