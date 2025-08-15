import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { weaponDescriptions, WeaponColors } from "@/constants/WeaponColors";
import HeaderComponent from "@/components/header/HeaderComponent";

export default function WeaponTypes({ route }) {
  const navigation = useNavigation();
  const { type, key } = route.params;
  console.log("Weapon Type:", type);
  console.log("Key:", key);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: WeaponColors[key] }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          positon: "absolute",
          top: 0,
          left: 0,
          width: "100%",
        }}
      >
        <HeaderComponent text="Weapon Types" NavToWhere={"Rules"} color={Colors.hudDarker} />
      </View>
      <View style={styles.typeContainer}>
        <Text
          style={[
            styles.typeText,
            { fontSize: 20, fontFamily: "LeagueSpartan-Bold" },
          ]}
        >
          {key}
        </Text>
        <Text style={styles.typeText}>{weaponDescriptions[key]}</Text>
        <View
          style={[
            styles.typeText,
            {
              backgroundColor: WeaponColors[key],
              width: "90%",
              zIndex: 1000,
              height: 40,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 5,
            },
          ]}
        >
          <Text
            style={[
              styles.typeText,
              { fontFamily: "LeagueSpartan-Bold", color: Colors.hudDarker },
            ]}
          >
            Weapon Arc Color
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: Colors.hudDarker,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  text: {
    color: Colors.hudDarker,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "LeagueSpartan-Regular",
    left: 40,
  },
  typeContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.hudDarker,
    borderRadius: 5,
    padding: 5,
    margin: 5,
    flex: 1,
  },
  typeText: {
    fontSize: 12,
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Light",
    textAlign: "center",
    borderRadius: 5,
    margin: 5,
  },
});
