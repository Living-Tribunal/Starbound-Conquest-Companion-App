import { useState } from "react";
import { TouchableOpacity, Image, View, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import {
  FIREBASE_STORE,
  FIREBASE_AUTH,
  getDownloadURL,
} from "@/FirebaseConfig";
import { getStorage, ref, uploadBytes } from "firebase/storage";

export default function ImagePickerExample({ factionColor }) {
  const { userProfilePicture, setUserProfilePicture, profile } =
    useStarBoundContext();
  const user = FIREBASE_AUTH.currentUser;
  const storage = getStorage();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const downloadURL = await uploadImageAsync(
          result.assets[0].uri,
          user.uid
        );
        console.log("Download URL:", downloadURL);
        setUserProfilePicture(downloadURL);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log("Blob:", blob);
    return blob;
  };

  const uploadImageAsync = async (uri, userId) => {
    try {
      const blob = await uriToBlob(uri);
      console.log("Blob URI:", blob);

      const filename = `userProfilePhotos/${userId}/${Date.now()}.jpg`;
      console.log("Filename:", filename);
      const storageRef = ref(storage, filename);
      console.log("Storage Ref:", storageRef);

      const metadata = {
        contentType: "image/jpeg",
      };
      console.log("Metadata:", metadata);

      await uploadBytes(storageRef, blob, metadata);
      console.log("✅ Upload success!");

      const downloadURL = await getDownloadURL(storageRef);
      console.log("📎 File available at:", downloadURL);

      if (downloadURL) {
        try {
          console.log(downloadURL, "were saved to Auth");
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      }
      return downloadURL;
    } catch (err) {
      console.error("🔥 Upload failed:", err);
      throw err;
    }
  };

  //console.log("User profile Image in Picker: ", profile);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.text}>Choose Your Profile Picture</Text>
      </TouchableOpacity>
      <Image
        style={[
          styles.image,
          {
            boxShadow: `0px 0px 10px ${factionColor}`,
            borderColor: { factionColor } || Colors.hud,
          },
        ]}
        source={
          userProfilePicture ? { uri: userProfilePicture } : { uri: profile }
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
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
  },
  button: {
    backgroundColor: Colors.hud,
    borderWidth: 1,
    borderColor: Colors.hudDarker,
    borderRadius: 10,
    padding: 5,
    marginBottom: 15,
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
