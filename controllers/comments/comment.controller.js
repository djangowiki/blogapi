const asyncHandler = require('../../middlewares/asyncHandler.middleware');
const { Comment } = require('../../models/comment/Comment');
const validateID = require('../../utils/validateID');

const createCommentController = asyncHandler(async(req, res) => {
  const user = req.user
  try {
    const comment = await Comment.create({...req.body, user})
    res.status(200).json({success: true, data: comment})
  } catch (error) {
    res.status(400).json({success: false, error: error})
  }
})

const fetchAllCommentsController = asyncHandler(async(req,res) =>{
  try {
    const comments = await Comment.find({}).sort('-created')
    res.status(200).json({success: true, data: comments})
    } catch (error) {
      res.status(400).json({success: false, error: error})
    }
})

const fetchCommentController = asyncHandler(async(req,res) => {
  const {commentId} = req.params
  validateID(commentId)
  try {
    const comment = await Comment.findById(commentId)
    res.status(200).json({success: true, data: comment})
    } catch (error) {
      res.status(400).json({success: false, error: error})
    }
})

const updateCommentController = asyncHandler(async(req,res) => {
  const {commentId} = req.params
  validateID(commentId)
  try {
    const comment = await Comment.findByIdAndUpdate(commentId, {
      ...req.body
    }, {new: true})
    res.status(200).json({success: true, data: comment})
  } catch (error) {
    res.status(400).json({success: false, error: error})
  } 
})

const deleteCommentController = asyncHandler(async(req,res) => {
  const {commentId} = req.params
  validateID(commentId)
  try {
    const comment = await Comment.findByIdAndDelete(commentId)
    res.status(200).json({success: true, data: comment})
    } catch (error) {
      res.status(400).json({success: false, error: error})
    }
})

module.exports = {createCommentController,
  fetchAllCommentsController, 
  fetchCommentController,
  updateCommentController, 
  deleteCommentController
}