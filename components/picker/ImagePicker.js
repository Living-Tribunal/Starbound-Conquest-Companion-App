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
import { updateProfile, deleteUser } from "firebase/auth";

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
      const metadata = {
        contentType: "image/jpeg",
      };
      await uploadBytes(storageRef, blob, metadata);
      console.log("✅ Upload success!");
      const downloadURL = await getDownloadURL(storageRef);
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

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
        }}
      >
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.text}>Choose Your Profile Picture</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Image
          style={[
            styles.image,
            {
              boxShadow: factionColor
                ? `0px 0px 10px ${factionColor}`
                : `0px 0px 10px ${Colors.hud}`,
              borderColor: factionColor || Colors.hud,
            },
          ]}
          source={
            userProfilePicture
              ? { uri: userProfilePicture }
              : {
                  uri: profile
                    ? profile
                    : "https://firebasestorage.googleapis.com/v0/b/starbound-conquest-a1adc.firebasestorage.app/o/avatarimages%2Fpe.webp?alt=media&token=eaf5837e-adf6-4a86-9fc9-33b66cfde88e",
                }
          }
        />
        {userProfilePicture && (
          <Image
            style={styles.image2}
            source={require("../../assets/icons/icons8-check-mark-50.png")}
          />
        )}
      </View>
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
    width: "100%",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
  },
  image2: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 35,
    height: 35,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.green_toggle,
    tintColor: Colors.green_toggle,
    backgroundColor: Colors.darker_green_toggle,
  },
  button: {
    backgroundColor: Colors.hud,
    borderWidth: 1,
    borderColor: Colors.hudDarker,
    borderRadius: 5,
    padding: 5,
    marginBottom: 15,
    width: "95%",
    alignSelf: "center",
  },
  text: {
    color: Colors.hudDarker,
    fontFamily: "LeagueSpartan-Bold",
    fontSize: 15,
    padding: 5,
    textAlign: "center",
  },
});
