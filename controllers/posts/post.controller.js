const fs = require('fs');
const asyncHandler = require('../../middlewares/asyncHandler.middleware');
const Post = require('../../models/post/Post');
const Filter = require('bad-words');
const User = require('../../models/User');
const cloudinaryUploadService = require('../../utils/cloudinary');
const validateID = require('../../utils/validateID');

const createPostController = asyncHandler(async(req, res) => {
  try {
    const {id} = req.user
    // check for bad words.
    const filter = new Filter()
  //  Check if a word is profane,
  const isProfane = filter.isProfane(req?.body?.title, req?.body?.description)
  if (isProfane) {
    const user = await User.findById(id)
    user.isBlocked = true
    await user.save()
    return res.status(400).json({
      success: false, 
      msg:'Creating post failed because profane words was found in your post. You have been blocked.'
    })
  }
    // Upload to cloudinary.
    const localPath = `public/images/posts/${req.file.fileName}`
    const data = await cloudinaryUploadService(localPath)
    const post = await Post.create({...req.body, image: data.secure_url, user: id})
    res.status(201).json(post)
    // remove image from local path.
    fs.unlinkSync(localPath)
  } catch (error) {
    res.status(500).json(error)
  }
})

const fetchAllPostsController = asyncHandler(async(req,res) => {
  try {
    const posts = await Post.find({})
    res.status(200).json(posts)
    } catch (error) {
    res.status(500).json(error)
    }
})

const fetchPostController = asyncHandler(async(req, res) => {
  const {id} = req.params
  validateID(id)
  try {
    const post = await Post.findById(id).populate('user')
    .populate('likes')
    .populate('disLikes')
    await Post.findByIdAndUpdate(id, {
      $inc: {numViews: 1}
    }, {new: true})
    res.status(200).json({success: true, data: post})
  }catch (error){
    res.status(500).json(error)
  }
})

const updatePostController = asyncHandler(async(req, res) => {
  const {id} = req.params
  validateID(id)
  try {
    const localPath = `public/images/posts/${req?.file?.fileName}`
    const data = await cloudinaryUploadService(localPath)

    const post = await Post.findByIdAndUpdate(id, {...req?.body, image: data?.secure_url}, {new: true})
    fs.unlinkSync(localPath)
    return res.json({success: true, data: post})
    
  } catch (error) {
    console.log(error)
    res.status(500).json({success: false, data:error.message})
  }
})

const deletePostController = asyncHandler(async(req, res) => {
  const {id} = req.params
  validateID(id)
  try {
    const post = await Post.findByIdAndRemove(id)
    res.status(200).json({success: true, data: post})
    } catch (error) {
      console.log(error)
      res.status(500).json({success: false, data:error.message})
    }
})

const toggleAddLikeToPostController = asyncHandler(async(req, res) => {
  // Get the post to like.
  const {postId} = req?.body
  const post = await Post.findById(postId)
  // Find the login user that wants to like the post.
  const loginUserId = req?.user?.id
  // check if the user is already liking the post.
  const isLiked = post?.isLiked
  // Check if the user is disliking the post.
  const alreadyDisiked = post?.disLikes?.find(userId => userId.toString() === loginUserId.toString())
  // remove the user if the user is already disLikes it.
  if(alreadyDisiked){
    const post = await Post.findByIdAndUpdate(postId, {
      $pull: {
        disLikes: loginUserId
      },
      isDisLiked: false
    }, {new: true})
    res.status(200).json({success: true, data: post})
  }

  // remove the user if he has already liked the post.
  // toggle.
  if(isLiked){
    const post = await Post.findByIdAndUpdate(postId, {
      $pull:{
        likes: loginUserId
      },
      isLiked: false
  }, {new: true})
  res.status(200).json({success: true, data: post})
} else {
  // add to likes.
  const post = await Post.findByIdAndUpdate(postId, {
    $push: {likes: loginUserId},
    isLiked: true
  }, {new: true})
  res.status(200).json({success: true, data: post})
}

})

const toggleAddDisLikeToPostController = asyncHandler(async(req, res) => {
  // Get the post to dislike.
  const {postId} = req?.body
  const post = await Post.findById(postId)
  // Find the login user that wants to dislike the post.
  const loginUserId = req?.user?.id
  // check if the user is already disliking the post.
  const isDisLiked = post?.isDisLiked
  
  // check if the user is already liking the post.
  const alreadyLiked = post?.likes?.find(userId => userId.toString() === loginUserId.toString())
  // remove the user if the user is already liking the post.
  if(alreadyLiked){
    const post = await Post.findByIdAndUpdate(postId, {
      $pull: {
        likes: loginUserId
      },
      isLiked: false
    }, {new: true})
    res.status(200).json({success: true, data: post})
  }
  // remove the user if he has already disliked the post.
  // toggle.
  if(isDisLiked){
    const post = await Post.findByIdAndUpdate(postId, {
      $pull:{
        disLikes: loginUserId
      },
      isDisLiked: false
    }, {new: true})
    res.status(200).json({success: true, data: post})
  } else {
    const post = await Post.findByIdAndUpdate(postId, {
      $push: {disLikes: loginUserId},
      isDisLiked: true
    }, {new: true})
    res.status(200).json({success: true, data: post})
  }
})

module.exports = {
  createPostController, 
  fetchAllPostsController,
  fetchPostController, 
  updatePostController, 
  deletePostController,
  toggleAddLikeToPostController,
  toggleAddDisLikeToPostController
}

  // if (post.likes.includes(loginUserId)) {
  //   post.likes.splice(post.likes.indexOf(loginUserId), 1)}
  //   else {
  //   post.likes.push(loginUserId)}