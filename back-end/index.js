const { request, response } = require("express");
const express = require( "express" );
const app = express();
const mongoose = require( "mongoose" );
const auth = require( "./routes/auth" );
const dotenv = require( "dotenv" );
const userData = require( "./routes/userData" );
const follow = require( "./routes/follow" );
const makePost = require( "./routes/makePost" );
const cors = require("cors"); // for web requests

dotenv.config();

// conexiune cu baza de date
mongoose.connect( process.env.DB_CONNECT,
{ useNewUrlParser: true, useUnifiedTopology: true } )
.then( () => console.log( "connected to database" ) )
.catch( err => console.log( err ) );

app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );

const whitelist = ["http://localhost:19006"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
// const corsOptions = {
//     origin: "http://localhost:19006"
// }
app.use(cors(corsOptions))

// route
app.use( "/api/user", auth );
app.use( "/api/user", userData );
app.use( "/images", express.static( __dirname ) );
app.use( "/api/user", follow );
app.use( "/api/user", makePost );

app.listen( 50000, () => console.log( "server up and running" ) );