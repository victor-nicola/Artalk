import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity, Platform } from "react-native";
import { AuthContext } from "../../containers/authContext";

export default function LogIn( {navigation} ) {
    const [userString, setUserString] = useState("");
    const [password, setPassword] = useState("");

    // const logIn = async() => {
    //     const options = {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify( {userString: userString, password: password} )
    //     };

    //     await fetch( "http://172.16.30.60:3000/api/user/login", options )
    //     .then((res) => res.text())
    //     .then((res) => alert(res));
    // }

    const { logIn } = React.useContext( AuthContext );

    return (
        <View style = {{flex: 1, width: '100%'}}>
            <KeyboardAvoidingView behavior = {Platform.OS === "ios" ? "padding" : "height"} style = {styles.ViewContainer}>
                <Text style = {styles.Text}>Log In</Text>
                <View style = {styles.TextInputContainer}>
                    <TextInput style = {styles.TextInput} placeholder = {"Username or email"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setUserString( text ) } ></TextInput>
                </View>
                <View style = {styles.TextInputContainer}>
                    <TextInput secureTextEntry = {true} style = {styles.TextInput} placeholder = {"Password"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setPassword( text ) }></TextInput>
                </View>
                <TouchableOpacity style = {styles.TouchableOpacity} onPress = {() => logIn( userString, password )}>
                    <Text>Log In</Text>
                </TouchableOpacity>
                <View style = {{flexDirection: "row", margin: 5}}>
                    <Text style = {{color: "#fff"}}>Don't have an account? </Text>
                    <Text style = {{color: "#fff", fontWeight: "bold"}} onPress = {() => navigation.navigate( "Sign up" )}>Sign up</Text>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};


const styles = StyleSheet.create({
    TouchableOpacity: {
        width: "60%",
        borderRadius: 30,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#9c9c9c",
        margin: 5
    },
    ViewContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#3b3b3b",
        //margin: 5,
        width:'100%'
    },
    Text: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#fff"
    },
    TextInputContainer: {
       // flex: 1,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#000",
        height: 50,
        width: '90%',
        margin: 5,
        justifyContent: "center"
    },
    TextInput: {
        height: 50,
        //flex: 1,
        padding: 10,
        //margin: 5,
        width: "80%",
        color: "#fff"
        //margin: 10
    }
});
