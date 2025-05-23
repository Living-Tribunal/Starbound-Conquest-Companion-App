import React, { createContext, useContext, useState } from "react";

const MapImageContext = createContext();

export const MapImageProvider = ({ children }) => {
  const [MapImagesBackground, setMapImagesBackground] = useState(null);
  const [MapImage, setMapImage] = useState(null);
  const [MapImage2, setMapImage2] = useState(null);
  const [MapImage3, setMapImage3] = useState(null);
  const [gameSectors, setGameSectors] = useState("Show All Ships");
  const [tileSize, setTileSize] = useState(900);
  const [MapImage3Top, setMapImage3Top] = useState(null);
  const [MapImage3Left, setMapImage3Left] = useState(null);
  const [MapImageTop, setMapImageTop] = useState(null);
  const [MapImageLeft, setMapImageLeft] = useState(null);
  const [MapImage2Top, setMapImage2Top] = useState(null);
  const [MapImage2Left, setMapImage2Left] = useState(null);

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
        MapImage3Top,
        setMapImage3Top,
        MapImage3Left,
        setMapImage3Left,
        MapImageTop,
        setMapImageTop,
        MapImageLeft,
        setMapImageLeft,
        MapImage2Top,
        setMapImage2Top,
        MapImage2Left,
        setMapImage2Left,
      }}
    >
      {children}
    </MapImageContext.Provider>
  );
};

export const useMapImageContext = () => useContext(MapImageContext);
