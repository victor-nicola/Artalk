import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, View, useWindowDimensions } from "react-native";
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
        <View style={{width:'100%', alignItems: 'center', marginTop: 10}}>
            <TouchableOpacity style = {styles.LogoBanner} onPress = {onPress}>
                <View style = {{flexDirection: "row", alignContent: "center"}}>
                    <Avatar.Image style = {styles.AvatarImage} source = {{uri: ipString + "images/" + user.image}} size = {50} />
                    <View>
                        <Title style = {{fontSize: textSize/3*2, fontWeight: "bold", marginLeft: 5, color: "#fff"}}>{user.name} {user.surname}</Title>
                        <Caption style = {{marginLeft: 5, fontSize: textSize / 2 + 2, bottom: 5, color: "#fff"}}>@{user.username}</Caption>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default function LikersScreen( {navigation, route: {params}} ) {
    if ( params ) {
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

    const getLikers = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, postId: id} )
        };
    
        await fetch( ipString + "api/user/getLikers", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    useEffect( () => {
        setData( [] );
        getLikers();
    },[]);

    const linkTo = useLinkTo();

    const renderItem = ( {item} ) => {
        const onPress = () => {
            linkTo("/profile/" + item._id );
        };
        return (
            <Item onPress = {() => onPress()} user = {item} />
        );
    };

    return (
        <SafeAreaView style = {{flex: 1, backgroundColor: "#111"}} >
            <View style = {styles.LogoBanner} >
                <View style = {{flex: 1, alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}} style = {{marginLeft: 15}}>
                        <Octicons name="three-bars" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <Text style = {{marginLeft: -50 + (30 - textSize) * 4, fontSize:textSize, color: "#fff"}}>Likes</Text>
                </View>
            </View>
            <View style = {{backgroundColor: "#fff", height: 1}}/>
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
        marginTop: 5,
        // marginLeft: 20,
        paddingBottom: 5,
        //marginTop: 60,
        // backgroundColor: "#111"
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