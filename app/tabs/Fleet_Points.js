import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import EditButton from "../../components/buttons/EditButton";
import { useStarBoundContext } from "../../components/Global/StarBoundProvider";

const SHIP_VALUES = {
  fighter: 1,
  destroyer: 30,
  cruiser: 80,
  carrier: 120,
  dreadnought: 240,
};

export default function Fleet_Points() {
  const [fighterCount, setFighterCount] = useState(0);
  const [carrierCount, setCarrierCount] = useState(0);
  const [dreadnoughtCount, setDreadnoughtCount] = useState(0);
  const [cruiserCount, setCruiserCount] = useState(0);
  const [destroyerCount, setDestroyerCount] = useState(0);
  const [fleetValue, setFleetValue] = useState(0);

  const { text, username, setUsername } = useStarBoundContext();

  const handleAddShip = async (shipType, increment = 1) => {
    const newCount =
      {
        fighter: fighterCount,
        carrier: carrierCount,
        dreadnought: dreadnoughtCount,
        cruiser: cruiserCount,
        destroyer: destroyerCount,
      }[shipType] + increment;

    const newFleetValue = fleetValue + SHIP_VALUES[shipType] * increment;

    switch (shipType) {
      case "fighter":
        setFighterCount(newCount);
        break;
      case "carrier":
        setCarrierCount(newCount);
        break;
      case "dreadnought":
        setDreadnoughtCount(newCount);
        break;
      case "cruiser":
        setCruiserCount(newCount);
        break;
      case "destroyer":
        setDestroyerCount(newCount);
        break;
    }
    setFleetValue(newFleetValue);
    await saveFleetData(newCount, newFleetValue, shipType);
  };

  const handleRemoveShip = async (shipType, increment = 1) => {
    const currentCount = {
      fighter: fighterCount,
      carrier: carrierCount,
      dreadnought: dreadnoughtCount,
      cruiser: cruiserCount,
      destroyer: destroyerCount,
    }[shipType];

    if (currentCount > 0) {
      // Ensure new count doesn't go below zero
      const newCount = Math.max(currentCount - increment, 0);
      const effectiveIncrement = currentCount - newCount; // The actual amount removed
      const newFleetValue =
        fleetValue - SHIP_VALUES[shipType] * effectiveIncrement;

      switch (shipType) {
        case "fighter":
          setFighterCount(newCount);
          break;
        case "carrier":
          setCarrierCount(newCount);
          break;
        case "dreadnought":
          setDreadnoughtCount(newCount);
          break;
        case "cruiser":
          setCruiserCount(newCount);
          break;
        case "destroyer":
          setDestroyerCount(newCount);
          break;
      }
      setFleetValue(newFleetValue);
      await saveFleetData(newCount, newFleetValue, shipType);
    }
  };

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const savedFighterCount = await AsyncStorage.getItem("fighterCount");
        const savedCarrierCount = await AsyncStorage.getItem("carrierCount");
        const savedDreadnoughtCount = await AsyncStorage.getItem(
          "dreadnoughtCount"
        );
        const savedCruiserCount = await AsyncStorage.getItem("cruiserCount");
        const savedDestroyerCount = await AsyncStorage.getItem(
          "destroyerCount"
        );
        const savedFleetValue = await AsyncStorage.getItem("fleetValue");

        setFighterCount(
          savedFighterCount !== null ? JSON.parse(savedFighterCount) : 0
        );
        setCarrierCount(
          savedCarrierCount !== null ? JSON.parse(savedCarrierCount) : 0
        );
        setDreadnoughtCount(
          savedDreadnoughtCount !== null ? JSON.parse(savedDreadnoughtCount) : 0
        );
        setCruiserCount(
          savedCruiserCount !== null ? JSON.parse(savedCruiserCount) : 0
        );
        setDestroyerCount(
          savedDestroyerCount !== null ? JSON.parse(savedDestroyerCount) : 0
        );
        setFleetValue(
          savedFleetValue !== null ? JSON.parse(savedFleetValue) : 0
        );
      } catch (e) {
        console.error("Failed to load counts:", e);
      }
    };

    loadCounts();
  }, []);

  useEffect(() => {
    const getUserName = async () => {
      try {
        const username = await AsyncStorage.getItem("UserName");
        if (username) {
          setUsername(username); // Only set if a username exists
        } else {
          setUsername("Commander");
        }
      } catch (error) {
        console.error("Failed to retrieve username:", error);
      }
    };
    getUserName();
  }, []);

  // Save combined data to AsyncStorage
  const saveFleetData = async (newCount, newFleetValue, shipType) => {
    try {
      await AsyncStorage.setItem(`${shipType}Count`, JSON.stringify(newCount));
      await AsyncStorage.setItem(`fleetValue`, JSON.stringify(newFleetValue));
    } catch (e) {
      console.error("Failed to save fleet data:", e);
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      setFighterCount(0);
      setDestroyerCount(0);
      setCruiserCount(0);
      setCarrierCount(0);
      setDreadnoughtCount(0);
      setFleetValue(0);
      console.log("Storage cleared");
    } catch (e) {
      console.error("Error clearing storage:", e);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.limitsValues}>
            <EditButton />
            <Text style={styles.values}>Your Fleet Value:</Text>
            <Text style={styles.values}>{fleetValue}</Text>
            {fleetValue > text && (
                <Text style={styles.warningValues}>
                    {username},Your fleet is over your limit! Consider removing some ships.
                </Text>
)}
          </View>
          <View style={styles.shipTableStats}>
            <Image
              style={styles.Image}
              source={require("../../assets/icons/rookie_64.png")}
            />
            <Image
              style={styles.Image}
              source={require("../../assets/icons/destroyer_64.png")}
            />
            <Image
              style={styles.Image}
              source={require("../../assets/icons/cruiser_64.png")}
            />
            <Image
              style={styles.Image}
              source={require("../../assets/icons/superCapital_64.png")}
            />
            <Image
              style={styles.Image}
              source={require("../../assets/icons/titan_64.png")}
            />
          </View>
          <View style={styles.shipTableStatsNumbers}>
            <Text style={styles.tableHeader}>{fighterCount}</Text>
            <Text style={styles.tableHeader}>{destroyerCount}</Text>
            <Text style={styles.tableHeader}>{cruiserCount}</Text>
            <Text style={styles.tableHeader}>{carrierCount}</Text>
            <Text style={styles.tableHeader}>{dreadnoughtCount}</Text>
          </View>
          <View style={[styles.TouchableOpacityContainer]}>
            <TouchableOpacity
              style={({ pressed }) => [
                styles.button,
                
              ]}
              onPress={() => handleAddShip("fighter")}
              onLongPress={() => handleRemoveShip("fighter")}
            >
              <Text style={styles.TouchableOpacityText}>Fighter +1</Text>
              <Image style={{width: 160, height: 80, position: 'relative'}} source={require("../../assets/images/cathud.png")} />
            </TouchableOpacity>
            <TouchableOpacity
              style={({ pressed }) => [
                styles.button,
                
              ]}
              onPress={() => handleAddShip("destroyer")}
              onLongPress={() => handleRemoveShip("destroyer")}
            >
              <Text style={styles.TouchableOpacityText}>Destroyer +1</Text>
              <Image style={{width: 160, height: 80, position: 'relative'}} source={require("../../assets/images/cathud.png")} />
            </TouchableOpacity>
          </View>

          {/*larger incerment buttons*/}
          <View style={styles.TouchableOpacityLargerContainer}>
            <View style={styles.TouchableOpacityLargerContainerLeft}>
              <TouchableOpacity
              style={({ pressed }) => [
                styles.buttonIncrements,
                
              ]}
                onPress={() => handleAddShip("fighter", 5)}
                onLongPress={() => handleRemoveShip("fighter", 5)}
              >
                <Text style={styles.TouchableOpacityTextIncrement}>+05</Text>
                <Image style={{width: 60, height: 60, position: 'relative'}} source={require("../../assets/images/inchud.png")} />

              </TouchableOpacity>
              <TouchableOpacity
                style={({ pressed }) => [
                    styles.buttonIncrements,
                    
                  ]}
                onPress={() => handleAddShip("fighter", 10)}
                onLongPress={() => handleRemoveShip("fighter", 10)}
              >
                <Text style={styles.TouchableOpacityTextIncrement}>+10</Text>
                <Image style={{width: 60, height: 60, position: 'relative'}} source={require("../../assets/images/inchud.png")} />
              </TouchableOpacity>
            </View>
            <View style={styles.TouchableOpacityLargerContainerRight}>
              <TouchableOpacity
                style={({ pressed }) => [
                    styles.buttonIncrements,
                    
                  ]}
                onPress={() => handleAddShip("destroyer", 5)}
                onLongPress={() => handleRemoveShip("destroyer", 5)}
              >
                <Text style={styles.TouchableOpacityTextIncrement}>+05</Text>
                <Image style={{width: 60, height: 60, position: 'relative'}} source={require("../../assets/images/inchud.png")} />
              </TouchableOpacity>
              <TouchableOpacity
                style={({ pressed }) => [
                    styles.buttonIncrements,
                    
                  ]}
                onPress={() => handleAddShip("destroyer", 10)}
                onLongPress={() => handleRemoveShip("destroyer", 10)}
              >
                <Text style={styles.TouchableOpacityTextIncrement}>+10</Text>
                <Image style={{width: 60, height: 60, position: 'relative'}} source={require("../../assets/images/inchud.png")} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.TouchableOpacityContainer}>
            <TouchableOpacity
              style={({ pressed }) => [
                styles.button,
                
              ]}
              onPress={() => handleAddShip("cruiser")}
              onLongPress={() => handleRemoveShip("cruiser")}
            >
              <Text style={styles.TouchableOpacityText}>Cruiser +1</Text>
              <Image style={{width: 160, height: 80, position: 'relative'}} source={require("../../assets/images/cathud.png")} />

            </TouchableOpacity>
            <TouchableOpacity
              style={({ pressed }) => [
                styles.button,
                
              ]}
              onPress={() => handleAddShip("carrier")}
              onLongPress={() => handleRemoveShip("carrier")}
            >
              <Text style={styles.TouchableOpacityText}>Carrier +1</Text>
              <Image style={{width: 160, height: 80, position: 'relative'}} source={require("../../assets/images/cathud.png")} />

            </TouchableOpacity>
          </View>

          {/*larger incerment buttons*/}
          <View style={styles.TouchableOpacityLargerContainer}>
            <View style={styles.TouchableOpacityLargerContainerLeft}>
              <TouchableOpacity
                style={({ pressed }) => [
                    styles.buttonIncrements,
                    
                  ]}
                onPress={() => handleAddShip("cruiser", 5)}
                onLongPress={() => handleRemoveShip("cruiser", 5)}
              >
                <Text style={styles.TouchableOpacityTextIncrement}>+05</Text>
                <Image style={{width: 60, height: 60, position: 'relative'}} source={require("../../assets/images/inchud.png")} />

              </TouchableOpacity>
              <TouchableOpacity
                style={({ pressed }) => [
                    styles.buttonIncrements,
                    
                  ]}
                onPress={() => handleAddShip("cruiser", 10)}
                onLongPress={() => handleRemoveShip("cruiser", 10)}
              >
                <Text style={styles.TouchableOpacityTextIncrement}>+10</Text>
                <Image style={{width: 60, height: 60, position: 'relative'}} source={require("../../assets/images/inchud.png")} />

              </TouchableOpacity>
            </View>
            <View style={styles.TouchableOpacityLargerContainerRight}>
              <TouchableOpacity
                style={({ pressed }) => [
                    styles.buttonIncrements,
                    
                  ]}
                onPress={() => handleAddShip("carrier", 5)}
                onLongPress={() => handleRemoveShip("carrier", 5)}
              >
                <Text style={styles.TouchableOpacityTextIncrement}>+05</Text>
                <Image style={{width: 60, height: 60, position: 'relative'}} source={require("../../assets/images/inchud.png")} />

              </TouchableOpacity>
              <TouchableOpacity
                style={({ pressed }) => [
                    styles.buttonIncrements,
                    
                  ]}
                onPress={() => handleAddShip("carrier", 10)}
                onLongPress={() => handleRemoveShip("carrier", 10)}
              >
                <Text style={styles.TouchableOpacityTextIncrement}>+10</Text>
                <Image style={{width: 60, height: 60, position: 'relative'}} source={require("../../assets/images/inchud.png")} />

              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.TouchableOpacityContainer}>
            <TouchableOpacity
              style={({ pressed }) => [
                styles.buttonIncrements,
                
              ]}
              onPress={() => handleAddShip("dreadnought", 5)}
              onLongPress={() => handleRemoveShip("dreadnought", 5)}
            >
              <Text style={styles.TouchableOpacityTextIncrement}>+05</Text>
              <Image style={{width: 60, height: 60, position: 'relative'}} source={require("../../assets/images/inchud.png")} />

            </TouchableOpacity>
            <TouchableOpacity
              style={({ pressed }) => [
                styles.button,
                
              ]}
              onPress={() => handleAddShip("dreadnought")}
              onLongPress={() => handleRemoveShip("dreadnought")}
            >
              <Text style={styles.TouchableOpacityText}>Dreadnought +1</Text>
              <Image style={{width: 160, height: 80, position: 'relative'}} source={require("../../assets/images/cathud.png")} />

            </TouchableOpacity>
            <TouchableOpacity
              style={({ pressed }) => [
                styles.buttonIncrements,
                
              ]}
              onPress={() => handleAddShip("dreadnought", 10)}
              onLongPress={() => handleRemoveShip("dreadnought", 10)}
            >
              <Text style={styles.TouchableOpacityTextIncrement}>+10</Text>
              <Image style={{width: 60, height: 60, position: 'relative'}} source={require("../../assets/images/inchud.png")} />

            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.TouchableOpacityContainer}>
          <TouchableOpacity
            onLongPress={() => clearStorage()}
            style={({ pressed }) => [
              styles.deleteButton,
              {
                backgroundColor: pressed ? Colors.gold : Colors.deep_red,
                borderColor: pressed
                  ? Colors.lightened_gold
                  : Colors.lightened_deep_red,
              },
            ]}
          >
            {({ pressed }) => (
              <Text
                style={{
                  color: pressed ? Colors.dark_gray : Colors.white,
                  fontFamily: "monospace",
                  fontSize: 10,
                }}
              >
                Delete Everything
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark_gray,
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark_gray,
    paddingBottom: 20
  },
  headerText: {
    color: Colors.white,
    fontSize: 28,
    marginBottom: 5,
    marginTop: 10,
    fontFamily: "monospace",
    alignSelf: "center",
  },
  buttonIncrements: {
    width: 75,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2,
    borderColor: Colors.slate,
  },
  button: {
    width: 175,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    alignItems: "center",
    position: "relative",
  },
  deleteButton: {
    width: 175,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 2,
  },
  TouchableOpacityContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  TouchableOpacityText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: "monospace",
    alignSelf: "center",
    position: "absolute",
    marginTop: 30,
  },
  TouchableOpacityTextIncrement: {
    color: Colors.white,
    fontSize: 8,
    fontFamily: "monospace",
    position: "absolute",
    marginLeft: 20,
    marginTop: 20,
  },
  limitsValues: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  values: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "monospace",
    alignSelf: "center",
  },
  shipTableStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.blue_gray,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginTop: 10,
    marginHorizontal: 10,
  },
  shipTableStatsNumbers: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.dark_gray,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginTop: 2,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.slate,
  },
  tableHeader: {
    color: Colors.misty_blue,
    fontSize: 12,
    textAlign: "center",
    fontFamily: "monospace",
    fontWeight: "bold",
    flex: 1,
  },
  Image: {
    width: 35,
    height: 35,
    alignSelf: "center",
  },
  TouchableOpacityLargerContainerLeft: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
    alignContent: "center",
    justifyContent: "space-around",
    flex: 1,
  },
  TouchableOpacityLargerContainerRight: {
    flexDirection: "row",
    marginBottom: 10,
    alignContent: "center",
    justifyContent: "space-around",
    flex: 1,
  },
  TouchableOpacityLargerContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center",
    marginTop: -10,
    marginBottom: 10,
  },
  warningValues:{
    color: Colors.lightened_deep_red,
    fontSize: 16,
    fontFamily: "monospace",
    alignSelf: "center",
    textAlign: "center",
  }
});