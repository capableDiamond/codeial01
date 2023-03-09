const express = require('express');

const router = express.Router();

//importing the file having the home controller
const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);
router.use('/users',require('./users'));

//for any further routes, access from here
//router.use('/routerName',require('/routerFile'));

// Since this is the router that is imported in the main index file of the project we will make all other routes accessible via this file
module.exports = router;