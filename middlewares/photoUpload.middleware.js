const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
// Where we want to store our images temporarily in the memory of our server using multer.
const multerStorage = multer.memoryStorage()

// Filter out the images using multer.
const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')){
    cb(null, true)
  } else {
    // rejected files.
    cb({
      message: 'Only images are accepted'
    }, false)
  }
}

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1000000 // 1mb
  }
})

const photoResize = async (req, res, next) => {
  // Check for file.
  if(!req.file) return next()
  // create a file name for the image to avoid collisions.
  req.file.fileName = `user-${Date.now()}-${req.file.originalname}`
  // Resize the image.
  await sharp(req.file.buffer)
  .resize(250, 250)
  .toFormat('jpeg')
  .jpeg({quality: 90})
  .toFile(path.join(`public/images/profile/${req.file.fileName}`))
  next()
}

const postImgResize = async(req, res, next) => {
  // Check for file.
  if(!req.file) return next()
  // create a file name for the image to avoid collisions.
  req.file.fileName = `user-${Date.now()}-${req.file.originalname}`
  // Resize the image.
  await sharp(req.file.buffer)
  .resize(500, 500)
  .toFormat('jpeg')
  .jpeg({quality: 90})
  .toFile(path.join(`public/images/posts/${req.file.fileName}`
  ))
  next()
}

module.exports = {
  photoUpload,
  photoResize,
  postImgResize
}