import React from "react";
import {useState, useEffect} from "react";
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity, Platform, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Mime from "mime";
import { AuthContext } from "../../containers/authContext";

export default function Register( {navigation} ) {
    const [name, setName] = useState( "" );
    const [surname, setSurname] = useState( "" );
    const [username, setUsername] = useState( "" );
    const [email, setEmail] = useState( "" );
    const [password, setPassword] = useState( "" );
    const [image, setImage] = useState( null );

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
        const newImageUri = "file:///" + image.split( "file:/" ).join( "" );
        const typeImage = image.substring( 5, image.search( new RegExp(';') ) );
        console.log( "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + image );
        // console.log("------------------------" + Mime.getType(newImageUri));
        console.log( "-----------------------------------------------------" + typeImage ); // 5 bcs 'data:'
        data.append( "image", {
            uri: newImageUri,
            type: typeImage,
            name: newImageUri.split( "/" ).pop()
        });
    }
    data.append( "name", name );

    // console.log( "NAME OG = " + name );
    // console.log( "NAME DATA = " + data.name );
    data.append( "surname", surname );
    data.append( "username", username );
    data.append( "email", email );
    data.append( "password", password );

    for(var pair of data.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
        // if ( pair[0] == "image" )
        //     console.log( pair[1].uri );
    }

    // const register = async() => {
    //     const options = {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: data
    //     };

    //     await fetch( "http://172.16.30.60:3000/api/user/register", options )
    //     .then((res) => res.text())
    //     .then((res) => alert(res));
    // };

    const { register } = React.useContext( AuthContext );

    return (
        <View style = {{flex: 1, width: "100%", backgroundColor: "#3b3b3b"}}>
            <KeyboardAvoidingView behavior = {Platform.OS === "ios" ? "padding" : "height"} style = {styles.ViewContainer}>
                <Text style = {styles.Text}>Register</Text>
                <View style = {styles.TextInputContainer}>
                    <TextInput style = {styles.TextInput} placeholder = {"Name"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setName( text ) }/>
                </View>
                <View style = {styles.TextInputContainer}>
                    <TextInput style = {styles.TextInput} placeholder = {"Surname"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setSurname( text ) }/>
                </View>
                <View style = {styles.TextInputContainer}>
                    <TextInput style = {styles.TextInput} placeholder = {"Username"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setUsername( text ) }/>
                </View>
                <View style = {styles.TextInputContainer}>
                    <TextInput style = {styles.TextInput} placeholder = {"Email"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setEmail( text ) }/>
                </View>
                <View style = {styles.TextInputContainer}>
                    <TextInput secureTextEntry = {true} style = {styles.TextInput} placeholder = {"Password"} placeholderTextColor = "#fff" onChangeText = { ( text ) => setPassword( text ) }/>
                </View>
                <View>
                <TouchableOpacity style = {styles.SelectImage} onPress = {() => pickImage() }>
                    <Text style = {{margin: 5, paddingLeft: 70, paddingRight: 70}}>Select image</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress = {() => displayImage()}>  */}
                    {image && <Image source = { { uri:image } } style = { { width: 200, height: 200, alignSelf: "center" } }/>}
                {/* </TouchableOpacity> */}
                </View>
                <TouchableOpacity style = {styles.TouchableOpacity} onPress = {() => {register( JSON.stringify(Object.fromEntries(data.entries())) );}}>
                {/* <TouchableOpacity style = {styles.TouchableOpacity} onPress = {() => {register(data);}}> */}
                    <Text>Register</Text>
                </TouchableOpacity>
                <View style = {{flexDirection: "row", margin: 5}}>
                    <Text style = {{color: "#fff"}}>Already have an account? </Text>
                    <Text style = {{color: "#fff", fontWeight: "bold"}} onPress = {() => navigation.goBack( null )}>Log in</Text>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};


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
        paddingTop: 60,
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
