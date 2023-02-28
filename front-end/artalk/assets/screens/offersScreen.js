import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View, SafeAreaView, Text, Picker, useWindowDimensions } from "react-native";
import { AntDesign, Fontisto, Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { Avatar, Caption, Title } from "react-native-paper";
import { useLinkTo } from "@react-navigation/native";

const Item = ( {elem, toUser, deleteGig} ) => {
    const { ipString } = useContext( EnvContext );
    const {height, width} = useWindowDimensions();
    const [textSize, setTextSize] = useState(20);
    const [smallMode, setSmallMode] = useState(false);
    
    window.addEventListener("resize", ()=>{
        if ( window.innerWidth < 800 )
            setTextSize(16);
        else
            setTextSize(20);
        
        if ( window.innerWidth < 590 )
            setSmallMode(true);
        else
            setSmallMode(false);
    });

    useEffect(()=>{
        if ( width < 800 )
            setTextSize(16);
        else
            setTextSize(20);
        if ( width < 590 )
            setSmallMode(true);
        else
            setSmallMode(false);
    });

    return (
        <View style = {{borderBottomColor:'rgba(255,255,255,0.5)', paddingBottom: 5, borderBottomWidth: 1}}>
            { !smallMode && <View style={{alignItems: 'center', justifyContent:"space-between", flexDirection: 'row'}}>
                <View style = {{flexDirection: "row", marginLeft: 20, flexShrink: 1}}>
                    <TouchableOpacity style = {{flexDirection: "row"}} onPress = {toUser}>
                        <View style = {{flexDirection: "row", alignContent: "center", justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                            <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {30} />
                            <View style = {{justifyContent: "center", alignSelf: "center", alignItems: "center", alignContent: "center"}}>
                                <Title style = {{alignItems: "center", alignContent: "center", alignSelf: "center", justifyContent: "center", fontSize: textSize, color: "#ffffff"}}>@{elem.user.username}</Title>
                                <Caption style = {{alignItems: "center", alignContent: "center", alignSelf: "center", justifyContent: "center", fontSize: textSize/4*3, color: "#ffffff"}}>{elem.offer.type}</Caption>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style = {{flexDirection: "column", marginLeft: 25, flexShrink: 1, marginRight: 25}}>
                        <Title style = {{color: "white", fontSize: textSize/4*3 + 3, fontWeight: "bold"}}>{elem.offer.title}</Title>
                        <Caption style = {{color: "white", fontSize: textSize/4*3 + 2, flexShrink: 1}}>{elem.offer.text}</Caption>
                    </View>
                </View>
                <Caption style = {{color: "white", fontSize: textSize, marginRight: 20}}>Hourly rate: {elem.offer.price}€</Caption>
            </View>}
            { smallMode && <View style={{justifyContent:"space-between", flexDirection: 'column'}}>
                <View style = {{flexDirection: "row", paddingLeft: 20, flexShrink: 1, justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'}}>
                    <TouchableOpacity style = {{flexDirection: "row", paddingRight: 10, paddingBottom: 5, alignSelf:'flex-start'}} onPress = {toUser}>
                        <View style = {{flexDirection: "row", alignContent: "center", justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                            <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {30} />
                            <View style = {{justifyContent: "center", alignSelf: "center", alignItems: "center", alignContent: "center"}}>
                                <Title style = {{alignItems: "center", alignContent: "center", alignSelf: "center", justifyContent: "center", fontSize: textSize, color: "#ffffff"}}>@{elem.user.username}</Title>
                                <Caption style = {{alignItems: "center", alignContent: "center", alignSelf: "center", justifyContent: "center", fontSize: textSize/4*3, color: "#ffffff"}}>{elem.offer.type}</Caption>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style = {{flexDirection: "column", marginBottom: 10, marginLeft: 25, flexShrink: 1, marginRight: 25, alignItems: 'center'}}>
                    <Title style = {{color: "white", fontSize: textSize/4*3 + 3, fontWeight: "bold"}}>{elem.offer.title}</Title>
                    <Caption style = {{color: "white", fontSize: textSize/4*3 + 2, flexShrink: 1}}>{elem.offer.text}</Caption>
                </View>
                <Caption style = {{color: "white", fontSize: textSize, alignSelf: 'center'}}>Hourly rate: {elem.offer.price}€</Caption>
            </View>}
        </View>
    );
};

export default function OffersScreen( {navigation} ) {
    const { ipString } = useContext( EnvContext );
    const [data, setData] = useState( [] );
    const [type, setType] = useState("");
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

    const linkTo = useLinkTo();

    const renderItem = ( {item} ) => {
        const toUser = () => {
            linkTo( "/profile/" + item.user._id );
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
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}} style = {{marginLeft: 20}}>
                        <Octicons name="three-bars" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>
                <View style = {{flexDirection: "row", flex: 1}}>
                    <Text style = {{marginLeft: -110, fontSize: textSize, color: "#fff"}}>Gigs for:</Text>
                    <Picker style = {{backgroundColor: "#111", marginLeft: 10, color:'white', borderWidth: 0, fontSize: textSize/6*5}} onValueChange = {(itemValue, itemPosition) => setType(itemValue)}>
                        <Picker.Item label = "Anything" value = ""/>
                        <Picker.Item label = "Photography" value = "photography"/>
                        <Picker.Item label = "Digital art" value = "digital art"/>
                        <Picker.Item label = "Design" value = "design"/>
                        <Picker.Item label = "Painting" value = "painting"/>
                        <Picker.Item label = "Sculpture" value = "sculpture"/>
                    </Picker>
                </View>
            </View>
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
        backgroundColor: "#111"
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
        width: "100%",
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,1)'
        // backgroundColor: "blue"
    },
});