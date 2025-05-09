import React, { createContext, useContext, useState } from "react";
import {
  SHIP_CAPACITY,
  SHIP_TOGGLES,
  SHIP_TOGGLES_DONE,
} from "@/constants/Ships";

const StarBoundContext = createContext();

export const StarBoundProvider = ({ children, shipType }) => {
  const [disabledButton, setDisabledButton] = React.useState(false);
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
  const [disabledButtonOnHit, setDisabledButtonOnHit] = useState(false);
  const [weaponId, setWeaponId] = useState(null);
  const [rolledD20, setRolledD20] = useState(null);
  const [gameRoom, setGameRoom] = useState(null);
  const [diceValueToShare, setDiceValueToShare] = useState(null);

  const [email, setEmail] = useState(null);

  const [text, setText] = useState("0");

  const [faction, setFaction] = useState("");
  const [getAllUsersShipToggled, setGetAllUsersShipToggled] = useState([]);

  const [showFighterClass, setShowFighterClass] = useState(true);
  const [showDestroyerClass, setShowDestroyerClass] = useState(true);
  const [showCarrierClass, setShowCarrierClass] = useState(true);
  const [showCruiserClass, setShowCruiserClass] = useState(true);
  const [showDreadnoughtClass, setShowDreadnoughtClass] = useState(true);
  const [username, setUsername] = useState("");
  const [toggleToDelete, setToggleToDelete] = useState(false);
  const [setDeleting, setSetDeleting] = useState(false);
  const [toggleSpecialOrders, setToggleSpecialOrders] = useState(false);
  const [allUsers, setAllUsers] = useState(null);
  const [allUsersShips, setAllUsersShips] = useState(null);
  const [singleUser, setSingleUser] = useState(null);
  const [singleUserShip, setSingleUserShip] = useState(null);
  const [expandUserShipList, setExpandUserShipList] = useState(false);
  const [hit, setHit] = useState(0);
  const [damageDone, setDamageDone] = useState(0);
  const [userFactionColor, setUserFactionColor] = useState(null);
  const [hasBeenInteractedWith, setHasBeenInteractedWith] = useState(false);

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
        rolledD20,
        setRolledD20,

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
        allUsers,
        setAllUsers,
        allUsersShips,
        setAllUsersShips,
        singleUser,
        setSingleUser,
        singleUserShip,
        setSingleUserShip,
        expandUserShipList,
        setExpandUserShipList,
        hit,
        setHit,
        damageDone,
        setDamageDone,
        disabledButton,
        setDisabledButton,
        disabledButtonOnHit,
        setDisabledButtonOnHit,
        weaponId,
        setWeaponId,
        gameRoom,
        setGameRoom,
        userFactionColor,
        setUserFactionColor,
        hasBeenInteractedWith,
        setHasBeenInteractedWith,
        getAllUsersShipToggled,
        setGetAllUsersShipToggled,
        diceValueToShare,
        setDiceValueToShare,
      }}
    >
      {children}
    </StarBoundContext.Provider>
  );
};

export const useStarBoundContext = () => useContext(StarBoundContext);
