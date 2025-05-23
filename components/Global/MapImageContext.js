import React, { createContext, useContext, useState } from "react";

const MapImageContext = createContext();

export const MapImageProvider = ({ children }) => {
  const [MapImagesBackground, setMapImagesBackground] = useState(null);
  const [MapImage, setMapImage] = useState(null);
  const [MapImage2, setMapImage2] = useState(null);
  const [MapImage3, setMapImage3] = useState(null);
  const [gameSectors, setGameSectors] = useState("Show All Ships");
  const [tileSize, setTileSize] = useState(900);

  return (
    <MapImageContext.Provider
      value={{
        MapImagesBackground,
        setMapImagesBackground,
        MapImage,
        setMapImage,
        MapImage2,
        MapImage3,
        setMapImage2,
        setMapImage3,
        gameSectors,
        setGameSectors,
        tileSize,
        setTileSize,
      }}
    >
      {children}
    </MapImageContext.Provider>
  );
};

export const useMapImageContext = () => useContext(MapImageContext);
