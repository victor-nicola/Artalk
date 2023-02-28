import React, { useContext, useEffect, useState } from "react";
import { Image, View, StyleSheet, TouchableOpacity, Text, FlatList, useWindowDimensions } from "react-native";
import { EnvContext } from "../../containers/envContext";
import { UserContext } from "../../containers/userContext";
import { Avatar, Caption, Title } from "react-native-paper";
import { AntDesign, Fontisto, Ionicons, Octicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLinkTo } from "@react-navigation/native";

const neutralColor = '#111';

const Gig = ( {elem, toUser, deleteGig} ) => {
    const { ipString } = useContext( EnvContext );
    const {user} = useContext( UserContext );
    const [smallMode, setSmallMode] = useState(false);
    const {height, width} = useWindowDimensions();
    const [textSize, setTextSize] = useState(20);
    
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

    // la width = 590px facem gigu vertical

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
                { elem.user._id == user._id &&
                    <View style={{flexDirection: 'row'}}>
                        <Caption style = {{color: "white", fontSize: textSize, alignSelf:'center', marginRight: 20}}>Hourly rate: {elem.offer.price}€</Caption>
                        <TouchableOpacity style = {{marginRight: 20, alignContent: "center", alignItems: "center", alignSelf: "center", justifyContent: "center"}} onPress={() => {deleteGig(elem)}}>
                            <Feather name="trash" size={30} color="#fff" style = {{alignSelf: "center", opacity: 0.5}} />
                        </TouchableOpacity>
                    </View>
                }
                {elem.user._id != user._id && <Caption style = {{color: "white", fontSize: textSize, marginRight: 20}}>Hourly rate: {elem.offer.price}€</Caption>}
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
                    <TouchableOpacity style = {{marginRight: 20, alignSelf: "center", justifyContent: "center"}} onPress={() => {deleteGig(elem)}}>
                        <Feather name="trash" size={25} color="#fff" style = {{alignSelf: "center", opacity: 0.5}} />
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

const Item = ( {elem, toUser, toLikers, like, dislike, toComments, deletePost, refresh} ) => {
    const { ipString } = useContext( EnvContext );
    const [imgHeight, setImgHeight] = useState("");
    const [imgWidth, setImgWidth] = useState("");
    const {height, width} = useWindowDimensions();
    const {user} = useContext( UserContext );
    var postWidth = 470;
    if ( width / 100 * 80 < postWidth )
        postWidth = width / 100 * 80;

    Image.getSize(ipString + "images/" + elem.post.image, (width, height) => {
        setImgHeight(height);
        setImgWidth(width);
    });

    return (
        <View style = {{
            width: postWidth, 
            // borderWidth: 1, 
            borderTopColor: neutralColor, 
            borderRightColor: neutralColor, 
            borderLeftColor: neutralColor, 
            // borderBottomColor: 'rgba(255,255,255,0.2)', 
            alignSelf: "center", 
            marginBottom: 20,
            paddingBottom: 10 }}>
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                <TouchableOpacity style = {{flexDirection: "row", paddingBottom: 10, alignSelf:'flex-start'}} onPress = {toUser}>
                    <View style = {{flexDirection: "row", alignContent: "center", justifyContent: "center"}}>
                        <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + elem.user.image}} size = {35} />
                        <Title style = {{fontSize: 16, fontWeight: "500", color: "#fff", alignSelf: "center", marginLeft: 10}}>{elem.user.username}</Title>
                    </View>
                </TouchableOpacity>
                { elem.user._id == user._id &&
                    <TouchableOpacity style = {{marginRight: 10, alignContent: "center", alignItems: "center", alignSelf: "center", justifyContent: "center"}} onPress={() => {deletePost(elem)}}>
                        <Feather name="trash" size={25} color="#fff" style = {{alignSelf: "center", opacity: 0.5}} />
                    </TouchableOpacity>
                }
            </View>
            <View style = {{flex: 1, alignItems: "center", justifyContent: "center"}} >
                <Image style = {{resizeMode: "cover", width: postWidth, height: postWidth/imgWidth*imgHeight}} source = {{uri: ipString + "images/" + elem.post.image}}/>
            </View>
            <View style = {{flexDirection: "row", marginTop: 10}}>
                { !elem.isLiked && <TouchableOpacity onPress = {() => { like( elem ); }}>
                    <AntDesign name = "like2" size = {30} color = "white"/>
                </TouchableOpacity> }
                { elem.isLiked && <TouchableOpacity onPress = {() => { dislike( elem ); }}>
                    <AntDesign name = "like1" size = {30} color = "white"/>
                </TouchableOpacity> }
                <TouchableOpacity style = {{marginLeft: 15}} onPress = {toComments}>
                    <Fontisto name = "comment" size = {30} color = "white" />
                </TouchableOpacity>
            </View>
            <View>
                { elem.post.likes > 1 && <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress = {toLikers}>
                    <Caption style = {{fontSize: 13, color: "#ffffff"}}>{elem.post.likes} likes</Caption>
                </TouchableOpacity> }
                { elem.post.likes == 1 && <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress = {toLikers}>
                    <Caption style = {{fontSize: 13, color: "#ffffff"}}>{elem.post.likes} like</Caption>
                </TouchableOpacity> }
                { elem.post.likes == 0 && <TouchableOpacity style={{alignSelf: 'flex-start'}}>
                    <Caption style = {{fontSize: 13, color: "#ffffff"}}>{elem.post.likes} likes</Caption>
                </TouchableOpacity> }
            </View>
            <View style = {{flexDirection: "row", marginTop: 5, marginBottom: 5}}>
                <TouchableOpacity onPress = {toUser}>
                    <Text style = {{fontSize: 13, fontWeight: "600", color: "#fff"}}>{elem.user.username}</Text>
                </TouchableOpacity>
                <Text style = {{color: "white", marginLeft: 15, alignSelf: 'center'}}>{elem.post.caption}</Text>
            </View>
        </View>
    );
};

