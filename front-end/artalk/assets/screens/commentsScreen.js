import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View, SafeAreaView, useWindowDimensions } from "react-native";
import { Ionicons, AntDesign, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { UserContext } from "../../containers/userContext";
import { Avatar, Caption, Text, Title } from "react-native-paper";
import { useLinkTo } from "@react-navigation/native";

var IS_ANSWERING = false, ELEM = null;
const defaultColor = "#111";

function Reply ( {elem, toUser, deleteComment, setPlaceholder, toRepliedUser} ) {
    const { ipString } = useContext( EnvContext );
    const { user } = useContext( UserContext );

    return (
        <View style = {styles.ViewReply}>
            <View style = {{flexDirection: "row", alignSelf:'flex-start', paddingLeft: 20, flexShrink: 1, paddingTop: 10}}>
                <TouchableOpacity style = {{flexDirection: "row"}} onPress={toUser}>
                    <View style = {{flexDirection: "row"}}>
                        <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {30} />
                    </View>
                </TouchableOpacity>
                <View style = {{flexDirection: "column", marginLeft: 15, flexShrink: 1}}>
                    <TouchableOpacity onPress={toUser}>
                        <Title style = {{color: "white", fontSize: 17, fontWeight: "bold", marginTop: -5}}>{elem.user.username}</Title>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', flexShrink: 1}}>
                            <TouchableOpacity style={{marginTop: -6}} onPress = {toRepliedUser}>
                                <Caption style={{color: "#cae5fa", fontSize: 17}}>@{elem.userRepliedTo.username}</Caption>
                            </TouchableOpacity>
                        <View style={{flexDirection: 'column', flexShrink: 1}}>
                            <Caption style = {{color: "white", fontSize: 17, flexShrink: 1, marginTop: -5, marginLeft: 5}}>{elem.comment.text}</Caption>
                        </View>
                    </View>
                </View>
            </View>
            <View style = {{flexDirection: "row", marginLeft: 75, marginTop: 5, paddingBottom: 15}}>
                {elem.comment.userId == user._id && 
                <TouchableOpacity style={{borderBottomWidth: 1, opacity: 0.5, alignSelf:'flex-start', borderBottomColor: "#fff"}} onPress={() => {deleteComment(elem)}}>
                    <Text style = {{color: "#fff", fontSize: 12}}>Delete</Text>
                </TouchableOpacity>
                }
                <TouchableOpacity style={{borderBottomWidth: 1, opacity: 0.5, marginLeft: 10, alignSelf:'flex-start', borderBottomColor: "#fff"}} onPress={() => {IS_ANSWERING = true; setPlaceholder("Replying to @" + elem.user.username); ELEM = elem;}}>
                    <Text style = {{color: "#fff", fontSize: 12}}>Reply</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// var arrayIsSet = new Map();

const Item = ( {elem, toUser, deleteComment, setPlaceholder, navigation} ) => {
    const { ipString } = useContext( EnvContext );
    const { user } = useContext( UserContext );
    const [itemData, setItemData] = useState([]);
    const linkTo = useLinkTo();
    
    const getReplies = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
        
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, commentId: elem.comment._id, userId: elem.comment.userId} )
        };
        
        await fetch( ipString + "api/user/getReplies", options )
        .then((res) => res.json()) 
        .then((res) => { 
            setItemData(res);
        });
    };
    
    useEffect( () => {
        setItemData( [] );
        getReplies();
    },[elem]);

    const renderItem = ( {item} ) => {
        const toRepliedUser = () => {
            linkTo( "/profile/" + item.userRepliedTo._id );
        };
        const toUserReply = () => {
            linkTo( "/profile/" + item.user._id );
        };
        return (
            <Reply 
                elem = {item} 
                toUser = {toUserReply}
                deleteComment = {deleteComment}
                setPlaceholder = {setPlaceholder}
                toRepliedUser = {toRepliedUser}
            />
        );
    };
            
    return (
        <View>
            <View style = {styles.View}>
                <View style = {{flexDirection: "row", alignSelf:'flex-start', paddingLeft: 5, flexShrink: 1, paddingTop: 10}}>
                    <TouchableOpacity style = {{flexDirection: "row"}} onPress={toUser}>
                        <View style = {{flexDirection: "row"}}>
                            <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {30} />
                        </View>
                    </TouchableOpacity>
                    <View style = {{flexDirection: "column", marginLeft: 15, flexShrink: 1}}>
                        <TouchableOpacity onPress={toUser}>
                            <Title style = {{color: "white", fontSize: 17, fontWeight: "bold", marginTop: -5}}>{elem.user.username}</Title>
                        </TouchableOpacity>
                        <Caption style = {{color: "white", fontSize: 17, flexShrink: 1, marginTop: -5}}>{elem.comment.text}</Caption>
                    </View>
                </View>
                <View style = {{flexDirection: "row", marginLeft: 60, marginTop: 5, paddingBottom: 15}}>
                    {elem.comment.userId == user._id && 
                    <TouchableOpacity style={{borderBottomWidth: 1, opacity: 0.5, alignSelf:'flex-start', borderBottomColor: "#fff"}} onPress={() => {deleteComment(elem)}}>
                        <Text style = {{color: "#fff", fontSize: 12}}>Delete</Text>
                    </TouchableOpacity>
                    }
                    <TouchableOpacity style={{borderBottomWidth: 1, opacity: 0.5, marginLeft: 10, alignSelf:'flex-start', borderBottomColor: "#fff"}} onPress={() => {IS_ANSWERING = true; setPlaceholder("Replying to @" + elem.user.username); ELEM = elem;}}>
                        <Text style = {{color: "#fff", fontSize: 12}}>Reply</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* { (elem.comment.noReplies > 0 && !gotReplies) && 
                <TouchableOpacity style = {{marginLeft: 60}} onPress = {getReplies}>
                    <Text style = {{color: "#fff", opacity: 0.5}}>Show replies ({elem.comment.noReplies})</Text>
                </TouchableOpacity> 
            } */}
            {/* { (elem.comment.noReplies > 0 && gotReplies) &&  */}
                {/* <View> */}
                    {/* <TouchableOpacity style = {{marginLeft: 60}} onPress = {() => {setGotReplies(false);expandedComments.set(elem.comment._id, false);}}>
                        <Text style = {{color: "#fff", opacity: 0.5}}>Hide replies</Text>
                    </TouchableOpacity> */}
                    <FlatList 
                    data = {itemData}
                    renderItem = {renderItem}
                    keyExtractor = {item => item.comment._id}
                    extraData = {itemData}
                    scrollEnabled = {false}
                    />
                {/* </View> */}
            {/* } */}
        </View>
    );
};

