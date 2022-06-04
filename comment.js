const mongoose = require( "mongoose" );

const commentSchema = new mongoose.Schema({ 
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    noLikes: {
        type: Number,
        required: true
    },
    noReplies: {
        type: Number,
        required: true
    },
    fatherCommentId: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model( "Comment", commentSchema );