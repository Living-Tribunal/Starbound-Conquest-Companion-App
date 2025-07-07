import React, { useMemo, useEffect, useRef, useState } from "react";
import { View, Image, Dimensions, Animated, StyleSheet } from "react-native";
import { useMapImageContext } from "../Global/MapImageContext";

export default function TileBackground({ panX, panY }) {
  const {
    MapImagesBackground,
    MapImage,
    MapImage2,
    MapImage3,
    tileSize,
    MapImage3Top,
    MapImage3Left,
    MapImageTop,
    MapImageLeft,
    MapImage2Left,
    MapImage2Top,
  } = useMapImageContext();
  const [loading, setLoading] = useState(true);
  const TILE_SIZE = tileSize;
  const WORLD_WIDTH = 1400 * 2;
  const WORLD_HEIGHT = 2900 * 2;
  //console.log("🧱 tileSize:", tileSize);
  const rows = Math.ceil(WORLD_HEIGHT / TILE_SIZE);
  const cols = Math.ceil(WORLD_WIDTH / TILE_SIZE);

  /*   console.log("🧱 MapImage:", MapImage);
  console.log("🧱 MapImagesBackground:", MapImagesBackground); */
  //console.log("🧱 TileBackground rendered");
  useEffect(() => {
    Animated.parallel([
      Animated.timing(panX, {
        toValue: panX,
        duration: 8,
        useNativeDriver: true,
      }),
      Animated.timing(panY, {
        toValue: panY,
        duration: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [panX, panY]);

  // Star tiles
  const tiles = useMemo(() => {
    const arr = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        arr.push(
          <Image
            key={`${x}-${y}`}
            source={MapImagesBackground}
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              position: "absolute",
              left: x * TILE_SIZE,
              top: y * TILE_SIZE,
            }}
          />
        );
      }
    }
    return arr;
  }, [MapImagesBackground]);

  return (
    <View
      style={{
        width: WORLD_WIDTH,
        height: WORLD_HEIGHT,
        position: "absolute",
      }}
    >
      {/* Tiled background */}
      {tiles}
      {/* Parallax planets */}
      <Animated.Image
        source={MapImage2}
        resizeMode="contain"
        style={{
          position: "absolute",
          width: 1324,
          height: 1324,
          top: MapImage2Top,
          left: MapImage2Left,
          transform: [
            { translateX: Animated.multiply(panX, 0.1) },
            { translateY: Animated.multiply(panY, 0.1) },
            { rotate: "160deg" },
          ],
        }}
      />
      <Animated.Image
        source={MapImage}
        resizeMode="contain"
        style={{
          position: "absolute",
          width: 1324,
          height: 1324,
          top: MapImageTop,
          left: MapImageLeft,
          transform: [
            { translateX: Animated.multiply(panX, 0.2) },
            { translateY: Animated.multiply(panY, 0.2) },
            { rotate: "0deg" },
          ],
        }}
      />
      <Animated.Image
        source={MapImage3}
        resizeMode="contain"
        style={{
          position: "absolute",
          width: 1324,
          height: 1324,
          top: MapImage3Top,
          left: MapImage3Left,
          transform: [
            { translateX: Animated.multiply(panX, 0.6) },
            { translateY: Animated.multiply(panY, 0.6) },
            { rotate: "90deg" },
          ],
        }}
      />
    </View>
  );
}
