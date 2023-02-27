const router = require( "express" ).Router();
const Offer = require( "../models/offer" );
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.post( "/makeOffer", async(req, res) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    if ( isNaN(req.body.price) || req.body.title.length > 80 || req.body.text.length > 1200 || req.body.type == "" )
        return res.send("Invalid gig");
    const offer = new Offer({
        userId: decodedToken._id,
        title: req.body.title,
        text: req.body.text,
        price: req.body.price,
        type: req.body.type
    });

    try {
        await offer.save();
        res.send( "Posted" );
    } catch(error) {
        console.log(error);
    }
});

router.post( "/deleteOffer", async(req, res) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
    if ( decodedToken._id != req.body.userId )
        return res.send( "Error" );
    try {
        await Offer.deleteOne( {_id: req.body.id} );
        res.send( "Deleted" );
    } catch(error) {
        console.log(error);
    }
});

module.exports = router;