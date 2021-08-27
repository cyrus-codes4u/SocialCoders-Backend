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

// @route  POST api/profile
// @desc   Create new profile for a user
// @access Private
router('/')
  .post(
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
  // @route  GET api/profile
  // @desc   Fetch all profiles
  // @access Public
  .get(async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', ['name', 'avatar'])
      res.status(200).json(profiles)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  })
  // @route  DELETE api/profile
  // @desc   Delete profile, user and posts
  // @access Private
  .delete(auth, async (req, res) => {
    try {
      //Remove profile
      await Profile.findOneAndRemove({ user: req.user.id })
      // Remove User
      await user.findOneAndRemove({ _id: req.user.id })

      res.status(204).json({ msg: 'User deleted' })
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  })

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user id
// @access Public
router('/user/:user_id').get(async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar'])
    if (!profile) {
      res.status(401).json({ msg: 'No profile found' })
    }
    res.status(200).json(profile)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      res.status(401).json({ msg: 'No profile found' })
    }
    res.status(500).send('Server error')
  }
})

// @route  PUT api/profile/experience
// @desc   Add profile experience
// @access Private
router('/experience').put(
  [
    auth,
    [
      check('company', 'Company is required').not().isEmpty(),
      check('title', 'Title is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { from, to, company, title, location, description, current } =
      req.body

    const newExperience = {
      from,
      to,
      title,
      company,
      location,
      description,
      current,
    }
    try {
      const profile = Profile.findOne({ user: req.user.id })
      profile.experience.unshift(newExperience)
      await profile.save()
      res.status(201).json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete profile experience
// @access Private
router('/experience/:exp_id').delete(auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1)
    await profile.save()

    res.status(204).json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route  PUT api/profile/education
// @desc   Add profile education
// @access Private
router('/education').put(
  [
    auth,
    [
      check('school').not().isEmpty(),
      check('degree').not().isEmpty(),
      check('from').not().isEmpty(),
      check('fieldofstudy').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { from, to, school, fieldofstudy, degree, description, current } =
      req.body

    const newEducation = {
      from,
      to,
      school,
      fieldofstudy,
      degree,
      description,
      current,
    }
    try {
      const profile = Profile.findOne({ user: req.user.id })
      profile.education.unshift(newEducation)
      await profile.save()
      res.status(201).json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route  DELETE api/profile/education/:edu_id
// @desc   Delete profile experience
// @access Private
router('/education/:edu_id').delete(auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id)

    profile.education.splice(removeIndex, 1)
    await profile.save()

    res.status(204).json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
