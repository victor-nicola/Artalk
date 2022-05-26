const mongoose = require( "mongoose" );

const followSchema = new mongoose.Schema({ 
    followerId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    followedId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model( "Followers", followSchema );