import { StyleSheet, Text, View, StatusBar, Image,  Pressable, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from 'react';
import { Colors } from "../../constants/Colors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

export default function Login(){

    const [isPressed, setIsPressed ] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar/>
            <View style={styles.logoContainer}>
                <Image source={require("../../assets/images/sbcq.png")} style={styles.logo}/>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput style={styles.input} placeholder="Enter username"/>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput style={styles.input} placeholder="Enter password"/>
            </View>
            <View style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity style={styles.loginButton}>
                    <Text style={[styles.loginText, { color: isPressed? Colors.dark_gray : Colors.white},]}>Login</Text>
                </TouchableOpacity>
                <Text style={[styles.loginText, { color: isPressed? Colors.dark_gray : Colors.white},]}>-or-</Text>
                <TouchableOpacity >
                    <Image source={require("../../assets/images/google.png")} style={{marginTop: 10, width: 189, height: 40}} />       
                </TouchableOpacity>
            </View>
            
        </SafeAreaView>
    )
}
    const styles = StyleSheet.create({
        container: {
            fontFamily: "aboreto",
            flex: 1,
            backgroundColor: Colors.dark_gray,
            padding: 24
        },
        logoContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        logo: {
            height: 310,
            width: 300
        },
        inputContainer: {
            marginBottom: 16
        },
        inputLabel: {
            fontSize: 16,
            marginBottom: 4,
            color: Colors.slate
        },
        input: {
            borderWidth: 1,
            borderColor: Colors.slate,
            padding: 10,
            borderRadius: 4,
            color: Colors.dark_gray,
            backgroundColor: Colors.white,
            borderTopLeftRadius: 20,
            borderBottomRightRadius: 20,
        },
        loginButton: {
            backgroundColor: Colors.primary,
            padding: 12,
            borderRadius: 4,
            marginTop: 16,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderTopLeftRadius: 20,
            borderBottomRightRadius: 20,
            marginBottom: 16,
            borderColor: Colors.slate,
            backgroundColor: Colors.slate,
        },
        loginText: {
            fontWeight: 'bold',
        }
    })
