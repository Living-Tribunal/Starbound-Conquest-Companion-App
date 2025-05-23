import React, { useEffect, useRef, useState, useCallback } from "react";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { MapImages } from "@/components/sector/MapImages";
import { Image, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { MapSector } from "@/components/sector/MapSector";
import { useMapImageContext } from "@/components/Global/MapImageContext";

export default function Map() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <ReactNativeZoomableView
        maxZoom={1.5}
        minZoom={0.25}
        zoomStep={0.5}
        initialZoom={0.25}
        bindToBorders={true}
        style={{
          padding: 10,
          backgroundColor: Colors.hudDarker,
        }}
        contentWidth={2000}
        contentHeight={3000}
      >
        <Image
          source={require("../../assets/background/background/galaxymap.jpg")}
          style={{
            width: 2000,
            height: 3000,
            transform: [{ scale: 1 }],
            position: "absolute",
          }}
        />
        <MapSector
          navigation={navigation}
          NavToSector="GameMap"
          top={500}
          left={400}
          SectorName="Crucible of Raths"
          MapImagesBackground={MapImages.starsImage}
          MapImage={MapImages.planetBottom}
          MapImage2={MapImages.greenplanet}
          MapImage3={null}
        />
        <MapSector
          navigation={navigation}
          NavToSector="GameMap"
          top={-1000}
          left={-400}
          SectorName="Echoes of Purgatis"
          MapImagesBackground={MapImages.metal}
          MapImage={MapImages.city}
          MapImage2={null}
          MapImage3={null}
        />
        <MapSector
          navigation={navigation}
          NavToSector="GameMap"
          top={-600}
          left={600}
          SectorName="The Ashward Maw"
          MapImagesBackground={MapImages.starsImage}
          MapImage={MapImages.planetBreaking1}
          MapImage2={null}
          MapImage3={null}
        />
        <MapSector
          navigation={navigation}
          NavToSector="GameMap"
          top={1000}
          left={600}
          SectorName="The Deadward Coil"
          MapImagesBackground={MapImages.starsImage}
          MapImage={MapImages.breaking}
          MapImage2={null}
          MapImage3={MapImages.debris}
        />
        <MapSector
          navigation={navigation}
          NavToSector="GameMap"
          top={1000}
          left={-600}
          SectorName={"The Cogspire Belt"}
          MapImagesBackground={MapImages.starsImage}
          MapImage={MapImages.planet}
          MapImage2={null}
          MapImage3={MapImages.pinkNebulae}
        />
      </ReactNativeZoomableView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
});
