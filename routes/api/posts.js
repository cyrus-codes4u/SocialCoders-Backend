const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const auth = require('../../middleware/auth')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route  POST api/posts
// @desc   Create a new post
// @access Private
router('/').post(
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select('-password')
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      })

      const post = await new newPost.save()

      res.status(201).json(post)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

// @route  GET api/posts
// @desc   Get all posts
// @access Private
router('/').get(auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.status(200).json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route  GET api/posts/:post_id
// @desc   Get post by id
// @access Private
router('/:post_id')
  .get(auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' })
      }
      res.status(200).json(post)
    } catch (err) {
      console.error(err.message)
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' })
      }
      res.status(500).send('Server error')
    }
  })
  // @route  DELETE api/posts/:post_id
  // @desc   Deletes a post by id
  // @access Private
  .delete(auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)

      if (!post) {
        return res.status(404).json({ msg: 'Post not found' })
      }
      //Check user own post
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' })
      }

      await post.remove

      res.status(204).json({ msg: 'Post removed' })
    } catch (err) {
      console.error(err.message)
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' })
      }
      res.status(500).send('Server error')
    }
  })

// @route  PUT api/posts/like/:post_id/
// @desc   Likes a post by id
// @access Private
router('/likes/:post_id').put(auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    // check if already liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' })
    }
    post.likes.unshift({ user: req.user.id })
    await post.save()

    res.status(200).json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route  PUT api/posts/unlike/:post_id/
// @desc   Unlikes a post by id
// @access Private
router('/likes/:post_id').put(auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    // check if already liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' })
    }
    //Remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)

    post.likes.splice(removeIndex, 1)

    await post.save()

    res.status(200).json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route  post api/posts/comment/:post_id/
// @desc   Create comment on a post
// @access Private

router('/comment/:post_id').post(auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    const post = await Post.findById(req.params.post_id)

    const newComment = {
      text: req.body.text,
      user: req.user.id,
      name: user.name,
      avatar: user.avatar,
    }

    post.comments.unshift(newComment)
    await post.save()

    res.status(201).json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route  DELETE api/posts/comment/:post_id/:comment_id
// @desc   Delete a comment on a post
// @access Private
router('/comment/:post_id/:comment_id').delete(auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    //Pull out comment
    const comment = post.comments.find(
      (com) => com.id === req.params.comment_id
    )

    //Ensure comment exists
    if (!commment) {
      return res.status(404).json({ msg: 'No comment found' })
    }

    //User is user that wrote comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    //Remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id)

    post.comments.splice(removeIndex, 1)
    await post.save()

    res.status(204).json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
