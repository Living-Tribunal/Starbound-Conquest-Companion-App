import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { GameFactions } from "@/constants/GameFactions";
import FactionAvatars from "@/constants/FactionAvatars";
import useMyTurn from "../Functions/useMyTurn";

const DropdownComponentFactions = ({ playerGameRoomID }) => {
  const { faction, setFaction, data } = useStarBoundContext();
  const [isFocus, setIsFocus] = useState(false);
  const { state: gameState } = useMyTurn(playerGameRoomID);

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
    <View style={[styles.container, { opacity: gameState?.started ? 0.5 : 1 }]}>
      {renderLabel()}
      <Dropdown
        disable={gameState?.started}
        style={[
          styles.dropdown,
          isFocus && {
            borderColor: Colors.hud,
          },
        ]}
        placeholderStyle={[styles.placeholderStyle]}
        selectedTextStyle={[styles.selectedTextStyle]}
        containerStyle={[styles.containerStyle]}
        inputSearchStyle={[styles.inputSearchStyle]}
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
      />
    </View>
  );
};

export default DropdownComponentFactions;

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
    backgroundColor: "transparent",
  },
  selectedTextStyle: {
    fontSize: 13,
    color: Colors.hud,
    backgroundColor: "transparent",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 45,
    fontSize: 16,
    borderColor: Colors.hud,
    color: Colors.hud,
    borderRadius: 5,
  },
  containerStyle: {
    backgroundColor: Colors.hudDarker,
    borderColor: Colors.hud,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 5,
    padding: 8,
  },
});
