const router = require( "express" ).Router();
const Offer = require( "../models/offer" );
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.post( "/makeOffer", async(req, res) => {
    const decodedToken = jwt.verify( req.body.token, process.env.TOKEN_SECRET );
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
    if ( decodedToken._id != req.body.offer.userId )
        return res.send( "Error" );
    try {
        await Offer.deleteOne( {_id: req.body.offer._id} );
        res.send( "Deleted" );
    } catch(error) {
        console.log(error);
    }
});

module.exports = router;