import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default function DeleteWarning({ onConfirmWarning, onCancelWarning }) {
  console.log("DeleteWarning rendered");
  return (
    <View style={styles.loadingContainer}>
      <Text style={[styles.valueWarning, { fontSize: 20, padding: 10 }]}>
        Warning: You are now in a delete mode, any ship you tap on WILL be
        deleted. To return to normal mode, tap on the X button.
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          gap: 40,
        }}
      >
        <TouchableOpacity style={styles.button} onPress={onCancelWarning}>
          <Image
            source={require("../../assets/icons/icons8-x-48.png")}
            style={{
              width: 25,
              height: 25,
              marginTop: 5,
              tintColor: Colors.lighter_red,
            }}
          />
          <Image
            style={{
              width: 60,
              height: 60,
              position: "absolute",
            }}
            source={require("../../assets/images/edithud.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onConfirmWarning}>
          <Image
            source={require("../../assets/icons/icons8-check-50.png")}
            style={{
              width: 25,
              height: 25,
              marginTop: 5,
              tintColor: Colors.green_toggle,
            }}
          />
          <Image
            style={{
              width: 60,
              height: 60,
              position: "absolute",
            }}
            source={require("../../assets/images/edithud.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 35,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark_gray,
  },
  valueWarning: {
    fontSize: 12,
    color: Colors.lighter_red,
    fontFamily: "leagueBold",
    textAlign: "center",
  },
});
