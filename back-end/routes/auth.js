const router = require( "express" ).Router();
const User = require( "../models/user" );
const { registerValidation } = require("../validation");
const jwt = require( "jsonwebtoken" );
const multer = require( "multer" );
var upload = multer( { dest: "assets/profilePics/" } );
const generateUuid = require('@supercharge/strings');
const fs = require("fs");
// var multiparty = require('multiparty');
// const { inspect } = require('node:util');
// const util = require('node:util');

router.post( "/login", async( req, res ) => {
    const isUsername = await User.findOne( { username: req.body.userString } );
    if ( !isUsername ) {
        const isEmail = await User.findOne( { email: req.body.userString } );
        if ( isEmail ) {
            //const validPassword = await bcrypt.compare( req.body.password, isEmail.password );
            if ( req.body.password == isEmail.password ) {
                const token = jwt.sign( { _id: isEmail._id }, process.env.TOKEN_SECRET );
                return res.send( token );
            }
            return res.status( 400 ).send( "Password is incorrect!" );
        }
        return res.status( 400 ).send( "Username or email is incorrect!" );
    }
    //const validPassword = await bcrypt.compare( req.body.password, isUsername.password );
    if ( req.body.password != isUsername.password )
        return res.status( 400 ).send( "Password is incorrect!" );

    const token = jwt.sign( { _id: isUsername._id }, process.env.TOKEN_SECRET );
    return res.send( token );
});

router.post( "/register", upload.single( "image" ), async( req, res ) => {
    req.body.username = req.body.username.toLowerCase();
    
    const usernameExists = await User.findOne( { username: req.body.username } );
    if ( usernameExists ) {
        return res.status( 400 ).send( "Username already exists!" );
    }
    
    const emailExists = await User.findOne( { email: req.body.email } );
    if ( emailExists ) {
        return res.status( 400 ).send( "Email already exists!" );
    }
    
    const { error } = registerValidation( req.body );
    if ( error ) {
        return res.status( 400 ).send( error.details[0].message );
    }

    var filePath, base64Data;
    if ( req.body.image ) {
        const array = req.body.image.split( "," );
        const imgFormat = array[0].substring( 11, array[0].search( new RegExp(';') ) );
        base64Data = array[1];
        const uuid = generateUuid.uuid(); 
        filePath = "./assets/profilePics/" + uuid + "." + imgFormat;
        if ( !base64Data )
            return res.status( 400 ).send( "File does not exist!" );
    }
    else {
        filePath = "./assets/profilePics/default.jpg";
    }
    
    const user = new User({ 
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        image: filePath,
        noFollowers: 0,
        noFollowing: 0,
        noPosts: 0
    });
    
    try {
        const savedUser = await user.save();
        fs.writeFile(filePath, base64Data, 'base64', function(err) {
            if ( err )
                console.log("ERROR: " + err);
        });
    }
    catch( err ) {
        res.status( 400 ).send( err );
    }
    return res.send();
});

module.exports = router;