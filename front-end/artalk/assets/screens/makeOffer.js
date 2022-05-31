import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, Platform, Picker, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Mime from "mime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";

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

    return (
        <View style = {{flex: 1, width: "100%", backgroundColor: "#3b3b3b"}}>
            <TouchableOpacity style = {{marginLeft: 20, marginTop: 10, height: "fit-content"}} onPress = { () => {navigation.goBack(null)} } >
                <Ionicons name = "chevron-back" size = {24} color = "#fff" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle = {styles.ViewContainer}>
                <View style = {styles.TextInputContainer}>
                    <TextInput style = {styles.TextInput} placeholder = {"Title"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setTitle( text ) }/>
                </View>
                <View style = {styles.TextInputContainer}>
                    <TextInput style = {styles.TextInput} placeholder = {"Description"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setText( text ) }/>
                </View>
                <View style = {styles.TextInputContainer}>
                    <TextInput style = {styles.TextInput} placeholder = {"Price per hour"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setPrice( new Number(text) ) }/>
                </View>
                <View style = {{flexDirection: "row", paddingTop: 10, paddingBottom: 10}}>
                    <Text style = {{marginRight: 20, fontSize: 20, color: "#fff"}}>Type:</Text>
                    <Picker style = {{backgroundColor: "#3b3b3b", borderWidth: 0, color: "#fff", fontSize: 20}} onValueChange = {(itemValue, itemPosition) => setType(itemValue)}>
                        <Picker.Item label = "Anything" value = ""/>
                        <Picker.Item label = "Painting" value = "painting"/>
                        <Picker.Item label = "Digital art" value = "digital art"/>
                        <Picker.Item label = "Photography" value = "photography"/>
                        <Picker.Item label = "Videography" value = "videography"/>
                        <Picker.Item label = "Sculpture" value = "sculpture"/>
                    </Picker>
                </View>
                <TouchableOpacity style = {styles.TouchableOpacity} onPress = {() => { makeGig(); }}>
                    <Text>Post</Text>
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
        width: "80%",
        color: "#fff"
        //margin: 10
    }
});
