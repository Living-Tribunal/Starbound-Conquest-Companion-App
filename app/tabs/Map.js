import React, { useEffect, useRef, useState, useCallback } from "react";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { MapImages } from "@/components/sector/MapImages";
import { Image, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { MapSector } from "@/components/sector/MapSector";

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
          source={require("../../assets/background/background/galaxy1.png")}
          style={{
            width: 2000,
            height: 3000,
            transform: [{ scale: 1 }],
            position: "absolute",
          }}
        />
        <MapSector
          navigation={navigation}
          tileSize={400}
          NavToSector="GameMap"
          top={400}
          left={-400}
          SectorName="Crucible of Raths"
          MapImagesBackground={MapImages.colorStars}
          MapImage={MapImages.planetBottom}
          MapImageTop={1800}
          MapImageLeft={200}
          MapImage2={MapImages.greenplanet}
          MapImage2Top={400}
          MapImage2Left={500}
          MapImage3={null}
          MapImage3Top={null}
          MapImage3Left={null}
        />
        <MapSector
          navigation={navigation}
          NavToSector="GameMap"
          tileSize={1000}
          top={-1000}
          left={-400}
          SectorName="Echoes of Purgatis"
          MapImagesBackground={MapImages.starsImage}
          MapImage={null}
          MapImageTop={null}
          MapImageLeft={null}
          MapImage2={MapImages.largeShip}
          MapImage2Top={1000}
          MapImage2Left={500}
          MapImage3={null}
          MapImage3Top={null}
          MapImage3Left={null}
        />
        <MapSector
          navigation={navigation}
          NavToSector="GameMap"
          tileSize={1000}
          top={-600}
          left={600}
          SectorName="The Ashward Maw"
          MapImagesBackground={MapImages.nebAshward}
          MapImage={null}
          MapImageTop={null}
          MapImageLeft={null}
          MapImage2={MapImages.ringworld}
          MapImage2Top={1000}
          MapImage2Left={500}
          MapImage3={null}
          MapImage3Top={null}
          MapImage3Left={null}
        />
        <MapSector
          navigation={navigation}
          NavToSector="GameMap"
          tileSize={1000}
          top={1000}
          left={600}
          SectorName="The Deadward Coil"
          MapImagesBackground={MapImages.starsImage}
          MapImage={MapImages.breaking}
          MapImageTop={1800}
          MapImageLeft={800}
          MapImage2={null}
          MapImage2Top={null}
          MapImage2Left={null}
          MapImage3={MapImages.debris}
          MapImage3Top={1500}
          MapImage3Left={1200}
        />
        <MapSector
          navigation={navigation}
          NavToSector="GameMap"
          tileSize={800}
          top={1000}
          left={-600}
          SectorName={"The Cogspire Belt"}
          MapImagesBackground={MapImages.starsImage}
          MapImage={null}
          MapImage2={MapImages.planet}
          MapImage2Top={1000}
          MapImage2Left={500}
          MapImage3={null}
          MapImage3Top={null}
          MapImage3Left={null}
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
