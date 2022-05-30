const mongoose = require( "mongoose" );

const messageSchema = new mongoose.Schema({ 
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model( "Message", messageSchema );