import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../assets/screens/homeScreen";
import UserProfile from "../assets/screens/userProfile";
import SearchScreen from "../assets/screens/searchScreen";
import MakePostScreen from "../assets/screens/makePostScreen";
import FollowerScreen from "../assets/screens/followerScreen";
import FollowingScreen from "../assets/screens/followingScreen";
import LikersScreen from "../assets/screens/likersScreen";
import CommentsScreen from "../assets/screens/commentsScreen";
import { UserContext } from "../containers/userContext";

const Stack = createStackNavigator();

export default function AppStack() {
    const {user} = useContext( UserContext );
    return (
        <Stack.Navigator screenOptions = {{headerShown: false}}>
            <Stack.Screen name = "homeScreen" component = {HomeScreen} />
            <Stack.Screen name = "userProfile" component = {UserProfile} />
            <Stack.Screen name = "searchScreen" component = {SearchScreen}/>
            <Stack.Screen name = "makePostScreen" component = {MakePostScreen}/>
            <Stack.Screen name = "followerScreen" component = {FollowerScreen}/>
            <Stack.Screen name = "followingScreen" component = {FollowingScreen}/>
            <Stack.Screen name = "likersScreen" component = {LikersScreen}/>
            <Stack.Screen name = "commentsScreen" component = {CommentsScreen}/>
        </Stack.Navigator>
    );
}
