const express = require('express');
const { createPostController, fetchAllPostsController, fetchPostController, updatePostController, deletePostController, toggleAddLikeToPostController, toggleAddDisLikeToPostController } = require('../../controllers/posts/post.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { photoUpload, postImgResize } = require('../../middlewares/photoUpload.middleware');

const postRouter = express.Router()

postRouter.post('/create', authMiddleware, photoUpload.single('image'), postImgResize, createPostController)
postRouter.get('/', fetchAllPostsController)
postRouter.put('/like', authMiddleware, toggleAddLikeToPostController)
postRouter.put('/dislike', authMiddleware, toggleAddDisLikeToPostController)
postRouter.get('/:id', fetchPostController)
postRouter.put('/:id', authMiddleware, photoUpload.single('image'), postImgResize, updatePostController)
postRouter.delete('/:id', authMiddleware, deletePostController)


module.exports = postRouter;