const express = require('express');

const router = express.Router();

//importing the file having the home controller
const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);

module.exports = router;