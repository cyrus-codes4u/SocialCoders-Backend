const express = require('express')
const router = express.Router()

// @route  GET api/profile
// @desc   Test Route
// @access Publis
router.get('/', (req, res) => res.send('Profile router response'))

module.exports = router
