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

router.post( "/getPost", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const post = await Post.findById({_id: req.body.postId});
    const user = await User.findById({_id: post.userId});
    res.send( {post: post, user: user} );
});

router.post( "/deletePost", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const user = await User.findById( { _id: req.body.userId }, { noPosts: 1 } );
    if ( decodedToken._id != req.body.userId )
        return res.send( "Error" );
    try {
        await User.updateOne( { _id: user._id }, { noPosts: user.noPosts - 1 } );
        await Post.deleteOne( { _id: req.body.postId } );
        //res.send( "Deleted" );
    } catch(error) {
        console.log(error);
    }
    //res.send( "Deleted!" );
});

router.post( "/like", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const liked = await Likes.findOne( { userId: decodedToken._id, postId: req.body.postId } );
    if ( liked )
        return res.send( "Already liked" );

    const like = new Likes({
        userId: decodedToken._id,
        postId: req.body.postId
    });
    try {
        await like.save();
        await Post.updateOne( { _id: req.body.postId }, { likes: req.body.noLikes + 1 } );
        res.send( "Liked" );
    } catch (error) {
        console.log(error);
    }
});

router.post( "/dislike", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const liked = await Likes.findOne( { userId: decodedToken._id, postId: req.body.postId } );
    if ( !liked )
        return res.send( "Not liked" );

    await Likes.deleteOne( { userId: decodedToken._id, postId: req.body.postId } );
    
    await Post.updateOne( { _id: req.body.postId }, { likes: req.body.noLikes - 1 } );
    res.send( "Disliked" );
});

router.post( "/getLikers", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    const likersList = await Likes.find( { postId: req.body.postId }, { userId: 1 } );
    const userList = [];
    for ( var i = 0; i < likersList.length; i ++ )
        userList[i] = await User.findById( { _id: likersList[i].userId }, projection );
    res.send( userList );
});


router.post( "/getComments", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    var comments = await Comment.find( { postId: req.body.postId, fatherCommentId: { $exists: false } } );
    var ans = [], cnt = 0;
    for ( var i = 0; i < comments.length; i ++ ) {
        const user = await User.findById( { _id: comments[i].userId }, projection );
        ans[cnt] = { comment: comments[i], user: user };
        cnt ++;
    }
    // console.log(ans);
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
    const comms = await Comment.find( { fatherCommentId: req.body.commentId } );
    for ( var i = 0; i < comms.length; i ++ ) {
        const user = await User.findById( { _id: comms[i].userId }, projection );
        const userRepliedTo = await User.findById( { _id: req.body.userId }, projection );
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
        await Post.updateOne( { _id: req.body.postId }, { noComments: post.noComments + 1 } );
        res.send( comm );
    } catch (error) {
        console.log(error);
    }
});

async function deleteAllChildren( commentId ) {
    var children = await Comment.find( { fatherCommentId: commentId } );
    if ( children.length == 0 )
        return 0;
    var delta = 0;
    for ( var i = 0; i < children.length; i ++ ) {
        await Comment.deleteOne( { _id: children[i]._id } );
        delta += await deleteAllChildren( children[i]._id ) + 1;
    }
    return delta;
}

router.post( "/deleteComment", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    if ( decodedToken._id != req.body.userId )
        return res.send("Error");
    
    const comment = await Comment.findById({_id: req.body.commentId});
    await Comment.deleteOne( { _id: req.body.commentId } );

    const deleted = await deleteAllChildren(req.body.commentId);

    const post = await Post.findById( { _id: comment.postId } );
    await Post.updateOne( { _id: post._id }, { noComments: post.noComments - deleted - 1 } );
    post.noComments -= deleted + 1;

    await updateAllParents(req.body.fatherCommentId, -deleted - 1);

    res.send( "Succes" );
});

async function updateAllParents(fatherCommentId, val) {
    if ( fatherCommentId ) {
        const fatherComment = await Comment.findById( { _id: fatherCommentId } );
        if (fatherComment) {
            await Comment.updateOne( { _id: fatherComment._id }, { noReplies: fatherComment.noReplies + val } );
            if ( !fatherComment.fatherCommentId )
                return fatherComment._id;
            return await updateAllParents(fatherComment.fatherCommentId, val);
        }
    }
}

router.post( "/replyToComment", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const post = await Post.findById( { _id: req.body.postId } );
    const comm = new Comment({
        userId: decodedToken._id,
        postId: req.body.postId,
        text: req.body.text,
        fatherCommentId: req.body.fatherCommentId,
        noReplies: 0,
        noLikes: 0
    });

    try {
        await comm.save();
        var rootCommentId = await updateAllParents(comm.fatherCommentId, 1);
        await Post.updateOne( { _id: req.body.postId }, { noComments: post.noComments + 1 } );
        res.send( {comment: comm, rootCommentId: rootCommentId } );
    } catch (error) {
        console.log(error);
    }

    // console.log( req.body.text );
});

module.exports = router;