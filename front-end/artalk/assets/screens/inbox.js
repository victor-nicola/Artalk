import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native";
import { Ionicons, Feather, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { UserContext } from "../../containers/userContext";
import { Avatar, Caption, Text, Title } from "react-native-paper";

const Item = ( {elem, toChat} ) => {
    const { ipString } = useContext( EnvContext );

    return (
        <View>
            <TouchableOpacity style = {styles.TouchableOpacity} onPress = {toChat}>
                <View style = {{flexDirection: "row", alignContent: "center"}}>
                    <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {30} />
                    <View style = {{justifyContent: "center"}}>
                        <Title style = {{fontSize: 17, color: "#fff", fontWeight: "bold"}}>@{elem.user.username}</Title>
                    </View>
                </View>
                <Caption style = {styles.Caption}>{elem.text}</Caption>
            </TouchableOpacity>
            <View style = {{marginTop: 5, marginBottom: 5, backgroundColor: "#fff", height: 1, opacity: 0.5}}/>
        </View>
    );
};

export default function InboxScreen( {navigation, route: {params}} ) {
    const {ipString} = useContext( EnvContext );
    const {user} = useContext( UserContext );
    const [data, setData] = useState([]);

    const getInbox = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token} )
        };
    
        await fetch( ipString + "api/user/getInbox", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    useEffect( () => {
        setData([]);
        getInbox();
    },[]);

    const renderItem = ( {item} ) => {
        const toChat = () => {
            navigation.navigate( "Chat", {user: item.user} );
        };
        return (
            <Item 
                elem = {item} 
                toChat = {toChat}
            />
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
                    <Text style = {{color: "#fff", fontSize: 25}}>Inbox</Text>
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
                keyExtractor = {item => item.user._id}
                extraData = {data}
                scrollEnabled = {true}
            />
        </SafeAreaView>
    );
;}

const styles = StyleSheet.create({
    TextInputContainer: {
        // backgroundColor: "blue",
        //flex: 1,
        //borderRadius: 30,
        //borderWidth: 1,
        // position: "absolute",
        // borderRadius: 30,
        // borderBottomWidth: 1,
        flexDirection: "row",
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#fff",
        height: 50,
        width: '99%',
        // margin: 5,
        // marginLeft: 15,
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between"
    },
    TextInput: {
        height: 50,
        //flex: 1,
        // padding: 15,
        marginLeft: 10,
        // width: "fit-content",
        width: "99%",
        color: "#fff"
        //margin: 10
    },
    LogoBannerView: {
        flexDirection: "row",
        // marginTop: 60,
        justifyContent: "space-between",
        width: "100%",
        paddingTop: 10,
        paddingBottom: 10,
    },
    View : {
        flexDirection: "row", 
        paddingLeft: 20, 
        paddingTop: 10, 
        paddingBottom: 10,
        justifyContent: "space-between"
    },
    PostView : {
        flexDirection: "row", 
        paddingLeft: 20, 
        paddingTop: 10, 
        paddingBottom: 10,
        // justifyContent: "center"
    },
    ViewReply : {
        flexDirection: "row", 
        paddingLeft: 50, 
        paddingTop: 10, 
        paddingBottom: 10,
        justifyContent: "space-between"
    },
    TouchableOpacity: {
        flexDirection: "row", 
        width: "fit-content"
    },
    Caption: {
        color: "#fff", 
        fontSize: 17, 
        marginLeft: 10, 
        alignSelf: "center", 
        marginTop: 35
    },
    AvatarImage: {
        alignSelf: "center",
        margin: 5,
        marginTop: 0
    }
});