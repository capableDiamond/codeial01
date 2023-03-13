const express = require('express');
const router = express.Router();
const passport = require('passport');


const commentsController = require('../controllers/comments_controller');
//checks if the user is signed in before allowing him to make a comment
router.post('/create',passport.checkAuthentication,commentsController.create);

module.exports = router;