export default function UserProfile( {navigation, route: {params}} ) {
    if (params) {
    const {ipString} = React.useContext( EnvContext );
    const {user} = React.useContext( UserContext );
    const {id} = params;
    const [searchedUser, setSearchedUser] = useState();
    const [isFollowed, setIsFollowed] = useState( Boolean );
    const [noFollowers, setNoFollowers] = useState(0);
    const [data, setData] = useState( [] );
    const [underline, setUnderline] = useState(0);
    const {height, width} = useWindowDimensions();
    const [pfpSize, setPfpSize] = useState(100);
    const [textSize, setTextSize] = useState(20);
    
    window.addEventListener("resize", ()=>{
        if ( window.innerHeight < 800 ) {
            setPfpSize(70);
            setTextSize(18);
        }
        else {
            setPfpSize(100);
            setTextSize(20);
        }
    });

    useEffect(() => {
        if ( height < 800 ) {
            setPfpSize(70);
            setTextSize(18);
        }
        else {
            setPfpSize(100);
            setTextSize(20);
        }
        getInfo();
        setUnderline( 0 );
    },[id]);

    useEffect(()=>{
        if ( searchedUser ) {
            setData([]);
            checkFollow();
            getPosts();
        }
    },[searchedUser]);

    const getInfo = async() => {
        
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {userId: id} )
        };

        await fetch( ipString + "api/user/getUserData", options )
        .then((res) => res.json())
        .then((res) => {setSearchedUser(res);setNoFollowers(res.noFollowers);});
    };

    const getPosts = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, user: searchedUser} )
        };
    
        await fetch( ipString + "api/user/getPosts", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    const getGigs = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, user: searchedUser} )
        };
    
        await fetch( ipString + "api/user/getGigs", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    const like = async( elem ) => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, postId: elem.post._id, noLikes: elem.post.likes} )
        };
    
        await fetch( ipString + "api/user/like", options )
        .then((res) => res.text())
        .then((res) => alert(res));
        setTimeout( () => refresh( elem, 1 ), 10 );
    };

    const dislike = async( elem ) => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, postId: elem.post._id, noLikes: elem.post.likes} )
        };
    
        await fetch( ipString + "api/user/dislike", options )
        .then((res) => res.text())
        .then((res) => alert(res));
        setTimeout( () => refresh( elem, -1 ), 10 );
    };

    const refresh = ( elem, sign ) => {
        elem.isLiked = !elem.isLiked;
        elem.post.likes += sign;
        setData( [...data] );
    };

    const follow = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, followedUserId: searchedUser._id} )
        };
    
        await fetch( ipString + "api/user/follow", options )
        .then((res) => res.text())
        .then((res) => {setIsFollowed(true);setNoFollowers(noFollowers + 1);});
    };

    const checkFollow = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
        
        //console.log(searchedUser);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, followedUserId: searchedUser._id} )
        };
        
        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

        await fetch( ipString + "api/user/checkFollow", options )
        .then((res) => res.json())
        .then((res) => setIsFollowed(res));
    };

    const unfollow = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, followedUserId: searchedUser._id} )
        };
    
        await fetch( ipString + "api/user/unfollow", options )
        .then((res) => res.text())
        .then((res) => {setIsFollowed(false);setNoFollowers(noFollowers - 1);});
    };

    const deletePost = async(elem) => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, userId: elem.post.userId, postId: elem.post._id} )
        };
    
        await fetch( ipString + "api/user/deletePost", options )
        .then((res) => res.text())
        .then((res) => {if(res)alert(res);});

        getPosts();
    };
    
    const deleteGig = async(elem) => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, userId: elem.offer.userId, id: elem.offer._id} )
        };
    
        await fetch( ipString + "api/user/deleteOffer", options )
        .then((res) => res.text())
        .then((res) => {if(res)alert(res);});

        getGigs();
    };

    //console.log( isFollowed );

    const linkTo = useLinkTo();

    const renderItem = ( {item} ) => {
        const toUser = () => {
            linkTo( "/profile/" + item.user._id );
        };
        const toLikers = () => {
            linkTo( "/likes/" + item.post._id );
        };
        const toComments = () => {
            navigation.navigate( "Comments", {post: item} );
        };
        return (
            <Item
                toUser = {toUser}
                elem = {item}
                toLikers = {toLikers}
                like = {like}
                dislike = {dislike}
                toComments = {toComments}
                refresh = {refresh}
                deletePost = {deletePost}
            />
        );
    };

    const renderGig = ( {item} ) => {
        const toUser = () => {
            linkTo( "/profile/" + item.user._id );
        };
        return (
            <Gig
                toUser = {toUser}
                elem = {item}
                deleteGig = {deleteGig}
            />
        );
    };

    return (
        <View style = { { flex: 1, backgroundColor: "#111" } }>
            <View style = {{justifyContent: "space-between", flexDirection: "column", alignItems: 'center'}}>
                <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}} style = {{marginLeft: 20, marginTop: 6, alignSelf: 'flex-start'}}>
                    <Octicons name="three-bars" size={24} color="#fff"/>
                </TouchableOpacity>
                <View style = { styles.ViewContainer }>
                    { searchedUser && <View style = { styles.ProfileBanner }>
                        <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + searchedUser.image}} size = {pfpSize} />
                        <View style = {{alignContent: "center"}}>
                            <Title style = {{fontSize: textSize, fontWeight: "bold", alignSelf: "center", color: "#fff"}}>{searchedUser.name} {searchedUser.surname}</Title>
                            <Caption style = {{fontSize: textSize / 4 * 3, alignSelf: "center", color: "#fff"}}>@{searchedUser.username}</Caption>
                        </View>
                        <View style = { { flexDirection: "row", justifyContent: "center" } }>
                            { noFollowers > 1 && <TouchableOpacity onPress = {() => { linkTo( "/followers/" + id ); }}>
                                <Caption style = {{margin: 5, fontSize: textSize / 4 * 3, color: "#fff"}}>{noFollowers} followers</Caption>
                            </TouchableOpacity> }
                            { noFollowers == 1 && <TouchableOpacity onPress = {() => { linkTo( "/followers/" + id ); }}>
                                <Caption style = {{margin: 5, fontSize: textSize / 4 * 3, color: "#fff"}}>{noFollowers} follower</Caption>
                            </TouchableOpacity> }
                            { noFollowers == 0 && <TouchableOpacity>
                                <Caption style = {{margin: 5, fontSize: textSize / 4 * 3, color: "#fff"}}>{noFollowers} followers</Caption>
                            </TouchableOpacity> }
                            <Caption style = {{margin: 5, fontSize: textSize / 4 * 3, color: "#fff"}}>|</Caption>
                            { searchedUser.noFollowing > 0 && <TouchableOpacity onPress = {() => { linkTo( "/following/" + id ); }}>
                                <Caption style = {{margin: 5, fontSize: textSize / 4 * 3, color: "#fff"}}>{searchedUser.noFollowing} following</Caption>
                            </TouchableOpacity> }
                            { searchedUser.noFollowing == 0 && <TouchableOpacity>
                                <Caption style = {{margin: 5, fontSize: textSize / 4 * 3, color: "#fff"}}>{searchedUser.noFollowing} following</Caption>
                            </TouchableOpacity> }
                        </View>
                        <View style = {{flexDirection: "row", justifyContent: "center"}}>
                            { user._id == searchedUser._id && <TouchableOpacity style = { styles.TouchableOpacity } onPress = {() => { navigation.navigate( "MakeAPost" ) }} >
                                <Text style = {{fontSize: textSize / 4 * 3,fontWeight: "bold",color: "#fff",margin: 7,alignSelf: "center",justifyContent: "center"}}>Make a post</Text>
                            </TouchableOpacity> }
                            { user._id == searchedUser._id && <TouchableOpacity style = { styles.TouchableOpacity } onPress = {() => { navigation.navigate( "MakeGig" ) }}>
                                <Text style = {{fontSize: textSize / 4 * 3,fontWeight: "bold",color: "#fff",margin: 7,alignSelf: "center",justifyContent: "center"}}>Make a gig</Text>
                            </TouchableOpacity> }
                            { user._id != searchedUser._id && !isFollowed && 
                            <TouchableOpacity style = { styles.TouchableOpacity } onPress = { async() => { follow(); checkFollow(); } }>
                                <Text style = {{fontSize: textSize / 4 * 3,fontWeight: "bold",color: "#fff",margin: 7,alignSelf: "center",justifyContent: "center"}}>+ Follow</Text>
                            </TouchableOpacity> }
                            { user._id != searchedUser._id && isFollowed && 
                            <TouchableOpacity style = { styles.TouchableOpacity } onPress = { async() => { unfollow(); checkFollow(); } }>
                                <Text style = {{fontSize: textSize / 4 * 3,fontWeight: "bold",color: "#fff",margin: 7,alignSelf: "center",justifyContent: "center"}}>- Unfollow</Text>
                            </TouchableOpacity> }
                            { user._id != searchedUser._id && 
                            <TouchableOpacity style = { styles.TouchableOpacity } onPress = { () => {linkTo( "/chat/" + searchedUser._id )} }>
                                <Text style = {{fontSize: textSize / 4 * 3,fontWeight: "bold",color: "#fff",margin: 7,alignSelf: "center",justifyContent: "center"}}>Chat</Text>
                            </TouchableOpacity> }
                        </View>
                        <View style = {{marginTop: 10}}>
                            { underline == 0 && 
                            <View style = {{flexDirection: "row", justifyContent: "space-evenly", paddingBottom: 10}}>
                                <TouchableOpacity style={styles.Focused} onPress = {() => {setData([]); getPosts(); setUnderline(0);}}>
                                    <Caption style = {{fontSize: 15, color: "#fff"}}>Posts</Caption>
                                </TouchableOpacity>
                                <TouchableOpacity onPress = {() => {setData([]); getGigs(); setUnderline(1);}}>
                                    <Caption style = {{fontSize: 15, color: "#fff"}}>Gigs</Caption>
                                </TouchableOpacity>
                            </View>}
                            { underline == 1 && 
                            <View style = {{flexDirection: "row", justifyContent: "space-evenly", paddingBottom: 10}}>
                                <TouchableOpacity onPress = {() => {setData([]); getPosts(); setUnderline(0);}}>
                                    <Caption style = {{fontSize: 15, color: "#fff"}}>Posts</Caption>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.Focused} onPress = {() => {setData([]); getGigs(); setUnderline(1);}}>
                                    <Caption style = {{fontSize: 15, color: "#fff"}}>Gigs</Caption>
                                </TouchableOpacity>
                            </View>}
                        </View>
                    </View>}
                </View>
                <View style = {{width: 63}}/>
            </View>
            {underline == 0 && data.length > 0 && data[0].post && 
                <FlatList 
                    data = {data}
                    extraData = {data}
                    renderItem = {renderItem}
                    keyExtractor = {item => item.post._id}
                    scrollEnabled = {true}/>}
            {underline == 1 && data.length > 0 && data[0].offer &&
                <FlatList 
                    data = {data}
                    extraData = {data}
                    renderItem = {renderGig}
                    keyExtractor = {item => item.offer._id}
                    scrollEnabled = {true} />}
        </View>
    );
    }
}

const styles = StyleSheet.create({
    Focused: {borderBottomColor: 'rgba(255,255,255,0.8)', borderBottomWidth: 1},
    ProfileBanner: {
        //flex: 1,
        // paddingTop: 50,
        backgroundColor: "#111",
        justifyContent: "center"
    },
    TouchableOpacity: {
        // width: "fit-content",
        width: 120,
        borderRadius: 5,
        alignContent: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        // backgroundColor: "#9c9c9c",
        margin: 5
    },
    ViewContainer: {
        marginTop: 5,
        //flex: 1,
        //justifyContent: "center",
        // alignItems: "center",
        flexDirection: "row"
        //backgroundColor: "#111",
        //margin: 5,
        // width:'100%'
    },
    PostImage : {
        resizeMode: "center",
        width: 350,
        height: 350
    },
    AvatarImage: {
        alignSelf: "center",
        margin: 5
    }
});
