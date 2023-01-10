
//---------------------------------------------------
//
//  Module: UseController
//
//---------------------------------------------------


//---------------------------------------------------
//
//  userRegisterController
//
//---------------------------------------------------

const fs = require('fs');
// const sgMail = require('@sendgrid/mail')
const generateToken = require('../../config/generateToken')
const asyncHandler = require('../../middlewares/asyncHandler.middleware')
const User = require('../../models/User')
const validateID = require('../../utils/validateID')
const crypto = require('crypto')
const cloudinaryUploadService = require('../../utils/cloudinary')
// sgMail.setApiKey(process.env.SEND_GRID_API_KEY)


const userRegisterController = asyncHandler(async (req, res) => {
  console.log('first')
  const userExists = await User.findOne({email: req?.body?.email})
  if (userExists) throw new Error('User already exists')
  try {
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password
    })
    res.status(200).json({ success: true, user})
  } catch (error) {
    res.json(error)
  }

})


// --------------------------------
//
//  Login userController.
//
// --------------------------------

const userLoginController = asyncHandler(async(req, res) => {
  const {email, password} = req.body
  const user = await User.findOne({email})
  // Check if user exists and password matches.
  if(user && await(user.isPasswordMatched(password))) {
    return res.json({ 
      success: true,
      id: user?._id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      profilePhoto:user?.profilePhoto,
      token: generateToken(user?.id)
    })
  } else {
    throw new Error('Invalid credentials')
  }
})


// --------------------------------
//
//  fetchAllUsers.
//
// --------------------------------

const fetchAllUsers = asyncHandler(async(req, res) =>{
  try {
    const users = await User.find({})
    res.status(200).json({ success: true, users: users })
  } catch (error) {
    res.status(400).json({success: false, error: error.message})
  }
})

// --------------------------------
//
//  deleteUser.
//
// --------------------------------

const deleteUser = asyncHandler(async(req, res) =>{
  const {id} = req.params
  validateID(id)
  try {
    const user = await User.findByIdAndRemove(id)
    res.status(200).json({ success: true, user })
    } catch (error) {
      res.status(400).json({success: false, error: error.message})
    }
})

// --------------------------------
//
//  fetchUserById.
//
// --------------------------------

const fetchUserDetails = asyncHandler(async(req, res) => {
    const {id} = req.params
   validateID(id)
  try {
    const user = await User.findById(id)
    res.status(200).json({ success: true, user })
  }catch (error){
    res.status(400).json({success: false, error: error.message})
  }
})

// --------------------------------
//
//  userProfile.
//
// --------------------------------

const userProfileController = asyncHandler(async(req, res) => {
  const {id} = req.params
  validateID(id)
  try{
    const userProfile = await User.findById(id).populate('posts')
    res.status(200).json({ success: true, userProfile })
  } catch (error){
    res.status(400).json({success: false, error: error.message})
  }

})

// --------------------------------
//
//  updateUserProfileController
//
// --------------------------------

const updateUserProfileController = asyncHandler(async(req,res) => {
  const {id} = req.user
  validateID(id)
  try {
    const user = await User.findByIdAndUpdate(id, {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio
    }, {new: true, runValidators:true})
    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(400).json({success: false, error: error.message})
  }
})

// -----------------------
//
//  updateUserPasswordController
//
// -----------------------

const updateUserPasswordController = asyncHandler(async(req, res) => {
  const {id} = req.user
  validateID(id)
  const user = await User.findById(id)
  const {password} = req.body
  if(password) {
    user.password = password
    const updatedUser = await user.save()
    return res.status(200).json({success: true, updatedUser})
  } 
  return res.json(user)
})

// -----------------------
//
//  following
//
// -----------------------

const userFollowingController = asyncHandler(async(req, res) => {
  // Get the login user Id.
  const loginUserId = req.user.id
  // Get the follower user Id.
  const {followId} = req.body
  // Check if the user is already following.
  // Find the user you want to follow.
  const userToFollow = await User.findById(followId)
  // Check if the login user is already following
  // console.log(userToFollow.followers)
  const alreadyFollowing = userToFollow?.followers?.find(user => user.toString() === loginUserId.toString())

  if (alreadyFollowing) throw new Error('You are already following this user')
  // Find the user you want to follow and update its followers field
  await User.findByIdAndUpdate(followId, {
    $push: {
      followers: loginUserId,
    },
    isFollowing: true
  }, {new: true})
  
  // Add the user you followed to your following.
  // ie. update the login user following
  await User.findByIdAndUpdate(loginUserId, {
    $push:{following: followId}
  }, {new: true})

  res.status(200).json({success: true, msg:'You have successfully followed this user'})
 
})

// -----------------------
//
//  unfollowUserController
//
// -----------------------

