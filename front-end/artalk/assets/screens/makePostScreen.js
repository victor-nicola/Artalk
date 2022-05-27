import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, Platform, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Mime from "mime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";

export default function MakePostScreen() {
    const [caption, setCaption] = useState( "" );
    const [image, setImage] = useState( null );
    const { ipString } = useContext( EnvContext );

    useEffect( () => {
        (async() => {
            if ( Platform.OS != "web" ) {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if ( status !== "granted" ) {
                    alert( "The app doesn't have permission to access your gallery!" );
                }
            }
        })();
    },[]);

    const pickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0
        });
        if ( !result.cancelled ) {
            setImage( result.uri );
        }
    };

    const data = new FormData();
    if ( image != null ) {
        // const newImageUri = "file:///" + image.split( "file:/" ).join( "" );
        // data.append( "image", { 
        //     uri: newImageUri,
        //     type: Mime.getType( newImageUri ),
        //     name: newImageUri.split( "/" ).pop()
        // });
        data.append( "image", image );
        data.append( "caption", caption );
    }

    const makePost = async( data ) => {
        var token = await AsyncStorage.getItem( "userToken" );
        data.append( "token", token );

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: data
        };

        await fetch( ipString + "api/user/makePost", options )
        .then((res) => res.text())
        .then((res) => alert(res));
    };

    return (
        <View style = {{flex: 1, width: "100%", backgroundColor: "#3b3b3b"}}>
            <ScrollView contentContainerStyle = {styles.ViewContainer}>
                <View style = {styles.TextInputContainer}>
                    <TextInput style = {styles.TextInput} placeholder = {"Caption"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setCaption( text ) }/>
                </View>
                <View>
                <TouchableOpacity style = {styles.SelectImage} onPress = {() => pickImage() }>
                    <Text style = {{margin: 5, paddingLeft: 70, paddingRight: 70}}>Select image</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress = {() => displayImage()}>  */}
                    {image && <Image source = { { uri:image } } style = { { width: 200, height: 200, alignSelf: "center" } }/>}
                {/* </TouchableOpacity> */}
                </View>
                <TouchableOpacity style = {styles.TouchableOpacity} onPress = {() => { makePost( data ); }}>
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
