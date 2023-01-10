const express = require('express');
const { sendEmailMessageController } = require('../../controllers/email/EmailMessaging.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const mailRouter = express.Router()

mailRouter.post('/send', authMiddleware, sendEmailMessageController)

module.exports = mailRouter;
