import React, { createContext, useContext, useState } from "react";
import {
  SHIP_CAPACITY,
  SHIP_TOGGLES,
  SHIP_TOGGLES_DONE,
} from "@/constants/Ships";

const StarBoundContext = createContext();

export const StarBoundProvider = ({ children, shipType }) => {
  const [fighterImages, setFighterImages] = useState([]);
  const [destroyerImages, setDestroyerImages] = useState([]);
  const [cruiserImages, setCruiserImages] = useState([]);
  const [carrierImages, setCarrierImages] = useState([]);
  const [dreadnoughtImages, setDreadnoughtImages] = useState([]);
  const [serverConnected, setServerConnected] = useState(true);
  const [gameValue, setGameValue] = useState(0);
  const [selectedShip, setSelectedShip] = useState(null);
  const [turnTaken, setTurnTaken] = useState(0);
  const [hitPoints, setHitPoints] = useState(0);
  const [hitPointsColor, setHitPointsColor] = useState({});
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [profile, setProfile] = useState(null);
  const [data, setData] = useState([]);

  const [email, setEmail] = useState(null);

  const [text, setText] = useState("0");

  const [faction, setFaction] = useState("");

  const [showFighterClass, setShowFighterClass] = useState(true);
  const [showDestroyerClass, setShowDestroyerClass] = useState(true);
  const [showCarrierClass, setShowCarrierClass] = useState(true);
  const [showCruiserClass, setShowCruiserClass] = useState(true);
  const [showDreadnoughtClass, setShowDreadnoughtClass] = useState(true);
  const [username, setUsername] = useState("");
  const [toggleToDelete, setToggleToDelete] = useState(false);
  const [setDeleting, setSetDeleting] = useState(false);
  const [toggleSpecialOrders, setToggleSpecialOrders] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [toggleOrders, setToggleOrders] = useState(
    Array(SHIP_TOGGLES[shipType]).fill(false)
  );

  const [toggleCapacity, setToggleCapacity] = useState(
    Array(SHIP_CAPACITY[shipType]).fill(false)
  );

  const [toggleDoneState, setToggleDoneState] = useState(
    Array(SHIP_TOGGLES_DONE[shipType]).fill(false)
  );

  return (
    <StarBoundContext.Provider
      value={{
        fighterImages,
        setFighterImages,
        destroyerImages,
        setDestroyerImages,
        cruiserImages,
        setCruiserImages,
        carrierImages,
        setCarrierImages,
        dreadnoughtImages,
        setDreadnoughtImages,

        showFighterClass,
        setShowFighterClass,
        showDestroyerClass,
        setShowDestroyerClass,
        showCarrierClass,
        setShowCarrierClass,
        showCruiserClass,
        setShowCruiserClass,
        showDreadnoughtClass,
        setShowDreadnoughtClass,
        turnTaken,
        setTurnTaken,

        toggleOrders,
        setToggleOrders,
        toggleCapacity,
        setToggleCapacity,
        toggleDoneState,
        setToggleDoneState,

        isModalVisible,
        setIsModalVisible,
        username,
        setUsername,

        text,
        setText,

        faction,
        setFaction,

        profile,
        setProfile,

        data,
        setData,
        email,
        setEmail,
        serverConnected,
        setServerConnected,
        gameValue,
        setGameValue,
        selectedShip,
        setSelectedShip,
        toggleToDelete,
        setToggleToDelete,
        setDeleting,
        setSetDeleting,
        hitPoints,
        setHitPoints,
        hitPointsColor,
        setHitPointsColor,
        userProfilePicture,
        setUserProfilePicture,
        toggleSpecialOrders,
        setToggleSpecialOrders,
      }}
    >
      {[children, shipType]}
    </StarBoundContext.Provider>
  );
};

export const useStarBoundContext = () => useContext(StarBoundContext);
