import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Image, TouchableOpacity, View, Text } from "react-native";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { Avatar, Caption, Title } from "react-native-paper";
import { StatusBar } from 'expo-status-bar';

const Item = ( {elem, toUser, toLikers, like, dislike, toComments, refresh} ) => {
    const { ipString } = useContext( EnvContext );
    
    console.log( elem.post.image );

    return (
        <View>
            <TouchableOpacity style = {{flexDirection: "row", backgroundColor: "#3b3b3b"}} onPress = {toUser}>
                <View style = {{flexDirection: "row", alignContent: "center"}}>
                    <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {30} />
                    <View>
                        <Title style = {{fontSize: 15, color: "#ffffff"}}>@{elem.user.username}</Title>
                    </View>
                </View>
            </TouchableOpacity>
            <View style = {{flex: 1, alignItems: "center", justifyContent: "center"}} >
                <Image style = { styles.PostImage } source = {{uri: ipString + "images/" + elem.post.image}}/>
            </View>
            <View style = {{flexDirection: "row", marginLeft: 10}}>
                { !elem.isLiked && <TouchableOpacity onPress = {() => { like( elem ); }}>
                    <AntDesign name = "like2" size = {30} color = "white"/>
                </TouchableOpacity> }
                { elem.isLiked && <TouchableOpacity onPress = {() => { dislike( elem ); }}>
                    <AntDesign name = "like1" size = {30} color = "white"/>
                </TouchableOpacity> }
                { elem.post.noComments > 0 && <TouchableOpacity style = {{paddingLeft: 15}} onPress = {toComments}>
                    <Fontisto name = "comment" size = {30} color = "white" />
                </TouchableOpacity> }
                { elem.post.noComments == 0 && <View style = {{paddingLeft: 15}}>
                    <Fontisto name = "comment" size = {30} color = "white" />
                </View> }
            </View>
            <View style = {{marginBottom: 10, marginLeft: 10}} >
                { elem.post.likes > 1 && <TouchableOpacity onPress = {toLikers}>
                    <Caption style = {{fontSize: 13, color: "#ffffff"}}>{elem.post.likes} likes</Caption>
                </TouchableOpacity> }
                { elem.post.likes == 1 && <TouchableOpacity onPress = {toLikers}>
                    <Caption style = {{fontSize: 13, color: "#ffffff"}}>{elem.post.likes} like</Caption>
                </TouchableOpacity> }
                { elem.post.likes == 0 && <TouchableOpacity>
                    <Caption style = {{fontSize: 13, color: "#ffffff"}}>{elem.post.likes} likes</Caption>
                </TouchableOpacity> }
            </View>
            <View style = {{flexDirection: "row"}}>
                <Caption style = {{color: "white"}}>{elem.post.caption}</Caption>
            </View>
        </View>
    );
};

export default function HomeScreen( {navigation} ) {
    const { ipString } = useContext( EnvContext );
    const [data, setData] = useState( [] );

    const getFeed = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token} )
        };
    
        await fetch( ipString + "api/user/getFeed", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    const like = async( elem ) => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, post: elem.post} )
        };
    
        await fetch( ipString + "api/user/like", options )
        .then((res) => res.text())
        .then((res) => alert(res));
        setTimeout( () => refresh( elem, 1 ), 10 );
    };

    const dislike = async( elem ) => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, post: elem.post} )
        };
    
        await fetch( ipString + "api/user/dislike", options )
        .then((res) => res.text())
        .then((res) => alert(res));
        setTimeout( () => refresh( elem, -1 ), 10 );
    };

    const refresh = ( elem, sign ) => {
        elem.isLiked = !elem.isLiked;
        elem.post.likes += sign;
        setData( [...data] );
    };

    useEffect( () => {
        setData( [] );
        getFeed();
    },[]);

    const renderItem = ( {item} ) => {
        const toUser = () => {
            navigation.navigate( "userProfile", {searchedUser: item.user} );
        };
        const toLikers = () => {
            navigation.navigate( "likersScreen", {post: item.post} );
        };
        const toComments = () => {
            navigation.navigate( "commentsScreen", {post: item.post} );
        };
        return (
            <Item
                toUser = {toUser}
                elem = {item}
                toLikers = {toLikers}
                like = {like}
                dislike = {dislike}
                toComments = {toComments}
                refresh = {refresh}
            />
        );
    };

    return (
        <View style = {styles.View}>
            <View style = {styles.LogoBanner} >
                <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}}>
                    <Image style = { { width: 50, height: 50, alignSelf: "center" } } source = {require("../app-logo.png")}/>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.SearchBtn} onPress = {() => {navigation.navigate( "searchScreen" )}}>
                    <AntDesign style = {{margin: 5}} name = "search1" size = { 24 } color = "#fff" />
                </TouchableOpacity>
            </View>
            <FlatList 
                data = {data}
                extraData = {data}
                renderItem = {renderItem}
                keyExtractor = {item => item.post._id}
                scrollEnabled = {true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    View: {
        flex: 1,
        //justifyContent: "center",
        //alignItems: "center"
        backgroundColor: "#3b3b3b"
    },
    AvatarImage: {
        alignSelf: "center",
        margin: 5
    },
    Text: {
        fontSize: 20
    },
    SelectImage: {
        //width: "60%",
        borderRadius: 30,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b3b3b",
        margin: 5
    },
    PostImage : {
        resizeMode: "center",
        width: 300,
        height: 300
    },
    LogoBanner: {
        flexDirection: "row",
        marginTop: 60,
        marginBottom: 10,
        backgroundColor: "#3b3b3b"
    },
    SearchBtn: {
        alignSelf: "center",
        position: "absolute",
        right: 0,
        backgroundColor: "#3b3b3b",
        borderRadius: 100,
        margin: 5
    }
});