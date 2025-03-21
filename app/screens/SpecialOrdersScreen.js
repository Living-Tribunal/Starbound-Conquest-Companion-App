import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { SpecialOrders } from "@/constants/SpecialOrders.js";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "@/constants/fonts";
import HeaderComponent from "../../components/header/HeaderComponent.js";

export default function SpecialOrdersScreen() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <HeaderComponent text="Special Orders" NavToWhere={"Rules"} />
      <FlatList
        data={Object.entries(SpecialOrders)}
        keyExtractor={([key]) => key} // Use the object key as the unique identifier
        renderItem={({ item }) => {
          const [key, value] = item; // Destructure key and value
          return (
            <View
              style={{
                margin: 10,
                borderRadius: 8,
                elevation: 8,
                shadowColor: Colors.underTextGray,
                shadowRadius: 10,
              }}
            >
              <View style={styles.rulesSection}>
                <Text style={styles.headerSOText}>{value.name}</Text>
                <Text style={styles.text}>{value.text}</Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
  rulesSection: {
    padding: 20,
  },
  text: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "monospace",
    marginBottom: 5,
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
  headerText: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    fontFamily: FONTS.leagueRegular,
  },
  headerSOText: {
    color: Colors.hud,
    fontSize: 30,
    marginBottom: 5,
    marginTop: 5,
    textAlign: "center",
    fontFamily: FONTS.leagueRegular,
    borderBottomColor: Colors.white,
    borderTopColor: "transparent",
    marginBottom: 10,
    marginTop: 10,
    paddingBottom: 5,
    paddingTop: 5,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderStyle: "solid",
    borderColor: Colors.white,
    backgroundColor: Colors.dark_gray,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
});
