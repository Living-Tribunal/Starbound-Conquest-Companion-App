import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Canvas, Circle, Fill, Rect } from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-reanimated";
import { GestureResponderEvent } from "react-native";
import { Colors } from "@/constants/Colors";
import { useImage } from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { Image } from "@shopify/react-native-skia";

export default function GameMap() {
  const shipX = useSharedValue(100);
  const shipY = useSharedValue(100);

  const image = useImage(require("../../assets/background/starfield.png"));
  const dreadnought = useImage(require("../../assets/images/al_macnamara.png"));
  const { width, height } = useWindowDimensions();

  if (!image) return null;

  const imgWidth = image.width();
  const imgHeight = image.height();

  //container that holds the image
  const tiles = [];
  //loop through the image and create a tile for each dimension
  for (let y = 0; y < height; y += imgHeight) {
    for (let x = 0; x < width; x += imgWidth) {
      //push that tile into the array
      tiles.push(
        //create a tile
        <Image
          key={`${x}-${y}`}
          image={image}
          x={x}
          y={y}
          width={imgWidth}
          height={imgHeight}
        />
      );
    }
  }

  const handleMove = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;
    shipX.value = locationX;
    shipY.value = locationY;
  };

  return (
    <>
      <Canvas
        style={styles.container}
        onTouchStart={(e) => {
          console.log("Touch Start");
        }}
        onTouchEnd={() => {
          console.log("Touch End");
        }}
        onTouchMove={handleMove}
      >
        {/* show background */}
        {tiles}
        <Image
          image={dreadnought}
          x={shipX}
          y={shipY}
          width={150}
          height={150}
        />
      </Canvas>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
  },
});