export default function CommentsScreen( {navigation, route: {params}} ) {
    if ( params ) {
    const { ipString } = useContext( EnvContext );
    const [data, setData] = useState([]);
    const [comment, setComment] = useState("");
    const [placeholder, setPlaceholder] = useState("Comment");
    const {id} = params;
    const linkTo = useLinkTo();
    const [post, setPost] = useState();
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

    const getComments = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
        
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, postId: id} )
        };
    
        await fetch( ipString + "api/user/getComments", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    const getPost = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
        
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, postId: id} )
        };
    
        await fetch( ipString + "api/user/getPost", options )
        .then((res) => res.json())
        .then((res) => setPost(res));
    };

    const postComment = async() => {
        var token = await AsyncStorage.getItem( "userToken" );

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, postId: id, text: comment} )
        };

        await fetch( ipString + "api/user/comment", options )
        .then((res) => res.text());

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
            body: JSON.stringify( {token: token, commentId: elem.comment._id, userId: elem.user._id, fatherCommentId: elem.comment.fatherCommentId} )
        };

        await fetch( ipString + "api/user/deleteComment", options )
        .then((res) => res.text());

        getComments();
    };

    const replyToComment = async(elem) => {
        var token = await AsyncStorage.getItem( "userToken" );

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, postId: id, fatherCommentId: elem.comment._id, text: comment} )
        };

        await fetch( ipString + "api/user/replyToComment", options )
        .then((res) => res.text());

        setComment("");
        IS_ANSWERING = false;
        ELEM = null;

        getComments();
    };

    useEffect( () => {
        setData( [] );
        getPost();
        getComments();
    },[id]);

    // useEffect( () => {
    //     if ( data.length > 0 ) {
    //         for ( var i = 0; i < data.length; i ++ )
    //             arrayIsSet.set(data[i].comment._id, false);
    //     }
    // }, [data] );

    const renderItem = ( {item} ) => {
        const toUser = () => {
            linkTo( "/profile/" + item.user._id );
        };
        return (
            <Item 
                elem = {item} 
                toUser = {toUser}
                deleteComment = {deleteComment}
                replyToComment = {replyToComment}
                setPlaceholder = {setPlaceholder}
                navigation = {navigation}
            />
        );
    };

    // console.log(data);
    return (
        <SafeAreaView style = {{flex: 1, backgroundColor: "#111"}} >
            <View style = {styles.LogoBanner} >
                <View style = {{flex: 1, alignItems: "center", flexDirection: "row"}}>
                    <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}} style = {{marginLeft: 15}}>
                        <Octicons name="three-bars" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <Text style = {{marginLeft: -65 + (30-textSize) * 2, fontSize:textSize, color: "#fff"}}>Comments</Text>
                </View>
            </View>
            {post && 
            <View style = {{flexDirection: "row", paddingLeft: 20, paddingBottom: 10, flexShrink: 1, paddingTop: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)'}}>
                <TouchableOpacity style = {{flexDirection: "row"}} >
                    <View style = {{flexDirection: "row"}}>
                        <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + post.user.image}} size = {30} />
                    </View>
                </TouchableOpacity>
                <View style = {{flexDirection: "column", marginLeft: 15, flexShrink: 1}}>
                    <TouchableOpacity>
                        <Title style = {{color: "white", fontSize: 17, fontWeight: "bold", marginTop: -5}}>{post.user.username}</Title>
                    </TouchableOpacity>
                    <Caption style = {{color: "white", fontSize: 17, flexShrink: 1, marginTop: -5}}>{post.post.caption}</Caption>
                </View>
            </View>}
            <FlatList 
                data = {data}
                renderItem = {renderItem}
                keyExtractor = {item => item.comment._id}
                extraData = {data}
                scrollEnabled = {true}
            />
            <View>
                <View style = {styles.TextInputContainer}>
                    <TextInput style = {styles.TextInput} multiline = {true} textAlignVertical = {"top"} placeholder = {placeholder} placeholderTextColor = "#fff" value={comment} onChangeText={(text) => { setComment( text ) }}/>
                    <TouchableOpacity style = {{alignSelf: "center", borderWidth: 2, borderRadius: 5, borderColor: 'rgba(255,255,255,0.5)', padding: 5, marginRight: 10}} onPress = {() => {if (IS_ANSWERING == false){postComment();}else{replyToComment(ELEM)}setPlaceholder("Comment")}}>
                        <Text style = {{color: "#fff"}}>POST</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
        
        // <View style = {{borderBottomColor:'rgba(255,255,255,0.5)', backgroundColor: "#111", paddingBottom: 5, borderBottomWidth: 1, alignItems: 'center', justifyContent:"space-between", flexDirection: 'row'}}>
        //     {post && 
        //     <View style = {{flexDirection: "row", marginLeft: 20, flexShrink: 1}}>
        //         <TouchableOpacity style = {{flexDirection: "row"}} >
        //             <View style = {{flexDirection: "row", alignContent: "center", justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
        //                 <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + post.user.image}} size = {30} />
        //             </View>
        //         </TouchableOpacity>
        //         <View style = {{flexDirection: "column", marginLeft: 25, flexShrink: 1, marginRight: 25}}>
        //             <TouchableOpacity>
        //                 <Title style = {{color: "white", fontSize: 23, fontWeight: "bold"}}>{post.user.username}</Title>
        //             </TouchableOpacity>
        //             <Caption style = {{color: "white", fontSize: 17, flexShrink: 1}}>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Caption>
        //         </View>
        //     </View>}
        // </View>
    );
    }
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
        borderRadius: 5,
        borderWidth: 1,
        borderBottomColor: "#fff",
        borderColor: defaultColor,
        height: 50,
        width: '99%',
        marginBottom: 30,
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
    LogoBanner: {
        flexDirection: "row",
        // marginTop: 60,
        justifyContent: "space-between",
        width: "100%",
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#fff'
    },
    View : {
        flexDirection: "column", 
        paddingLeft: 20, 
        paddingTop: 10, 
        // paddingBottom: 10,
        // justifyContent: "space-between"
    },
    PostView : {
        flexDirection: "row", 
        paddingLeft: 20, 
        paddingTop: 10, 
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.5)',
        flexShrink: 1,
        // justifyContent: "center"
    },
    ViewReply : {
        flexDirection: "column", 
        paddingLeft: 50, 
        // paddingTop: 10, 
        paddingBottom: 10,
        // justifyContent: "spaces-between"
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
        marginTop: -5,
        flexShrink: 1,
        // marginTop: 35
    },
    AvatarImage: {
        justifyContent: "center",
        margin: 5,
    },
});