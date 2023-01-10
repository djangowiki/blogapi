const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please enter a post title'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    default: 'Uncategorized',
  },
  isLiked:{
    type: Boolean,
    default: false,
  },
  isDisLiked:{
    type: Boolean,
    default: false,
  },
  numViews:{
    type: Number,
    default: 0,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  disLikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please enter a post author']
  },
  description: {
    type: String,
    required: [true, 'Please enter a post description']
  },
  image: {
    type: String,
    default: 'https://images.pexels.com/photos/12316510/pexels-photo-12316510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }

},
{
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
}

)
// Compile to Post Model
const Post = mongoose.model('Post', postSchema)
module.exports = Post