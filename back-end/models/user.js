const mongoose = require( "mongoose" );

const userSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true,
        min: 2,
        max: 30
    },
    surname: {
        type: String,
        required: true,
        min: 2,
        max: 30
    },
    username: {
        type: String,
        required: true,
        min: 2,
        max: 30
    },
    email: {
        type: String,
        required: true,
        min: 6, 
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    image: {
        type: String,
        //required: true
    },
    noFollowers: {
        type: Number,
        required: true
    },
    noFollowing: {
        type: Number,
        required: true
    },
    noPosts: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model( "User", userSchema );