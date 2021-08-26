const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')
const { check, validationResult } = require('express-validator/check')
const auth = require('../../middleware/auth')

const User = require('../../models/User')

// @route  POST api/auth
// @desc   Authenticate user and get token
// @access Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      // See if user exists in MongoDB database
      let user = await User.findOne({ email })

      if (user) {
        // Use this data structure for error return to be consistent with validation middleware
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] })
      }

      const correctPassword = await bcrypt.compare(password, user.password)

      if (!correctPassword) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] })
      }

      // Return jsonwebtoken
      const payload = { user: { id: user.id } }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route  GET api/auth
// @desc   user authenication
// @access Protected
router.get('/', auth, async (req, res) => {
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
