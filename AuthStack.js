import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LogIn from "../assets/screens/logIn";
import Register from "../assets/screens/register";
import HomeScreen from "../assets/screens/homeScreen";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../containers/authContext";
import { Drawer } from "react-native-paper";
import  DrawerNav  from "./DrawerNav";
import { EnvContext } from "../containers/envContext";


const Stack = createStackNavigator();

export default function authStack() {
    //const ipString = "http://172.20.10.3:3000/"; // hotspot iphone vodafone
    //const ipString = "http://192.168.1.176:50000/"; // acasa
    const ipString = "http://localhost:50000/";
    //const ipString = "http://192.168.1.140:3000/"; // raspberry pi internal ip
    //const ipString = "http://epaint.ddns.net:3000/"; // no ip
    //const ipString = "http://192.168.1.103:3000/";
    
    const initLogInState = {
        isLoading: true,
        email: null, 
        userToken: null
    };

    const logInReducer = ( prevState, action ) => {
        switch ( action.type ) {
        case "RETRIEVE_TOKEN": 
            return {
                ...prevState,
                userToken: action.token,
                isLoading: false
            };
        case "LOGIN":
            return {
                ...prevState,
                email: action.id,
                userToken: action.token,
                isLoading: false
            };
        case "LOGOUT":
            return {
                ...prevState,
                email: null,
                userToken: null,
                isLoading: false
            };
        case "REGISTER":
                return {
                    ...prevState,
                    email: action.id,
                    userToken: action.token,
                    isLoading: false
                };
        }
    };

    const [logInState, dispatch] = React.useReducer( logInReducer, initLogInState );

    const authContext = React.useMemo( () => ({
        logIn: async( userString, password ) => { 
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( {userString: userString, password: password} )
            };

            var data, userToken;
            await fetch( ipString + "api/user/login", options )
            .then((res) => res.text())
            .then((res) => data = res);
            try {
                if( !(data.length < 149) ) {
                    userToken = data;
                    await AsyncStorage.setItem( "userToken", userToken );
                }
                else
                    alert( data );
            } catch (error) {
                console.log(error);
            }
            dispatch( { type: "LOGIN", id: userString, token: userToken } );
        },
        register: async( data ) => {
            const options = {
                method: "POST",
                headers: {
                    // 'Accept': 'application/json',
                    // "Content-Type": "application/json",
                    // "Content-Type": "multipart/form-data"
                    // "Content-Type": "multipart/form-data; boundary=${form._boundary}",
                },
                body: data
            };
            
            // console.log("options: " + options );
            // console.log("data: " + data );
            // console.log("stringify data: " + JSON.stringify(Object.fromEntries(data.entries())) );

            // console.log("-----------------------------------------------------------------------------------------------------------------");
            // for(var pair of data.entries()) {
            //     console.log(`${pair[0]}: ${pair[1]}`);
            // }

            await fetch( ipString + "api/user/register", {
                method: "POST",
                headers: {
                    // 'Accept': 'application/json',
                    // "Content-Type": "application/json",
                    // "Content-Type": "multipart/form-data"
                    // "Content-Type": "multipart/form-data; boundary=${form._boundary}",
                },
                body: data
            } )
            .then((res) => res.text())
            .then((res) => alert(res));
        },
        logOut: async() => {
            try {
                await AsyncStorage.removeItem( "userToken" );
            } catch (error) {
                console.log(error);
            }
            dispatch( { type: "LOGOUT" } );
        }
    }));

    useEffect( () => {
        setTimeout( async() => {
            var userToken = null;
            try {
                userToken = await AsyncStorage.getItem( "userToken" );
                console.log( userToken );
            } catch (error) {
                console.log( error );
            }
            dispatch( {type: "RETRIEVE_TOKEN", token: userToken} );
        });
    },[]);

    if ( logInState.isLoading ) {
        return (
            <View style = {{flex: 1, justifyContent: "center", alignItems: "center"}} >
                <ActivityIndicator size = "large"/>
            </View>
        );
    }

    return (
        <EnvContext.Provider value = {{ipString}}>
        <AuthContext.Provider value = {authContext}>
                <NavigationContainer>
                    { logInState.userToken != null ? ( 
                    <DrawerNav/>
                    // <HomeScreen />
                    ) : (
                        <Stack.Navigator screenOptions = {{headerShown: false}}>
                            <Stack.Screen name = "Log in" component = {LogIn} />
                            <Stack.Screen name = "Sign up" component = {Register} />
                            {/* <Stack.Screen name = "HomeScreen" component = {homeScreen} options = {{animationEnabled: false}}/> */}
                        </Stack.Navigator>
                        )
                    }
                </NavigationContainer>
        </AuthContext.Provider>
        </EnvContext.Provider>
    );
};