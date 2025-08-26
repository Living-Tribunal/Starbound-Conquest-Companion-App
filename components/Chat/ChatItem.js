import React, { useState, useEffect, useCallback } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../Global/StarBoundProvider";
import { Image } from "expo-image";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function ChatItem({ item, index, noBorder }) {
  const { data, setData, userFactionColor } = useStarBoundContext();
  const user = FIREBASE_AUTH.currentUser;
  const navigation = useNavigation();
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <>
      {item.uid !== user.uid && (
        <TouchableOpacity
          onPress={() => navigation.navigate("PrivateChat", { item })}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: Colors.underTextGray,
              padding: 2,
              margin: 10,
              borderWidth: 1,
              borderColor: Colors.hud,
              borderRadius: 5,
            }}
          >
            <Image
              style={{ width: 20, height: 20, borderRadius: 50 }}
              source={{ uri: item.profile }}
              blurHash={blurhash}
              transition={500 + index * 100}
            />
            <Text
              style={[
                styles.playerName,
                {
                  color: item.userFactionColor
                    ? item.userFactionColor
                    : Colors.hud,
                },
              ]}
            >
              {item.displayName}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.blue_gray,
  },
  playerName: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Regular",
    fontSize: 10,
    textAlign: "center",
    padding: 5,
  },
});
