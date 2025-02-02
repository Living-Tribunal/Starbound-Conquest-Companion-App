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
import { FONTS } from "../../constants/fonts";
export default function ShipFlatList({ type, fleetClass }) {
  const { data } = useStarBoundContext();

  const fleetData = data.filter((ship) => ship.type === type);
  console.log(`${type} count:`, fleetData.length); // Debugging log

  return (
    <View style={{ alignItems: "center" }}>
      {fleetData.length > 0 ? (
        <FlatList
          data={fleetData}
          nestedScrollEnabled={true}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={{ flex: 1, alignItems: "center", padding: 2 }}>
                <Text style={styles.typeText}>
                  {item.shipId} - {item.type}
                </Text>
                <View style={{ width: 100, height: 50 }}>
                  <Image
                    resizeMode="contain"
                    source={{ uri: item.image }}
                    style={{ width: 50, height: 50, alignSelf: "center" }}
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
