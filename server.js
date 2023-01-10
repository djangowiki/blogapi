const express = require('express');
const dotenv = require('dotenv');

dotenv.config()
const app = express();

// Custom Imports
const dbConnection = require('./config/db');

const userRouter = require('./routes/user/user.route');
const { errorHandler, notFound } = require('./middlewares/errorHandler.middleware');
const postRouter = require('./routes/post/post.route');
const commentRouter = require('./routes/comment/comment.route');
const mailRouter = require('./routes/email/emailMessaging.router');
const categoryRouter = require('./routes/category/category.route');

// DB
dbConnection()

// Middlewares.
app.use(express.json())

// Routes Middlewares.
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/comments', commentRouter)
app.use('/api/mail', mailRouter)
app.use('/api/category', categoryRouter)


// Error Handler Middleware.
app.use(notFound)
app.use(errorHandler)

// Server
const PORT = process.env.PORT || 4000
app.listen(PORT, console.log(`Server listening on ${PORT}`));
