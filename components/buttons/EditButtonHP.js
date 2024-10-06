import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View, Modal, Text, TextInput, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";

export default function EditButtonHP({ type, index, value }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [text, setText] = useState("");

    const statKey = `${type}-${index} -${value}-hp`;

    const shipImages = {
        "fighter": require('../../assets/icons/rookie_64.png'),
        "destroyer": require('../../assets/icons/destroyer_64.png'),
        "cruiser": require('../../assets/icons/cruiser_64.png'),
        "carrier": require('../../assets/icons/superCapital_64.png'),
        "dreadnought": require('../../assets/icons/titan_64.png'),
    };
    const shipHPValues = {
        "fighter": 1,
        "destroyer": 8,
        "cruiser": 12,
        "carrier": 14,
        "dreadnought": 30,
    }

    const save = async () => {
        try {
            await AsyncStorage.setItem(statKey, text);
        } catch (err) {
            alert(err);
        }
    };

    const load = async () => {
        try {
            let stat = await AsyncStorage.getItem(statKey);
            if (stat !== null) {
                setText(stat);
            }
        } catch (err) {
            alert(err);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const imageSource = shipImages[type] || require('../../assets/icons/rookie_64.png');
    const hpValue = shipHPValues[type] || 0;

    return (
        <View style={styles.buttonContainer}>
            <View style={styles.fleetContainer}>
                <Pressable
                    onPress={() => setIsModalVisible(true)}
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed ? Colors.goldenrod : Colors.blue_gray,
                            borderColor: pressed ? Colors.gold : Colors.slate,
                        },
                    ]}>
                    <Image
                        source={imageSource}
                        style={{
                            width: 50,
                            height: 50,
                        }}/>
                    <Text style={styles.textStyle}>HP: {text || hpValue}</Text>
                </Pressable>
            </View>
            <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
                animationType="slide" >
                <View style={styles.heroModalContainer}>
                <Text style={styles.textModalStyle}>Enter the desired HP for the ship</Text>
                    <TextInput
                        style={styles.modalTextInput}
                        onChangeText={setText}
                        value={text}
                        keyboardType="numeric"/>
                    <View style={styles.heroModalContainerButtons}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                {
                                    backgroundColor: pressed ? Colors.goldenrod : Colors.blue_gray,
                                    borderColor: pressed ? Colors.gold : Colors.slate,
                                },
                            ]}
                            onPress={() => {
                                setIsModalVisible(false);
                                save();
                            }}>
                            <Image
                                source={require('../../assets/icons/icons8-save-50.png')}
                                style={{
                                    width: 25,
                                    height: 25,
                                }}/>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                {
                                    backgroundColor: pressed ? Colors.deep_red : Colors.blue_gray,
                                    borderColor: pressed ? Colors.lightened_deep_red : Colors.slate,
                                },
                            ]}
                            onLongPress={() => {
                                setText("0");
                                setIsModalVisible(false);
                                save();
                            }}>
                            <Image
                                source={require('../../assets/icons/delete50.png')}
                                style={{
                                    width: 25,
                                    height: 25,
                                }}/>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 10,
    },
    button: {
        width: 75,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 2,
        alignItems: "center",
    },
    modalTextInput: {
        backgroundColor: Colors.slate,
        width: 300,
        textAlign: 'center',
        margin: 10,
    },
    heroModalContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.dark_gray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        color: Colors.white,
        fontSize: 10,
        fontFamily: 'monospace',
    },
    textModalStyle: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: 'monospace',
        justifyContent: 'center',
        textAlign: 'center',
    },
    heroModalContainerButtons: {
        flexDirection: 'row',
        backgroundColor: Colors.dark_gray,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    fleetContainer: {
        padding: 2,
    },
});
