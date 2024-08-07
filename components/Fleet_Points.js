import React, { useState,useEffect  } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Pressable,
    ScrollView,
  } from "react-native";
  import { Colors } from "@/constants/Colors";
  import { SafeAreaView } from "react-native-safe-area-context";
  import EditButton from "./buttons/EditButton";

  const SHIP_VALUES = {
    fighter: 30,
    frigate: 50,
    destroyer: 70,
    lightcruiser: 90,
    heavycruiser: 120,
    battleship: 150,
    carrier: 130,
    dreadnought: 180
  };
  
  export default function Fleet_Points() {

    const [fighterCount, setFighterCount] = useState(0);
    const [frigateCount, setFrigateCount] = useState(0);
    const [carrierCount, setCarrierCount] = useState(0);
    const [battleshipCount, setBattleshipCount] = useState(0);
    const [dreadnoughtCount, setDreadnoughtCount] = useState(0);
    const [lightcruiserCount, setLightcruiserCount] = useState(0);
    const [heavycruiserCount, setHeavycruiserCount] = useState(0);
    const [destroyerCount, setDestroyerCount] = useState(0);
    const [fleetValue, setFleetValue] = useState(0);

    const handleAddShip = async (shipType) => {
        const newCount = {
            fighter: fighterCount,
            frigate: frigateCount,
            carrier: carrierCount,
            battleship: battleshipCount,
            dreadnought: dreadnoughtCount,
            lightcruiser: lightcruiserCount,
            heavycruiser: heavycruiserCount,
            destroyer: destroyerCount
        }[shipType] + 1;

        const newFleetValue = fleetValue + SHIP_VALUES[shipType];

        switch (shipType) {
            case 'fighter':
                setFighterCount(newCount);
                break;
            case 'frigate':
                setFrigateCount(newCount);
                break;
            case 'carrier':
                setCarrierCount(newCount);
                break;
            case 'battleship':
                setBattleshipCount(newCount);
                break;
            case 'dreadnought':
                setDreadnoughtCount(newCount);
                break;
            case 'lightcruiser':
                setLightcruiserCount(newCount);
                break;
            case 'heavycruiser':
                setHeavycruiserCount(newCount);
                break;
            case 'destroyer':
                setDestroyerCount(newCount);
                break;
        }
        setFleetValue(newFleetValue);
        await saveFleetData(newCount, newFleetValue, shipType);
    };

    const handleRemoveShip = async (shipType) => {
        const currentCount = {
            fighter: fighterCount,
            frigate: frigateCount,
            carrier: carrierCount,
            battleship: battleshipCount,
            dreadnought: dreadnoughtCount,
            lightcruiser: lightcruiserCount,
            heavycruiser: heavycruiserCount,
            destroyer: destroyerCount,
        }[shipType];
    
        if (currentCount > 0) {
            const newCount = currentCount - 1;
            const newFleetValue = fleetValue - SHIP_VALUES[shipType];
    
            switch (shipType) {
                case 'fighter':
                    setFighterCount(newCount);
                    break;
                case 'frigate':
                    setFrigateCount(newCount);
                    break;
                case 'carrier':
                    setCarrierCount(newCount);
                    break;
                case 'battleship':
                    setBattleshipCount(newCount);
                    break;
                case 'dreadnought':
                    setDreadnoughtCount(newCount);
                    break;
                case 'lightcruiser':
                    setLightcruiserCount(newCount);
                    break;
                case 'heavycruiser':
                    setHeavycruiserCount(newCount);
                    break;
                case 'destroyer':
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
                const savedFighterCount = await AsyncStorage.getItem('fighterCount');
                const savedFrigateCount = await AsyncStorage.getItem('frigateCount');
                const savedCarrierCount = await AsyncStorage.getItem('carrierCount');
                const savedBattleshipCount = await AsyncStorage.getItem('battleshipCount');
                const savedDreadnoughtCount = await AsyncStorage.getItem('dreadnoughtCount');
                const savedLightcruiserCount = await AsyncStorage.getItem('lightcruiserCount');
                const savedHeavycruiserCount = await AsyncStorage.getItem('heavycruiserCount');
                const savedDestroyerCount = await AsyncStorage.getItem('destroyerCount');
                const savedFleetValue = await AsyncStorage.getItem('fleetValue');
        
                setFighterCount(savedFighterCount !== null ? JSON.parse(savedFighterCount) : 0);
                setFrigateCount(savedFrigateCount !== null ? JSON.parse(savedFrigateCount) : 0);
                setCarrierCount(savedCarrierCount !== null ? JSON.parse(savedCarrierCount) : 0);
                setBattleshipCount(savedBattleshipCount !== null ? JSON.parse(savedBattleshipCount) : 0);
                setDreadnoughtCount(savedDreadnoughtCount !== null ? JSON.parse(savedDreadnoughtCount) : 0);
                setLightcruiserCount(savedLightcruiserCount !== null ? JSON.parse(savedLightcruiserCount) : 0);
                setHeavycruiserCount(savedHeavycruiserCount !== null ? JSON.parse(savedHeavycruiserCount) : 0);
                setDestroyerCount(savedDestroyerCount !== null ? JSON.parse(savedDestroyerCount) : 0);
                setFleetValue(savedFleetValue !== null ? JSON.parse(savedFleetValue) : 0);
            } catch (e) {
                console.error('Failed to load counts:', e);
            }
        };

        loadCounts();
    }, []);

    
    // Save combined data to AsyncStorage
    const saveFleetData = async (newCount, newFleetValue, shipType) => {
        try {
            await AsyncStorage.setItem(`${shipType}Count`, JSON.stringify(newCount));
            await AsyncStorage.setItem(`fleetValue`, JSON.stringify(newFleetValue));
        } catch (e) {
            console.error('Failed to save fleet data:', e);
        }
    };

    const clearStorage = async () => {
        try {
          await AsyncStorage.clear();
          setFighterCount(0);
          setFrigateCount(0);
          setDestroyerCount(0);
          setLightcruiserCount(0);
          setHeavycruiserCount(0);
          setCarrierCount(0);
          setBattleshipCount(0);
          setDreadnoughtCount(0);
          setFleetValue(0);
          console.log("Storage cleared");
        } catch (e) {
          console.error("Error clearing storage:", e);
        }
      };
    
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <ScrollView>
        <View style={styles.container}>
          <Text style={styles.headerText}>Fleet Points</Text>
          <View style={styles.limitsValues}>
                <EditButton />
                <Text style={styles.values}>Your Fleet Value:</Text>
                <Text style={styles.values}>{fleetValue}</Text>

            </View>
            <View style={styles.shipTableStats}>
                <Text style={styles.tableHeader}>Fi</Text>
                <Text style={styles.tableHeader}>Fr</Text>
                <Text style={styles.tableHeader}>De</Text>
                <Text style={styles.tableHeader}>Lc</Text>
                <Text style={styles.tableHeader}>Hc</Text>
                <Text style={styles.tableHeader}>Ca</Text>
                <Text style={styles.tableHeader}>Ba</Text>
                <Text style={styles.tableHeader}>Dn</Text>
            </View>
            <View style={styles.shipTableStatsNumbers}>
                <Text style={styles.tableHeader}>{fighterCount}</Text>
                <Text style={styles.tableHeader}>{frigateCount}</Text>
                <Text style={styles.tableHeader}>{destroyerCount}</Text>
                <Text style={styles.tableHeader}>{lightcruiserCount}</Text>
                <Text style={styles.tableHeader}>{heavycruiserCount}</Text>
                <Text style={styles.tableHeader}>{carrierCount}</Text>
                <Text style={styles.tableHeader}>{battleshipCount}</Text>
                <Text style={styles.tableHeader}>{dreadnoughtCount}</Text>
            </View>
          <View style={styles.pressableContainer}>
            <Pressable style={({ pressed }) => [
                    styles.button,
                    {
                    backgroundColor: pressed ? Colors.slate : Colors.blue_gray,
                    },
                ]} 
                onPress={() => handleAddShip('fighter')} 
                onLongPress={() =>handleRemoveShip('fighter')}>
                <Text style={styles.pressableText}>Fighter +30</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [
                    styles.button,
                    {
                    backgroundColor: pressed ? Colors.slate : Colors.blue_gray,
                    },
                ]} 
                onPress={() => handleAddShip('frigate')} 
                onLongPress={() =>handleRemoveShip('frigate')}>
                <Text style={styles.pressableText}>Frigate +50</Text>
            </Pressable>
        </View>
        <View style={styles.pressableContainer}>
            <Pressable style={({ pressed }) => [
                    styles.button,
                    {
                    backgroundColor: pressed ? Colors.slate : Colors.blue_gray,
                    },
                ]} 
                onPress={() => handleAddShip('destroyer')} 
                onLongPress={() =>handleRemoveShip('destroyer')}>
                <Text style={styles.pressableText}>Destroyer +70</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [
                    styles.button,
                    {
                    backgroundColor: pressed ? Colors.slate : Colors.blue_gray,
                    },
                ]} 
                onPress={() => handleAddShip('lightcruiser')} 
                onLongPress={() =>handleRemoveShip('lightcruiser')}>
                <Text style={styles.pressableText}>Light Cruiser +90</Text>
            </Pressable>
        </View>
        <View style={styles.pressableContainer}>
            <Pressable style={({ pressed }) => [
                    styles.button,
                    {
                    backgroundColor: pressed ? Colors.slate : Colors.blue_gray,
                    },
                ]} 
                onPress={() => handleAddShip('heavycruiser')} 
                onLongPress={() =>handleRemoveShip('heavycruiser')}>
                <Text style={styles.pressableText}>Heavy Cruiser +120</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [
                    styles.button,
                    {
                    backgroundColor: pressed ? Colors.slate : Colors.blue_gray,
                    },
                ]} 
                onPress={() => handleAddShip('carrier')} 
                onLongPress={() =>handleRemoveShip('carrier')}>
                <Text style={styles.pressableText}>Carrier +130</Text>
            </Pressable>
            </View>
            <View style={styles.pressableContainer}>
            <Pressable style={({ pressed }) => [
                    styles.button,
                    {
                    backgroundColor: pressed ? Colors.slate : Colors.blue_gray,
                    },
                ]} 
                onPress={() => handleAddShip('battleship')} 
                onLongPress={() =>handleRemoveShip('battleship')}>
                <Text style={styles.pressableText}>Battleship +150</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [
                    styles.button,
                    {
                    backgroundColor: pressed ? Colors.slate : Colors.blue_gray,
                    },
                ]} 
                onPress={() => handleAddShip('dreadnought')} 
                onLongPress={() =>handleRemoveShip('dreadnought')}>
                <Text style={styles.pressableText}>Dreadnought +180</Text>
            </Pressable>
            </View>
            <View style={styles.pressableContainer}>
            <Pressable 
                onLongPress={() =>clearStorage()}
                style={({ pressed }) => [
                        styles.deleteButton,
                        {
                        backgroundColor: pressed ? Colors.deep_red : Colors.blue_gray,
                        borderColor: pressed ? Colors.lightened_deep_red : Colors.slate,
                        },
                    ]}>  
    
                <Text style={styles.pressableText}>Delete Everything</Text>
            </Pressable>
          </View>
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
    headerText: {
      color: Colors.white,
      fontSize: 28,
      marginBottom: 10,
      marginTop: 10,
      fontFamily: "monospace",
      alignSelf: "center",
    },  
    button: {
      width: 175,
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginBottom: 10,
      alignItems: "center",
      borderTopLeftRadius: 20,
      borderBottomRightRadius: 20,
      borderWidth: 2,
      borderColor: Colors.slate,
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
    pressableContainer: {
      alignItems: "center",
      backgroundColor: Colors.dark_gray,
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 10,
    },
    pressableText: {
      color: Colors.white,
      fontSize: 10,
      fontFamily: "monospace",
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
  });
  