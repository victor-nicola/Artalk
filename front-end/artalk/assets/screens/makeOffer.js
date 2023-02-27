import { Octicons, Ionicons } from "@expo/vector-icons";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, Platform, Picker, ScrollView, KeyboardAvoidingView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Mime from "mime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { useLinkTo } from "@react-navigation/native";

export default function MakePostScreen({navigation}) {
    const [title, setTitle] = useState( "" );
    const [text, setText] = useState( "" );
    const [price, setPrice] = useState( 0 );
    const [type, setType] = useState( "" );
    const { ipString } = useContext( EnvContext );

    const makeGig = async() => {
        var token = await AsyncStorage.getItem( "userToken" );

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: token, title: title, text: text, price: price, type: type })
        };

        // console.log(JSON.stringify({ token: token, title: title, text: text, price: price, type: type }));

        await fetch( ipString + "api/user/makeOffer", options )
        .then((res) => res.text())
        .then((res) => alert(res));
    };

    const linkTo = useLinkTo();

    return (
        <View style = {{flex: 1, width: "100%", backgroundColor: "#111", paddingTop: 5}}>
            <View style = {styles.LogoBanner} >
                <View style = {{flex: 1, alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}} style = {{marginLeft: 15}}>
                        <Octicons name="three-bars" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <Text style = {{marginLeft: -60, fontSize:30, color: "#fff"}}>Make gig</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle = {styles.ViewContainer}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style = {styles.TextInputContainer}>
                        <TextInput style = {styles.TextInput} placeholder = {"Title"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setTitle( text ) }/>
                    </View>
                    <View style = {styles.TextInputContainer}>
                        <TextInput multiline={true} style = {styles.TextInput} placeholder = {"Description"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setText( text ) }/>
                    </View>
                    <View style = {styles.TextInputContainer}>
                        <TextInput style = {styles.TextInput} placeholder = {"Price per hour"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setPrice( new Number(text) ) }/>
                    </View>
                    <View style = {{flexDirection: "row", paddingTop: 10, paddingBottom: 10}}>
                        <Text style = {{marginRight: 20, fontSize: 20, color: "#fff"}}>Type:</Text>
                        <Picker style = {{backgroundColor: "#111", borderWidth: 0, color: "#fff", fontSize: 20}} onValueChange = {(itemValue, itemPosition) => setType(itemValue)}>
                            <Picker.Item label = "Anything" value = ""/>
                            <Picker.Item label = "Painting" value = "painting"/>
                            <Picker.Item label = "Digital art" value = "digital art"/>
                            <Picker.Item label = "Photography" value = "photography"/>
                            <Picker.Item label = "Sculpture" value = "sculpture"/>
                        </Picker>
                    </View>
                </KeyboardAvoidingView>
                <TouchableOpacity style = {styles.TouchableOpacity} onPress = {() => { makeGig(); }}>
                    <Text style={styles.ButtonText}>Post</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    SelectImage: {
        //width: "60%",
        borderRadius: 30,
        height: 40,
        //alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#9c9c9c",
        margin: 5
    },
    ButtonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white"
    },
    TouchableOpacity: {
        height: 30,
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
        backgroundColor: "#111",
        //margin: 5,
        width:'100%'
    },
    Text: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#fff"
    },
    LogoBanner: {
        flexDirection: "row",
        // marginTop: 60,
        width: "100%",
        paddingBottom: 10,
        // backgroundColor: "blue"
    },
    TextInputContainer: {
        //flex: 1,
        //borderRadius: 30,
        //borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#fff",
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
        // width: "80%",
        color: "#fff"
        //margin: 10
    }
});
