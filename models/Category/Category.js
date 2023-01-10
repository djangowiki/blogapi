const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please enter a user.']
  },
  name: {
    type: String,
    required: [true, 'Please enter a category name.']
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

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
