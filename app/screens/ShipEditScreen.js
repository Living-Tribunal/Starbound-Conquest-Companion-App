import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import EditButtonHP from "../../components/buttons/EditButtonHP";
import ToggleAttributeButton from "../../components/buttons/ToggleAttribute";

export default function ShipEditScreen() {
  const route = useRoute();
  const { factionName, factionImage, description } = route.params || {};
  const navigation = useNavigation();


  return (
    <View style={{ backgroundColor: Colors.dark_gray, flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Info")}>
                      <Image
                        style={styles.image}
                        source={require("../../assets/icons/icons8-back-arrow-50.png")}
                      />
                    </TouchableOpacity>
                    <Text style={[styles.text, { left: 40 }]}>Factions</Text>
                  </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.dark_gray,
        }}
      >
        <View>
      <Text>{factionName}</Text>
      <Image source={factionImage} style={{ width: 100, height: 100 }} />
      <Text style={[styles.text, { left: 40 }]}>{description}</Text>
    </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({});
