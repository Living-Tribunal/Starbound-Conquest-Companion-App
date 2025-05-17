import React from "react";
import { useImage } from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";
import { Image } from "@shopify/react-native-skia";

export default function StarBackground() {
  const image = useImage(require("../../assets/background/starfield.png"));
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
  //return the array of tiles
  return tiles;
}
