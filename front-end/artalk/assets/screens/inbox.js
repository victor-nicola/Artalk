import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View, SafeAreaView, useWindowDimensions } from "react-native";
import { Ionicons, Feather, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { UserContext } from "../../containers/userContext";
import { Avatar, Caption, Text, Title } from "react-native-paper";
import { useLinkTo } from "@react-navigation/native";

const Item = ( {elem, toChat} ) => {
    const { ipString } = useContext( EnvContext );

    return (
        <View style={{ paddingLeft: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)'}}>
            <TouchableOpacity style = {styles.TouchableOpacity} onPress = {toChat}>
                <View style = {{flexDirection: "row", paddingTop: 10}}>
                    <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {50} />
                    <View style = {{marginTop: -5, marginLeft: 10}}>
                        <Title style = {{fontSize: 17, color: "#fff", fontWeight: "bold"}}>@{elem.user.username}</Title>
                        <Caption style = {styles.Caption}>{elem.text}</Caption>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default function InboxScreen( {navigation, route: {params}} ) {
    const {ipString} = useContext( EnvContext );
    const {user} = useContext( UserContext );
    const [data, setData] = useState([]);
    const {height, width} = useWindowDimensions();
    const [smallMode, setSmallMode] = useState("big");
    
    window.addEventListener("resize", ()=>{
        if ( window.innerWidth < 725 )
            setSmallMode("small");
        else if ( window.innerWidth < 920 )
            setSmallMode("medium");
        else 
            setSmallMode("big");
    });
    
    useEffect( () => {
        if ( width < 725 )
            setSmallMode("small");
        else if ( width < 920 )
            setSmallMode("medium");
        else 
            setSmallMode("big");
        setData([]);
        getInbox();
    },[]);

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

    const linkTo = useLinkTo();

    const renderItem = ( {item} ) => {
        const toChat = () => {
            linkTo( "/chat/" + item.user._id );
        };
        return (
            <Item 
                elem = {item} 
                toChat = {toChat}
            />
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
                <Text style = {{marginLeft: -60, fontSize:30, flex: 1, color: "#fff"}}>Inbox</Text>
            </View>

            {smallMode == "big" && <View style={{flexDirection:'row', width: '80%', flex: 1, marginBottom: 10, marginTop: 10, alignSelf: 'center'}}>
                <View style={{flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRightWidth: 0}}>
                    <FlatList 
                        data = {data}
                        renderItem = {renderItem}
                        keyExtractor = {item => item.user._id}
                        extraData = {data}
                        scrollEnabled = {true}
                    />
                </View>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'}}>
                    <Text style={{color: 'white', fontSize: 20, alignSelf: 'center'}}>Message fellow art enthusiasts from all over the world!</Text>
                </View>
            </View>}

            {smallMode == "medium" && <View style={{flexDirection:'row', width: '100%', flex: 1, alignSelf: 'center'}}>
                <View style={{flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRightWidth: 0}}>
                    <FlatList 
                        data = {data}
                        renderItem = {renderItem}
                        keyExtractor = {item => item.user._id}
                        extraData = {data}
                        scrollEnabled = {true}
                    />
                </View>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'}}>
                    <Text style={{color: 'white', fontSize: 20, alignSelf: 'center'}}>Message fellow art enthusiasts from all over the world!</Text>
                </View>
            </View>}

            {smallMode == "small" && 
                <FlatList 
                    data = {data}
                    renderItem = {renderItem}
                    keyExtractor = {item => item.user._id}
                    extraData = {data}
                    scrollEnabled = {true}
                />
            }

            {/* <FlatList 
                data = {data}
                renderItem = {renderItem}
                keyExtractor = {item => item.user._id}
                extraData = {data}
                scrollEnabled = {true}
            /> */}
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
    LogoBanner: {
        flexDirection: "row",
        // marginTop: 60,
        width: "100%",
        paddingBottom: 10,
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        // backgroundColor: "blue"
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
        marginLeft: 5, 
        alignSelf: "center", 
        // marginTop: 35
    },
    AvatarImage: {
        alignSelf: "center",
        margin: 5,
        marginTop: 0
    }
});