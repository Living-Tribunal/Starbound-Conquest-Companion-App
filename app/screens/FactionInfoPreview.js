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
import HeaderComponent from "@/components/header/HeaderComponent";

export default function FactionInfoPreview() {
  const route = useRoute();
  const { factionName, factionImage, description, ship } = route.params || {};
  console.log(factionName, factionImage, description, ship);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <HeaderComponent text="Factions" NavToWhere={"Login"} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: Colors.dark_gray,
          paddingBottom: 50,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ backgroundColor: Colors.dark_gray }}>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <View style={styles.faction}>
              <Text style={styles.factionText}>{factionName}</Text>
            </View>
            <View>
              <Image
                source={{ uri: factionImage }}
                style={{ width: 200, height: 200, borderRadius: 5 }}
              />
            </View>
            <View>
              <View style={styles.textSectionContainer}>
                <Image
                  style={styles.textContainer2}
                  source={require("../../assets/images/hud2.png")}
                />
                <Text style={styles.textSection}>Ships</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  nestedScrollEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  data={Object.entries(ship)} // Converts object to array of key-value pairs
                  renderItem={({ item }) => {
                    const [shipType, shipData] = item; // Destructure key-value pair
                    return (
                      <View key={shipType} style={styles.infoContainer}>
                        <Image
                          source={shipData.classImage}
                          style={styles.shipImage}
                        />
                      </View>
                    );
                  }}
                />
              </View>
              <View style={styles.textSectionContainer}>
                <Image
                  style={styles.textContainer2}
                  source={require("../../assets/images/hud2.png")}
                />
                <Text style={styles.textSection}>Overview</Text>
              </View>

              <Text style={styles.description}>{description}</Text>
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
  },
  text: {
    color: Colors.white,
    fontSize: 25,
    textAlign: "center",
    fontFamily: FONTS.leagueRegular,
  },
  description: {
    color: Colors.white,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "monospace",
  },
  descriptionOver: {
    color: Colors.white,
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    textAlign: "center",
    fontFamily: FONTS.leagueBold,
    backgroundColor: Colors.hudDarker,
    borderRadius: 5,
  },
  factionText: {
    color: Colors.white,
    fontSize: 35,
    textAlign: "center",
    fontFamily: FONTS.leagueBold,
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
  textSectionContainer: {
    textAlign: "center",
    justifyContent: "center",
    resizeMode: "container",
    left: 5,
    right: 5,
  },
  textContainer2: {
    resizeMode: "center",
    alignSelf: "center",
    width: 250,
    height: 90,
  },
  textSection: {
    fontFamily: "leagueRegular",
    color: Colors.hud,
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "bold",
    position: "absolute",
  },
  infoContainer: {
    justifyContent: "center", // Center children vertically
    alignItems: "center", // Center children horizontally
    width: 160, // Ensure it has width
    height: 160, // Ensure it has height
  },
  shipImage: {
    width: 140, // Set width
    height: 150, // Set height
    resizeMode: "contain", // Ensure image is scaled properly
    alignSelf: "center", // Align within the container
  },
});
