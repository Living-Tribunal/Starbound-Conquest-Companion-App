import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import EditButtonHP from "../../components/buttons/EditButtonHP";
import ToggleAttributeButton from "../../components/buttons/ToggleAttribute";
import { FactionImages } from "../../constants/FactionImages.js";

export default function ShipEditScreen() {
  const route = useRoute();
  const { shipClass, index } = route.params || {};
  const navigation = useNavigation();
  const factionData = FactionImages[selectedFaction];
  const [selectedFaction, setSelectedFaction] = useState("");
  const [selectedShip, setSelectedShip] = useState("");
  const shipData = factionData ? factionData[selectedShip] : null;

  const classImage = shipData ? shipData.classImage : null;


   useEffect(() => {
      if (shipClass) {
      switch (shipClass) {
        case "fighter":
          setShowFighterClass(true);
          setSelectedShip('Fighter');
          break;
        case "destroyer":
          setShowDestroyerClass(true);
          setSelectedShip('Destroyer');
          break;
        case "carrier":
          setShowCarrierClass(true);
          setSelectedShip('Carrier');
          break;
        case "cruiser":
          setShowCruiserClass(true);
          setSelectedShip('Cruiser');
          break;
        case "dreadnought":
          setShowDreadnoughtClass(true);
          setSelectedShip('Dreadnought');
          break;
        default:
          break;
      }
  }
    }, [shipClass]);

  return (
    <View style={{ backgroundColor: Colors.dark_gray, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.dark_gray,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Fleet", { shipClass })}
        >
          <Image
            style={styles.image}
            source={require("../../assets/icons/icons8-back-arrow-50.png")}
          />
        </TouchableOpacity>
        <Text style={[styles.text, { left: 40 }]}>Settings</Text>
        <View>
          <EditButtonHP type="fighter" index={index} />
          <ToggleAttributeButton shipType="fighter" index={index} />
          <Image style={styles.icon} source={classImage} />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({});
