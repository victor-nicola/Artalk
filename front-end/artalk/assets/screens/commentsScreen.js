import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View, SafeAreaView } from "react-native";
import { Ionicons, Feather, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { UserContext } from "../../containers/userContext";
import { Avatar, Caption, Text, Title } from "react-native-paper";

var IS_ANSWERING = false, ELEM = null;

function Reply ( {elem, toUser, deleteComment} ) {
    const { ipString } = useContext( EnvContext );
    const { user } = useContext( UserContext );

    return (
        <View>
            <View style = {styles.ViewReply}>
                <View style = {{flexDirection: "row", alignItems: "flex-start"}}>
                    <TouchableOpacity style = {styles.TouchableOpacity} onPress = {toUser}>
                            <View style = {{flexDirection: "row", alignContent: "center"}}>
                                <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {30} />
                                <View style = {{justifyContent: "center"}}>
                                    <Title style = {{fontSize: 17, color: "#fff", fontWeight: "bold"}}>@{elem.user.username}</Title>
                                </View>
                            </View>
                    </TouchableOpacity>
                    <Caption style = {styles.Caption}>{elem.comment.text}</Caption>
                </View>
                <View style = {{flexDirection: "row"}}>
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
                </View>
            </View>
        </View>
    );
};

// var arrayIsSet = new Map();

const Item = ( {elem, toUser, deleteComment} ) => {
    const { ipString } = useContext( EnvContext );
    const { user } = useContext( UserContext );
    // var [gotReplies, setGotReplies] = useState(arrayIsSet.get(elem.comment._id));
    var [gotReplies, setGotReplies] = useState(false);
    var [itemData, setItemData] = useState([]);
    itemData = elem.itemData;

    const getReplies = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, commentId: elem.comment._id, userId: elem.comment.userId} )
        };

        // console.log( elem.comment );

        await fetch( ipString + "api/user/getReplies", options )
        .then((res) => res.json()) 
        .then((res) => { 
            elem.itemData = res;
            // arrayIsSet.set(elem.comment._id, true);
            // console.log( "!!!!!!!!!!!1111" );
            // for ( var i in arrayIsSet ) {
            //     // console.log( i + ": " + arrayIsSet[i] );
            //     console.log( "LMAO" );
            // }
            // console.log( "!!!!!!!!!!!1111" );
            setGotReplies(true);
        });
    };

    const renderItem = ( {item} ) => {
        return (
            <Reply 
                elem = {item} 
                toUser = {toUser}
                deleteComment = {deleteComment}
            />
        );
    };

    // console.log( elem.comment._id );
    // console.log( arrayIsSet.get(elem.comment._id) );

    return (
        <View>
            <View style = {styles.View}>
                <View style = {{flexDirection: "row", alignItems: "flex-start"}}>
                    <TouchableOpacity style = {styles.TouchableOpacity} onPress = {toUser}>
                            <View style = {{flexDirection: "row", alignContent: "center"}}>
                                <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {30} />
                                <View style = {{justifyContent: "center"}}>
                                    <Title style = {{fontSize: 17, color: "#fff", fontWeight: "bold"}}>@{elem.user.username}</Title>
                                </View>
                            </View>
                    </TouchableOpacity>
                    <Caption style = {styles.Caption}>{elem.comment.text}</Caption>
                </View>
                <View style = {{flexDirection: "row"}}>
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
                </View>
            </View>
            { (elem.comment.noReplies > 0 && !gotReplies) && 
                <TouchableOpacity style = {{marginLeft: 60}} onPress = {getReplies}>
                    <Text style = {{color: "#fff", opacity: 0.5}}>Show replies ({elem.comment.noReplies})</Text>
                </TouchableOpacity> 
            }
            { (elem.comment.noReplies > 0 && gotReplies) && 
                <FlatList 
                    data = {itemData}
                    renderItem = {renderItem}
                    keyExtractor = {item => item.comment._id}
                    extraData = {itemData}
                    scrollEnabled = {false}
                />
            }
        </View>
    );
};

