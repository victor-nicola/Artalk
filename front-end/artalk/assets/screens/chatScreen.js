import React, { useContext, useEffect, useState, useRef } from "react";
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View, SafeAreaView } from "react-native";
import { Ionicons, Feather, Octicons, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { UserContext } from "../../containers/userContext";
import { Avatar, Caption, Text, Title } from "react-native-paper";

const Item = ( {elem, toUser, deleteMessage} ) => {
    const { ipString } = useContext( EnvContext );
    const { user } = useContext( UserContext );

    return (
        <View style = {styles.View}>

            { elem.user._id != user._id && <View style = {{flexDirection: "row", alignItems: "flex-start"}}>
                <TouchableOpacity style = {styles.TouchableOpacity} onPress = {toUser}>
                    <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {30} />
                </TouchableOpacity>
                <Caption style = {styles.CaptionL}>{elem.message.text}</Caption>
            </View>}

            { elem.user._id == user._id && <View style = {{flexDirection: "row", justifyContent: "flex-end"}}>
                <TouchableOpacity  style={{alignSelf: "center"}} onPress={() => {deleteMessage(elem)}}>
                    <Feather name="trash" size={20} color="#fff" style = {{alignSelf: "center", marginRight: 7, opacity: 0.5}} />
                </TouchableOpacity>
                <Caption style = {styles.CaptionR}>{elem.message.text}</Caption>
                <TouchableOpacity style = {styles.TouchableOpacity} onPress = {toUser}>
                    <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {30} />
                </TouchableOpacity>
            </View>}
            {/* <View style = {{flexDirection: "row"}}>
                {elem.comment.userId == user._id && 
                <View style = {{height: "fit-content", backgroundColor: "#000", opacity: 0.3, borderRadius: 30, padding: 10}}>
                    <TouchableOpacity onPress={() => {deleteComment(elem)}}>
                        <Text style = {{color: "#fff"}}>DELETE</Text>
                    </TouchableOpacity>
                </View>}
                <View style = {{marginLeft: 10, marginRight: 10, height: "fit-content", backgroundColor: "#000", opacity: 0.3, borderRadius: 30, padding: 10}}>
                    <TouchableOpacity onPress={() => {IS_ANSWERING = true; ELEM = elem;}}>
                        <Text style = {{color: "#fff", opacity: 1}}>REPLY</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
        </View>
    );
};

export default function ChatScreen( {navigation, route: {params}} ) {
    const { ipString } = useContext( EnvContext );
    const [data, setData] = useState([]);
    const [message, setMessage] = useState("");
    const {user} = params;
    // console.log( user );

    const getMessages = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, user: user} )
        };
    
        await fetch( ipString + "api/user/getMessages", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    const postMessage = async() => {
        var token = await AsyncStorage.getItem( "userToken" );

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, userId: user._id, text: message} )
        };

        await fetch( ipString + "api/user/sendMessage", options )
        .then((res) => res.text())
        .then((res) => alert(res));

        setMessage("");
        getMessages();
    };

    const deleteMessage = async(elem) => {
        var token = await AsyncStorage.getItem( "userToken" );

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, messageId: elem.message._id, senderId: elem.message.senderId} )
        };

        await fetch( ipString + "api/user/deleteMessage", options )
        .then((res) => res.text())
        .then((res) => alert(res));

        getMessages();
    };

    useEffect( () => {
        setData( [] );
        getMessages();
    },[user]);

    const renderItem = ( {item} ) => {
        const toUser = () => {
            navigation.navigate( "userProfile", {searchedUser: item.user} );
        };
        return (
            <Item 
                elem = {item} 
                toUser = {toUser}
                deleteMessage = {deleteMessage}
            />
        );
    };

    // console.log(data);
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
                    <Text style = {{color: "#fff", fontSize: 25}}>Messages</Text>
                </View>
                {/* <TouchableOpacity style = {{marginRight: 20}}>
                    <Feather name="send" size={24} color="#fff" />
                </TouchableOpacity> */}
                <View style = {{width: 63}}></View>
            </View>
            <View style = {{backgroundColor: "#fff", height: 1}}/>
            <FlatList 
                inverted = {true}
                data = {data}
                renderItem = {renderItem}
                keyExtractor = {item => item.message._id}
                extraData = {data}
                scrollEnabled = {true}
                initialNumToRender = {20}
            />
            <View>
                <View style = {styles.TextInputContainer}>
                    <TextInput style = {styles.TextInput} multiline = {true} textAlignVertical = {"top"} placeholder = {"Message"} placeholderTextColor = "#fff" value={message} onChangeText={(text) => { setMessage( text ) }}/>
                    <TouchableOpacity style = {{alignSelf: "center", marginRight: 10}} onPress = {postMessage}>
                        <Text style = {{color: "#fff"}}>SEND</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

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
        height: 30,
        paddingTop: 7,
        paddingLeft: 10,
        paddingBottom: 10,
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
        flexDirection: "column", 
        paddingLeft: 20, 
        paddingRight: 20, 
        paddingTop: 10, 
        paddingBottom: 10,
        width: "100%"
        // justifyContent: "space-between"
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
    CaptionR: {
        color: "#fff", 
        fontSize: 17, 
        marginRight: 10,
        alignSelf: "center", 
        // marginTop: 35
    },
    CaptionL: {
        color: "#fff", 
        fontSize: 17, 
        marginLeft: 10,
        alignSelf: "center", 
        // marginTop: 35
    },
    AvatarImage: {
        alignSelf: "center",
        margin: 5,
        marginTop: 0
    }
});