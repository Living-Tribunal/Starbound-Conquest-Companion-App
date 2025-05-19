import { View, Image, Dimensions } from "react-native";

const TILE_SIZE = 256;
const screen = Dimensions.get("window");

const rows = Math.ceil((screen.height / TILE_SIZE) * 3);
const cols = Math.ceil((screen.width / TILE_SIZE) * 6);
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
            width: TILE_SIZE / 1.5,
            height: TILE_SIZE / 1.5,
            position: "absolute",
            left: (x * TILE_SIZE) / 1.5,
            top: (y * TILE_SIZE) / 1.5,
          }}
        />
      );
    }
  }

  return <View style={{ flex: 1 }}>{tiles}</View>;
}
