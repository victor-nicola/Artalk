const router = require( "express" ).Router();
const User = require( "../models/user" );
const Followers = require( "../models/followers" );
const Post = require( "../models/post" );
const Likes = require( "../models/likes" );
const Message = require( "../models/message" );
const jwt = require( "jsonwebtoken" );
const fs = require("fs");
const Offer = require("../models/offer");

router.post( "/getSearchedUsers", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    var regex = new RegExp( "^" + req.body.searchedString, "i" );
    const userList = await User.find( {username: regex}, projection );
    res.send( userList );
});

router.post( "/getPosts", async(req, res) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const posts = await Post.find( {userId: req.body.user._id} ).sort({date: -1});
    var ans = [];
    for ( var x = 0; x < posts.length; x ++ ) {
        ans.push( {user: req.body.user, post: posts[x]} );
    }
    return res.send( ans );
});

router.post( "/getFeed", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    const user = await User.findById( { _id: decodedToken._id }, { noFollowing: 1 } );
    var followedUsers = await Followers.find( { followerId: decodedToken._id } );
    var feed = [];
    for ( var i = 0; i < user.noFollowing; i ++ ) {
        followedUsers[i] = await User.findById( { _id: followedUsers[i].followedId }, { noFollowers: 1 } );
    }
    followedUsers.sort( ( a, b ) => {
        if ( a.noFollowers < b.noFollowers )
            return 1;
        else if ( a.noFollowers > b.noFollowers )
            return -1;
        return 0;
    });
    for ( var i = 0; i < user.noFollowing; i ++ ) {
        feed[i] = await Post.find( { userId: followedUsers[i]._id } );
        
        feed[i].sort( ( a, b ) => { 
            if ( a.likes > b.likes )
                return -1;
            else if ( a.likes < b.likes )
                return 1;
            return 0;
        });
    }

    var ans = [], cnt = 0;
    for ( var i = 0; i < user.noFollowing; i ++ ) {
        for ( var j = 0; j < feed[i].length; j ++ ) {
            const isLiked = await Likes.findOne( {userId: decodedToken._id, postId: feed[i][j]._id} );
            var aux = false;
            if ( isLiked )
                aux = true;
            ans[cnt] = { post: feed[i][j], user: await User.findById( { _id: feed[i][j].userId }, projection ), isLiked: aux };
            cnt ++;
        }
    }

    res.send( ans );
});

router.post( "/getFollowers", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    const followersList = await Followers.find( { followedId: req.body.userId }, { followerId: 1 } );
    const userList = [];
    for ( var i = 0; i < followersList.length; i ++ ) {
        userList[i] = await User.findById( { _id: followersList[i].followerId }, projection );
    }
    res.send( userList );
});

router.post( "/getFollowedUsers", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    const followingList = await Followers.find( { followerId: req.body.userId }, { followedId: 1 } );
    const userList = [];
    for ( var i = 0; i < followingList.length; i ++ ) {
        userList[i] = await User.findById( { _id: followingList[i].followedId }, projection );
    }
    res.send( userList );
});

router.post( "/getUserData", async( req, res ) => {
    var id;
    if ( req.body.token )
        id = jwt.verify( req.body.token, process.env.TOKEN_SECRET )._id;
    else
        id = req.body.userId;
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    const user = await User.findById( { _id: id }, projection );
    if ( !user )
        return res.status( 400 ).send( "User not found!" );
    res.send( user );
});

router.post( "/getInbox", async(req, res) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const received = await Message.find( { receiverId: decodedToken._id }, { senderId: 1, text: 1, date: 1 } );
    const sent = await Message.find( { senderId: decodedToken._id }, { receiverId: 1, text: 1, date: 1 } );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    var ans = [];
    var map = new Map();
    var messages = received.concat( sent );
    
    messages.sort( (a, b) => {
        if ( a.date < b.date )
            return 1;
        else if ( a.date > b.date )
            return -1;
        return 0;
    });

    for ( var x = 0; x < messages.length; x ++ ) {
        if ( messages[x].senderId != undefined ) {
            if ( map.get( messages[x].senderId ) == undefined ) {
                var user = await User.findById( { _id: messages[x].senderId }, projection );
                map.set( messages[x].senderId, 1 );
                ans.push( { user: user, text: messages[x].text } );
            }
        }
        else if ( messages[x].receiverId != undefined ) {
            if ( map.get( messages[x].receiverId ) == undefined ) {
                var user = await User.findById( { _id: messages[x].receiverId }, projection );
                map.set( messages[x].receiverId, 1 );
                ans.push( { user: user, text: messages[x].text } );
            }
        }
    }

    return res.send( ans );
});

router.post( "/getOffersFeed", async(req, res) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    const user = await User.findById( { _id: decodedToken._id }, { noFollowing: 1 } );
    var followedUsers = await Followers.find( { followerId: decodedToken._id } );
    var feed = [];
    for ( var i = 0; i < user.noFollowing; i ++ ) {
        followedUsers[i] = await User.findById( { _id: followedUsers[i].followedId }, { noFollowers: 1 } );
    }
    followedUsers.sort( ( a, b ) => {
        if ( a.noFollowers < b.noFollowers )
            return 1;
        else if ( a.noFollowers > b.noFollowers )
            return -1;
        return 0;
    });
    for ( var i = 0; i < user.noFollowing; i ++ ) {
        if ( req.body.type != "" )
            feed[i] = await Offer.find( { userId: followedUsers[i]._id, type: req.body.type } );
        else
            feed[i] = await Offer.find( { userId: followedUsers[i]._id } );

        feed[i].sort( ( a, b ) => { 
            if ( a.date > b.date )
                return -1;
            else if ( a.date < b.date )
                return 1;
            return 0;
        });
    }

    var feedFollowing = [];
    var map = new Map();
    for ( var i = 0; i < user.noFollowing; i ++ ) {
        for ( var j = 0; j < feed[i].length; j ++ ) {
            feedFollowing.push({ offer: feed[i][j], user: await User.findById( { _id: feed[i][j].userId }, projection ) });
            map.set( feed[i][j]._id.toString(), 1 );
        }
    }

    // console.log(feed);

    var feedAllAux;
    if ( req.body.type != "" )
        feedAllAux = await Offer.find({type: req.body.type}).sort({date: -1});
    else
        feedAllAux = await Offer.find().sort({date: -1});

    var feedAll = [];
    for ( var x = 0; x < feedAllAux.length; x ++ ) {
        if ( map.get( feedAllAux[x]._id.toString() ) == undefined && feedAllAux[x].userId != decodedToken._id ) {
            feedAll.push({ offer: feedAllAux[x], user: await User.findById( { _id: feedAllAux[x].userId }, projection ) });
        }
    }

    const ans = feedFollowing.concat( feedAll );

    res.send( ans );
});

router.post( "/getGigs", async(req, res) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const gigs = await Offer.find( {userId: req.body.user._id} ).sort({date: -1});
    var ans = [];
    for ( var x = 0; x < gigs.length; x ++ ) {
        ans.push( {user: req.body.user, offer: gigs[x]} );
    }
    return res.send( ans );
});

module.exports = router;