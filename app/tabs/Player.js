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
import useMyTurn from "../../components/Functions/useMyTurn";
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
import Clipboard from "@react-native-clipboard/clipboard";
import { startGame, stopGame } from "../../components/Functions/StartGame";
import useAllUsersAndDataFromGameRoom from "../../components/Functions/useAllUsersAndDataFromGameRoom";
import { useNavigation } from "expo-router";
import NewUser from "../../components/NewUser/NewUser";
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
  writeBatch,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

export default function Player() {
  const ref = useRef();
  const user = FIREBASE_AUTH.currentUser;
  const tabBarHeight = useBottomTabBarHeight();
  const [isLoading, setIsLoading] = useState(false);
  const [isShowWarning, setIsShowWarning] = useState(false);
  const [shipCounts, setShipCounts] = useState({});
  const [showEndOfRound, setShowEndOfRound] = useState(false);
  const [gameRound, setGameRound] = useState(0);
  const { gameSectors, setGameSectors } = useMapImageContext();
  const [showEndRoundModal, setShowEndRoundModal] = useState(false);
  const [isShowPlayers, setIsShowPlayers] = useState(true);
  //const [playersInGameRoom, setPlayersInGameRoom] = useState([]);
  const [shouldEndRound, setShouldEndRound] = useState(false);
  const [showEndTurnModal, setShowEndTurnModal] = useState(false);
  const [isShowRules, setIsShowRules] = useState(false);
  const [isEndingRound, setIsEndingRound] = useState(false);
  const [isEndingTurn, setIsEndingTurn] = useState(false);
  const [playerGameRoomID, setPlayerGameRoomID] = useState("");
  const {
    username,
    setUsername,
    profile,
    faction,
    setFaction,
    setProfile,
    data,
    setData,
    setGameValue,
    toggleToDelete,
    setToggleToDelete,
    userFactionColor,
    setUserFactionColor,
    myShips,
    setMyShips,
    gameRoomID,
    setGameRoomID,
    adminStatus,
    setAdminStatus,
  } = useStarBoundContext();
  const uid = user?.uid ?? null;

  const { myTurn, state: gameState, loading } = useMyTurn(gameRoomID);
  const { playersInGameRoom, getAllUsersShipToggled } =
    useAllUsersAndDataFromGameRoom(gameRoomID);

  const gameStarted = gameState?.started;

  //console.log(getAllUsersShipToggled.length, playersInGameRoom.length);

  const hasShownEndRoundModal = useRef(false);
  const isPlayerTurn = myTurn;

  const currentUserShips = playersInGameRoom.some((player) => {
    if (!uid) return false;
    if (player.uid === uid) {
      const currentUserShips = getAllUsersShipToggled.filter(
        (ship) => ship.user === uid
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

  const toastStartGame = () => {
    Toast.show({
      type: "info",
      text1: "StarBound Conquest",
      text2: "Long Press the button to start/stop the game.",
      position: "top",
    });
  };

  const copyToClipboard = () => {
    try {
      Clipboard.setString(gameRoomID);
      Toast.show({
        type: "success",
        text1: "StarBound Conquest",
        text2: "Game Room ID copied to clipboard!",
        position: "top",
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const canEndRoundForAllPlayers = playersInGameRoom
    .filter((player) => player.uid !== uid)
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
    setMyShips(myShipsToSave);
  }, [myShipsToSave, setMyShips]);

  useEffect(() => {
    setGameRoomID(playerGameRoomID);
  }, [playerGameRoomID]);

  //get the number of ships that are toggled or pending destruction
  const myToggledOrDestroyingShips =
    myShips.length > 0 &&
    myShips.every((ship) => ship.isToggled || ship.isPendingDestruction);

  //get all ships by sector for user
  /*   const myShipsBySector = myShips.reduce((acc, ship) => {
    const sector = ship.gameSector || "Unassigned";
    if (!acc[sector]) acc[sector] = [];
    acc[sector].push(ship);
    return acc;
  }, {}); */

  //get ships not toggled count using length

  //reduce the untoggled ships to a dictionary of sectors and ships

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
    if (totalFleetValue > gameState?.gameValue) {
      return (
        <Text style={styles.valueWarning}>
          Warning: You are over your game value limit.
        </Text>
      );
    }
  };

  const addingShipToFleet = (item) => {
    if (!uid) return false;
    if (!gameRoomID) {
      Toast.show({
        type: "info",
        text1: "Starbound Conquest",
        text2: "You must select/join a game room to add a ship.",
        position: "top",
      });
      return;
    } else {
      addShipToFleet(item.ships[0], shipCounts[item.type] || 1);
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
          user: uid,
          username: username || "Commander",
          factionName: faction,
          isSelected: false,
          isToggled: false,
          hasBeenInteractedWith: false,
          gameRoomID: gameRoomID,
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
          collection(FIREBASE_DB, "users", uid, "ships"),
          shipToSave
        );

        //console.log("Ship added with ID:", docRef.id);
        // After adding, update it to include the doc ID
        await setDoc(docRef, { id: docRef.id }, { merge: true });
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      getFleetData({ data, setData, gameRoomID, gameSectors });
      setIsLoading(false);
    }
  };

  const totalFleetValue = data
    ? data.reduce((sum, ship) => sum + (ship.pointValue || 0), 0)
    : 0;

  useEffect(() => {
    const auth = FIREBASE_AUTH;
    if (!auth.currentUser) return;
    if (!user) return;
    const userDocRef = doc(FIREBASE_DB, "users", uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.displayName || "");
        setProfile(data.photoURL || "");
        setFaction(data.factionName || "");
        setPlayerGameRoomID(data.gameRoomID || "");
        setUserFactionColor(data.userFactionColor || "");
        setGameValue(data.gameValue || "");
        setAdminStatus(data.gameRoomAdmin || "");
      }
    });
    // console.log("Game Room ID in Player:", gameRoomID);
    return () => unsubscribe();
  }, [user?.uid, FIREBASE_AUTH.currentUser]);

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
    /*  const request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://discord.com/api/webhooks/1400193103775793282/2Rz9AIJTztHwqS8B2OINDmUHy-In76UWV5NBkCnQkBVdBPpedCrPmV0njSE4t4KIDYat"
    );
    request.setRequestHeader("Content-Type", "application/json");
    const params = {
      username: "Starbound Conquest",
      avatar_url: "",
      content: `The Round has ended in ${gameRoomID}. Resetting your ships.`,
    };
    request.send(JSON.stringify(params)) */
  }

  async function advanceTurn(gameRoomID, myUId) {
    const ref = doc(FIREBASE_DB, "gameRooms", gameRoomID);
    let nextUidOut = null;

    await runTransaction(FIREBASE_DB, async (transaction) => {
      const snap = await transaction.get(ref);
      if (!snap.exists()) throw new Error("No such document!");

      const data = snap.data();
      console.log("Data:", data);

      if (data.currentTurnUid.uid !== myUId)
        throw new Error("No current turn!");
      const order = Array.isArray(data.turnOrder) ? data.turnOrder : [];

      const currentIndex =
        typeof data.currentTurnIndex === "number" &&
        data.currentTurnIndex >= 0 &&
        data.currentTurnIndex < order.length
          ? data.currentTurnIndex
          : Math.max(0, order.indexOf(data.currentTurnUid.uid));

      const nextIndex = (currentIndex + 1) % order.length;
      const nextUid = order[nextIndex];

      transaction.update(ref, {
        currentTurnUid: nextUid,
        currentTurnIndex: nextIndex,
        updatedAt: serverTimestamp(),
      });
      nextUidOut = nextUid;
    });
    return nextUidOut;
  }

  async function endYourTurnAndSendMessage() {
    setIsEndingTurn(true);
    try {
      // 1. Get players
      if (!user || !gameRoomID) throw new Error("Missing user or room");

      //3. Update ship isToggled for non-toggled ships
      const shipsRef = collection(FIREBASE_DB, "users", uid, "ships");
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

      const nextUid = await advanceTurn(gameRoomID, uid);
      const nextName = nextUid.username || "Next Player";

      /*     // 4. THEN send Discord message
      const discordMessage = {
        username: "Starbound Conquest",
        avatar_url: "",
        content: `${username} has ended their turn in ${gameRoomID}. ${nextPlayer.displayName} is up next!`,
      };
      await fetch(
        "https://discord.com/api/webhooks/1400193598691217428/wIGjO6m0CUTV1rEanECgljpMRyWbrkLoP0nUtdqDerJOvHzYeOCjgOKx25ImJU8vFoi1",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordMessage),
        }
      );
 */
      // 4. Toast confirmation
      Toast.show({
        type: "success",
        text1: "Turn Ended",
        text2: `${nextName} is up next!`,
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
    setIsEndingTurn(false);
  }

  //reset the round for the current user IF there are no ships in the fleet from ANYONE
  const resetRoundForCurretUser = async () => {
    if (!user || !gameRoomID) return;
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
        const userRef = doc(FIREBASE_DB, "users", uid);
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
  /*  const updateRoundForAllUsers = async () => {
    if (!user || !gameRoomID) return;
    const usersCollection = collection(FIREBASE_DB, "users");
    const myQuery = query(
      usersCollection,
      where("gameRoomID", "==", gameRoomID)
    );
    const querySnapshot = await getDocs(myQuery);
    const updatePromises = querySnapshot.docs.map((doc) => {
      updateDoc(doc.ref, {
        round: increment(1),
      });
    });
    await Promise.all(updatePromises);
  }; */

  //clean up ships with isPendingDestruction
  const cleanUpPendingDestruction = async () => {
    if (!gameRoomID) return;

    const usersRef = collection(FIREBASE_DB, "users");
    const userQuery = query(usersRef, where("gameRoomID", "==", gameRoomID));
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
    const auth = FIREBASE_AUTH;
    if (!auth.currentUser) return;
    if (!user || !gameRoomID) return;
    const docRef = doc(FIREBASE_DB, "users", uid); // or "gameRooms", depending on your structure

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setGameRound(docSnap.data().round);
      }
    });

    return () => unsubscribe();
  }, [gameRoomID, user?.uid, FIREBASE_AUTH.currentUser]);

  /*   useEffect(() => {
    const count = getAllUsersShipToggled.filter((s) => s.isToggled).length;
    setGetAllUsersShipTotals(count);
  }, [getAllUsersShipToggled]); */

  useEffect(() => {
    const auth = FIREBASE_AUTH;
    if (!auth.currentUser) return;
    if (!gameRoomID) return;

    const ref = query(
      collection(FIREBASE_DB, "users", uid, "ships"),
      where("gameRoomID", "==", gameRoomID)
    );

    const unsubscribe = onSnapshot(ref, (snap) => {
      const userShips = snap.docs.map((doc) => doc.data());
      setData(userShips); // live update your fleet
    });

    return () => unsubscribe();
  }, [FIREBASE_AUTH.currentUser, gameRoomID]);

  async function resetToFirstPerson(gameRoomID) {
    const roomRef = doc(FIREBASE_DB, "gameRooms", gameRoomID);
    await runTransaction(FIREBASE_DB, async (transaction) => {
      const snap = await transaction.get(roomRef);
      if (!snap.exists()) throw new Error("No such document!");

      const roomData = snap.data();
      const order = Array.isArray(roomData.turnOrder) ? roomData.turnOrder : [];
      if (order.length === 0) throw new Error("No players in game room!");

      const nextUid = order[0];
      transaction.update(roomRef, {
        currentTurnUid: nextUid,
        currentTurnIndex: 0,
        updatedAt: serverTimestamp(),
      });
    });
  }

  const endRound = async () => {
    if (!user || !gameRoomID) return;
    setShowEndOfRound(true);

    try {
      const allResetPromises = [];

      // restting my ships back to default values
      const myShipsRef = collection(FIREBASE_DB, "users", uid, "ships");
      const myShipsSnapshot = await getDocs(myShipsRef);

      for (const myShipDoc of myShipsSnapshot.docs) {
        const myShipData = myShipDoc.data();
        const myShipDocRef = doc(
          FIREBASE_DB,
          "users",
          uid,
          "ships",
          myShipDoc.id
        );

        let newSpecialOrders = {};
        let newShipActions = {};
        let newShipWeaponStatus = {};
        let newSpecialWeaponAttemptedStatus = {};
        let newSpecialOrdersAttempted = {};

        const specialOrdesToPersist = ["Launch Fighters"];
        const specialOrdersAttemptedToPersist = ["Launch Fighters"];
        /*   const specialWeaponStatusToPersist = ["Ion Particle Beam"]; */

        if (myShipData.specialWeaponStatusAttempted) {
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

        if (myShipData.specialOrdersAttempted) {
          Object.keys(myShipData.specialOrdersAttempted).forEach((order) => {
            newSpecialOrdersAttempted[order] =
              specialOrdersAttemptedToPersist.includes(order)
                ? myShipData.specialOrdersAttempted[order]
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
            specialOrdersAttempted: newSpecialOrdersAttempted,
          })
        );
      }

      // reset the opponents ships to default values
      const usersRef = collection(FIREBASE_DB, "users");
      const opponentsQuery = query(
        usersRef,
        where("gameRoomID", "==", gameRoomID),
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
          let newSpecialOrdersAttempted = {};

          const specialOrdersToPersist = ["Launch Fighters"];
          const specialOrdersAttemptedToPersist = ["Launch Fighters"];
          //const specialWeaponStatusToPersist = ["Ion Particle Beam"];

          if (shipData.specialWeaponStatusAttempted) {
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
              newSpecialOrders[key] = specialOrdersToPersist.includes(key)
                ? shipData.specialOrders[key]
                : false;
            });
          }

          if (shipData.specialOrdersAttempted) {
            Object.keys(shipData.specialOrdersAttempted).forEach((order) => {
              newSpecialOrdersAttempted[order] =
                specialOrdersAttemptedToPersist.includes(order)
                  ? shipData.specialOrdersAttempted[order]
                  : false;
            });
          }

          if (shipData.shipActions) {
            Object.keys(shipData.shipActions).forEach((key) => {
              newShipActions[key] = false;
            });
          }

          const stillHasActiveSpecialOrders =
            Object.values(newSpecialOrders).some(Boolean);

          if (stillHasActiveSpecialOrders) {
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
              specialOrdersAttempted: newSpecialOrdersAttempted,
            })
          );
        }
      }
      // ✅ First, reset ships for all players
      await Promise.all(allResetPromises);

      // ✅ Then, update round for all users
      //await updateRoundForAllUsers();
      await resetToFirstPerson(gameRoomID);

      //setGetAllUsersShipToggled([]);
      //setGetAllUsersShipTotals(0);

      // 🔄 Refresh local fleet state
      getFleetData({ data, setData, gameRoomID, gameSectors });
      setShowEndOfRound(false);
    } catch (e) {
      console.error("Error in endYourTurn:", e);
    } finally {
      setShowEndOfRound(false);
    }
  };

  const handleEndRoundPress = async () => {
    if (canEndRoundForAllPlayers && currentUserShips) {
      setIsEndingRound(true);
      await endRound();

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
    setIsEndingRound(false);
  };

  //show end round modal if all ships are toggled or hp is zero
  useFocusEffect(
    useCallback(() => {
      if (!isPlayerTurn) return;
      const timer = setTimeout(() => {
        if (!isLoading) {
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
    }, [canEndRoundForAllPlayers, currentUserShips, isLoading])
  );

  const getLoadingMessage = () => {
    if (showEndOfRound) return "Round has ended. Resetting your ships...";
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
                    screens where you can manage your ship's stats, view the
                    galaxy map and issue orders. Also tap on the settings to
                    change your Faction, Username, Profile Picture, and create a
                    Game Room.
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
              {adminStatus && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={toastStartGame}
                    // disabled={playersInGameRoom.length <= 1}
                    onLongPress={async () => {
                      if (gameState?.started) {
                        await stopGame(gameRoomID, getAllUsersShipToggled);
                      } else {
                        await startGame(
                          gameRoomID,
                          playersInGameRoom,
                          getAllUsersShipToggled
                        );
                      }
                    }}
                    style={[
                      styles.gameStartTextButton,
                      {
                        opacity: playersInGameRoom.length <= 1 ? 0.5 : 1,
                        backgroundColor: !gameState?.started
                          ? Colors.goldenrod
                          : Colors.hudDarker,
                        borderColor: !gameState?.started
                          ? Colors.gold
                          : Colors.hud,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.startTextValue,
                        {
                          color: !gameState?.started ? Colors.gold : Colors.hud,
                        },
                      ]}
                    >
                      {!gameState?.started ? "Start Game" : "Stop Game"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                onPress={() => setIsShowPlayers(!isShowPlayers)}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.hud,
                    boxShadow: `0px 0px 10px ${Colors.hud}`,
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
                  {gameRoomID && isShowPlayers ? (
                    <Text
                      style={{
                        color: Colors.hud,
                        fontFamily: "LeagueSpartan-Bold",
                        fontSize: 13,
                        textAlign: "center",
                      }}
                    >
                      {gameState && playersInGameRoom.length <= 1
                        ? `Waiting for other players...`
                        : `Current Player's Turn: ${
                            gameState?.currentTurnUid?.username || ""
                          }`}
                    </Text>
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
                            color: Colors.hud,
                            fontFamily: "LeagueSpartan-Bold",
                            fontSize: 15,
                            textAlign: "center",
                            marginBottom: 5,
                          }}
                        >
                          {gameRoomID
                            ? "All Players:"
                            : "No Game Room Selected"}
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
                          <View
                            key={index}
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 5,
                              borderWidth: 1,
                              borderRadius: 5,
                              padding: 3,
                              borderColor:
                                (player.uid === gameState?.currentTurnUid.uid &&
                                  player.userFactionColor) ||
                                "transparent",
                            }}
                          >
                            <Image
                              style={{
                                width: 25,
                                height: 25,
                                borderRadius: 50,
                              }}
                              source={{ uri: player?.photoURL }}
                            />
                            <Text
                              key={player.uid}
                              numberOfLines={1}
                              style={{
                                color: player.userFactionColor || Colors.hud,
                                fontFamily: "LeagueSpartan-Regular",
                                fontSize: 10,
                                textAlign: "center",
                              }}
                            >
                              {index + 1}. {player.displayName}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              {gameState?.started ? (
                gameRoomID && !isPlayerTurn ? (
                  <Text style={{ textAlign: "center", color: Colors.hud }}>
                    Waiting for your turn...
                  </Text>
                ) : null
              ) : (
                <Text style={{ textAlign: "center", color: Colors.hud }}>
                  Waiting for game to start...
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
                        toggleToDelete
                          ? Colors.lighter_red
                          : userFactionColor || Colors.hud
                      }`,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={saveCharacterImage}
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
                        <Text
                          style={{
                            color: Colors.hud,
                            textAlign: "center",
                            fontFamily: "LeagueSpartan-Light",
                            fontSize: 15,
                          }}
                        >
                          Head over to Settings and choose a profile picture.
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

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
                    {gameRoomID ? (
                      <TouchableOpacity
                        onPress={copyToClipboard}
                        style={[
                          styles.gameRoomTextButton,
                          {
                            backgroundColor: toggleToDelete
                              ? Colors.deep_red
                              : Colors.hudDarker,
                            borderColor: toggleToDelete
                              ? Colors.lighter_red
                              : Colors.hud,
                          },
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: toggleToDelete
                              ? Colors.deep_red
                              : "transparent",
                            borderColor: toggleToDelete
                              ? Colors.lighter_red
                              : Colors.hud,
                          }}
                        >
                          <Image
                            style={[
                              styles.image,
                              {
                                tintColor: toggleToDelete
                                  ? Colors.lighter_red
                                  : Colors.hud,
                              },
                            ]}
                            source={require("../../assets/icons/icons8-copy-50.png")}
                          />
                          <Text
                            style={[
                              {
                                fontSize: 10,
                                backgroundColor: "transparent",
                                textAlign: "center",
                                fontFamily: "monospace",
                                padding: 5,
                                color: toggleToDelete
                                  ? Colors.lighter_red
                                  : Colors.hud,
                                backgroundColor: toggleToDelete
                                  ? Colors.deep_red
                                  : "transparent",
                                borderColor: toggleToDelete
                                  ? Colors.lighter_red
                                  : Colors.hud,
                              },
                            ]}
                          >
                            {gameRoomID || "Not Connected"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.gameRoomText}>
                        Game Room not selected, head over to Settings to create
                        or join one!
                      </Text>
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
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
                      <Image
                        style={[
                          styles.image2,
                          {
                            opacity: !gameState?.started ? 0.5 : 1,
                            borderColor: !gameState?.started
                              ? Colors.hudDarker
                              : Colors.gold,
                            tintColor: !gameState?.started
                              ? Colors.hudDarker
                              : Colors.goldenrod,
                            backgroundColor: !gameState?.started
                              ? Colors.dark_gray
                              : Colors.gold,
                          },
                        ]}
                        source={require("../../assets/icons/icons8-check-mark-50.png")}
                      />
                    </View>
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
                      Total Fleet Value: {totalFleetValue || 0}/
                      {gameState?.gameValue || 0}
                    </Text>
                    {gameRoomID && (
                      <TouchableOpacity
                        disabled={!isPlayerTurn && gameState?.started}
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
                      disabled={
                        (!isPlayerTurn && gameState?.started) ||
                        !canEndRoundForEveryone
                      }
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
                        (!isPlayerTurn && gameStarted) ||
                        shouldEndRound ||
                        myToggledOrDestroyingShips
                      }
                      style={[
                        styles.editContainer,
                        {
                          borderWidth: 1,
                          width: "30%",
                          /* opacity:
                            shouldEndRound ||
                            myToggledOrDestroyingShips ||
                            !gameRoomID ||
                            hasNoShips
                              ? 0.5
                              : 1, */
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
                              !!toggleToDelete ||
                              !isPlayerTurn ||
                              hasNoShips ||
                              shouldEndRound ||
                              !gameRoomID ||
                              !gameState?.started
                                ? 0.5
                                : 1,
                            backgroundColor:
                              !isPlayerTurn ||
                              hasNoShips ||
                              shouldEndRound ||
                              !gameRoomID ||
                              !gameState?.started
                                ? Colors.hudDarker
                                : Colors.hud,
                            width: "35%",
                          },
                        ]}
                        disabled={
                          !isPlayerTurn ||
                          hasNoShips ||
                          shouldEndRound ||
                          !gameRoomID ||
                          !gameState?.started
                        }
                        onPress={async () => setShowEndTurnModal(true)}
                      >
                        <Text
                          style={[
                            styles.textValue,
                            {
                              color:
                                !isPlayerTurn ||
                                hasNoShips ||
                                shouldEndRound ||
                                !gameRoomID ||
                                !gameState?.started
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
                  {!toggleToDelete && gameRoomID && (
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
                  {
                    color: toggleToDelete ? Colors.lighter_red : Colors.white,
                  },
                ]}
              >
                {item.type}
              </Text>
              {/* //minus button */}
              <TouchableOpacity
                disabled={
                  (!isPlayerTurn && gameState?.started) ||
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
                  (!isPlayerTurn && gameState?.started) ||
                  toggleToDelete ||
                  shouldEndRound ||
                  myToggledOrDestroyingShips
                }
                onPress={() => addingShipToFleet(item)}
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
                  (!isPlayerTurn && gameState?.started) ||
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
                gameStarted={gameStarted}
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
        isEndingRound={isEndingRound}
      />
      <EndTurnModal
        showEndTurnModal={showEndTurnModal}
        setShowEndTurnModal={setShowEndTurnModal}
        endYourTurnAndSendMessage={endYourTurnAndSendMessage}
        myToggledOrDestroyingShips={myToggledOrDestroyingShips}
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
    marginTop: 15,
    borderWidth: 1,
    borderColor: Colors.hud,
    backgroundColor: Colors.hudDarker,
    borderRadius: 5,
    padding: 5,
  },
  shareButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
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
  gameRoomTextButton: {
    backgroundColor: Colors.hudDarker,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.hud,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  gameStartTextButton: {
    width: "80%",
    backgroundColor: Colors.goldenrod,
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: 5,
    alignSelf: "center",
  },
  startTextValue: {
    color: Colors.gold,
    fontFamily: "LeagueSpartan-Bold",
    fontSize: 15,
    textAlign: "center",
    backgroundColor: "transparent",
  },
  image: {
    width: 25,
    height: 25,
    tintColor: Colors.hud,
  },
  image2: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 1,
  },
});
