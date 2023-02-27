import React from "react";
import {useState, useEffect} from "react";
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity, Platform, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Mime from "mime";
import { AuthContext } from "../../containers/authContext";
import bcrypt from "bcryptjs";
import { useLinkTo } from "@react-navigation/native";
import * as ImageManipulator from 'expo-image-manipulator';

const salt = '$2a$10$TTrGvnChh/FAch.67cwLCe';

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
            const comprPic = await ImageManipulator.manipulateAsync(
                result.uri,
                [{ resize: { width: 470 } }]
            );
            // const comprPic = result;
            // console.log(result.uri);
            setImage( comprPic.uri );
        }
    };

    const data = new FormData();
    if ( image != null ) {
        // const newImageUri = "file:///" + image.split( "file:/" ).join( "" );
        // scoti data:image/ceva;base64
        // const typeImage = image.substring( 5, image.search( new RegExp(';') ) );
        // console.log( "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + image );
        // console.log("------------------------" + Mime.getType(newImageUri));
        // console.log( "-----------------------------------------------------" + typeImage ); // 5 bcs 'data:'
        // console.log(newImageUri);
        // console.log(typeImage);
        // console.log(newImageUri.split( "/" ).pop());
        // data.append( "image", {
        //     uri: newImageUri,
        //     type: typeImage,
        //     name: newImageUri.split( "/" ).pop()
        // });
        // console.log(image);
        data.append( "image", image );
        // console.log("data:" + data);
        // console.log("data:" + data["image"]);
    }
    data.append( "name", name );

    // console.log( "NAME OG = " + name );
    // console.log( "NAME DATA = " + data.name );
    data.append( "surname", surname );
    data.append( "username", username );
    data.append( "email", email );

    const hashedPassword = bcrypt.hashSync(password, salt);
    data.append( "password", hashedPassword );

    // for(var pair of data.entries()) {
    //     console.log(`${pair[0]}: ${pair[1]}` );
    //     // if ( pair[0] == "image" )
    //     //     console.log( pair[1].uri );
    // }

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

    const linkTo = useLinkTo();

    return (
        <View style = {styles.ViewContainer}>
            <KeyboardAvoidingView style={styles.KeyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Text style = {styles.Title}>Sign up</Text>
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
            </KeyboardAvoidingView>
            <View style={{alignItems:'center'}}>
                <TouchableOpacity style = {styles.SelectImage} onPress = {() => pickImage() }>
                    <Text style = {styles.ButtonText}>Select image</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress = {() => displayImage()}>  */}
                    {image && <Image source = { { uri:image } } style = { { width: 300, height: 300, alignSelf: "center" } }/>}
                {/* </TouchableOpacity> */}
            </View>
            {/* <TouchableOpacity style = {styles.TouchableOpacity} onPress = {() => { register( JSON.stringify(Object.fromEntries(data.entries())) );}}> */}
            <TouchableOpacity style = {styles.TouchableOpacity} onPress = {() => {register(data);linkTo('/login');}}>
                <Text style={styles.ButtonText}>Sign up</Text>
            </TouchableOpacity>
            <View style = {{flexDirection: "row", margin: 5, width: 300, justifyContent: "center"}}>
                <Text style = {{color: "#fff"}}>Already have an account? </Text>
                <Text style = {{color: "#fff", fontWeight: "bold"}} onPress = {() => linkTo('/login')}>Log in</Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
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
        flexDirection: "column",
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
