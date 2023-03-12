const express = require('express');
const router = express.Router();
const passport = require('passport');


const postController = require('../controllers/posts_controller');
//checks if the user is signed in before allowing him to make a post
router.post('/create',passport.checkAuthentication,postController.create);

module.exports = router;