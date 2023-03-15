const express = require('express');
const router = express.Router();
const passport = require('passport');


const postController = require('../controllers/posts_controller');
//checks if the user is signed in before allowing him to make a post

router.post('/create',passport.checkAuthentication,postController.create);
//handling the delete route
//second check happens here third check happens at the controller level,1st check happens at the views level
//the key for the post id gets defined here instead of at the views level in the url
router.get('/destroy/:id',passport.checkAuthentication,postController.destroy);

module.exports = router;