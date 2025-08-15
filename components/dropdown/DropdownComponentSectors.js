import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";
import { useMapImageContext } from "../Global/MapImageContext";
import { GameSectors } from "@/constants/GameSectors";

const DropdownComponentSectors = ({ getShips }) => {
  const { gameSectors, setGameSectors } = useMapImageContext();
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: Colors.hud }]}>
          Choose a Sector to deploy
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && {
            borderColor: Colors.hud,
          },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.containerStyle}
        iconStyle={styles.iconStyle}
        data={GameSectors}
        search
        maxHeight={350}
        labelField="value"
        valueField="value"
        placeholder={!isFocus ? "Choose a Sector to Deploy to" : "..."}
        searchPlaceholder="Search..."
        value={gameSectors}
        onFocus={() => setIsFocus(true)}
        inputSearchStyle={styles.searchInput}
        onBlur={() => {
          setIsFocus(false);
        }}
        onChange={(item) => {
          setGameSectors(item.value);
          setIsFocus(false);
          getShips({ gameSectors: item.value });
        }}
        renderItem={(item) => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderColor: Colors.hud,
              backgroundColor: Colors.hudDarker,
            }}
          >
            <Text
              style={{
                color: Colors.hud,
                fontFamily: "LeagueSpartan-Regular",
                fontSize: 18,
              }}
            >
              {item.value}
            </Text>
          </View>
        )}
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

export default DropdownComponentSectors;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
    padding: 10,
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
    borderWidth: 2,
    borderRadius: 3,
    borderColor: Colors.hud,
    color: Colors.hud,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.hud,
  },
  selectedTextStyle: {
    fontSize: 13,
    color: Colors.hud,
    backgroundColor: Colors.hudDarker,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: Colors.hud,
  },
  containerStyle: {
    backgroundColor: Colors.hudDarker,
    borderColor: Colors.hud,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 5,
    padding: 8,
  },
  searchInput: {
    borderColor: Colors.hud,
    color: Colors.hud,
    backgroundColor: Colors.hudDarker,
    fontSize: 14,
    borderRadius: 5,
  },
});
