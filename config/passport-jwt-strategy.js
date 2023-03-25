const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'codeial'
}

//user is present in the jwt we are just checking if the user exists or not, for every request we are doing that
passport.use(new JWTStrategy(opts, function(jwtPayload,done){
    User.findById(jwtPayload._id,function(err,user){
        if(err){console.log('error in finding user from JWT',err);return;}

        if(user){
            return done(null,user); //if user is found return it
        }else{
            return done(null,false); //if user is not found return false
        }
    });
}));

module.exports = passport;