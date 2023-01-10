const mongoose = require('mongoose');
const {Schema} = mongoose
const bcrypt = require('bcryptjs');
const crypto = require('crypto')

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
  },
  profilePhoto: {
    type: String,
    default: 'https://images.pexels.com/photos/1049622/pexels-photo-1049622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
  },
  role: {
    type: String,
    enum: ['admin', 'guest', 'blogger'],
    default: 'blogger',
  },
  postCount: {
    type: Number,
    default: 0,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isFollowing: {  
    type: Boolean,
    default: false,
  },
  isUnFollowing: {
    type: Boolean,
    default: false,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  isActive:{
    type: Boolean,
    default: false,
  },
  accountVerificationToken: String,
  accountVerificationTokenExpiration:Date,
  // Data Association in MongoDb.
  // One to many relationship (1 user can have multiple posts.)
  // Many to many relationship ()
  // Many to one relationship (Many users can view a single user post)

  viewedBy: {
    type: [
     {
      type: Schema.Types.ObjectId,
      ref: 'User',
     }
    ]
  },
  followers: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      }
    ]
  },
  following: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      }
    ]
    },
  
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpiration: Date

}, {
  toJSON:{
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  timestamps: true

})

// MongoDB Virtuals. Connecting posts to users virtually.
userSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'user',
  localField: '_id',
})

// Mongoose Middlewares
userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
 const salt = await bcrypt.genSalt(10)
 user.password = await bcrypt.hash(user.password, salt)
  next()
})

// Mongoose Methods.
userSchema.methods.isPasswordMatched = async function(enteredPassword){
  const password = this.password
  return await bcrypt.compare(enteredPassword, password)
}

// generate AccountVerification Token and save it.
userSchema.methods.createAccountVerificationToken = async function(){
  const user = this
  // this is how to create a random token.
  const verificationToken = crypto.randomBytes(32).toString('hex')
  // this is how to hash the token and save it in the database field of the user accountVerificationToken.
  user.accountVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex')
  user.accountVerificationTokenExpiration = Date.now() + 30 * 60 * 1000 // 10 minutes.
  await user.save()
  // return the plain text token for the frontend.
  return verificationToken
}

// forgotPassword method
userSchema.methods.forgotPassword = async function(){
  const user = this
  const token = crypto.randomBytes(32).toString('hex')
  user.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
  user.passwordResetTokenExpiration = Date.now() + 30 * 60 * 1000 // 10
  await user.save()
  return token
}

// Compile Schema to Models.
const User = mongoose.model('User', userSchema)
module.exports = User

// In MongoDb, we have two ways of referencing.
// 1. Using a foreign key.
// 2. Using a composite key.
// In both cases, we need to create a new schema for the foreign key.
// We can do this by creating a new schema for the foreign key,


// Referencing is how you relate another model in another model. 

// When working with Mongoose, Schema.Types.ObjectId is not a real object. Its like a virtual property.
// So we need to popuplate this virtual property already by using the following.
// toObject: {virtual: true }, toJSON:{virtual: true}