import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from "@/constants/Colors";


export default function GameLore() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Game Lore</Text>
            <Text style={styles.text}>Your text goes here.</Text>
        </View>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.dark_gray,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.white,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
        color: Colors.white,
    },
});