import { AntDesign, Ionicons, Octicons } from "@expo/vector-icons";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, Platform, Image, ScrollView, KeyboardAvoidingView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Mime from "mime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { useLinkTo } from "@react-navigation/native";
import * as ImageManipulator from 'expo-image-manipulator';

export default function MakePostScreen({navigation}) {
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
            const comprPic = await ImageManipulator.manipulateAsync(
                result.uri,
                [{ resize: { width: 470 } }]
            );
            setImage( comprPic.uri );
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
                // "Content-Type": "application/json"
            },
            body: data
        };

        await fetch( ipString + "api/user/makePost", options )
        .then((res) => res.text())
        .then((res) => alert(res));
    };

    const linkTo = useLinkTo();

    return (
        <View style = {{flex: 1, width: "100%", backgroundColor: "#111"}}>
            <View style = {styles.LogoBanner} >
                <View style = {{flex: 1, alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}} style = {{marginLeft: 15}}>
                        <Octicons name="three-bars" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>
                <Text style = {{marginLeft: -140, flex: 1, fontSize:30, color: "#fff"}}>Make post</Text>
            </View>
            <View style = {styles.ViewContainer}>
                <KeyboardAvoidingView style = {styles.TextInputContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <TextInput style = {styles.TextInput} placeholder = {"Caption"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setCaption( text ) }/>
                </KeyboardAvoidingView>
                <View style={{alignItems:'center'}}>
                    <TouchableOpacity style = {styles.SelectImage} onPress = {() => pickImage() }>
                        <Text style = {styles.ButtonText}>Select image</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress = {() => displayImage()}>  */}
                        {image && <Image source = { { uri:image } } style = { { width: 300, height: 300, alignSelf: "center", resizeMode: 'cover' } }/>}
                    {/* </TouchableOpacity> */}
                </View>
                <TouchableOpacity style = {styles.TouchableOpacity} onPress = {() => { makePost( data ); }}>
                    <Text style={styles.ButtonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    LogoBanner: {
        paddingTop: 10,
        flexDirection: "row",
        marginBottom: 10,
        justifyContent: "space-between",
        backgroundColor: "#111"
    },
    SelectImage: {
        //width: "60%",
        borderRadius: 30,
        height: 50,
        width: 300,
        //alignItems: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ab260f",
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
    TextInput: {
        height: 50,
        //flex: 1,
        padding: 10,
        //margin: 5,
        width: "100%",
        color: "#fff",
        // borderRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
        height: 50,
        width: 300,
        margin: 5,
        //margin: 10
    }
});
