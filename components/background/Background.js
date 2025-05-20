import { View, Image, Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";

const TILE_SIZE = 256;
const screen = Dimensions.get("window");
const VIRTUAL_WIDTH = 1200;
const VIRTUAL_HEIGHT = 900;

const rows = Math.ceil(VIRTUAL_HEIGHT / TILE_SIZE);
const cols = Math.ceil(VIRTUAL_WIDTH / TILE_SIZE);

const image = require("../../assets/background/starfield.png");

export default function TiledBackground() {
  const tiles = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      tiles.push(
        <Image
          key={`${x}-${y}`}
          source={image}
          style={{
            width: TILE_SIZE,
            height: TILE_SIZE,
            position: "absolute",
            left: x * TILE_SIZE,
            top: y * TILE_SIZE,
            borderWidth: 1,
          }}
        />
      );
    }
  }

  return (
    <View
      style={{
        width: VIRTUAL_WIDTH,
        height: VIRTUAL_HEIGHT,
        position: "absolute",
      }}
    >
      {tiles}
    </View>
  );
}
