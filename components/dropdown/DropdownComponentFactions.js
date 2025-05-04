import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { GameFactions } from "@/constants/GameFactions";
import FactionAvatars from "@/constants/FactionAvatars";

const DropdownComponentFactions = () => {
  const { faction, setFaction, data } = useStarBoundContext();
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: Colors.hud }]}>
          Choose a Faction
        </Text>
      );
    }
    return null;
  };

  //console.log("faction:", faction);

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: Colors.hud }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={GameFactions}
        search
        maxHeight={350}
        labelField="value"
        valueField="value"
        placeholder={!isFocus ? "Choose a Faction" : "..."}
        searchPlaceholder="Search..."
        value={faction}
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
          setIsFocus(false);
        }}
        onChange={(item) => {
          setFaction(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? Colors.hud : Colors.hud}
            name="Safety"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default DropdownComponentFactions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: Colors.hud,
    borderWidth: 0.5,
    borderRadius: 3,
    paddingHorizontal: 8,
    backgroundColor: Colors.hudDarker,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: Colors.dark_gray,
    left: 22,
    top: 1,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.hud,
    color: Colors.hud,
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 13,
    color: Colors.hud,
    backgroundColor: Colors.hudDarker,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
