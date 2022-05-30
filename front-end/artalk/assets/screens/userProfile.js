import React, { useContext, useEffect, useState } from "react";
import { Image, View, StyleSheet, TouchableOpacity, Text, FlatList } from "react-native";
import { EnvContext } from "../../containers/envContext";
import { UserContext } from "../../containers/userContext";
import { Avatar, Caption, Title } from "react-native-paper";
import { AntDesign, Fontisto, Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function UserProfile( {navigation, route: {params}} ) {
    const {ipString} = React.useContext( EnvContext );
    const {user} = React.useContext( UserContext );
    const {searchedUser} = params;
    const [isFollowed, setIsFollowed] = useState( Boolean );
    const [data, setData] = useState( [] );

    const getPosts = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, user: searchedUser} )
        };
    
        await fetch( ipString + "api/user/getPosts", options )
        .then((res) => res.json())
        .then((res) => {console.log(res); setData(res);});
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
        console.log( "USE EFFECT" );
        setData( [] );
        getPosts();
        checkFollow();
    },[user]);

    //console.log( isFollowed );

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
        <View style = { { flex: 1, backgroundColor: "#3b3b3b", flexDirection: "row" } }>
            <View style = { styles.ViewContainer }>
                <TouchableOpacity style = {{marginLeft: 20, marginTop: 10, height: "fit-content"}} onPress = { () => {navigation.goBack(null)} } >
                    <Ionicons name = "chevron-back" size = {24} color = "#fff" />
                </TouchableOpacity>
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
                    <View style = {{flexDirection: "row"}}>
                    { user._id == searchedUser._id && <TouchableOpacity style = { styles.TouchableOpacity } onPress = {() => { navigation.navigate( "makePostScreen" ) }} >
                        <Text style = { styles.Text }>Make a post</Text>
                    </TouchableOpacity> }
                    { user._id == searchedUser._id && <TouchableOpacity style = { styles.TouchableOpacity } >
                        <Text style = { styles.Text }>Make a sale</Text>
                    </TouchableOpacity> }
                    { user._id != searchedUser._id && !isFollowed && 
                    <TouchableOpacity style = { styles.TouchableOpacity } onPress = { async() => { follow(); checkFollow(); } }>
                        <Text style = { styles.Text }>+ Follow</Text>
                    </TouchableOpacity> }
                    { user._id != searchedUser._id && isFollowed && 
                    <TouchableOpacity style = { styles.TouchableOpacity } onPress = { async() => { unfollow(); checkFollow(); } }>
                        <Text style = { styles.Text }>- Unfollow</Text>
                    </TouchableOpacity> }
                    { user._id != searchedUser._id && 
                    <TouchableOpacity style = { styles.TouchableOpacity } onPress = { () => {navigation.navigate("Chat", {user: searchedUser})} }>
                        <Text style = { styles.Text }>Chat</Text>
                    </TouchableOpacity> }
                </View>
                </View>
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
    ProfileBanner: {
        //flex: 1,
        // paddingTop: 50,
        backgroundColor: "#3b3b3b"
    },
    TouchableOpacity: {
        width: "fit-content",
        borderRadius: 30,
        height: "fit-content",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "#9c9c9c",
        margin: 5
    },
    ViewContainer: {
        marginTop: 5,
        //flex: 1,
        //justifyContent: "center",
        // alignItems: "center",
        flexDirection: "row"
        //backgroundColor: "#3b3b3b",
        //margin: 5,
        // width:'100%'
    },
    PostImage : {
        resizeMode: "center",
        width: 350,
        height: 350
    },
    Text: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#fff",
        margin: 7,
        marginBottom: 7,
        alignSelf: "center",
        justifyContent: "center"
    },
    AvatarImage: {
        alignSelf: "center",
        margin: 5
    }
});