export default function CommentsScreen( {navigation, route: {params}} ) {
    const { ipString } = useContext( EnvContext );
    const [data, setData] = useState([]);
    const [comment, setComment] = useState("");
    const {post} = params;

    const getComments = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, postId: post.post._id} )
        };
    
        await fetch( ipString + "api/user/getComments", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    const postComment = async() => {
        var token = await AsyncStorage.getItem( "userToken" );

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, postId: post.post._id, text: comment} )
        };

        await fetch( ipString + "api/user/comment", options )
        .then((res) => res.text())
        .then((res) => alert(res));

        setComment("");
        getComments();
    };

    const deleteComment = async(elem) => {
        var token = await AsyncStorage.getItem( "userToken" );

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, comment: elem.comment, userId: elem.user._id} )
        };

        await fetch( ipString + "api/user/deleteComment", options )
        .then((res) => res.text())
        .then((res) => alert(res));

        getComments();
    };

    const replyToComment = async(elem) => {
        var token = await AsyncStorage.getItem( "userToken" );

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, postId: post.post._id, fatherCommentId: elem.comment._id, text: comment} )
        };

        await fetch( ipString + "api/user/replyToComment", options )
        .then((res) => res.text())
        .then((res) => alert(res));

        setComment("");
        IS_ANSWERING = false;
        ELEM = null;

        getComments();
    };

    useEffect( () => {
        setData( [] );
        getComments();
    },[post]);

    // useEffect( () => {
    //     if ( data.length > 0 ) {
    //         for ( var i = 0; i < data.length; i ++ )
    //             arrayIsSet.set(data[i].comment._id, false);
    //     }
    // }, [data] );

    const renderItem = ( {item} ) => {
        const toUser = () => {
            navigation.navigate( "userProfile", {searchedUser: item.user} );
        };
        return (
            <Item 
                elem = {item} 
                toUser = {toUser}
                deleteComment = {deleteComment}
                replyToComment = {replyToComment}
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
                    <Text style = {{color: "#fff", fontSize: 25}}>Comments</Text>
                </View>
                <TouchableOpacity style = {{marginRight: 20}}>
                    {/* <Feather name="send" size={24} color="#fff" /> */}
                </TouchableOpacity>
            </View>
            <View style = {{backgroundColor: "#fff", height: 1}}/>
            <View style = {styles.PostView}>
                <TouchableOpacity style = {styles.TouchableOpacity} onPress = {() => {navigation.navigate( "userProfile", {searchedUser: post.user} );}}>
                        <View style = {{flexDirection: "row", alignContent: "center"}}>
                            <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + post.user.image}} size = {30} />
                            <View style = {{justifyContent: "center"}}>
                                <Title style = {{fontSize: 17, color: "#fff", fontWeight: "bold"}}>@{post.user.username}</Title>
                            </View>
                        </View>
                </TouchableOpacity>
                <Caption style = {styles.Caption}>{post.post.caption}</Caption>
            </View>
            <View style = {{marginBottom: 5, backgroundColor: "#fff", height: 1, opacity: 0.5}}/>
            <FlatList 
                data = {data}
                renderItem = {renderItem}
                keyExtractor = {item => item.comment._id}
                extraData = {data}
                scrollEnabled = {true}
            />
            <View>
                <View style = {styles.TextInputContainer}>
                    <TextInput style = {styles.TextInput} multiline = {true} textAlignVertical = {"top"} placeholder = {"Comment"} placeholderTextColor = "#fff" value={comment} onChangeText={(text) => { setComment( text ) }}/>
                    <TouchableOpacity style = {{alignSelf: "center", marginRight: 10}} onPress = {() => {if (IS_ANSWERING == false){postComment();}else{replyToComment(ELEM)}}}>
                        <Text style = {{color: "#fff"}}>POST</Text>
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