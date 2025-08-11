import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";
import { useMapImageContext } from "../../components/Global/MapImageContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import ShipFlatlist from "../../components/shipdata/ShipFlatlist";
import { getFleetData } from "../../components/API/API";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { shipObject } from "../../constants/shipObjects";
import Toast from "react-native-toast-message";
import LoadingComponent from "../../components/loading/LoadingComponent";
import { factionIcons } from "../../constants/shipIcons";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import DropdownComponentSectors from "../../components/dropdown/DropdownComponentSectors";
import { ActivityIndicator } from "react-native";
import EndRoundModal from "../../components/Modals/EndRoundModal/EndRoundModal";
import EndTurnModal from "../../components/Modals/EndTurnModal/EndTurnModal";
import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
  updateDoc,
  doc,
  addDoc,
  setDoc,
  increment,
  onSnapshot,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";

export default function Player() {
  const ref = useRef();
  const user = FIREBASE_AUTH.currentUser;
  const tabBarHeight = useBottomTabBarHeight();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowWarning, setIsShowWarning] = useState(false);
  const [shipCounts, setShipCounts] = useState({});
  const [numberOfShips, setNumberOfShips] = useState(0);
  const [showEndOfRound, setShowEndOfRound] = useState(false);
  const [gameRound, setGameRound] = useState(0);
  const [getAllUsersShipTotals, setGetAllUsersShipTotals] = useState(0);
  const { gameSectors, setGameSectors } = useMapImageContext();
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [isUsersColors, setIsUsersColors] = useState(false);
  const [showEndRoundModal, setShowEndRoundModal] = useState(false);
  const [isShowPlayers, setIsShowPlayers] = useState(true);
  const [playersInGameRoom, setPlayersInGameRoom] = useState([]);
  const [shouldEndRound, setShouldEndRound] = useState(false);
  const [isLoadingActivePlayers, setIsLoadingActivePlayers] = useState(false);
  const [showEndTurnModal, setShowEndTurnModal] = useState(false);
  const [isShowRules, setIsShowRules] = useState(false);

  const {
    isUsersTurn,
    setIsUsersTurn,
    username,
    setUsername,
    profile,
    faction,
    setFaction,
    setProfile,
    data,
    setData,
    gameValue,
    setGameValue,
    toggleToDelete,
    setToggleToDelete,
    gameRoom,
    setGameRoom,
    userFactionColor,
    setUserFactionColor,
    getAllUsersShipToggled,
    setGetAllUsersShipToggled,
    myShips,
    setMyShips,
  } = useStarBoundContext();

  const hasShownEndRoundModal = useRef(false);

  const currentTurnUid = Object.keys(isUsersTurn).find(
    (uid) => isUsersTurn[uid]
  );
  const isPlayerTurn = isUsersTurn?.[user?.uid] === true;

  const currentTurnColor = isUsersColors?.[currentTurnUid] || "#FFFFFF";

  const currentUserShips = playersInGameRoom.some((player) => {
    if (player.uid === user.uid) {
      const currentUserShips = getAllUsersShipToggled.filter(
        (ship) => ship.user === user.uid
      );
      if (currentUserShips.length === 0) return false;
      return (
        currentUserShips.length === 0 ||
        currentUserShips.every(
          (ship) => ship.isToggled || ship.isPendingDestruction
        )
      );
    }
    return false;
  });

  const canEndRoundForAllPlayers = playersInGameRoom
    .filter((player) => player.uid !== user.uid)
    .every((player) => {
      const otherPlayerShips = getAllUsersShipToggled.filter(
        (ship) => ship.user === player.uid
      );
      if (otherPlayerShips.length === 0) return false;
      return (
        otherPlayerShips.length === 0 ||
        otherPlayerShips.every(
          (ship) => ship.isToggled || ship.isPendingDestruction
        )
      );
    });

  //if everyone can end the round, then can end the round
  const canEndRoundForEveryone = canEndRoundForAllPlayers && currentUserShips;

  //filtering out the ships from the current user
  const uid = user?.uid ?? null;

  const myShipsToSave = useMemo(() => {
    const all = getAllUsersShipToggled ?? [];
    if (!uid) return [];
    return all.filter((s) => s?.user === uid);
  }, [getAllUsersShipToggled, uid]);

  // optional: shallow equality on IDs to avoid re-renders
  const sameIds = (a, b) => {
    if (a.length !== b.length) return false;
    const bIds = new Set(b.map((x) => x.shipId ?? x.id));
    return a.every((x) => bIds.has(x.shipId ?? x.id));
  };

  useEffect(() => {
    setMyShips((prev) => (sameIds(prev, myShipsToSave) ? prev : myShipsToSave));
  }, [myShipsToSave, setMyShips]);

  //get the number of ships that are toggled or pending destruction
  const myToggledOrDestroyingShips =
    myShips.length > 0 &&
    myShips.every((ship) => ship.isToggled || ship.isPendingDestruction);

  //get the number of ships that ARE toggled
  const myToggledShipsCount = myShips.filter((ship) => ship.isToggled).length;

  //get all ships by sector for user
  /*   const myShipsBySector = myShips.reduce((acc, ship) => {
    const sector = ship.gameSector || "Unassigned";
    if (!acc[sector]) acc[sector] = [];
    acc[sector].push(ship);
    return acc;
  }, {}); */

  //get ships not toggled count using length
  const myUntoggledShipsCount = myShips.filter(
    (ship) => !ship.isToggled && !ship.isPendingDestruction
  ).length;

  //get the actual ships that are untoggled
  const myUntoggledShips = myShips.filter(
    (ship) => !ship.isToggled && !ship.isPendingDestruction
  );

  //reduce the untoggled ships to a dictionary of sectors and ships
  const myUntoggledShipsBySector = myUntoggledShips.reduce((acc, ship) => {
    const sector = ship.gameSector || "Unassigned";
    if (!acc[sector]) acc[sector] = [];
    acc[sector].push(ship);
    return acc;
  }, {});

  const shipInSector = useMemo(() => {
    if (!myShips || !Array.isArray(myShips)) return [];
    return gameSectors === "Show All Ships..."
      ? myShips
      : myShips.filter((ship) => ship.gameSector === gameSectors);
  }, [myShips, gameSectors]);

  //assign that to a variable to check if there are any ships
  const hasNoShips = myShips.length === 0;
  //console.log("hasNoShips:", hasNoShips);
  //console.log("Game Sectors:", gameSectors);
  const onCancelWarning = () => {
    setIsShowWarning(false);
    setToggleToDelete(false);
  };

  const onConfirmWarning = () => {
    setIsShowWarning(false);
    setToggleToDelete(true);
    // console.log("Toggled:", toggleToDelete);
  };

  const valueWarning = () => {
    if (totalFleetValue > gameValue) {
      return (
        <Text style={styles.valueWarning}>
          Warning: You are over your game value limit.
        </Text>
      );
    }
  };

  const getRandomColorForCarrier = () => {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  };

  const saveCharacterImage = async () => {
    try {
      ref.current.capture().then(async (uri) => {
        await Share.open({
          url: "file://" + uri, // add explicit scheme
          type: "image/png",
          failOnCancel: false,
          message: user.displayName + "'s Character Image",
        });
      });
    } catch (error) {
      console.error("Error saving character image:", error);
    }
  };

  //console.log("PLayers Done:", canEndRoundForAllPlayers);

  //console.log("Ship Length:", data);
  //so ship ids arent too crazy long
  function generateShortId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 4; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  const addShipToFleet = async (shipData, count = 1) => {
    //console.log("Button Pressed: ", JSON.stringify(shipData, null, 2));
    //console.log("Players Faction: ", faction);

    if (!user || !gameSectors || gameSectors === "Show All Ships..." || null) {
      Toast.show({
        type: "error",
        text1: "Starbound Conquest",
        text2: "You must select a sector to deploy to.",
        position: "top",
      });
      return;
    }

    setIsLoading(true);

    try {
      for (let i = 0; i < count; i++) {
        const newShipId =
          Date.now().toString() + "_" + Math.floor(Math.random() * 10000);

        const ShipId = generateShortId();

        const shipToSave = {
          ...shipData,
          id: newShipId,
          shipId: ShipId,
          user: user.uid,
          username: username || "Commander",
          factionName: faction,
          isSelected: false,
          isToggled: false,
          hasBeenInteractedWith: false,
          gameRoom: gameRoom,
          factionColor: userFactionColor,
          hit: false,
          miss: false,
          hasRolledDToHit: false,
          round: 0,
          shipInterval: 0,
          gameSector: gameSectors,
          protectedByCarrierID: null,
          numberOfShipsProtecting: 0,
          color: getRandomColorForCarrier(),
          specialOrdersAttempted: {},
          isPendingDestruction: false,
          specialWeaponStatusAttempted: {},
        };
        // Add to Firestore
        const docRef = await addDoc(
          collection(FIREBASE_DB, "users", user.uid, "ships"),
          shipToSave
        );

        //console.log("Ship added with ID:", docRef.id);
        // After adding, update it to include the doc ID
        await setDoc(docRef, { id: docRef.id }, { merge: true });
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      getFleetData({ data, setData, setUsersInRoom, gameRoom, gameSectors });
      setIsLoading(false);
    }
  };

  const totalFleetValue = data
    ? data.reduce((sum, ship) => sum + (ship.pointValue || 0), 0)
    : 0;

  useEffect(() => {
    if (!FIREBASE_AUTH.currentUser) return;
    if (!user) return;
    const userDocRef = doc(FIREBASE_DB, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.displayName || "");
        setProfile(data.photoURL || "");
        setFaction(data.factionName || "");
        setGameRoom(data.gameRoom || "");
        setUserFactionColor(data.userFactionColor || "");
        setGameValue(data.gameValue || "");
      }
    });
    return () => unsubscribe();
  }, [user?.uid, FIREBASE_AUTH.currentUser]);

  useEffect(() => {
    const fetchShipCount = async () => {
      if (!user || !gameRoom) return;

      const shipsRef = query(
        collection(FIREBASE_DB, "users", user.uid, "ships"),
        where("gameRoom", "==", gameRoom)
      );

      try {
        const countSnap = await getCountFromServer(shipsRef);
        setNumberOfShips(countSnap.data().count);
      } catch (err) {
        console.error("Failed to get ship count:", err);
      }
    };

    fetchShipCount();
  }, [user?.uid, gameRoom]);

  const incrementShipCount = (type) => {
    setShipCounts((prev) => ({
      ...prev,
      [type]: (prev[type] || 1) + 1,
    }));
  };

  const decrementShipCount = (type) => {
    setShipCounts((prev) => ({
      ...prev,
      [type]: Math.max(1, (prev[type] || 1) - 1),
    }));
  };

  const createShipForFleet = () => {
    if (!faction || faction === "Choose a Faction") return [];

    const factionData = shipObject[faction];
    if (!factionData) return [];

    return [
      {
        type: "Destroyer",
        fleetClass: "fleetDestroyer",
        ships: [factionData.destroyer],
      },
      {
        type: "Cruiser",
        fleetClass: "fleetCruiser",
        ships: [factionData.cruiser],
      },
      {
        type: "Carrier",
        fleetClass: "fleetCarrier",
        ships: [factionData.carrier],
      },
      {
        type: "Dreadnought",
        fleetClass: "fleetDreadnought",
        ships: [factionData.dreadnought],
      },
    ];
  };

  const fleetData = createShipForFleet(faction);

  /* console.log(JSON.stringify(totalFleetValue) + " In Player"); */

  function send_message_discord_end_of_round() {
    console.log("Discord message sent ending round");
    const request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://discord.com/api/webhooks/1400193103775793282/2Rz9AIJTztHwqS8B2OINDmUHy-In76UWV5NBkCnQkBVdBPpedCrPmV0njSE4t4KIDYat"
    );
    request.setRequestHeader("Content-Type", "application/json");
    const params = {
      username: "Starbound Conquest",
      avatar_url: "",
      content: `The Round has ended in ${gameRoom}. Resetting your ships.`,
    };
    request.send(JSON.stringify(params));
  }

  async function endTurnWarning() {
    Toast.show({
      type: "info",
      text1: "Starbound Conquest",
      text2: "If you want to end your turn early, long press the button.",
      position: "top",
    });
  }

  async function endYourTurnAndSendMessage() {
    /*  if (!myToggledOrDestroyingShips) {
      Toast.show({
        type: "error",
        text1: "Starbound Conquest",
        text2: "You have ships left to deploy.",
        position: "top",
      });
      return;
    } */

    try {
      // 1. Get players
      const usersRef = collection(FIREBASE_DB, "users");
      const usersQuery = query(usersRef, where("gameRoom", "==", gameRoom));
      const snapshot = await getDocs(usersQuery);

      const players = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      const sortedPlayers = players.sort((a, b) => a.uid.localeCompare(b.uid));
      const currentIndex = sortedPlayers.findIndex((p) => p.uid === user.uid);
      const nextIndex = (currentIndex + 1) % sortedPlayers.length;
      const currentPlayer = sortedPlayers[currentIndex];
      const nextPlayer = sortedPlayers[nextIndex];

      // 2. Update turn state in Firestore
      const currentRef = doc(FIREBASE_DB, "users", currentPlayer.uid);
      const nextRef = doc(FIREBASE_DB, "users", nextPlayer.uid);
      await Promise.all([
        updateDoc(currentRef, { isUserTurn: false }),
        updateDoc(nextRef, { isUserTurn: true }),
      ]);

      //3. Update ship isToggled for non-toggled ships
      const shipsRef = collection(FIREBASE_DB, "users", user.uid, "ships");
      const shipsSnap = await getDocs(shipsRef);
      const batch = writeBatch(FIREBASE_DB);

      shipsSnap.forEach((docSnap) => {
        const shipData = docSnap.data();
        if (!shipData.isToggled && !shipData.isPendingDestruction) {
          batch.update(docSnap.ref, {
            isToggled: true,
            shipActions: {
              move: shipData.shipActions?.move || false,
              attack: shipData.shipActions?.attack || false,
              specialOrder: shipData.shipActions?.specialOrder || false,
            },
          });
        }
      });

      await batch.commit();

      // 4. THEN send Discord message
      const discordMessage = {
        username: "Starbound Conquest",
        avatar_url: "",
        content: `${username} has ended their turn in ${gameRoom}. ${nextPlayer.displayName} is up next!`,
      };
      await fetch(
        "https://discord.com/api/webhooks/1400193598691217428/wIGjO6m0CUTV1rEanECgljpMRyWbrkLoP0nUtdqDerJOvHzYeOCjgOKx25ImJU8vFoi1",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordMessage),
        }
      );

      // 4. Toast confirmation
      Toast.show({
        type: "success",
        text1: "Turn Ended",
        text2: `${nextPlayer.displayName} is up next!`,
        position: "top",
      });
    } catch (error) {
      console.error("Error ending turn:", error);
      Toast.show({
        type: "error",
        text1: "Error ending turn",
        text2: "Please try again.",
        position: "top",
      });
    }
  }

  //reset the round for the current user IF there are no ships in the fleet from ANYONE
  const resetRoundForCurretUser = async () => {
    if (!user || !gameRoom) return;
    //console.log(hasNoShips, getAllUsersShipToggled.length);

    if (!hasNoShips || getAllUsersShipToggled.length > 0) {
      Toast.show({
        type: "error",
        text1: "There are ships on the field",
        text2: "Cannot reset round",
        position: "top",
      });
      return;
    }

    if (getAllUsersShipToggled.length <= 0)
      // console.log("Resetting round for current user");
      try {
        const userRef = doc(FIREBASE_DB, "users", user.uid);
        await updateDoc(userRef, {
          round: 0,
        });
        Toast.show({
          type: "success",
          text1: "Round reset for current user",
          text2: "Round reset to 0",
          position: "top",
        });
        //console.log("Round reset for current user");
      } catch (error) {
        console.error("Error resetting round for current user:", error);
      }
  };

  //users in a game room, increment the round
  const updateRoundForAllUsers = async () => {
    if (!user || !gameRoom) return;
    const usersCollection = collection(FIREBASE_DB, "users");
    const myQuery = query(usersCollection, where("gameRoom", "==", gameRoom));
    const querySnapshot = await getDocs(myQuery);
    const updatePromises = querySnapshot.docs.map((doc) => {
      updateDoc(doc.ref, {
        round: increment(1),
      });
    });
    await Promise.all(updatePromises);
  };

  //clean up ships with isPendingDestruction
  const cleanUpPendingDestruction = async () => {
    if (!gameRoom) return;

    const usersRef = collection(FIREBASE_DB, "users");
    const userQuery = query(usersRef, where("gameRoom", "==", gameRoom));
    const userSnapshots = await getDocs(userQuery);

    const batch = writeBatch(FIREBASE_DB);

    for (const userDoc of userSnapshots.docs) {
      const userId = userDoc.id;
      const shipsRef = collection(FIREBASE_DB, "users", userId, "ships");
      const shipsSnap = await getDocs(shipsRef);

      shipsSnap.docs.forEach((shipDoc) => {
        const shipData = shipDoc.data();
        if (shipData.isPendingDestruction) {
          const shipRef = doc(
            FIREBASE_DB,
            "users",
            userId,
            "ships",
            shipDoc.id
          );
          batch.delete(shipRef);
        }
      });
    }

    try {
      await batch.commit();
      console.log("All pending destruction ships deleted.");
    } catch (error) {
      console.error("Error cleaning up pending ships:", error);
    }
  };

  //listen for gameround changes and update the round for all users
  useEffect(() => {
    if (!FIREBASE_AUTH.currentUser || !user || !gameRoom) return;
    const docRef = doc(FIREBASE_DB, "users", user.uid); // or "gameRooms", depending on your structure

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setGameRound(docSnap.data().round);
      }
    });

    return () => unsubscribe();
  }, [gameRoom, user?.uid, FIREBASE_AUTH.currentUser]);

  useEffect(() => {
    const count = getAllUsersShipToggled.filter((s) => s.isToggled).length;
    setGetAllUsersShipTotals(count);
  }, [getAllUsersShipToggled]);

  useEffect(() => {
    if (!FIREBASE_AUTH.currentUser || !gameRoom) return;

    const ref = query(
      collection(FIREBASE_DB, "users", user.uid, "ships"),
      where("gameRoom", "==", gameRoom)
    );

    const unsubscribe = onSnapshot(ref, (snap) => {
      const userShips = snap.docs.map((doc) => doc.data());
      setData(userShips); // live update your fleet
      setNumberOfShips(userShips.length); // keep ship count updated
    });

    return () => unsubscribe();
  }, [FIREBASE_AUTH.currentUser, gameRoom]);

  const endRound = async () => {
    if (!user || !gameRoom) return;
    setShowEndOfRound(true);

    try {
      const allResetPromises = [];

      // restting my ships back to default values
      const myShipsRef = collection(FIREBASE_DB, "users", user.uid, "ships");
      const myShipsSnapshot = await getDocs(myShipsRef);

      for (const myShipDoc of myShipsSnapshot.docs) {
        const myShipData = myShipDoc.data();
        const myShipDocRef = doc(
          FIREBASE_DB,
          "users",
          user.uid,
          "ships",
          myShipDoc.id
        );

        let newSpecialOrders = {};
        let newShipActions = {};
        let newShipWeaponStatus = {};
        let newSpecialWeaponAttemptedStatus = {};

        const specialOrdesToPersist = ["Launch Fighters"];

        if (myShipData.weaponStatusAttempted) {
          Object.keys(myShipData.specialWeaponStatusAttempted).forEach(
            (weapon) => {
              newSpecialWeaponAttemptedStatus[weapon] = false;
            }
          );
        }

        if (myShipData.weaponStatus) {
          Object.keys(myShipData.weaponStatus).forEach((weapon) => {
            newShipWeaponStatus[weapon] = false;
          });
        }

        if (myShipData.specialOrders) {
          Object.keys(myShipData.specialOrders).forEach((order) => {
            newSpecialOrders[order] = specialOrdesToPersist.includes(order)
              ? myShipData.specialOrders[order]
              : false;
          });
        }

        if (myShipData.shipActions) {
          Object.keys(myShipData.shipActions).forEach((key) => {
            newShipActions[key] = false;
          });
        }

        const stillHasActiveSpecialOrders =
          Object.values(newSpecialOrders).some(Boolean);

        if (stillHasActiveSpecialOrders) {
          newShipActions["specialOrder"] = true;
        }

        allResetPromises.push(
          updateDoc(myShipDocRef, {
            isToggled: false,
            specialOrders: newSpecialOrders,
            specialOrdersAttempted: {},
            hasBeenInteractedWith: false,
            hit: false,
            miss: false,
            hasRolledDToHit: false,
            shipInterval: increment(1),
            distanceTraveled: 0,
            shipActions: newShipActions,
            weaponStatus: newShipWeaponStatus,
            bonuses: {
              broadSideBonus: 0,
              inFighterRangeBonus: 0,
              moveDistanceBonus: 0,
            },
            specialWeaponStatusAttempted: newSpecialWeaponAttemptedStatus,
          })
        );
      }

      // reset the opponents ships to default values
      const usersRef = collection(FIREBASE_DB, "users");
      const opponentsQuery = query(
        usersRef,
        where("gameRoom", "==", gameRoom),
        where("email", "!=", user.email)
      );
      const opponentSnapshots = await getDocs(opponentsQuery);

      for (const opponentDoc of opponentSnapshots.docs) {
        const opponentId = opponentDoc.id;
        const opponentShipsRef = collection(
          FIREBASE_DB,
          "users",
          opponentId,
          "ships"
        );
        const opponentShipsSnapshot = await getDocs(opponentShipsRef);
        //console.log("ship snaps in player:", opponentShipsSnapshot);

        for (const shipDoc of opponentShipsSnapshot.docs) {
          const shipData = shipDoc.data();
          const shipDocRef = doc(
            FIREBASE_DB,
            "users",
            opponentId,
            "ships",
            shipDoc.id
          );

          let newSpecialOrders = {};
          let newShipActions = {};
          let newShipWeaponStatus = {};
          let newSpecialWeaponAttemptedStatus = {};

          const specialOrdersToPersistForOpponent = ["Launch Fighters"];

          if (shipData.weaponStatusAttempted) {
            Object.keys(shipData.specialWeaponStatusAttempted).forEach(
              (weapon) => {
                newSpecialWeaponAttemptedStatus[weapon] = false;
              }
            );
          }

          if (shipData.weaponStatus) {
            Object.keys(shipData.weaponStatus).forEach((weapon) => {
              newShipWeaponStatus[weapon] = false;
            });
          }

          if (shipData.specialOrders) {
            Object.keys(shipData.specialOrders).forEach((key) => {
              newSpecialOrders[key] =
                specialOrdersToPersistForOpponent.includes(key)
                  ? shipData.specialOrders[key]
                  : false;
            });
          }
          if (shipData.shipActions) {
            Object.keys(shipData.shipActions).forEach((key) => {
              newShipActions[key] = false;
            });
          }

          const opponentStillHasActiveSpecialOrders =
            Object.values(newSpecialOrders).some(Boolean);

          if (opponentStillHasActiveSpecialOrders) {
            newShipActions["specialOrder"] = true;
          }

          allResetPromises.push(
            updateDoc(shipDocRef, {
              isToggled: false,
              hasBeenInteractedWith: false,
              hit: false,
              miss: false,
              hasRolledDToHit: false,
              shipInterval: increment(1),
              distanceTraveled: 0,
              specialOrdersAttempted: {},
              shipActions: newShipActions,
              specialOrders: newSpecialOrders,
              weaponStatus: newShipWeaponStatus,
              bonuses: {
                broadSideBonus: 0,
                inFighterRangeBonus: 0,
                moveDistanceBonus: 0,
              },
              specialWeaponStatusAttempted: newSpecialWeaponAttemptedStatus,
            })
          );
        }
      }
      // ✅ First, reset ships for all players
      await Promise.all(allResetPromises);

      // ✅ Then, update round for all users
      await updateRoundForAllUsers();

      // ✅ Now update player turn states
      const usersQuery = query(usersRef, where("gameRoom", "==", gameRoom));
      const snapshot = await getDocs(usersQuery);

      const sortedPlayers = snapshot.docs
        .map((doc) => ({ uid: doc.id, ...doc.data() }))
        .sort((a, b) => a.uid.localeCompare(b.uid));

      const updateTurnPromises = sortedPlayers.map((player, index) => {
        const isFirstPlayer = index === 0;
        return updateDoc(doc(FIREBASE_DB, "users", player.uid), {
          isUserTurn: isFirstPlayer,
        });
      });

      await Promise.all(updateTurnPromises);
      console.log(
        "✅ Round ended. Next player is:",
        sortedPlayers[0]?.displayName
      );
      Toast.show({
        type: "success",
        text1: "Round Ended",
        text2: `${
          sortedPlayers[0]?.displayName || "Next Player"
        } is now active!`,
        position: "top",
      });

      //setGetAllUsersShipToggled([]);
      setGetAllUsersShipTotals(0);

      // 🔄 Refresh local fleet state
      getFleetData({ data, setData, setUsersInRoom, gameRoom, gameSectors });
      setShowEndOfRound(false);
    } catch (e) {
      console.error("Error in endYourTurn:", e);
    } finally {
      setShowEndOfRound(false); // Ensures it's always turned off
    }
  };

  const handleEndRoundPress = async () => {
    if (canEndRoundForAllPlayers && currentUserShips) {
      endRound();

      await cleanUpPendingDestruction();

      send_message_discord_end_of_round();
    } else {
      Toast.show({
        type: "info",
        text1: "Not all ships are toggled",
        text2: "You can only end the round when all ships are ready",
        position: "top",
      });
    }
  };

  useEffect(() => {
    if (!gameRoom || !FIREBASE_AUTH.currentUser) return;
    setIsLoadingActivePlayers(true);

    const userShipUnsubs = [];
    const allShipMap = {};
    const turnsMap = {};
    const colorsMap = {};

    const usersRef = collection(FIREBASE_DB, "users");
    const unsubscribeUsers = onSnapshot(usersRef, (userSnapshot) => {
      // Clear previous listeners
      userShipUnsubs.forEach((unsub) => unsub());
      userShipUnsubs.length = 0;

      // Reset temp storage
      Object.keys(allShipMap).forEach((key) => delete allShipMap[key]);
      Object.keys(turnsMap).forEach((key) => delete turnsMap[key]);
      Object.keys(colorsMap).forEach((key) => delete colorsMap[key]);

      const activePlayers = [];

      userSnapshot.docs.forEach((userDoc) => {
        const uid = userDoc.id;
        const userData = userDoc.data();
        if (userData.gameRoom === gameRoom) {
          activePlayers.push({
            uid,
            displayName: userData.displayName,
            userFactionColor: userData.userFactionColor || "#FFFFFF",
          });
        }
        turnsMap[uid] = userData.isUserTurn || false;
        colorsMap[uid] = userData.userFactionColor || "#FFFFFF";

        const shipsRef = collection(FIREBASE_DB, "users", uid, "ships");
        const shipsQuery = query(shipsRef, where("gameRoom", "==", gameRoom));

        const unsub = onSnapshot(shipsQuery, (shipsSnap) => {
          const userShips = shipsSnap.docs.map((doc) => doc.data());

          allShipMap[uid] = userShips;

          // Flatten and update
          const allShips = Object.values(allShipMap).flat();
          setGetAllUsersShipToggled(allShips);
        });

        userShipUnsubs.push(unsub);
      });

      setIsUsersTurn({ ...turnsMap });
      setIsUsersColors({ ...colorsMap });
      setPlayersInGameRoom(activePlayers);
    });
    setIsLoadingActivePlayers(false);
    return () => {
      unsubscribeUsers();
      userShipUnsubs.forEach((unsub) => unsub());
    };
  }, [gameRoom, FIREBASE_AUTH.currentUser]);

  //show end round modal if all ships are toggled or hp is zero
  useFocusEffect(
    useCallback(() => {
      if (!isPlayerTurn) return;
      const timer = setTimeout(() => {
        if (!loading && !isLoading) {
          setShouldEndRound(canEndRoundForAllPlayers && currentUserShips);
          if (
            canEndRoundForAllPlayers &&
            currentUserShips &&
            !hasShownEndRoundModal.current
          ) {
            console.log("Showing End Round Modal");
            setShowEndRoundModal(true);
            hasShownEndRoundModal.current = true;
          } else if (!(canEndRoundForAllPlayers && currentUserShips)) {
            hasShownEndRoundModal.current = false;
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    }, [canEndRoundForAllPlayers, currentUserShips, loading, isLoading])
  );

  const getLoadingMessage = () => {
    if (showEndOfRound) return "Round has ended. Resetting your ships...";
    if (loading) return "Summoning your fleet...";
    if (isLoading) return "Adding ships to your Fleet...";
    return null;
  };

  const loadingMessage = getLoadingMessage();
  if (loadingMessage) {
    return <LoadingComponent whatToSay={loadingMessage} />;
  }

  if (isShowWarning) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.valueWarning, { fontSize: 20, padding: 10 }]}>
          Warning: You are now in a delete mode, any ship you tap on WILL be
          deleted. To return to normal mode, tap on the X button.
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            gap: 40,
          }}
        >
          <TouchableOpacity style={styles.button} onPress={onCancelWarning}>
            <Image
              source={require("../../assets/icons/icons8-x-48.png")}
              style={{
                width: 25,
                height: 25,
                marginTop: 5,
                tintColor: Colors.lighter_red,
              }}
            />
            <Image
              style={{
                width: 60,
                height: 60,
                position: "absolute",
              }}
              source={require("../../assets/images/edithud.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onConfirmWarning}>
            <Image
              source={require("../../assets/icons/icons8-check-50.png")}
              style={{
                width: 25,
                height: 25,
                marginTop: 5,
                tintColor: Colors.green_toggle,
              }}
            />
            <Image
              style={{
                width: 60,
                height: 60,
                position: "absolute",
              }}
              source={require("../../assets/images/edithud.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: Colors.dark_gray, flex: 1 }}>
      <FlatList
        data={fleetData}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        ListHeaderComponent={
          <>
            <View style={styles.container}>
              <TouchableOpacity onPress={() => setIsShowRules((prev) => !prev)}>
                {isShowRules ? (
                  <Text style={styles.subHeaderText}>
                    Welcome to Starbound Conquest! Prepare to command your fleet
                    and conquer the stars. Below, you'll find a quick snapshot
                    of your fleet's status. Use the buttons to navigate to
                    screens where you can manage your ships' stats, toggle their
                    turns, and issue orders. Also tap on the settings to change
                    your Faction, Username and Profile Picture.
                  </Text>
                ) : (
                  <Text style={styles.subHeaderText}>Game Info</Text>
                )}
              </TouchableOpacity>

              {toggleToDelete && (
                <View>
                  <Text
                    style={[
                      styles.valueWarning,
                      { fontSize: 17, padding: 5, marginTop: 10 },
                    ]}
                  >
                    Delete Mode Has Been Enabled
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: "100%",
                  marginHorizontal: -20,
                }}
              >
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={saveCharacterImage}
                >
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: Colors.gold,
                    }}
                    source={require("../../assets/icons/icons8-share-100.png")}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => setIsShowPlayers(!isShowPlayers)}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: currentTurnColor,
                    boxShadow: `0px 0px 10px ${currentTurnColor}`,
                    borderRadius: 5,
                    padding: 10,
                    marginTop: 10,
                    margin: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 20,
                  }}
                >
                  {isShowPlayers ? (
                    playersInGameRoom
                      .filter((player) => isUsersTurn[player.uid])
                      .map((player) => (
                        <Text
                          key={player.uid}
                          style={{
                            color: player.userFactionColor || Colors.hud,
                            fontFamily: "LeagueSpartan-Bold",
                            fontSize: 13,
                            textAlign: "center",
                          }}
                        >
                          Current Player's Turn: {player.displayName}
                        </Text>
                      ))
                  ) : (
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: Colors.gold,
                            fontFamily: "LeagueSpartan-Bold",
                            fontSize: 15,
                            textAlign: "center",
                            marginBottom: 5,
                          }}
                        >
                          All Players:
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        {playersInGameRoom.map((player, index) => (
                          <Text
                            key={player.uid}
                            numberOfLines={1}
                            style={{
                              color: player.userFactionColor || Colors.hud,
                              fontFamily: "LeagueSpartan-Regular",
                              fontSize: 10,
                              textAlign: "left",
                              borderBottomColor:
                                player.userFactionColor || "transparent",
                              borderBottomWidth: 1,
                            }}
                          >
                            {index + 1}. {player.displayName}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              {!isPlayerTurn && (
                <Text style={{ textAlign: "center", color: Colors.hud }}>
                  Waiting for your turn...
                </Text>
              )}

              <ViewShot
                style={{ justifyContent: "center", alignItems: "center" }}
                ref={ref}
                options={{
                  fileName: username,
                  format: "jpg",
                  quality: 1,
                }}
              >
                <View
                  style={[
                    styles.profileContainer,
                    {
                      borderColor: toggleToDelete
                        ? Colors.lighter_red
                        : userFactionColor || Colors.hud,
                      boxShadow: `0px 0px 10px ${
                        toggleToDelete ? Colors.lighter_red : userFactionColor
                      }`,
                    },
                  ]}
                >
                  {profile ? (
                    <Image style={styles.profile} source={{ uri: profile }} />
                  ) : (
                    <View
                      style={{
                        width: 275,
                        height: 275,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ActivityIndicator size="large" color={Colors.gold} />
                      <Text
                        style={{
                          color: Colors.gold,
                          textAlign: "center",
                          fontFamily: "LeagueSpartan-Light",
                          fontSize: 15,
                        }}
                      >
                        Loading Profile
                      </Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.playerText,
                      {
                        color: toggleToDelete
                          ? Colors.lighter_red
                          : userFactionColor || Colors.hud,
                      },
                    ]}
                  >
                    {username}
                  </Text>
                  <Text
                    style={[
                      styles.factionText,
                      {
                        color: toggleToDelete
                          ? Colors.lighter_red
                          : userFactionColor || Colors.hud,
                      },
                    ]}
                  >
                    {faction}
                  </Text>
                </View>
              </ViewShot>
              {faction !== "Choose a Faction" && (
                <View>
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {gameRoom ? (
                      <Text
                        style={[
                          styles.gameRoomText,
                          {
                            marginTop: 10,
                            padding: 5,
                            color: toggleToDelete
                              ? Colors.lighter_red
                              : Colors.hud,
                            backgroundColor: toggleToDelete
                              ? Colors.deep_red
                              : Colors.hudDarker,
                            borderColor: toggleToDelete
                              ? Colors.lighter_red
                              : Colors.hud,
                          },
                        ]}
                      >
                        Game Room: {gameRoom || "Not Connected"}
                      </Text>
                    ) : (
                      <Text style={styles.gameRoomText}>
                        Game Room not selected, head over to Settings to pick
                        one
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.textSub,
                        {
                          color: toggleToDelete
                            ? Colors.lighter_red
                            : Colors.white,
                        },
                      ]}
                    >
                      Fleet Overview
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.valueContainer,
                      {
                        borderColor: toggleToDelete
                          ? Colors.lighter_red
                          : Colors.hud,
                        backgroundColor: toggleToDelete
                          ? Colors.deep_red
                          : Colors.hudDarker,
                      },
                    ]}
                  >
                    {valueWarning()}
                    <Text
                      style={[
                        styles.textValue,
                        {
                          color: toggleToDelete
                            ? Colors.lighter_red
                            : Colors.hud,
                        },
                      ]}
                    >
                      Total Fleet Value: {totalFleetValue}/{gameValue}
                    </Text>
                    {gameRoom ? (
                      <TouchableOpacity
                        disabled={!isPlayerTurn}
                        onLongPress={resetRoundForCurretUser}
                      >
                        <Text
                          style={[
                            styles.gameRoomText,
                            {
                              marginTop: 10,
                              padding: 5,
                              color: toggleToDelete
                                ? Colors.lighter_red
                                : Colors.hud,
                              backgroundColor: toggleToDelete
                                ? Colors.deep_red
                                : Colors.dark_gray,
                              borderColor: toggleToDelete
                                ? Colors.lighter_red
                                : Colors.hud,
                            },
                          ]}
                        >
                          Round: {gameRound || 0}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.gameRoomText}>0</Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                    }}
                  >
                    <TouchableOpacity
                      disabled={!isPlayerTurn || !canEndRoundForEveryone}
                      onPress={handleEndRoundPress}
                      style={[
                        styles.editContainer,
                        {
                          borderWidth: 1,
                          width: "30%",
                          shadowColor:
                            !isPlayerTurn || !canEndRoundForEveryone
                              ? Colors.lighter_red
                              : Colors.gold,
                          borderColor:
                            !isPlayerTurn || !canEndRoundForEveryone
                              ? Colors.lighter_red
                              : Colors.gold,
                          backgroundColor:
                            !isPlayerTurn || !canEndRoundForEveryone
                              ? Colors.deep_red
                              : Colors.goldenrod,
                          opacity:
                            !isPlayerTurn || !canEndRoundForEveryone ? 0.5 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.textValue,
                          {
                            color:
                              !isPlayerTurn || !canEndRoundForEveryone
                                ? Colors.lighter_red
                                : Colors.gold,
                            fontSize: 12,
                          },
                        ]}
                      >
                        End Round
                      </Text>
                    </TouchableOpacity>

                    {/*  <PushNotifications /> */}

                    <TouchableOpacity
                      disabled={
                        !isPlayerTurn ||
                        shouldEndRound ||
                        myToggledOrDestroyingShips
                      }
                      style={[
                        styles.editContainer,
                        {
                          borderWidth: 1,
                          width: "30%",
                          opacity:
                            shouldEndRound || myToggledOrDestroyingShips
                              ? 0.5
                              : 1,
                          borderColor:
                            shouldEndRound || myToggledOrDestroyingShips
                              ? Colors.lighter_red
                              : Colors.green_toggle,
                          backgroundColor:
                            shouldEndRound || myToggledOrDestroyingShips
                              ? Colors.deep_red
                              : Colors.darker_green_toggle,
                        },
                      ]}
                      onPress={() => {
                        setIsShowWarning(true);
                      }}
                    >
                      <Text
                        style={[
                          styles.textValue,
                          {
                            color:
                              shouldEndRound || myToggledOrDestroyingShips
                                ? Colors.lighter_red
                                : Colors.green_toggle,
                            fontSize: 12,
                          },
                        ]}
                      >
                        Delete a ship
                      </Text>
                    </TouchableOpacity>
                    {!shouldEndRound && (
                      <TouchableOpacity
                        style={[
                          styles.editContainer,
                          {
                            opacity:
                              !isPlayerTurn || hasNoShips || shouldEndRound
                                ? 0.5
                                : 1,
                            backgroundColor:
                              !isPlayerTurn || hasNoShips || shouldEndRound
                                ? Colors.hudDarker
                                : Colors.hud,
                            width: "35%",
                          },
                        ]}
                        disabled={!isPlayerTurn || hasNoShips || shouldEndRound}
                        onPress={async () => setShowEndTurnModal(true)}
                      >
                        <Text
                          style={[
                            styles.textValue,
                            {
                              color:
                                !isPlayerTurn || hasNoShips || shouldEndRound
                                  ? Colors.hud
                                  : Colors.hudDarker,
                              fontSize: 12,
                            },
                          ]}
                        >
                          End Turn
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      borderRadius: 5,
                      marginTop: 10,
                      padding: 5,
                      width: "95%",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: toggleToDelete
                        ? Colors.lighter_red
                        : Colors.hud,
                      backgroundColor: Colors.dark_gray,
                    }}
                  >
                    <Text
                      style={{
                        color: toggleToDelete ? Colors.lighter_red : Colors.hud,
                        fontFamily: "LeagueSpartan-Light",
                        fontSize: 15,
                        textAlign: "center",
                      }}
                    >
                      {gameSectors === "Show All Ships..." ? (
                        <Text
                          style={{
                            color: toggleToDelete
                              ? Colors.lighter_red
                              : Colors.hud,
                            fontFamily: "LeagueSpartan-Light",
                            fontSize: 15,
                            textAlign: "center",
                          }}
                        >
                          Total Ships in All Sectors:{" "}
                          {shipInSector.length > 0 ? shipInSector.length : "0"}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: toggleToDelete
                              ? Colors.lighter_red
                              : Colors.hud,
                            fontFamily: "LeagueSpartan-Light",
                            fontSize: 15,
                            textAlign: "center",
                          }}
                        >
                          {!gameSectors ? (
                            <Text>No Sector Selected</Text>
                          ) : (
                            <Text>
                              Total Ships in {gameSectors}:{" "}
                              {shipInSector.length > 0
                                ? shipInSector.length
                                : "0"}
                            </Text>
                          )}
                        </Text>
                      )}
                      {/*     Total Ships in {gameSectors}:{" "}
                      {shipInSector.length > 0 ? shipInSector.length : "0"} */}
                    </Text>
                  </View>
                  {!toggleToDelete && (
                    <DropdownComponentSectors getShips={getFleetData} />
                  )}
                </View>
              )}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.shipContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                margin: 10,
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: toggleToDelete ? Colors.lighter_red : Colors.hud,
                  padding: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={factionIcons[item.type.toLowerCase()]}
                  style={{
                    width: 35,
                    height: 35,
                    tintColor: toggleToDelete ? Colors.lighter_red : Colors.hud,
                  }}
                  resizeMode="contain"
                />
              </View>

              <Text
                style={[
                  styles.textUnder,
                  { color: toggleToDelete ? Colors.lighter_red : Colors.white },
                ]}
              >
                {item.type}
              </Text>
              {/* //minus button */}
              <TouchableOpacity
                disabled={
                  !isPlayerTurn ||
                  toggleToDelete ||
                  shouldEndRound ||
                  myToggledOrDestroyingShips
                }
                onPress={() => decrementShipCount(item.type)}
                style={styles.button}
              >
                <Image
                  source={require("../../assets/icons/icons8-minus-100.png")}
                  style={{
                    width: 25,
                    height: 25,
                    marginTop: 5,
                    tintColor: toggleToDelete ? Colors.lighter_red : Colors.hud,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={
                  !isPlayerTurn ||
                  toggleToDelete ||
                  shouldEndRound ||
                  myToggledOrDestroyingShips
                }
                onPress={() =>
                  addShipToFleet(item.ships[0], shipCounts[item.type] || 1)
                }
                style={styles.button}
              >
                <Text style={styles.addButtonText}>
                  {shipCounts[item.type] || 1}
                </Text>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    position: "absolute",
                    tintColor: toggleToDelete ? Colors.lighter_red : Colors.hud,
                  }}
                  source={require("../../assets/images/edithud.png")}
                />
              </TouchableOpacity>
              {/* //add button */}
              <TouchableOpacity
                disabled={
                  !isPlayerTurn ||
                  toggleToDelete ||
                  shouldEndRound ||
                  myToggledOrDestroyingShips
                }
                onPress={() => incrementShipCount(item.type)}
                style={styles.button}
              >
                <Image
                  source={require("../../assets/icons/icons8-plus-100.png")}
                  style={{
                    width: 25,
                    height: 25,
                    marginTop: 5,
                    tintColor: toggleToDelete ? Colors.lighter_red : Colors.hud,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "column" }}>
              <ShipFlatlist
                toggleToDelete={toggleToDelete}
                type={item.type}
                usersColor={userFactionColor}
                isPlayerTurn={isPlayerTurn}
                myToggledOrDestroyingShips={myToggledOrDestroyingShips}
                myShips={myShips}
              />
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
      />
      <EndRoundModal
        showEndRoundModal={showEndRoundModal}
        setShowEndRoundModal={setShowEndRoundModal}
        handleEndRoundPress={handleEndRoundPress}
      />
      <EndTurnModal
        showEndTurnModal={showEndTurnModal}
        setShowEndTurnModal={setShowEndTurnModal}
        endYourTurnAndSendMessage={endYourTurnAndSendMessage}
        myToggledOrDestroyingShips={myToggledOrDestroyingShips}
        myToggledShipsCount={myToggledShipsCount}
        myUntoggledShipsCount={myUntoggledShipsCount}
        myShipsBySectorNotToggled={myUntoggledShipsBySector}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "monospace",
    numberOfLines: 2,
    width: 50,
  },
  shipContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  textSub: {
    fontSize: 30,
    color: Colors.white,
    fontFamily: "LeagueSpartan-Bold",
    textAlign: "center",
    margin: 10,
  },
  textLoading: {
    fontSize: 30,
    color: Colors.hud,
    fontFamily: "leagueBold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 25,
  },
  textUnder: {
    fontSize: 20,
    color: Colors.white,
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
    backgroundColor: Colors.dark_gray,
    width: "80%",
    padding: 10,
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.hud,
    elevation: 10,
  },
  editContainer: {
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.hud,
    padding: 5,
    backgroundColor: Colors.hud,
  },
  profile: {
    width: 275,
    height: 275,
    borderRadius: 10,
    shadowColor: Colors.dark_gray,
  },
  playerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.hud,
    marginTop: 10,
    textAlign: "center",
  },
  factionText: {
    fontSize: 20,
    fontStyle: "LeagueSpartan-Light",
    color: Colors.hud,
    textAlign: "center",
  },
  subHeaderText: {
    fontFamily: "monospace",
    color: Colors.white,
    fontSize: 9,
    textAlign: "center",
    backgroundColor: Colors.underTextGray,
    borderRadius: 5,
    padding: 5,
    margin: 5,
  },
  textValue: {
    fontSize: 15,
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Bold",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 5,
  },
  valueContainer: {
    backgroundColor: Colors.hudDarker,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
    padding: 10,
  },
  valueWarning: {
    fontSize: 12,
    color: Colors.lighter_red,
    fontFamily: "leagueBold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark_gray,
  },
  button: {
    width: 35,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  gameRoomText: {
    fontSize: 15,
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Light",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
    backgroundColor: Colors.hudDarker,
    borderRadius: 5,
  },
  shareButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.gold,
    backgroundColor: Colors.goldenrod,
    padding: 5,
  },
  underText: {
    fontSize: 12,
    color: Colors.hud,
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 5,
  },
  text1: {
    color: Colors.hud,
    fontFamily: "LeagueSpartan-Light",
    fontSize: 12,
    padding: 5,
    textAlign: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.hud,
    backgroundColor: Colors.hudDarker,
    marginBottom: 10,
    marginTop: 10,
  },
});
