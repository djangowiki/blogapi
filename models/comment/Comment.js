const mongoose = require('mongoose');

const Schema = mongoose.Schema

const commentSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Please enter a post']
  },
  user: {
    type: Object,
    required: [true, 'Please enter a comment user']
  },
  text: {
    type: String,
    required: [true, 'Please enter a text']
  }
}, {
  toJSON:{
    virtuals: true
  },
  toObject:{
    virtuals: true
  },
  timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = {
  Comment
}
