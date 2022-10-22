const mongoose = require('mongoose')

const dbConnection = async () => {
  try {
   const conn =  await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDb Connected on ${conn.connection.host}`)
  } catch (error) {
    console.error(error.message)
  }
}

module.exports = dbConnection