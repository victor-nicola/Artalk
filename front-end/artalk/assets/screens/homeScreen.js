import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Image, TouchableOpacity, View, SafeAreaView, Text, useWindowDimensions } from "react-native";
import { AntDesign, Fontisto, Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { Avatar, Caption, Title } from "react-native-paper";
import { StatusBar } from 'expo-status-bar';
import { useLinkTo } from "@react-navigation/native";

const neutralColor = '#111';

const Item = ( {elem, toUser, toLikers, like, dislike, toComments, refresh} ) => {
    const { ipString } = useContext( EnvContext );
    const [imgHeight, setImgHeight] = useState("");
    const [imgWidth, setImgWidth] = useState("");
    const {height, width} = useWindowDimensions();
    var postWidth = 470;
    if ( width / 100 * 80 < postWidth )
        postWidth = width / 100 * 80;

    Image.getSize(ipString + "images/" + elem.post.image, (width, height) => {
        setImgHeight(height);
        setImgWidth(width);
    });

    return (
        <View style = {{
            width: postWidth, 
            // borderWidth: 1, 
            borderTopColor: neutralColor, 
            borderRightColor: neutralColor, 
            borderLeftColor: neutralColor, 
            // borderBottomColor: 'rgba(255,255,255,0.2)', 
            alignSelf: "center", 
            marginBottom: 20,
            paddingBottom: 10
        }}>
            <TouchableOpacity style = {{flexDirection: "row", paddingBottom: 10, alignSelf:'flex-start'}} onPress = {toUser}>
                <View style = {{flexDirection: "row", alignContent: "center", justifyContent: "center"}}>
                    <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {35} />
                    <Title style = {{fontSize: 16, fontWeight: "500", color: "#fff", alignSelf: "center", marginLeft: 10}}>{elem.user.username}</Title>
                </View>
            </TouchableOpacity>
            <View style = {{flex: 1, alignItems: "center", justifyContent: "center"}} >
                <Image style = {{resizeMode: "cover", width: postWidth, height: postWidth/imgWidth*imgHeight}} source = {{uri: ipString + "images/" + elem.post.image}}/>
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
                { elem.post.likes > 1 && <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress = {toLikers}>
                    <Caption style = {{fontSize: 13, color: "#ffffff"}}>{elem.post.likes} likes</Caption>
                </TouchableOpacity> }
                { elem.post.likes == 1 && <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress = {toLikers}>
                    <Caption style = {{fontSize: 13, color: "#ffffff"}}>{elem.post.likes} like</Caption>
                </TouchableOpacity> }
                { elem.post.likes == 0 && <TouchableOpacity style={{alignSelf: 'flex-start'}}>
                    <Caption style = {{fontSize: 13, color: "#ffffff"}}>{elem.post.likes} likes</Caption>
                </TouchableOpacity> }
            </View>
            <View style = {{flexDirection: "row", marginTop: 5, marginBottom: 5}}>
                <TouchableOpacity onPress = {toUser}>
                    <Text style = {{fontSize: 13, fontWeight: "600", color: "#fff"}}>{elem.user.username}</Text>
                </TouchableOpacity>
                <Text style = {{color: "white", marginLeft: 15, alignSelf: 'center'}}>{elem.post.caption}</Text>
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
        .then((res) => res.text());
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
        .then((res) => res.text());
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
    
    const linkTo = useLinkTo();

    const renderItem = ( {item} ) => {
        const toUser = () => {
            //navigation.navigate( "Profile", {searchedUser: item.user} );
            linkTo("/profile/" + item.user._id);
        };
        const toLikers = () => {
            linkTo( "/likes/" + item.post._id );
        };
        const toComments = () => {
            linkTo( "/comments/" + item.post._id );
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
                <View style = {{flex: 1, alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}} style = {{marginLeft: 20}}>
                        <Octicons name="three-bars" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{flex: 1}} onPress={() => {linkTo("/")}}>
                    <Text style = {{marginLeft: -40, fontSize:30, color: "#fff"}}>Artalk</Text>
                </TouchableOpacity>
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
        backgroundColor: "#111"
    },
    AvatarImage: {
        justifyContent: "center",
        margin: 5
    },
    LogoBanner: {
        flexDirection: "row",
        // marginTop: 60,
        width: "100%",
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.5)',
        marginBottom: 10,
    },
});