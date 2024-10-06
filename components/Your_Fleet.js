import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from "@/constants/Colors";
import EditButtonHP from './buttons/EditButtonHP';
import ToggleAttributeButton from './buttons/ToggleAttribute';

export default function Your_Fleet() {
    const [fighterImages, setFighterImages] = useState([]);
    const [destroyerImages, setDestroyerImages] = useState([]);
    const [cruiserImages, setCruiserImages] = useState([]);
    const [carrierImages, setCarrierImages] = useState([]);
    const [dreadnoughtImages, setDreadnoughtImages] = useState([]);

useFocusEffect(
    useCallback(() => {
        const loadCounts = async () => {
            try {
                const savedFighterCount = await AsyncStorage.getItem('fighterCount');
                const savedCarrierCount = await AsyncStorage.getItem('carrierCount');
                const savedDreadnoughtCount = await AsyncStorage.getItem('dreadnoughtCount');
                const savedCruiserCount = await AsyncStorage.getItem('cruiserCount');
                const savedDestroyerCount = await AsyncStorage.getItem('destroyerCount');

                const counts = {
                    fighterCount: parseInt(savedFighterCount) || 0,
                    carrierCount: parseInt(savedCarrierCount) || 0,
                    dreadnoughtCount: parseInt(savedDreadnoughtCount) || 0,
                    cruiserCount: parseInt(savedCruiserCount) || 0,
                    destroyerCount: parseInt(savedDestroyerCount) || 0,
                };

                setFighterImages(Array.from({ length: counts.fighterCount }, (_, i) => ({ id: i })));
                setDestroyerImages(Array.from({ length: counts.destroyerCount }, (_, i) => ({ id: i })));
                setCruiserImages(Array.from({ length: counts.cruiserCount }, (_, i) => ({ id: i })));
                setCarrierImages(Array.from({ length: counts.carrierCount }, (_, i) => ({ id: i })));
                setDreadnoughtImages(Array.from({ length: counts.dreadnoughtCount }, (_, i) => ({ id: i })));
            } catch (e) {
                console.error('Failed to load counts:', e);
            }
        };

        loadCounts();
    }, [])
);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Fleet</Text>
            <ScrollView style={styles.scrollView}>
            <Text style={styles.shipTextHeader}>Fighters</Text>
                <View style={styles.imageRow}>
                    {fighterImages.map((image, index) => (
                        <View key={image.id} style={styles.imageContainer}>
                            <EditButtonHP type="fighter" index={index} />
                            <ToggleAttributeButton type="fighter" index={index} />
                        </View>
                    ))}
                </View>
            <Text style={styles.shipTextHeader}>Destroyers</Text>
                <View style={styles.imageRow}>
                    {destroyerImages.map((image, index) => (
                    <View key={image.id} style={styles.imageContainer}>
                        <EditButtonHP type="destroyer" index={index} />
                        <ToggleAttributeButton type="destroyer" index={index} />
                    </View>
                    ))}
                </View>
            <Text style={styles.shipTextHeader}>Cruisers</Text>
                <View style={styles.imageRow}>
                    {cruiserImages.map((image, index) => (
                        <View key={image.id} style={styles.imageContainer}>
                        <EditButtonHP type="cruiser" index={index} />
                        <ToggleAttributeButton type="cruiser" index={index} />
                    </View>
                    ))}
                </View>
            <Text style={styles.shipTextHeader}>Carriers</Text>
                <View style={styles.imageRow}>
                    {carrierImages.map((image, index) => (
                        <View key={image.id} style={styles.imageContainer}>
                        <EditButtonHP type="carrier"/>
                        <ToggleAttributeButton type="carrier" index={index} />
                    </View>
                    ))}
                </View>
            <Text style={styles.shipTextHeader}>Dreadnoughts</Text>
                <View style={styles.imageRow}>
                    {dreadnoughtImages.map((image, index) => (
                        <View key={image.id} style={styles.imageContainer}>
                        <EditButtonHP type="dreadnought" index={index} />
                        <ToggleAttributeButton type="dreadnought" index={index}/>
                    </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: Colors.dark_gray,
    },
    title: {
        color: Colors.white,
        fontSize: 28,
        textAlign: "center",
        fontFamily: "monospace",
        marginBottom: 20,
        marginTop: 20,
    },
    button: {
        width: 75,
        height: 50,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginRight: 10,
        alignItems: "center",
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 2,
        borderColor: Colors.slate,
    },
    scrollView: {
        flex: 1,
        backgroundColor: Colors.dark_gray,
    },
    imageRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 1,
        justifyContent: 'space-evenly',
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
    },
    image: {
        width: 25,
        height: 25,
    },
    imageContainerHP: {
        flexDirection: "row",
        alignItems: 'center',
    },
    shipText: {
        color: Colors.white,
        marginLeft: 2,
        fontSize: 10,
        fontFamily: "monospace",
    },
    shipTextHeader:{
        color: Colors.white,
        marginLeft: 2,
        fontSize: 16,
        fontFamily: "monospace",
        marginTop: 10,
        borderWidth: 2,
        borderBottomColor: Colors.slate,
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
    },

});
