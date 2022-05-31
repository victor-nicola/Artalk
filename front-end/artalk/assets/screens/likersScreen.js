import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, View } from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
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
                    <Title style = {{fontSize: 20, fontWeight: "bold", margin: 5, color: "#fff"}}>{user.name} {user.surname}</Title>
                    <Caption style = {{margin: 5, fontSize: 15, bottom: 5, color: "#fff"}}>@{user.username}</Caption>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function LikersScreen( {navigation, route: {params}} ) {
    const { ipString } = useContext( EnvContext );
    const [data, setData] = useState([]);
    const {post} = params;

    const getLikers = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, post: post} )
        };
    
        await fetch( ipString + "api/user/getLikers", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    useEffect( () => {
        setData( [] );
        getLikers();
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
        <SafeAreaView style = {{flex: 1, backgroundColor: "#3b3b3b"}} >
            <View style = {styles.LogoBannerView}>
                <View style = {{flexDirection: "row"}}>
                    <TouchableOpacity style = {{marginLeft: 20}} onPress = { () => {navigation.goBack(null)} } >
                        <Ionicons style = {{alignSelf: "center"}} name = "chevron-back" size = {24} color = "#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}} style = {{marginLeft: 15}}>
                        <Octicons name="three-bars" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style = {{color: "#fff", fontSize: 25}}>Liked by</Text>
                </View>
                {/* <TouchableOpacity style = {{marginRight: 20}}>
                    <Feather name="send" size={24} color="#fff" />
                </TouchableOpacity> */}
                <View style = {{width: 63}}></View>
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
        marginLeft: 20,
        //marginTop: 60,
        backgroundColor: "#3b3b3b"
    },
    LogoBannerView: {
        paddingTop: 10,
        flexDirection: "row",
        marginBottom: 10,
        justifyContent: "space-between",
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