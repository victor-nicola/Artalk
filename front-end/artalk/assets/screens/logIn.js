import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform } from "react-native";
import { AuthContext } from "../../containers/authContext";
import { useLinkTo } from "@react-navigation/native";

export default function LogIn( {navigation} ) {
    const [userString, setUserString] = useState("");
    const [password, setPassword] = useState("");
    const {height, width} = useWindowDimensions();

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
    const linkTo = useLinkTo();

    return (
        <View style = {styles.ViewContainer}>
            {/* <ImageBackground source={require('../bgAuth.png')} style={styles.backgroundImage}> */}
                { width >= 1100 && 
                <View style = {styles.TitleWrapper}>
                    <Text style = {styles.Title}>Artalk</Text>
                    <Text style = {styles.Text}>Supporting upcoming artists.</Text>
                </View>}

                <View style={styles.LogIn}>
                    <KeyboardAvoidingView style={styles.KeyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        {width < 1100 && <Text style = {styles.TitleMobile}>Artalk</Text>}
                        <TextInput style = {styles.TextInput} placeholder = {"Username or email"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setUserString( text ) } ></TextInput>
                        <TextInput secureTextEntry = {true} style = {styles.TextInput} placeholder = {"Password"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setPassword( text ) }></TextInput>
                        <TouchableOpacity style = {styles.TouchableOpacity} onPress = {() => logIn( userString, password )}>
                            <Text style={styles.ButtonText}>Log In</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                    <View style = {{flexDirection: "row", margin: 5}}>
                        <Text style = {{color: "#fff"}}>Don't have an account? </Text>
                        <Text style = {{color: "#fff", fontWeight: "bold"}} onPress = {() => linkTo('/sign_up')}>Sign up</Text>
                    </View>
                </View>
            {/* </ImageBackground> */}
        </View>
    );
};


const styles = StyleSheet.create({
    LogIn: {
        alignItems: "center",
        justifyContent: "center",
    },
    // backgroundImage: {
    //     width: 1920,
    //     height: 1080
    //     //resizeMode: 'cover', // or 'stretch'
    // },
    TouchableOpacity: {
        height: 50,
        //flex: 1,
        //margin: 5,
        width: "100%",
        backgroundColor: "#115aba",
        borderRadius: 5,
        borderWidth: 1,
        //borderColor: "#fff",
        height: 50,
        width: 300,
        margin: 5,
        alignItems: 'center',
        justifyContent: "center",
    },
    ViewContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#111",
        paddingHorizontal: '25%',
        //margin: 5,
        width:'100%'
    },
    KeyboardAvoidingView: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    TitleWrapper: {
        marginRight: '50%',
    },
    Title: {
        fontSize: 60,
        fontWeight: "bold",
        color: "#fff"
    },
    TitleMobile: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#fff"
    },
    Text: {
        fontSize: 25,
        color: "#fff"
    },
    ButtonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white"
    },
    TextInput: {
        height: 50,
        //flex: 1,
        padding: 10,
        //margin: 5,
        width: "100%",
        color: "#fff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#fff",
        height: 50,
        width: 300,
        margin: 5,
        //margin: 10
    }
});
