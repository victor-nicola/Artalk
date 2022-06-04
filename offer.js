const mongoose = require( "mongoose" );

const offerSchema = new mongoose.Schema({ 
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model( "Offer", offerSchema );