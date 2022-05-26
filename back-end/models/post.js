const mongoose = require( "mongoose" );

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    caption: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },
    noComments: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model( "Posts", postSchema );