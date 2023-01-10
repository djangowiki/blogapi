const notFound = (req, res, next) => { 
  res.status(404)
  const error = new Error(`Not Found: ${req.originalUrl}`)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    error:{
      message: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : null
    }
  })
}
module.exports = {errorHandler, notFound};