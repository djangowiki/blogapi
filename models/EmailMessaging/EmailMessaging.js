const mongoose = require('mongoose')

const Schema = mongoose.Schema

const emailMessageSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isFlagged: {
    type: Boolean,
    default: false,
  }
}, {
  toJSON:{
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
  timestamps: true,
})

const EmailMessage = mongoose.model('EmailMessage', emailMessageSchema) 

module.exports = {
  EmailMessage
}
