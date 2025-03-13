import { useState } from "react";
import { TouchableOpacity, Image, View, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";

export default function ImagePickerExample() {
  const { profile, setProfile } = useStarBoundContext();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.text}>Choose Your Profile Picture</Text>
      </TouchableOpacity>
      <Image
        style={styles.image}
        source={
          profile ? { uri: profile } : require("../../assets/images/ships.jpg")
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  button: {
    backgroundColor: Colors.hud,
    borderWidth: 1,
    borderColor: Colors.hudDarker,
    borderRadius: 10,
    padding: 5,
    marginBottom: 5,
    width: "80%",
  },
  text: {
    color: Colors.hudDarker,
    fontFamily: "monospace",
    fontSize: 12,
    padding: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
});
