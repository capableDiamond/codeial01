//*********Route index for v1 API Routes**********//

const express = require('express');

const router = express.Router();

router.use('/posts',require('./posts'));
router.use('/users',require('./users'));

module.exports = router;