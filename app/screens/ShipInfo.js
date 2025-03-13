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

export default function ShipInfo({ route }) {
  const navigation = useNavigation();
  const { ship } = route.params || {};
  console.log(
    JSON.stringify(ship) +
      " That came from player through ship flatlist into shipinfo"
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark_gray }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.navigate("Player")}>
          <Image
            style={styles.backImage}
            source={require("../../assets/icons/icons8-back-arrow-50.png")}
          />
        </TouchableOpacity>
        <Text style={[styles.text, { left: 40 }]}>Ship Info</Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.card}>
            <Image source={{ uri: ship.image }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{ship.shipId}</Text>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <Text>HP</Text>
                <Text>Threat Level</Text>
                <Text>Move</Text>
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <Text>
                  {ship.hp}/{ship.maxHP}
                </Text>
                <Text>{ship.threatLevel}</Text>
                <Text>{ship.moveDistance}</Text>
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <Text>Firing Arc: </Text>
                <Text>Weapon Type: </Text>
                <Text>Weapon Damage: </Text>
              </View>

              <Text style={styles.textInfo}>{ship.firingArc}</Text>

              <Text style={styles.textInfo}>{ship.weaponType}</Text>

              <Text style={styles.textInfo}>{ship.weaponDamage}</Text>
              <Text style={styles.textHead}>Weapon Range: </Text>
              <Text style={styles.textInfo}>{ship.weaponRange}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    width: 70,
    height: 70,
    resizeMode: "contain",
    tintColor: Colors.white,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  backImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: Colors.white,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#284b547a",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
    borderRadius: 5,
    marginBottom: 20,
  },
  infoContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.hud,
    textAlign: "center",
    fontFamily: FONTS.leagueBold,
  },
  text: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "leagueRegular",
  },
  textHead: {
    fontSize: 12,
    color: Colors.hud,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 3,
  },
  headerText: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: FONTS.leagueRegular,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 20,
    backgroundColor: Colors.hudDarker,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 20,
    width: "100%",
    alignSelf: "center",
  },
  textInfo: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "monospace",
  },
});
