import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../assets/screens/homeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../containers/userContext";
import { EnvContext } from "../containers/envContext";
import { DrawerContent } from "./DrawerContent";
import UserProfile from "../assets/screens/userProfile";
import SearchScreen from "../assets/screens/searchScreen";
import MakePostScreen from "../assets/screens/makePostScreen";
import FollowerScreen from "../assets/screens/followerScreen";
import FollowingScreen from "../assets/screens/followingScreen";
import LikersScreen from "../assets/screens/likersScreen";
import CommentsScreen from "../assets/screens/commentsScreen";
import InboxScreen from "../assets/screens/inbox";
import ChatScreen from "../assets/screens/chatScreen";
import OffersScreen from "../assets/screens/offersScreen";
import MakeOffer from "../assets/screens/makeOffer";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    const [user, setUser] = useState( Object );
    const { ipString } = useContext( EnvContext );

    const getInfo = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token} )
        };
        
        //console.log( "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" );

        await fetch( ipString + "api/user/getUserData", options )
        .then((res) => res.json())
        .then((res) => setUser(res));
    };

    useEffect(() => {
        getInfo();
    },[]);

    return (
        <UserContext.Provider value = {{user}}>
            {/* <Drawer.Navigator drawerContent = {(props) => <DrawerContent {...props}/>} screenOptions = {{headerStyle:{flex:1,backgroundColor: "#111"},headerTitleStyle:{color:"#fff"}, headerTransparent:true}} > */}
            <Drawer.Navigator drawerContent = {(props) => <DrawerContent {...props}/>} screenOptions={{headerShown:false}}>
                <Drawer.Screen name = "Home" component={HomeScreen} />
                <Drawer.Screen name = "Profile" component = {UserProfile} />
                <Drawer.Screen name = "Search" component = {SearchScreen}/>
                <Drawer.Screen name = "MakeAPost" component = {MakePostScreen}/>
                <Drawer.Screen name = "Followers" component = {FollowerScreen}/>
                <Drawer.Screen name = "Following" component = {FollowingScreen}/>
                <Drawer.Screen name = "Likes" component = {LikersScreen}/>
                <Drawer.Screen name = "Comments" component = {CommentsScreen}/>
                <Drawer.Screen name = "Inbox" component = {InboxScreen}/>
                <Drawer.Screen name = "Chat" component = {ChatScreen}/>
                <Drawer.Screen name = "Gigs" component = {OffersScreen}/>
                <Drawer.Screen name = "MakeGig" component = {MakeOffer}/>
                {/* <Drawer.Screen name = "navigationStack" component = {NavigationStack}/> */}
            </Drawer.Navigator>
        </UserContext.Provider>
    );
}