const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('./asyncHandler.middleware')

const authMiddleware = asyncHandler(async(req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
   try {
    token = req.headers.authorization.split(' ')[1];
    if(token) {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      const user = await User.findById(decoded?.id).select('-password')
      req.user = user
      next()
    } 
   } catch (error) {
    throw new Error('Unauthorized, Invalid token.')
   }

  } else {
    throw new Error('Unauthorized, No token Found.')
  }
})

module.exports = authMiddleware