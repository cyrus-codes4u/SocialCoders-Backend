const express = require('express')
const router = express.Router()

// @route  GET api/posts
// @desc   Test Route
// @access Publis
router.get('/', (req, res) => res.send('Post router response'))

module.exports = router
