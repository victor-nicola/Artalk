const mongoose = require( "mongoose" );

const likeSchema = new mongoose.Schema({ 
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model( "Likes", likeSchema );