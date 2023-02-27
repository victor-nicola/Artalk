import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, SafeAreaView, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { Avatar, Caption, Text, Title } from "react-native-paper";
import { useLinkTo } from "@react-navigation/native";

const Item = ( {user, onPress} ) => {
    const { ipString } = useContext( EnvContext );
    const {height, width} = useWindowDimensions();
    const [textSize, setTextSize] = useState(20);
    
    window.addEventListener("resize", ()=>{
        if ( window.innerWidth < 800 )
            setTextSize(24);
        else
            setTextSize(30);
    });

    useEffect(()=>{
        if ( width < 800 )
            setTextSize(24);
        else
            setTextSize(30);
    });
    
    //console.log( user );

    return (
        <View style={{width:'100%', alignItems: 'center', marginTop: 15}}>
            <TouchableOpacity style = {{}} onPress = {onPress}>
                <View style = {{flexDirection: "row", alignContent: "center"}}>
                    <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + user.image}} size = {50} />
                    <View style={{paddingLeft: 5}}>
                        <Title style = {{fontSize: textSize/3*2, fontWeight: "bold", color: "#fff"}}>{user.name} {user.surname}</Title>
                        <Caption style = {{fontSize: textSize/2 + 2, color: "#fff"}}>@{user.username}</Caption>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default function FollowingScreen( {navigation, route: {params}} ) {
    if (params) {
    const { ipString } = useContext( EnvContext );
    const [data, setData] = useState([]);
    const {id} = params;
    const {height, width} = useWindowDimensions();
    const [textSize, setTextSize] = useState(30);
    
    window.addEventListener("resize", ()=>{
        if ( window.innerWidth < 800 )
            setTextSize(24);
        else
            setTextSize(30);
    });

    useEffect(()=>{
        if ( width < 800 )
            setTextSize(24);
        else
            setTextSize(30);
    });
    
    const getFollowing = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, userId: id} )
        };
    
        await fetch( ipString + "api/user/getFollowedUsers", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    useEffect( () => {
        setData( [] );
        getFollowing();
    },[]);

    const linkTo = useLinkTo();

    const renderItem = ( {item} ) => {
        const onPress = () => {
            linkTo( "/profile/" + item._id );
        };
        return (
            <Item onPress = {() => onPress()} user = {item} />
        );
    };

    return (
        <SafeAreaView style = {{flex: 1, backgroundColor: "#111"}} >
            <View style = {styles.LogoBanner} >
                <View style = {{flex: 1, alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}} style = {{marginLeft: 10}}>
                        <Octicons name="three-bars" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <Text style = {{marginLeft: -75 + (30-textSize) * 3, fontSize:textSize, color: "#fff"}}>Following</Text>
                </View>
            </View>
            <FlatList 
                data = {data}
                renderItem = {renderItem}
                keyExtractor = {item => item._id}
                extraData = {data}
                scrollEnabled = {true}
            />
        </SafeAreaView>
    );
    }
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
        paddingTop: 5,
        //marginTop: 60,
        paddingLeft: 20,
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        paddingBottom: 10,
    },
    LogoBannerView: {
        paddingTop: 10,
        flexDirection: "row",
        marginBottom: 10,
        justifyContent: "space-between",
        backgroundColor: "#111"
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