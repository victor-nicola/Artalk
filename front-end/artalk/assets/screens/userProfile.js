import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { EnvContext } from "../../containers/envContext";
import { UserContext } from "../../containers/userContext";
import { Avatar, Caption, Title } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserProfile( {navigation, route: {params}} ) {
    const {ipString} = React.useContext( EnvContext );
    const {user} = React.useContext( UserContext );
    const {searchedUser} = params;
    const [isFollowed, setIsFollowed] = useState( Boolean );

    const follow = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, followedUserId: searchedUser._id} )
        };
    
        await fetch( ipString + "api/user/follow", options )
        .then((res) => res.text())
        .then((res) => alert(res));
    };

    const checkFollow = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, followedUserId: searchedUser._id} )
        };
    
        await fetch( ipString + "api/user/checkFollow", options )
        .then((res) => res.json())
        .then((res) => setIsFollowed(res));
    };

    const unfollow = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, followedUserId: searchedUser._id} )
        };
    
        await fetch( ipString + "api/user/unfollow", options )
        .then((res) => res.text())
        .then((res) => alert(res));
    };

    useEffect(() => {
        checkFollow();
    },[]);

    //console.log( isFollowed );

    return (
        <View style = { { flex: 1, backgroundColor: "#3b3b3b" } }>
            <View style = { styles.ViewContainer }>
                <View style = { styles.ProfileBanner }>
                    <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + searchedUser.image}} size = {100} />
                    <View style = {{alignContent: "center"}}>
                        <Title style = {{fontSize: 20, fontWeight: "bold", margin: 5, alignSelf: "center", color: "#fff"}}>{searchedUser.name} {searchedUser.surname}</Title>
                        <Caption style = {{margin: 5, fontSize: 15, bottom: 5, alignSelf: "center", color: "#fff"}}>@{searchedUser.username}</Caption>
                    </View>
                    <View style = { { flexDirection: "row" } }>
                        { searchedUser.noFollowers > 1 && <TouchableOpacity onPress = {() => { navigation.navigate( "followerScreen", {user: searchedUser} ) }}>
                            <Caption style = {{margin: 5, fontSize: 15, color: "#fff"}}>{searchedUser.noFollowers} followers</Caption>
                        </TouchableOpacity> }
                        { searchedUser.noFollowers == 1 && <TouchableOpacity onPress = {() => { navigation.navigate( "followerScreen", {user: searchedUser} ) }}>
                            <Caption style = {{margin: 5, fontSize: 15, color: "#fff"}}>{searchedUser.noFollowers} follower</Caption>
                        </TouchableOpacity> }
                        { searchedUser.noFollowers == 0 && <TouchableOpacity>
                            <Caption style = {{margin: 5, fontSize: 15, color: "#fff"}}>{searchedUser.noFollowers} followers</Caption>
                        </TouchableOpacity> }
                        <Caption style = {{margin: 5, fontSize: 15, color: "#fff"}}>|</Caption>
                        { searchedUser.noFollowing > 0 && <TouchableOpacity onPress = {() => { navigation.navigate( "followingScreen", {user: searchedUser} ) }}>
                            <Caption style = {{margin: 5, fontSize: 15, color: "#fff"}}>{searchedUser.noFollowing} following</Caption>
                        </TouchableOpacity> }
                        { searchedUser.noFollowing == 0 && <TouchableOpacity>
                            <Caption style = {{margin: 5, fontSize: 15, color: "#fff"}}>{searchedUser.noFollowing} following</Caption>
                        </TouchableOpacity> }
                    </View>
                </View>
                <View style = {{flexDirection: "row"}}>
                    { user._id == searchedUser._id && <TouchableOpacity style = { styles.TouchableOpacity } onPress = {() => { navigation.navigate( "makePostScreen" ) }} >
                        <Text style = { styles.Text }>Make a post</Text>
                    </TouchableOpacity> }
                    { user._id == searchedUser._id && <TouchableOpacity style = { styles.TouchableOpacity } >
                        <Text style = { styles.Text }>Make a sale</Text>
                    </TouchableOpacity> }
                    { user._id != searchedUser._id && !isFollowed && <TouchableOpacity style = { styles.TouchableOpacity } onPress = { async() => { follow(); checkFollow() } }>
                        <Text style = { styles.Text }>+ Follow</Text>
                    </TouchableOpacity> }
                    { user._id != searchedUser._id && isFollowed && <TouchableOpacity style = { styles.TouchableOpacity } onPress = { async() => { unfollow(); checkFollow() } }>
                        <Text style = { styles.Text }>- Unfollow</Text>
                    </TouchableOpacity> }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ProfileBanner: {
        //flex: 1,
        paddingTop: 50,
        backgroundColor: "#3b3b3b"
    },
    TouchableOpacity: {
        width: "25%",
        borderRadius: 30,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#9c9c9c",
        margin: 5
    },
    ViewContainer: {
        //flex: 1,
        //justifyContent: "center",
        alignItems: "center",
        //backgroundColor: "#3b3b3b",
        //margin: 5,
        width:'100%'
    },
    Text: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#fff",
        margin: 5
    },
    AvatarImage: {
        alignSelf: "center",
        margin: 5
    }
});
