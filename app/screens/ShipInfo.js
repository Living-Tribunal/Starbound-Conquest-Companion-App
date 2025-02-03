import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { FONTS } from "@/constants/fonts";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"; 

export default function ShipInfo({ route}) {
  const navigation = useNavigation();
  const { ship } = route.params || {};
  console.log(JSON.stringify(ship) + " That came from player through ship flatlist into shipinfo");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark_gray }}>
      <View style={{ flexDirection: "row", alignships: "center" }}>
        <TouchableOpacity onPress={() => navigation.navigate("Player")}>
          <Image
            style={styles.image}
            source={require("../../assets/icons/icons8-back-arrow-50.png")}
          />
        </TouchableOpacity>
        <Text style={[styles.text, { left: 40 }]}>Ship Information</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.card}>
          <Image source={{ uri: ship.image }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{ship.shipId}</Text>
            <Text style={styles.text}>HP: {ship.hp}/{ship.maxHP}</Text>
            <Text style={styles.text}>Threat Level: {ship.threatLevel}</Text>
            <Text style={styles.text}>Move: {ship.moveDistance}</Text>
            <Text style={styles.text}>Firing Arc: {ship.firingArc}</Text>
            <Text style={styles.text}>Weapon Type: {ship.weaponType}</Text>
            <Text style={styles.text}>Weapon Damage: {ship.weaponDamage}</Text>
            <Text style={styles.text}>Weapon Range: {ship.weaponRange}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: Colors.white,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  infoContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e94560",
  },
  text: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 3,
  },
});
