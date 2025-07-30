import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../Global/StarBoundProvider";
import { campaigns } from "@/constants/Campaigns";

const DropdownComponentCampaigns = () => {
  const { gameRoom, setGameRoom, data } = useStarBoundContext();
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: Colors.hud }]}>
          Choose a Game Room
        </Text>
      );
    }
    return null;
  };

  //console.log("Game Mode:", gameRoom);

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: Colors.hud }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={campaigns}
        search
        maxHeight={350}
        labelField="value"
        valueField="value"
        placeholder={!isFocus ? "Choose a Game Room" : "..."}
        searchPlaceholder="Search..."
        value={gameRoom}
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
          setIsFocus(false);
        }}
        onChange={(item) => {
          setGameRoom(item.value);
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

export default DropdownComponentCampaigns;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
    padding: 10,
    marginBottom: 10,
  },
  dropdown: {
    height: 55,
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
    borderWidth: 2,
    borderRadius: 3,
    borderColor: Colors.hud,
    color: Colors.hud,
  },
  placeholderStyle: {
    fontSize: 12,
  },
  selectedTextStyle: {
    fontSize: 14,
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
