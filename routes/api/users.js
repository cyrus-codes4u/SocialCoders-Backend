const express = require('express')
const router = express.Router()

// @route  GET api/users
// @desc   Test Route
// @access Publis
router.get('/', (req, res) => res.send('User router response'))

module.exports = router
