import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View, Modal, Text, TextInput, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { useStarBoundContext } from "../Global/StarBoundProvider";

// Define your key for AsyncStorage
const statKey = '';

export default function EditButton() {
    /* const [isModalVisible, setIsModalVisible] = useState(false); */
    const { isModalVisible, setIsModalVisible, text, setText } = useStarBoundContext();
    
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

    return (
        <View style={styles.buttonContainer}>
            <Text style={styles.textStyle}>Fleet Limit:</Text>
            <View style={styles.fleetContainer}>
                <Text style={styles.textStyle}>{text}</Text>
                <Pressable
                onPress={() => setIsModalVisible(true)}
                style={({ pressed }) => [
                    styles.button,
                    {
                    backgroundColor: pressed ? Colors.goldenrod : Colors.blue_gray,
                    borderColor: pressed ? Colors.gold : Colors.slate,
                    },
                ]}>
                    <Image source={require('../../assets/icons/icons8-create-50.png')} 
                    style={{
                        width: 25, 
                        height: 25, }}/>
                </Pressable>    
            </View>
            <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
                animationType="slide">
                <View style={styles.heroModalContainer}>
                    <TextInput
                        style={styles.modalTextInput}
                        onChangeText={setText}
                        value={text}
                        keyboardType="numeric"
                    />
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
                                <Image source={require('../../assets/icons/icons8-save-50.png')} 
                    style={{
                        width: 25, 
                        height: 25, }}/>
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
                                <Image source={require('../../assets/icons/delete50.png')} 
                    style={{
                        width: 25, 
                        height: 25, }}/>
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
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 2,
        borderColor: Colors.slate,
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
        fontSize: 18,
        fontFamily: 'monospace',
        textAlign: 'center',
    },
    heroModalContainerButtons: {
        flexDirection: 'row',
        backgroundColor: Colors.dark_gray,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    buttonContainer: {
       alignItems: 'center',
       margin: 10,
    },
    fleetContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 10,
        gap: 70,
        },
});
