import React, { createContext, useContext, useState } from "react";

const StarBoundContext = createContext();

export const StarBoundProvider = ({ children, shipType }) => {
  const [disabledButton, setDisabledButton] = React.useState(false);
  const [isUsersTurn, setIsUsersTurn] = useState(false);
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
  const [gameRoomID, setGameRoom] = useState(null);
  const [diceValueToShare, setDiceValueToShare] = useState(null);
  const [email, setEmail] = useState(null);
  const [text, setText] = useState("0");
  const [faction, setFaction] = useState("");
  const [getAllUsersShipToggled, setGetAllUsersShipToggled] = useState([]);
  const [fromGameMap, setFromGameMap] = useState(null);
  const [username, setUsername] = useState("");
  const [toggleToDelete, setToggleToDelete] = useState(false);
  const [setDeleting, setSetDeleting] = useState(false);
  const [toggleSpecialOrders, setToggleSpecialOrders] = useState(false);
  const [allUsers, setAllUsers] = useState(null);
  const [allUsersShips, setAllUsersShips] = useState(null);
  const [singleUser, setSingleUser] = useState(null);
  const [singleUserShip, setSingleUserShip] = useState(null);
  const [expandUserShipList, setExpandUserShipList] = useState(false);
  const [hit, setHit] = useState(false);
  const [damageDone, setDamageDone] = useState(0);
  const [userFactionColor, setUserFactionColor] = useState(null);
  const [hasBeenInteractedWith, setHasBeenInteractedWith] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [myShips, setMyShips] = useState([]);

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

        turnTaken,
        setTurnTaken,

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
        gameRoomID,
        setGameRoom,
        userFactionColor,
        setUserFactionColor,
        hasBeenInteractedWith,
        setHasBeenInteractedWith,
        getAllUsersShipToggled,
        setGetAllUsersShipToggled,
        diceValueToShare,
        setDiceValueToShare,
        fromGameMap,
        setFromGameMap,
        isUsersTurn,
        setIsUsersTurn,
        myShips,
        setMyShips,
      }}
    >
      {children}
    </StarBoundContext.Provider>
  );
};

export const useStarBoundContext = () => useContext(StarBoundContext);
