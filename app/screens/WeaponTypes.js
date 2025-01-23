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

export default function WeaponTypes({ route }) {
  const navigation = useNavigation();
  const { type, key } = route.params;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark_gray }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: -10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Rules");
          }}
        >
          <Image
            style={styles.image}
            source={require("../../assets/icons/icons8-back-arrow-50.png")}
          />
        </TouchableOpacity>
        <Text style={[styles.text]}>Weapon Type</Text>
      </View>
      <View style={styles.typeContainer}>
        <Text style={styles.typeText}>Weapon Details:</Text>
        <Text style={styles.typeText}>Type: {key}</Text>
        <Text style={styles.typeText}>Range: {type.range}</Text>
        <Text style={styles.typeText}>Firing Arc: {type.firingarc}</Text>
      </View>
    </SafeAreaView>
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
      text:{
        color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "leagueRegular",
    left: 40,
      },    
});
