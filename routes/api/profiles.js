const express = require('express')
const router = express.Router()

// @route  GET api/profiles
// @desc   Test Route
// @access Publis
router.get('/', (req, res) => res.send('Profiles router response'))

module.exports = router
