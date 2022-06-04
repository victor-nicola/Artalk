import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View, SafeAreaView, Text, Picker } from "react-native";
import { AntDesign, Fontisto, Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { Avatar, Caption, Title } from "react-native-paper";

const Item = ( {elem, toUser} ) => {
    const { ipString } = useContext( EnvContext );

    return (
        <View>
            <View style = {{width:"100%", marginTop: 10, marginBottom: 10, flexDirection: "row"}}>
                <TouchableOpacity style = {{flexDirection: "row"}} onPress = {toUser}>
                    <View style = {{flexDirection: "row", alignContent: "center", justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                        <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {30} />
                        <View style = {{justifyContent: "center", alignSelf: "center", alignItems: "center", alignContent: "center"}}>
                            <Title style = {{alignItems: "center", alignContent: "center", alignSelf: "center", justifyContent: "center", fontSize: 20, color: "#ffffff"}}>@{elem.user.username}</Title>
                            <Caption style = {{alignItems: "center", alignContent: "center", alignSelf: "center", justifyContent: "center", fontSize: 15, color: "#ffffff"}}>{elem.offer.type}</Caption>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style = {{flexDirection: "column", marginLeft: 50}}>
                    <Title style = {{color: "white", fontSize: 23, fontWeight: "bold"}}>{elem.offer.title}</Title>
                    <Caption style = {{color: "white", fontSize: 17}}>{elem.offer.text}</Caption>
                </View>
            </View>
            <View style = {{marginBottom: 5, backgroundColor: "#fff", height: 1, opacity: 0.5}}/>
        </View>
    );
};

export default function OffersScreen( {navigation} ) {
    const { ipString } = useContext( EnvContext );
    const [data, setData] = useState( [] );
    const [type, setType] = useState("");

    const getOffersFeed = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, type: type} )
        };
    
        await fetch( ipString + "api/user/getOffersFeed", options )
        .then((res) => res.json())
        .then((res) => {setData(res)});
    };

    useEffect( () => {
        setData( [] );
        getOffersFeed();
    },[type]);

    const renderItem = ( {item} ) => {
        const toUser = () => {
            navigation.navigate( "userProfile", {searchedUser: item.user} );
        };
        return (
            <Item
                toUser = {toUser}
                elem = {item}
            />
        );
    };

    return (
        <SafeAreaView style = {styles.View}>
            <View style = {styles.LogoBanner}>
                <View style = {{flexDirection: "row"}}>
                    <TouchableOpacity style = {{marginLeft: 20}} onPress = { () => {navigation.goBack(null)} } >
                        <Ionicons style = {{alignSelf: "center"}} name = "chevron-back" size = {24} color = "#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}} style = {{marginLeft: 15}}>
                        <Octicons name="three-bars" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>
                <View style = {{flexDirection: "row"}}>
                    <Text style = {{marginRight: 20, fontSize: 30, color: "#fff"}}>Offers for:</Text>
                    <Picker style = {{backgroundColor: "#3b3b3b", borderWidth: 0, color: "#fff", fontSize: 25}} onValueChange = {(itemValue, itemPosition) => setType(itemValue)}>
                        <Picker.Item label = "Anything" value = ""/>
                        <Picker.Item label = "Painting" value = "painting"/>
                        <Picker.Item label = "Digital art" value = "digital art"/>
                        <Picker.Item label = "Photography" value = "photography"/>
                        <Picker.Item label = "Videography" value = "videography"/>
                        <Picker.Item label = "Sculpture" value = "sculpture"/>
                    </Picker>
                </View>
                <View style = {{flexDirection: "row"}}>
                    <TouchableOpacity style = {{marginRight: 20}} onPress = {() => {navigation.navigate( "searchScreen" )}}>
                        <AntDesign name = "search1" size = { 24 } color = "#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style = {{marginRight: 20}} onPress = {() => {navigation.navigate( "Inbox" )}}>
                        <Octicons name="inbox" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style = {{backgroundColor: "#fff", height: 1}}/>
            <FlatList 
                data = {data}
                extraData = {data}
                renderItem = {renderItem}
                keyExtractor = {item => item.offer._id}
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