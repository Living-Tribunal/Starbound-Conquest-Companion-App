import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Pressable,
  View,
  Modal,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import Toast from 'react-native-toast-message';

export default function EditButtonHP({ type, index, value, short }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hpText, setHpText] = useState("");
  const [idText, setIdText] = useState("");

  const statKeyHP = `${type}-${index}-${value}-${short}-hp`;
  const statKeyID = `${type}-${index}-${value}-${short}id`;

  const showToast = () => {
      Toast.show({
        type: "success",
        text1: "StarBound Conquest",
        text2: "Ships Stats Have Been Adjusted.",
      });
    };

  const shipImages = {
    fighter: require("../../assets/icons/fighter-01.png"),
    destroyer: require("../../assets/icons/destroyer-01.png"),
    cruiser: require("../../assets/icons/cruiser-01.png"),
    carrier: require("../../assets/icons/carrier-01.png"),
    dreadnought: require("../../assets/icons/dreadnought-01.png"),
  };
  const shipHPValues = {
    fighter: 1,
    destroyer: 8,
    cruiser: 12,
    carrier: 14,
    dreadnought: 30,
  };

  const shipAcronyms = {
    fighter: "FG",
    destroyer: "DE",
    cruiser: "CR",
    carrier: "CA",
    dreadnought: "DR",
  };

  const save = async () => {
    try {
      await AsyncStorage.setItem(statKeyHP, hpText);
      await AsyncStorage.setItem(statKeyID, idText);
    } catch (err) {
      alert(err);
    }
  };

  const load = async () => {
    try {
      const statHP = await AsyncStorage.getItem(statKeyHP);
      const statID = await AsyncStorage.getItem(statKeyID);
      if (statHP !== null) {
        setHpText(statHP);
      }

      if (statID !== null) {
        setIdText(statID);
      }
    } catch (err) {
      alert(err);
    }
  };

  const changeButtonColor = () => {
    if (parseInt(hpText) === 0) {
      return Colors.deep_red;
    } else {
      return "transparent";
    }
  };

  const changeBorderButtonColor = () => {
    if (parseInt(hpText) === 0) {
      return Colors.lightened_deep_red;
    } else {
      return Colors.hud;
    }
  };

  useEffect(() => {
    load();
  }, []);

  const imageSource =
    shipImages[type] || require("../../assets/icons/rookie_64.png");
  const hpValue = shipHPValues[type] || "0";
  const shortValue = shipAcronyms[type];

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.fleetContainer}>
        <Pressable
          onPress={() => {
            setIsModalVisible(true);
            changeButtonColor();
          }}
          style={({ pressed }) => [
            styles.outsideButton,
            {
              backgroundColor: pressed ? Colors.goldenrod : changeButtonColor(),
              borderColor: pressed ? Colors.gold : changeBorderButtonColor(),
            },
          ]}
        >
          {({ pressed }) => (
            <>
              <Image
                source={imageSource}
                style={{
                  width: 40,
                  height: 40,
                  margin: 5,
                  tintColor: pressed ? Colors.gold : changeBorderButtonColor(), // Change tintColor based on 'pressed'
                  resizeMode: "contain",
                }}
              />

              <Text style={styles.textStyle}>
                {shortValue}-ID: {idText || "0"}
              </Text>
              <Text style={styles.textStyle}>HP: {hpText || hpValue}</Text>
            </>
          )}
        </Pressable>
      </View>

      {/* MODAL */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.heroModalContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textModalStyle}>Enter the {type}'s ID</Text>
            <TextInput
              style={styles.modalTextInput}
              onChangeText={setIdText}
              value={idText}
              keyboardType="numeric"
              placeholder={shortValue}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.textModalStyle}>Enter the {type}'s HP</Text>
            <TextInput
              style={styles.modalTextInput}
              onChangeText={setHpText}
              value={hpText}
              keyboardType="numeric"
              placeholder="HP"
            />
          </View>
          <View style={styles.heroModalContainerButtons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                showToast();
                setIsModalVisible(false);
                save();
              }}
            >
              <Image
                source={require("../../assets/icons/icons8-save-50.png")}
                style={{
                  width: 25,
                  height: 25,
                  marginTop: 5,
                }}
              />
              <Image
                style={{ width: 60, height: 60, position: "absolute" }}
                source={require("../../assets/images/edithud.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onLongPress={() => {
                setHpText(hpValue);
                setIdText("0");
                setIsModalVisible(false);
                save();
              }}
            >
              <Image
                source={require("../../assets/icons/delete50.png")}
                style={{
                  width: 25,
                  height: 25,
                  marginTop: 5,
                }}
              />
              <Image
                style={{ width: 60, height: 60, position: "absolute" }}
                source={require("../../assets/images/edithud.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    height: "70%",
  },
  button: {
    width: 100,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  outsideButton: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderWidth: 2,
    alignItems: "center",
    borderRadius: 5,
    justifyContent: "center",
  },
  modalTextInput: {
    backgroundColor: Colors.slate,
    width: 150,
    textAlign: "center",
    margin: 10,
    color: Colors.white,
    borderColor: Colors.white,
    borderWidth: 1,
  },
  heroModalContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.dark_gray,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center",
  },
  textStyle: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: "monospace",
    fontWeight: "bold",
    marginBottom: 5,
  },
  textModalStyle: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "monospace",
    justifyContent: "center",
    textAlign: "center",
  },
  heroModalContainerButtons: {
    flexDirection: "row",
    backgroundColor: Colors.dark_gray,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  fleetContainer: {
    justifyContent: "center",
  },
});
