import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, Touchable, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { Avatar, Caption, Text, Title } from "react-native-paper";

const Item = ( {user, onPress} ) => {
    const { ipString } = useContext( EnvContext );
    
    //console.log( user );

    return (
        <TouchableOpacity style = {styles.LogoBanner} onPress = {onPress}>
            <View style = {{flexDirection: "row", alignContent: "center"}}>
                <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + user.image}} size = {50} />
                <View>
                    <Title style = {{fontSize: 20, fontWeight: "bold", margin: 5}}>{user.name} {user.surname}</Title>
                    <Caption style = {{margin: 5, fontSize: 15, bottom: 5}}>@{user.username}</Caption>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function FollowerScreen( {navigation, route: {params}} ) {
    const { ipString } = useContext( EnvContext );
    const [data, setData] = useState([]);
    const {user} = params;
    
    const getFollowers = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, user: user} )
        };
    
        await fetch( ipString + "api/user/getFollowers", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    useEffect( () => {
        setData( [] );
        getFollowers();
    },[]);

    const renderItem = ( {item} ) => {
        const onPress = () => {
            navigation.navigate( "userProfile", {searchedUser: item} );
        };
        return (
            <Item onPress = {() => onPress()} user = {item} />
        );
    };

    return (
        <View style = {{flex: 1, backgroundColor: "#3b3b3b"}} >
            <View style = {styles.LogoBannerView}></View>
            <FlatList 
                data = {data}
                renderItem = {renderItem}
                keyExtractor = {item => item._id}
                extraData = {data}
                scrollEnabled = {true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    TextInputContainer: {
        // flex: 1,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#000",
        height: 50,
        width: '85%',
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
    },
    LogoBanner: {
        flexDirection: "row",
        //marginTop: 60,
        backgroundColor: "#3b3b3b"
    },
    LogoBannerView: {
        paddingTop: 15,
        flexDirection: "row",
        marginTop: 30,
        backgroundColor: "#3b3b3b"
    },
    AvatarImage: {
        alignSelf: "center",
        margin: 5
    },
    BackBtn: {
        alignSelf: "center",
        //position: "absolute",
        //right: 0,
        //backgroundColor: "#fff",
        borderRadius: 100,
        margin: 5
    }
});