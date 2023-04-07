const express = require('express');
const passport = require('passport');

const router = express.Router();

const usersController = require('../controllers/users_controller');

router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.post('/update/:id',passport.checkAuthentication,usersController.update);

//Sign Up Sign In route
router.get('/sign-up',usersController.signUp);
router.get('/sign-in',usersController.signIn);

//Password reset routes
router.get('/forgot-password',usersController.forgotPassword);
router.post('/reset-password-initiate',usersController.resetPasswordInitiate);
router.get('/reset-password/:accessToken',usersController.resetPassword);
router.post('/reset-password',usersController.changePassword);

//Friendship Routes
router.get('/add-friend/:id',usersController.addFriend);
router.get('/remove-friend/:id',usersController.removeFriend);

//Create User route
router.post('/create',usersController.create);

//use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'}
    ), 
    usersController.createSession
);

//Log Out route
router.get('/sign-out',usersController.destroySession);

//url when user clicks on sign in via google
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));

//URL to which google calls back
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),usersController.createSession);


module.exports = router;