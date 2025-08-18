import React, { useState, useEffect, useCallback } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../Global/StarBoundProvider";
import { Image } from "expo-image";

export default function ChatItem({ item, index, noBorder }) {
  const { data, setData, userFactionColor } = useStarBoundContext();
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  //console.log("ChatItem:", item.profile);
  return (
    <TouchableOpacity>
      <View
        style={{
          gap: 5,
          justifyContent: "left",
          flexDirection: "row",
          backgroundColor: Colors.hudDarker,
          alignItems: "center",
          borderBottomWidth: noBorder ? 0 : 2,
          borderBottomColor: noBorder ? Colors.hudDarker : Colors.blue_gray,
        }}
      >
        <Image
          style={{ width: 20, height: 20, borderRadius: 50 }}
          source={{ uri: item.profile }}
          blurHash={item.blurHash}
          transition={500 + index * 100}
        />
        <Text
          style={[
            styles.playerName,
            {
              color: item.userFactionColor ? item.userFactionColor : Colors.hud,
            },
          ]}
        >
          {item.displayName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
