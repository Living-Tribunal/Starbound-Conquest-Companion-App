import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { FONTS } from "@/constants/fonts";
import { useNavigation } from "@react-navigation/native";

export default function HeaderComponent({ text, NavToWhere, onPress }) {
  const navigation = useNavigation();

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
        onPress={() => {
          goBack();
          onPress?.();
        }}
      >
        <Image
          style={styles.image}
          source={require("../../assets/icons/icons8-back-arrow-50.png")}
        />
      </TouchableOpacity>
      <Text style={[styles.headerText, { left: 40 }]}>{text}</Text>
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
});
