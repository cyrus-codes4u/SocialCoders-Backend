const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator/check')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route  GET api/profile/me
// @desc   Get current users profile
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    // Populating avatar through two methods
    //1. finding a profile of model Profile with the user id received in the token of the request
    //2. Use populate method to add name and avatar fields from associated user
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    )

    if (!profile) {
      return res
        .status(401)
        .json({ msg: 'There is no profile associated with this user' })
    }
    res.status(200).json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route  Post api/profile
// @desc   Create new profile for a user
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      linkedin,
      youtube,
      facebook,
      instagram,
      twitter,
    } = req.body

    // build profile object
    const profileFields = {}
    profileFields.user = req.user.id
    profileFields.status = status
    profileFields.skills = skills.split(',').map((skill) => skill.trim())
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (bio) profileFields.bio = bio
    if (githubusername) profileFields.githubusername = githubusername
    if (location) profileFields.location = location

    profileFields.social = {}

    if (twitter) profileFields.social.twitter = twitter
    if (linkedin) profileFields.social.linkedin = linkedin
    if (facebook) profileFields.social.facebook = facebook
    if (instagram) profileFields.social.instagram = instagram
    if (youtube) profileFields.social.youtube = youtube

    try {
      let profile = await Profile.findOne({ user: req.user.id })

      if (profile) {
        // Update existing profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
        return res.status(204).json(profile)
      }

      //Create
      profile = new Profile(profileFields)
      await profile.save()
      res.status(201).json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

module.exports = router
