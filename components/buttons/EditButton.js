import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Text,
  TextInput,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../Global/StarBoundProvider";

// Define your key for AsyncStorage
const statKey = "";

export default function EditButton() {
  const { isModalVisible, setIsModalVisible, text, setText } =
    useStarBoundContext();

  const save = async () => {
    try {
      await AsyncStorage.setItem(statKey, text);
    } catch (err) {
      alert(err);
    }
  };

  const load = async () => {
    try {
      let stat = await AsyncStorage.getItem(statKey);
      if (stat !== null) {
        setText(stat);
      }
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.buttonContainer}>
      <Text style={styles.textStyle}>Fleet Limit:</Text>
      <View style={styles.fleetContainer}>
        <Text style={styles.textStyle}>{text}</Text>
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.buttonEdit}
        >
          <Image
            source={require("../../assets/icons/icons8-create-50.png")}
            style={{
              marginTop: 13,
              right: 23,
              width: 25,
              height: 25,
              position: "absolute",
            }}
          />
          <Image
            style={{ width: 60, height: 60, position: "absolute" }}
            source={require("../../assets/images/edithud.png")}
          />
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
      >

        <View style={styles.heroModalContainer}>
        <Text style={styles.subHeaderText}>
        Enter the maximum amount of points your fleet can consist of.
        </Text>
          <TextInput
            style={styles.modalTextInput}
            onChangeText={setText}
            value={text}
            keyboardType="numeric"
          />
          <View style={styles.heroModalContainerButtons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
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
                setText("0");
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
  },
  button: {
    width: 75,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonEdit: {
    width: 75,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 30,
    alignItems: "center",
  },
  modalTextInput: {
    backgroundColor: Colors.hudDarker,
    width: 300,
    textAlign: "center",
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
    color: Colors.hud
  },
  heroModalContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.dark_gray,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: "monospace",
    textAlign: "center",
  },
  heroModalContainerButtons: {
    flexDirection: "row",
    backgroundColor: Colors.dark_gray,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  buttonContainer: {
    alignItems: "center",
    margin: 10,
  },
  fleetContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 10,
    gap: 70,
  },
  subHeaderText:{
    fontFamily: "monospace",
    color: Colors.white,
    fontSize: 9,
    marginBottom: 5,
    marginTop: 5,
    textAlign: "center",
    backgroundColor: Colors.underTextGray,
    borderRadius: 5,
    padding: 5,
  }
});
