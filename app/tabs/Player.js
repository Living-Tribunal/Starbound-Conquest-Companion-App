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
} from "react-native";
import { Colors } from "@/constants/Colors";
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
import { useNavigation } from "@react-navigation/native";
import DropdownComponentSectors from "../../components/dropdown/DropdownComponentSectors";
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
} from "firebase/firestore";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

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
  const {
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
  } = useStarBoundContext();

  const allToggled =
    getAllUsersShipToggled.length > 0 &&
    getAllUsersShipToggled.every((s) => s.isToggled);

  const allToggledOrHpZero =
    getAllUsersShipToggled.length > 0 &&
    getAllUsersShipToggled.every((ship) => ship.isToggled || ship.hp <= 0);

  const myShips = useMemo(() => {
    return getAllUsersShipToggled.filter((ship) => ship.user === user.uid);
  }, [getAllUsersShipToggled, user?.uid]);

  const shipInSector = useMemo(() => {
    return gameSectors === "Show All Ships..."
      ? myShips
      : myShips.filter((ship) => ship.gameSector === gameSectors);
  }, [myShips, gameSectors]);

  //assignt that to a variable to check if there are any ships
  const hasNoShips = myShips.length === 0;

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
          hasRolledDToHit: false,
          round: 0,
          trackManeuver: 0,
          shipInterval: 0,
          gameSector: gameSectors,
          protectedByCarrierID: null,
          numberOfShipsProtecting: 0,
          color: getRandomColorForCarrier(),
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
      getFleetData({ data, setData });
      setIsLoading(false);
    }
  };

  const totalFleetValue = data
    ? data.reduce((sum, ship) => sum + (ship.pointValue || 0), 0)
    : 0;

  useEffect(() => {
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
        //console.log("Profile Image In Player:", data.gameRoom);
      }
    });
    return () => unsubscribe();
  }, [user?.uid]);

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
        //  console.log("Ship Counts:", numberOfShips);
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
    const request = new XMLHttpRequest();
    request.open(
      "POST",
      "https://discord.com/api/webhooks/1334142368613400598/ByDe3g5n2lUlWW_dpj1tYV5JggI6XMbWpaldCsn53EJF5P1vJ3IU1Tg0-IqZ4cnWuOn_"
    );
    request.setRequestHeader("Content-Type", "application/json");
    const params = {
      username: "Starbound Conquest",
      avatar_url: "",
      content: `The Round has ended in ${gameRoom}. Resetting your ships.`,
    };
    request.send(JSON.stringify(params));
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

  //listen for gameround changes and update the round for all users
  useEffect(() => {
    const docRef = doc(FIREBASE_DB, "users", user.uid); // or "gameRooms", depending on your structure

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setGameRound(docSnap.data().round);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const count = getAllUsersShipToggled.filter((s) => s.isToggled).length;
    setGetAllUsersShipTotals(count);
  }, [getAllUsersShipToggled]);

  useEffect(() => {
    if (!user || !gameRoom) return;

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
  }, [user?.uid, gameRoom]);

  const endYourTurn = async () => {
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
        if (myShipData.specialOrders) {
          Object.keys(myShipData.specialOrders).forEach((order) => {
            newSpecialOrders[order] = false;
          });
        }
        allResetPromises.push(
          updateDoc(myShipDocRef, {
            isToggled: false,
            specialOrders: newSpecialOrders,
            hasBeenInteractedWith: false,
            hit: false,
            hasRolledDToHit: false,
            shipInterval: increment(1),
            distanceTraveled: 0,
            broadSideBonus: 0,
            moveDistanceBonus: 0,
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
          if (shipData.specialOrders) {
            Object.keys(shipData.specialOrders).forEach((key) => {
              newSpecialOrders[key] = false;
            });
          }

          allResetPromises.push(
            updateDoc(shipDocRef, {
              isToggled: false,
              specialOrders: {},
              hasBeenInteractedWith: false,
              hit: false,
              hasRolledDToHit: false,
              shipInterval: increment(1),
              distanceTraveled: 0,
            })
          );
        }
      }
      //update round for all users
      await updateRoundForAllUsers();
      // ✅ Wait for all updates
      await Promise.all(allResetPromises);
      //setGetAllUsersShipToggled([]);
      setGetAllUsersShipTotals(0);

      // 🔄 Refresh local fleet state
      getFleetData({ data, setData });

      setShowEndOfRound(false);
    } catch (e) {
      console.error("Error in endYourTurn:", e);
    } finally {
      setShowEndOfRound(false); // Ensures it's always turned off
    }
  };

  useEffect(() => {
    if (!gameRoom) return;

    const userShipUnsubs = [];
    const allShipMap = {}; // temp store: { [uid]: [ship, ship, ...] }

    const usersRef = collection(FIREBASE_DB, "users");
    const unsubscribeUsers = onSnapshot(usersRef, (userSnapshot) => {
      // Clear previous listeners
      userShipUnsubs.forEach((unsub) => unsub());
      userShipUnsubs.length = 0;

      userSnapshot.docs.forEach((userDoc) => {
        const uid = userDoc.id;
        const shipsRef = collection(FIREBASE_DB, "users", uid, "ships");
        const shipsQuery = query(shipsRef, where("gameRoom", "==", gameRoom));

        const unsub = onSnapshot(shipsQuery, (shipsSnap) => {
          const userShips = shipsSnap.docs.map((doc) => doc.data());

          // Update that user's ships
          allShipMap[uid] = userShips;

          // Flatten all users' ships
          const allShips = Object.values(allShipMap).flat();
          setGetAllUsersShipToggled(allShips);
        });

        userShipUnsubs.push(unsub);
      });
    });

    return () => {
      unsubscribeUsers();
      userShipUnsubs.forEach((u) => u());
    };
  }, [gameRoom]);

  const handleEndRoundPress = () => {
    if (allToggledOrHpZero) {
      endYourTurn();
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
    if (!gameRoom) return;

    const userShipUnsubs = [];

    const usersRef = collection(FIREBASE_DB, "users");
    const unsubscribeUsers = onSnapshot(usersRef, (userSnapshot) => {
      // clear previous listeners
      userShipUnsubs.forEach((u) => u());
      userShipUnsubs.length = 0;

      userSnapshot.docs.forEach((userDoc) => {
        const uid = userDoc.id;
        const shipsRef = collection(FIREBASE_DB, "users", uid, "ships");
        const shipsQuery = query(shipsRef, where("gameRoom", "==", gameRoom));

        const unsub = onSnapshot(shipsQuery, (shipsSnap) => {
          const currentShips = shipsSnap.docs.map((doc) => doc.data());

          setGetAllUsersShipToggled((prevShips) => {
            // Filter out old ships from this user
            const others = prevShips.filter((s) => s.user !== uid);
            return [...others, ...currentShips];
          });
        });

        userShipUnsubs.push(unsub);
      });
    });

    return () => {
      unsubscribeUsers();
      userShipUnsubs.forEach((u) => u());
    };
  }, [gameRoom]);

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
              <Text style={styles.subHeaderText}>
                Welcome to Starbound Conquest! Prepare to command your fleet and
                conquer the stars. Below, you'll find a quick snapshot of your
                fleet's status. Use the buttons to navigate to screens where you
                can manage your ships' stats, toggle their turns, and issue
                orders. Also tap on the settings to change your Faction,
                Username and Profile Picture.
              </Text>
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
                  <Image
                    style={styles.profile}
                    source={
                      profile
                        ? { uri: profile }
                        : require("../../assets/images/SC_logo1.png") // fallback image
                    }
                  />
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
                  <Text
                    style={[styles.underText, { color: Colors.green_toggle }]}
                  >
                    Toggled: {getAllUsersShipTotals || 0} / Total:{" "}
                    {getAllUsersShipToggled.length}
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
                      <TouchableOpacity onLongPress={resetRoundForCurretUser}>
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
                          Round: {gameRound}
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
                      gap: 10,
                    }}
                  >
                    <TouchableOpacity
                      disabled={!allToggledOrHpZero}
                      onPress={handleEndRoundPress}
                      style={[
                        styles.editContainer,
                        {
                          borderWidth: 1,
                          width: "45%",
                          shadowColor: !allToggledOrHpZero
                            ? Colors.lighter_red
                            : Colors.gold,
                          borderColor: !allToggledOrHpZero
                            ? Colors.lighter_red
                            : Colors.gold,
                          backgroundColor: !allToggledOrHpZero
                            ? Colors.deep_red
                            : Colors.goldenrod,
                          opacity: !allToggledOrHpZero ? 0.5 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.textValue,
                          {
                            color: !allToggledOrHpZero
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

                    {/* <TouchableOpacity
                      style={styles.editContainer}
                      onPress={updateRoundForAllUsers}
                    >
                      <Text style={styles.textValue}>Force Next Round</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      style={[
                        styles.editContainer,
                        {
                          borderWidth: 1,
                          width: "45%",
                          borderColor: toggleToDelete
                            ? Colors.lighter_red
                            : Colors.green_toggle,
                          backgroundColor: toggleToDelete
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
                            color: toggleToDelete
                              ? Colors.lighter_red
                              : Colors.green_toggle,
                            fontSize: 12,
                          },
                        ]}
                      >
                        Delete a ship
                      </Text>
                    </TouchableOpacity>
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
                      Ships in {gameSectors}:{" "}
                      {shipInSector.length > 0
                        ? shipInSector.length
                        : "No ships"}
                    </Text>
                  </View>
                  <DropdownComponentSectors />
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
                disabled={toggleToDelete}
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
                disabled={toggleToDelete || !gameRoom}
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
                disabled={toggleToDelete}
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
              />
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
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
    shadowColor: Colors.hud,
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
    fontFamily: "leagueBold",
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
});
