import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Image, TouchableOpacity, View, SafeAreaView, Text } from "react-native";
import { AntDesign, Fontisto, Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { Avatar, Caption, Title } from "react-native-paper";
import { StatusBar } from 'expo-status-bar';

const Item = ( {elem, toUser, toLikers, like, dislike, toComments, refresh} ) => {
    const { ipString } = useContext( EnvContext );

    return (
        <View style = {{width:"fit-content", alignSelf: "center"}}>
            <TouchableOpacity style = {{flexDirection: "row"}} onPress = {toUser}>
                <View style = {{flexDirection: "row", alignContent: "center"}}>
                    <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {30} />
                    <View style = {{justifyContent: "center"}}>
                        <Title style = {{fontSize: 15, color: "#ffffff"}}>@{elem.user.username}</Title>
                    </View>
                </View>
            </TouchableOpacity>
            <View style = {{flex: 1, alignItems: "center", justifyContent: "center"}} >
                <Image style = { styles.PostImage } source = {{uri: ipString + "images/" + elem.post.image}}/>
            </View>
            <View style = {{flexDirection: "row", marginTop: 10}}>
                { !elem.isLiked && <TouchableOpacity onPress = {() => { like( elem ); }}>
                    <AntDesign name = "like2" size = {30} color = "white"/>
                </TouchableOpacity> }
                { elem.isLiked && <TouchableOpacity onPress = {() => { dislike( elem ); }}>
                    <AntDesign name = "like1" size = {30} color = "white"/>
                </TouchableOpacity> }
                <TouchableOpacity style = {{marginLeft: 15}} onPress = {toComments}>
                    <Fontisto name = "comment" size = {30} color = "white" />
                </TouchableOpacity>
            </View>
            <View>
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
            body: JSON.stringify( {token: token, postId: elem.post._id, noLikes: elem.post.likes} )
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
            body: JSON.stringify( {token: token, postId: elem.post._id, noLikes: elem.post.likes} )
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
            navigation.navigate( "commentsScreen", {post: item} );
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
        <SafeAreaView style = {styles.View}>
            <View style = {styles.LogoBanner} >
                <View style = {{flexDirection: "row"}}>
                    <TouchableOpacity style = {{marginLeft: 20}} onPress = { () => {navigation.goBack(null)} } >
                        <Ionicons style = {{alignSelf: "center"}} name = "chevron-back" size = {24} color = "#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}} style = {{marginLeft: 15}}>
                        <Octicons name="three-bars" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => {navigation.navigate("homeScreen")}}>
                    <Text style = {{fontSize:30, color: "#fff"}}>Artalk</Text>
                </TouchableOpacity>
                <View style = {{flexDirection: "row"}}>
                    <TouchableOpacity style = {{marginRight: 20}} onPress = {() => {navigation.navigate( "searchScreen" )}}>
                        <AntDesign name = "search1" size = { 24 } color = "#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style = {{marginRight: 20}} onPress = {() => {navigation.navigate( "Inbox" )}}>
                        <Octicons name="inbox" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList 
                data = {data}
                extraData = {data}
                renderItem = {renderItem}
                keyExtractor = {item => item.post._id}
                scrollEnabled = {true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    HomeTextTouchable: {
        alignContent: "center"
    },
    View: {
        flex: 1,
        //justifyContent: "center",
        //alignItems: "center"
        backgroundColor: "#3b3b3b"
    },
    AvatarImage: {
        justifyContent: "center",
        margin: 5
    },
    PostImage : {
        resizeMode: "center",
        width: 350,
        height: 350
    },
    LogoBanner: {
        flexDirection: "row",
        // marginTop: 60,
        justifyContent: "space-between",
        width: "100%",
        paddingTop: 10,
        paddingBottom: 10,
        // backgroundColor: "blue"
    },
});