const express = require('express')
const router = express.Router()

// @route  GET api/auth
// @desc   Test Route
// @access Publis
router.get('/', (req, res) => res.send('Auth router response'))

module.exports = router
