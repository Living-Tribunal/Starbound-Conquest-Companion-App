/*  */ import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { useNavigation } from "@react-navigation/native";
export default function ShipFlatList({ type, fleetClass }) {
  const { data } = useStarBoundContext();
  const navigation = useNavigation();

  const fleetData = Array.isArray(data)
    ? data.filter((ship) => ship.type === type)
    : [];

  /*   console.log("----------------------");
  console.log(`${type} count:`, fleetData.length);
  console.log("----------------------"); */

  return (
    <View style={{ alignItems: "center" }}>
      {fleetData.length > 0 ? (
        <FlatList
          data={fleetData}
          nestedScrollEnabled={true}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Ship Info", { ship: item})
              }
            >
              <View style={{alignSelf:"center", width: "80%", marginBottom: 8, flex: 1, alignItems: "center",padding: 2, borderRadius: 5, borderWidth: 1, borderColor: Colors.hud}}>
                {/* <Text style={styles.typeText}>
                  {item.shipId
                </Text> */}
                <View style={{ marginBottom: 50, position: "relative", width: 200, height: 80, alignItems:"center"}}>
                  <Image
                    source={require("../../assets/images/fleethud-01.png")}
                    style={{ width: 150, height: 40 }}
                  />
                  <Text
                    style={{
                      position: "absolute",
                      top: 12,
                      color: "white",
                      textAlign:"center"
                    }}
                  >
                    {item.shipId}
                  </Text>
                  <Image
                    resizeMode="contain"
                    source={{ uri: item.image }}
                    style={{
                      width: 70,
                      height: 70,
                      alignSelf: "center",
                      marginTop: 5,
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noData}>No {type}s available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textUnder: {
    fontSize: 20,
    color: Colors.white,
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.hudDarker,
    padding: 4,
    fontFamily: "leagueBold",
    backgroundColor: Colors.hud,
    width: "100%",
    borderWidth: 2,
    borderColor: Colors.hudDarker,
    borderRadius: 5,
    textAlign: "center",
  },
  noData: {
    fontSize: 16,
    color: Colors.hudDarker,
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 10,
  },
});
