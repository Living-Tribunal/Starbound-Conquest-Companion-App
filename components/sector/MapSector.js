import { TouchableOpacity, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useMapImageContext } from "@/components/Global/MapImageContext";
import { useEffect } from "react";

export const MapSector = ({
  navigation,
  NavToSector,
  top,
  left,
  MapImagesBackground,
  MapImage,
  MapImage2,
  MapImage3,
  SectorName,
  tileSize,
}) => {
  const {
    setMapImagesBackground,
    setMapImage,
    setMapImage2,
    setMapImage3,
    setGameSectors,
    setTileSize,
  } = useMapImageContext();
  const handlePress = () => {
    setMapImagesBackground(MapImagesBackground || null);
    setMapImage(MapImage || null);
    setMapImage2(MapImage2 || null);
    setMapImage3(MapImage3 || null);
    setTileSize(tileSize || null);
    setGameSectors(SectorName || null);
    setTimeout(() => {
      navigation.navigate(NavToSector, { sector: SectorName });
    }, 100);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        position: "absolute",
        borderWidth: 3,
        borderColor: Colors.hud,
        top: top,
        left: left,
        backgroundColor: Colors.hudDarker,
        borderRadius: 10,
        padding: 10,
        width: 500,
      }}
    >
      <Text style={{ textAlign: "center", color: Colors.hud, fontSize: 40 }}>
        {SectorName}
      </Text>
    </TouchableOpacity>
  );
};
