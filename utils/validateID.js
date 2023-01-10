const mongoose = require('mongoose');

const validateID = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if(!isValid) throw new Error('The ID is not valid')
}

module.exports = validateID