const unfollowUserController = asyncHandler(async(req, res) => {
  const loginUserId = req.user.id
  const {unFollowId} =  req.body
  const userToUnfollow = await User.findById(unFollowId)
  // Check if the user is already unfollowing.
  const alreadyUnfollowing = userToUnfollow?.followers?.find(user => user.toString() === loginUserId.toString())
  if(!alreadyUnfollowing) throw new Error('You are already unfollowing this user')

  await User.findByIdAndUpdate(unFollowId, {
    $pull: {
      followers: loginUserId,
    },
    isFollowing: false
  }, {new: true})
  
  await User.findByIdAndUpdate(loginUserId, {
    $pull: {
      following: unFollowId,
    }
  }, {new: true})
  res.status(200).json({success: true, msg:'You have successfully unfollow this user'})
})

// -----------------------
//
//  blockUserController
//
// -----------------------

const blockUserController = asyncHandler(async(req, res) => {
  const {id} = req.params
  validateID(id)
  const user = await User.findById(id)
  if(!user) throw new Error('User not found')
  user.isBlocked = true
  await user.save()
  res.status(200).json({success: true, user})
})

// -----------------------
//
//  unblockUserController
//
// -----------------------
const unblockUserController = asyncHandler(async(req, res) => {
  const {id} = req.params
  validateID(id)
  const user = await User.findById(id)
  if(!user) throw new Error('User not found')
  user.isBlocked = false
  await user.save()
  res.status(200).json({success: true, user})
}) 

// -----------------------
//
//  generateVerificationTokenController
//
// -----------------------

const generateVerificationTokenController = asyncHandler(async (req, res) => {
  const loginUserId = req.user.id
  const user = await User.findById(loginUserId)
  try {
    const verificationToken = await user.createAccountVerificationToken()

  const verifyUrl = `Click on this link to verify your account. The link is active for 10 minutes.
   <a href='http://localhost:3000/${verificationToken}>Verify your Email Address</a>`
   
  const msg = {
    to: "flixya4gabby@gmail.com",
    from: 'postmaster@sandboxe216e633faa4484884a3e13eb55c7200.mailgun.org',
    subject: 'Verify your email address',
    html: verifyUrl
  }

  // await sgMail.send(msg)

  res.json(verifyUrl)
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
})

const accountVerification = asyncHandler(async(req, res) => {
  // In the frontend, we can grab this token from the params.
  const {token} = req.body
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  const user = await User.findOne({
    accountVerificationToken: hashedToken, 
    accountVerificationTokenExpiration: {$gt: new Date()} // check expiration.
  })
  if(!user) throw new Error('Token expired, please try again')
  user.isAccountVerified = true
  user.accountVerificationToken = undefined
  user.accountVerificationTokenExpiration = undefined
  await user.save()
  res.status(200).json({success: true, user})
})

// -----------------------
//
//  forgotPassword token generator.
//
// -----------------------
const generateForgotPasswordTokenController = asyncHandler(async(req, res) => {
    const {email} = req.body

    try {
    const user = await User.findOne({email})
    if(!user) throw new Error('User not found')
    const token = await user.forgotPassword()
    const forgotPasswordUrl = `You are receiving a reset password because you have provided your email address. 
    <a href='http://localhost:3000/${token}'>Click here to reset your password</a>`
   
    const msg = {
      to: email,
      from: 'postmaster@sandboxe216e633faa4484884a3e',
      subject: 'Reset your password',
      html: forgotPasswordUrl
    }

    // await sgMail.send(msg)
    res.json({
      success: true,
      message: `A verification message was sent successfully to ${email}. Reset now within 10 minutes. ${forgotPasswordUrl}`
    })

    } catch (error) {
      res.json(error)
    }

})

// -----------------------
//
//  forgotPasswordController.
//
// -----------------------

const forgotPasswordController = asyncHandler(async(req, res) => {
  const {token} = req.body
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  const user = await User.findOne({
    passwordResetToken: hashedToken, 
    passwordResetTokenExpiration: {$gt: new Date()}
  })
  if(!user) throw new Error('Token expired, please try again')
  // Change password.
  user.password = req.body.password
  user.passwordResetToken = undefined
  user.passwordResetTokenExpiration = undefined
  await user.save()
  res.json(user)
})

// -----------------------
//
//  photoUploadController
//
// -----------------------

const photoUploadController = asyncHandler(async(req, res) => {
  // Get the path to the image file.
  const localPath = `public/images/profile/${req.file.fileName}`
  const data = await cloudinaryUploadService(localPath)
  console.log(data)
  const {_id} = req.user
  const user = await User.findByIdAndUpdate(_id, {
    profilePhoto: data?.secure_url
  }, {new: true})
  res.status(200).json({success: true, user})
  // remove image from local path.
  fs.unlinkSync(localPath)

})

module.exports = {  
  userRegisterController, 
  userLoginController, 
  fetchAllUsers, 
  fetchUserDetails, 
  userProfileController, 
  deleteUser,
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
}
