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
          numColumns={4}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Stats", { ship: item })}
            >
              <View
                style={{
                  alignSelf: "center",
                  width: "80%",
                  flex: 1,
                  alignItems: "center",
                  padding: 2,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: Colors.hud,
                }}
              >
                {/* <Text style={styles.typeText}>
                  {item.shipId
                </Text> */}
                <View
                  style={{
                    marginBottom: 50,
                    position: "relative",
                    width: 90,
                    height: 40,
                    alignItems: "center",
                  }}
                >
                  <Image
                    resizeMode="contain"
                    source={require("../../assets/images/fleethud-01.png")}
                    style={{
                      width: 80,
                      height: 20,
                      tintColor: item.isToggled ? "orange" : Colors.hud,
                    }}
                  />
                  <Text
                    style={{
                      position: "absolute",
                      top: 5,
                      color: "white",
                      textAlign: "center",
                      fontSize: 8,
                    }}
                  >
                    {item.shipId}
                  </Text>
                  <Image
                    resizeMode="contain"
                    source={{ uri: item.image }}
                    style={{
                      width: 60,
                      height: 60,
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
  noData: {
    fontSize: 16,
    color: Colors.hudDarker,
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 10,
  },
});
