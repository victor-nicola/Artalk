import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, Touchable, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { Avatar, Caption, Text, Title } from "react-native-paper";

const Item = ( {elem, toUser} ) => {
    const { ipString } = useContext( EnvContext );

    return (
        <View style = {{flex: 1}}>
            <TouchableOpacity style = {{flexDirection: "row", backgroundColor: "#3b3b3b"}} onPress = {toUser}>
                <View style = {{flexDirection: "row", alignContent: "center"}}>
                    <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {30} />
                    <View>
                        <Title style = {{fontSize: 15, color: "#ffffff"}}>@{elem.user.username}</Title>
                    </View>
                </View>
            </TouchableOpacity>
            <View style = {{flex: 1}}>
                <Caption style = {{fontSize: 15, color: "#ffffff"}}>{elem.comment.text}</Caption>
            </View>
        </View>
    );
};

export default function CommentsScreen( {navigation, route: {params}} ) {
    const { ipString } = useContext( EnvContext );
    const [data, setData] = useState([]);
    const {post} = params;

    const getComments = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, post: post} )
        };
    
        await fetch( ipString + "api/user/getComments", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    useEffect( () => {
        setData( [] );
        getComments();
        //console.log( data );
    },[]);

    const renderItem = ( {item} ) => {
        const toUser = () => {
            navigation.navigate( "userProfile", {searchedUser: item.user} );
        };
        return (
            <Item 
                elem = {item} 
                toUser = {toUser}
            />
        );
    };

    return (
        <View style = {{flex: 1, backgroundColor: "#3b3b3b"}} >
            <View style = {styles.LogoBannerView}>
                <Caption style = {{color: "#fff", paddingLeft: 60, fontSize: 15}}>{post.caption}</Caption>
            </View>
            <hr style = {{color: "white"}}/>
            <FlatList 
                data = {data}
                renderItem = {renderItem}
                keyExtractor = {item => item.comment._id}
                extraData = {data}
                scrollEnabled = {true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    LogoBanner: {
        flexDirection: "row",
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
    }
});