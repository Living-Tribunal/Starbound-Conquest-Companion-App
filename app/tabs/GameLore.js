import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import FactionAvatars from "../../constants/FactionAvatars.js";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function GameLore() {
  const navigation = useNavigation(); // Fix navigation issue
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark_gray }}>
      <ScrollView
      contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: tabBarHeight,
                backgroundColor: Colors.dark_gray,
              }}>
        <View style={styles.container}>
          <Text style={styles.subHeaderText}>
            Explore the factions of Starbound Conquest below. Tap an image to
            learn more about each one.
          </Text>
          <View style={styles.gridContainer}>
            {Object.entries(FactionAvatars).map(([name, data]) => (
              <View style={styles.shipItem} key={name}>
                <TouchableOpacity
                  style={styles.touchable}
                  onPress={() => {
                    navigation.navigate("Faction Info", { 
                        factionName: name, 
                        factionImage: data.image, 
                        description: data.description,
                        ship: data.ship,
                      });
                  }}
                >
                  <Image source={data.image} style={styles.image} />
                  <View style={styles.infoContainer}>
                    <Text style={styles.typeText}>{name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark_gray,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  shipItem: {
    margin: 10,
  },
  touchable: {
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    borderRadius: 5
  },
  infoContainer: {
    backgroundColor: Colors.hudDarker,
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    borderRadius: 5
  },
  typeText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "monospace",
  },
  subHeaderText: {
    fontFamily: "monospace",
    color: Colors.white,
    fontSize: 12,
    textAlign: "center",
    backgroundColor: Colors.underTextGray,
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
});
