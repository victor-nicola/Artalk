const router = require( "express" ).Router();
const User = require( "../models/user" );
const Followers = require( "../models/followers" );
const Post = require( "../models/post" );
const Likes = require( "../models/likes" );
const jwt = require( "jsonwebtoken" );

router.post( "/getSearchedUsers", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    var regex = new RegExp( "^" + req.body.searchedString, "i" );
    const userList = await User.find( {username: regex}, projection );
    res.send( userList );
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
            return -1;
        else if ( a.noFollowers > b.noFollowers )
            return 1;
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
    for ( var i = 0; i < user.noFollowing; i ++ )
        for ( var j = 0; j < feed[i].length; j ++ ) {
            const isLiked = await Likes.findOne( {userId: decodedToken._id, postId: feed[i][j]._id} );
            var aux = false;
            if ( isLiked )
                aux = true;
            ans[cnt] = { post: feed[i][j], user: await User.findById( { _id: feed[i][j].userId }, projection ), isLiked: aux };
            cnt ++;
        }

    res.send( ans );
});

router.post( "/getFollowers", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    const followersList = await Followers.find( { followedId: req.body.user._id }, { followerId: 1 } );
    const userList = [];
    for ( var i = 0; i < req.body.user.noFollowers; i ++ ) {
        userList[i] = await User.findById( { _id: followersList[i].followerId }, projection );
    }
    res.send( userList );
});

router.post( "/getFollowedUsers", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    const followingList = await Followers.find( { followerId: req.body.user._id }, { followedId: 1 } );
    const userList = [];
    for ( var i = 0; i < req.body.user.noFollowing; i ++ ) {
        userList[i] = await User.findById( { _id: followingList[i].followedId }, projection );
    }
    res.send( userList );
});

router.post( "/getUserData", async( req, res ) => {
    var decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    const user = await User.findById( { _id: decodedToken._id }, projection );
    if ( !user )
        return res.status( 400 ).send( "User not found!" );
    res.send( user );
});

module.exports = router;