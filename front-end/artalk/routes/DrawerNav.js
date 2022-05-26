import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../assets/screens/homeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../containers/userContext";
import { EnvContext } from "../containers/envContext";
import { DrawerContent } from "./DrawerContent";
import UserProfile from "../assets/screens/userProfile";
import NavigationStack from "./StackNavigator";

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

    useEffect( () => {
        getInfo();
    },[]);

    return (
        <UserContext.Provider value = {{user}}>
            <Drawer.Navigator drawerContent = {(props) => <DrawerContent {...props}/>} screenOptions = {{headerShown: false}}>
                <Drawer.Screen name = "navigationStack" component = {NavigationStack} />
            </Drawer.Navigator>
        </UserContext.Provider>
    );
}