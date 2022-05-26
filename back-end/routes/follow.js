const router = require( "express" ).Router();
const jwt = require( "jsonwebtoken" );
const Followers = require( "../models/followers" );
const User = require( "../models/user" );

router.post( "/follow", async( req, res ) => {
    var decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );

    const connectionExists = await User.findOne( { followerId: decodedToken._id, followedId: req.body.followedUserId } );
    if ( connectionExists )
        return res.send( "Already followed" );

    const follow = new Followers({
        followerId: decodedToken._id,
        followedId: req.body.followedUserId
    });
    try {
        await follow.save();

        const followedUser = await User.findById( { _id: req.body.followedUserId }, { noFollowers: 1 } );
        await User.updateOne( { _id: req.body.followedUserId }, { noFollowers: followedUser.noFollowers + 1 } );
        
        const user = await User.findById( { _id: decodedToken._id }, { noFollowing: 1 } );
        await User.updateOne( { _id: decodedToken._id }, { noFollowing: user.noFollowing + 1 } );
        res.send( "Followed" );
    } catch (error) {
        console.log(error);
    }
});

router.post( "/checkFollow", async( req, res ) => {
    var decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const isFollowed = await Followers.findOne( {followerId: decodedToken._id, followedId: req.body.followedUserId} );
    if ( isFollowed ) {
        res.send( true );
        return;
    }
    res.send( false );
});

router.post( "/unfollow", async( req, res ) => {
    var decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );

    const connectionExists = await User.findOne( { followerId: decodedToken._id, followedId: req.body.followedUserId } );
    if ( !connectionExists )
        return res.send( "Not followed" );
    
    const unfollowed = await Followers.deleteOne( {followerId: decodedToken._id, followedId: req.body.followedUserId} );
    // if ( !unfollowed )
    //     return res.status(404).send( "User not found!" );
    const unfollowedUser = await User.findById( { _id: req.body.followedUserId }, { noFollowers: 1 } );
    await User.updateOne( { _id: req.body.followedUserId }, { noFollowers: unfollowedUser.noFollowers - 1 } );

    const user = await User.findById( { _id: decodedToken._id }, { noFollowing: 1 } );
    await User.updateOne( { _id: decodedToken._id }, { noFollowing: user.noFollowing - 1 } );

    res.send( "Unfollowed!" );
});

module.exports = router;