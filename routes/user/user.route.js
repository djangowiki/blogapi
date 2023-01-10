const express = require('express');
const { 
  userRegisterController, 
  userLoginController, 
  fetchAllUsers, 
  deleteUser, 
  userProfileController, 
  fetchUserDetails, 
  updateUserProfileController, 
  updateUserPasswordController, 
  userFollowingController,
  unfollowUserController,
  blockUserController,
  unblockUserController,
  generateVerificationTokenController,
  accountVerification,
  generateForgotPasswordTokenController,
  forgotPasswordController,
  photoUploadController
} = require('../../controllers/users/user.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const { photoUpload, photoResize } = require('../../middlewares/photoUpload.middleware');

const userRouter = express.Router();

userRouter.post('/register', userRegisterController)
userRouter.post('/login', userLoginController)
userRouter.post('/generate-email-verification-token', authMiddleware, generateVerificationTokenController)
userRouter.put('/verify-account', authMiddleware, accountVerification)
userRouter.post('/generate-forgot-password-token', generateForgotPasswordTokenController)
userRouter.put('/update-password', forgotPasswordController)
userRouter.put('/photo-upload', authMiddleware, photoUpload.single('image'), photoResize, photoUploadController)
userRouter.get('/', authMiddleware, fetchAllUsers)
userRouter.put('/password', authMiddleware, updateUserPasswordController)
userRouter.put('/follow', authMiddleware, userFollowingController)
userRouter.put('/unfollow', authMiddleware, unfollowUserController)
userRouter.put('/block/:id', authMiddleware, blockUserController)
userRouter.put('/unblock/:id', authMiddleware, unblockUserController)
userRouter.delete('/:id', deleteUser)
userRouter.get('/:id', fetchUserDetails)
userRouter.get('/profile/:id', authMiddleware, userProfileController)
userRouter.put('/:id', authMiddleware, updateUserProfileController)


module.exports = userRouter;
