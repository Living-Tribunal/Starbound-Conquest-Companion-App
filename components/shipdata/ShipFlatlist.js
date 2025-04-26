/*  */ import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Alert } from "react-native";
import { doc, deleteDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { useNavigation } from "@react-navigation/native";
import { getFleetData } from "../../components/API/API";

export default function ShipFlatList({ type, fleetClass }) {
  const { data, setData, toggleToDelete } = useStarBoundContext();
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();

  const fleetData = Array.isArray(data)
    ? data.filter((ship) => ship.type === type)
    : [];

  /*   console.log("----------------------");
  console.log(`${type} count:`, fleetData.length);
  console.log("----------------------"); */

  const deleteShip = async (ship) => {
    if (!user?.uid) {
      console.error("User not found");
      return;
    }

    try {
      const deleteShipReference = doc(
        FIREBASE_DB,
        "users",
        user.uid,
        "ships",
        ship.id
      );
      await deleteDoc(deleteShipReference);
      await getFleetData({ data, setData });

      // Refresh locally without needing to refetch from Firestore
      //const updatedShips = ship.filter((b) => b.docId !== ship.docId);

      Alert.alert(`${ship.id} Deleted`, "Ship has been deleted.", [
        { text: "OK" },
      ]);

      console.log(`Deleted Ship: ${ship.id}`);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

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
              onPress={() => {
                if (toggleToDelete) {
                  deleteShip(item);
                  console.log("Deleted Ship:", item.id);
                } else {
                  navigation.navigate("Stats", { ship: item });
                  console.log("Navigated to Stats:", item.id);
                }
              }}
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
                  marginVertical: 5,
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
