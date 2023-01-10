const express = require('express')
const { 
  createCommentController, 
  fetchAllCommentsController,
  fetchCommentController,
  updateCommentController, 
  deleteCommentController
} = require('../../controllers/comments/comment.controller')
const authMiddleware = require('../../middlewares/auth.middleware')

const commentRouter = express.Router()

commentRouter.post('/create', authMiddleware, createCommentController)
commentRouter.get('/', authMiddleware,  fetchAllCommentsController)
commentRouter.get('/:commentId', authMiddleware,  fetchCommentController)
commentRouter.put('/:commentId', authMiddleware,  updateCommentController)
commentRouter.delete('/:commentId', authMiddleware,  deleteCommentController)


module.exports = commentRouter
