const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')

const User = require('../../models/User')

// @route  GET api/auth
// @desc   Test Route
// @access Protected
router.get('/', auth, (req, res) => {
  try {
    //get user info from db using decoded token that contains the id excluding password
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
