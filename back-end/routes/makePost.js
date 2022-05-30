const router = require( "express" ).Router();
const jwt = require( "jsonwebtoken" );
const Post = require( "../models/post" );
const User = require( "../models/user" );
const Comment = require( "../models/comment" );
const Likes = require( "../models/likes" );
const multer = require( "multer" );
var upload = multer( { dest: "assets/postPics/" } );
const generateUuid = require('@supercharge/strings');

router.post( "/makePost", upload.single( "image" ), async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const user = await User.findById( { _id: decodedToken._id }, { noPosts: 1 });
    
    const array = req.body.image.split( "," );
    const imgFormat = array[0].substring( 11, array[0].search( new RegExp(';') ) );
    const base64Data = array[1];
    const uuid = generateUuid.uuid(); 
    const filePath = "./assets/postPics/" + uuid + "." + imgFormat;
    if ( !base64Data )
        return res.status( 400 ).send( "File does not exist!" );

    const post = new Post({
        userId: decodedToken._id,
        image: filePath,
        caption: req.body.caption,
        likes: 0,
        noComments: 0
    });
    try {
        await post.save();
        await User.updateOne( { _id: decodedToken._id }, { noPosts: user.noPosts + 1 } );
        require("fs").writeFile(filePath, base64Data, 'base64', function(err) {
            console.log("ERROR: " + err);
        });
        res.send( "Posted" );
    } catch (error) {
        console.log(error);
    }
});

router.post( "/deletePost", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const user = await User.findById( { _id: req.body.post.userId }, { noPosts: 1 } );
    await User.updateOne( { _id: user._id }, { noPosts: user.noPosts - 1 } );
    await Post.deleteOne( { _id: req.body.post._id } );
    res.send( "Deleted!" );
});

router.post( "/like", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const liked = await Likes.findOne( { userId: decodedToken._id, postId: req.body.post._id } );
    if ( liked )
        return res.send( "Already liked" );

    const like = new Likes({
        userId: decodedToken._id,
        postId: req.body.post._id
    });
    try {
        await like.save();
        await Post.updateOne( { _id: req.body.post._id }, { likes: req.body.post.likes + 1 } );
        res.send( "Liked" );
    } catch (error) {
        console.log(error);
    }
});

router.post( "/getLikers", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    const likersList = await Likes.find( { postId: req.body.post._id }, { userId: 1 } );
    const userList = [];
    for ( var i = 0; i < req.body.post.likes; i ++ )
        userList[i] = await User.findById( { _id: likersList[i].userId }, projection );
    res.send( userList );
});

router.post( "/dislike", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const liked = await Likes.findOne( { userId: decodedToken._id, postId: req.body.post._id } );
    if ( !liked )
        return res.send( "Not liked" );

    await Likes.deleteOne( { userId: decodedToken._id, postId: req.body.post._id } );
    
    await Post.updateOne( { _id: req.body.post._id }, { likes: req.body.post.likes - 1 } );
    res.send( "Disliked" );
});

router.post( "/getComments", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    var comments = await Comment.find( { postId: req.body.post.post._id, fatherCommentId: { $exists: false } } );
    var ans = [], cnt = 0;
    for ( var i = 0; i < comments.length; i ++ ) {
        const user = await User.findById( { _id: comments[i].userId }, projection );
        ans[cnt] = { comment: comments[i], user: user };
        cnt ++;
    }
    res.send( ans );
});

var replies = [];
async function getAllChildren( fatherCommentId ) {
    const children = await Comment.find( { fatherCommentId: fatherCommentId } );
    if ( children.length == 0 )
        return;
    const fatherComment = await Comment.findById( { _id: fatherCommentId } );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    for ( var i = 0; i < children.length; i ++ ) {
        const user = await User.findById( { _id: children[i].userId }, projection );
        const userRepliedTo = await User.findById( { _id: fatherComment.userId }, projection );
        replies.push({ comment: children[i], user: user, userRepliedTo: userRepliedTo });
        await getAllChildren( children[i]._id );
    }
}

router.post( "/getReplies", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    const comms = await Comment.find( { fatherCommentId: req.body.comment._id } );
    for ( var i = 0; i < comms.length; i ++ ) {
        const user = await User.findById( { _id: comms[i].userId }, projection );
        const userRepliedTo = await User.findById( { _id: req.body.comment.userId }, projection );;
        replies.push({ comment: comms[i], user: user, userRepliedTo: userRepliedTo });
        await getAllChildren( comms[i]._id );
    }
    res.send( replies.splice( 0, replies.length ) );
});

router.post( "/comment", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const post = await Post.findById( { _id: req.body.postId } );
    const user = await User.findById( { _id: decodedToken._id }, { name: 1 } );
    const comm = new Comment({
        userId: user._id,
        postId: req.body.postId,
        text: req.body.text,
        noReplies: 0,
        noLikes: 0
    });
    try {
        await comm.save();
        res.send( "Posted" );
    } catch (error) {
        console.log(error);
    }
    await Post.updateOne( { _id: req.body.postId }, { noComments: post.noComments + 1 } );
});

async function deleteAllChildren( comment, post ) {
    var children = await Comment.find( { fatherCommentId: comment._id } );
    for ( var i = 0; i < comment.noReplies; i ++ ) {
        await Comment.deleteOne( { _id: children[i]._id } );
        await Post.updateOne( { _id: post._id }, { noComments: post.noComments - 1 } );
        post.noComments --;
        await deleteAllChildren( children[i], post );
    }
}

router.post( "/deleteComment", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    if ( decodedToken._id != req.body.userId )
        return res.send("Error!");

    await Comment.deleteOne( { _id: req.body.comment._id } );

    const post = await Post.findById( { _id: req.body.comment.postId } );
    await Post.updateOne( { _id: post._id }, { noComments: post.noComments - 1 } );
    post.noComments --;

    await deleteAllChildren( req.body.comment, post );

    if ( req.body.comment.fatherCommentId != undefined ) {
        const fatherComment = await Comment.findById( { _id: req.body.comment.fatherCommentId } );
        await Comment.updateOne( { _id: fatherComment._id }, { noReplies: fatherComment.noReplies - 1 } );
    }

    res.send( "Comment deleted!" );
});

router.post( "/replyToComment", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const post = await Post.findById( { _id: req.body.postId } );
    const fathercomm = await Comment.findById( { _id: req.body.fatherCommentId } );
    const comm = new Comment({
        userId: decodedToken._id,
        postId: req.body.postId,
        text: req.body.text,
        fatherCommentId: req.body.fatherCommentId,
        noReplies: 0,
        noLikes: 0
    });

    await Post.updateOne( { _id: req.body.postId }, { noComments: post.noComments + 1 } );
    await Comment.updateOne( { _id: fathercomm._id }, { noReplies: fathercomm.noReplies + 1 } );

    try {
        await comm.save();
        res.send( "Posted" );
    } catch (error) {
        console.log(error);
    }

    // console.log( req.body.text );
});

module.exports = router;