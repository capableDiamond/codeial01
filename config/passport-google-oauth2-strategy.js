const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID:"50568899261-a73oe9to80f02ab034nh6v03h7l2iuk3.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL:"http://localhost:8000/users/auth/google/callback"
    },
    function(accessToken,refreshToken, profile, done){
        //find a user
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){console.log('Error in google-strategy-passport',err);return;}

            console.log(profile);

            if(user){
                //if found set this user as req.user
                return done(null,user);
            }else{
                //if not found, create the user and set it as req.user
                //sign up the user
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){console.log('Error in creating user in passport google strategy in config',err);return;}

                    return done(null,user);
                });
            }
        });
    }    
));

module.exports = passport;