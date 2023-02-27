const router = require( "express" ).Router();
const jwt = require( "jsonwebtoken" );
const User = require( "../models/user" );
const Message = require( "../models/message" );

router.post( "/sendMessage", async(req, res) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const message = new Message({
        senderId: decodedToken._id,
        receiverId: req.body.userId,
        text: req.body.text,
        isRead: false
    });

    try {
        await message.save();
        res.send( "Sent" );
    } catch (error) {
        console.log(error);
    }
});

router.post( "/deleteMessage", async(req, res) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    if ( decodedToken._id != req.body.senderId )
        return res.send("Error!");

    try {
        await Message.deleteOne( { _id: req.body.messageId } );
        res.send("Deleted");
    } catch( error ) {
        console.log(error);
    }
});

router.post( "/getUser", async( req, res ) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const user = await User.findById({_id: req.body.userId});
    res.send( user );
});

router.post( "/getMessages", async(req, res) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    const projection = { name: 1, surname: 1, username: 1, image: 1, noFollowers: 1, noFollowing: 1 };
    const sentMessages = await Message.find( { senderId: decodedToken._id, receiverId: req.body.senderId } );
    const receivedMessages = await Message.find( { receiverId: decodedToken._id, senderId: req.body.senderId } );
    const user = await User.findById( {_id: decodedToken._id}, projection );
    const sender = await User.findById( {_id: req.body.senderId}, projection );
    var ans = [];
    for ( var x = 0; x < sentMessages.length; x ++ ) {
        ans.push( {user: user, message: sentMessages[x]} );
    }
    for ( var x = 0; x < receivedMessages.length; x ++ ) {
        ans.push( {user: sender, message: receivedMessages[x]} );
    }
    ans.sort( (a, b) => {
        if ( a.message.date < b.message.date )
            return 1;
        else if ( a.message.date > b.message.date )
            return -1;
        return 0;
    });

    return res.send( ans );
});

module.exports = router;