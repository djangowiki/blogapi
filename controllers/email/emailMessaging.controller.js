const sgMail = require('@sendgrid/mail');
const asyncHandler = require('../../middlewares/asyncHandler.middleware');
const { EmailMessage } = require('../../models/EmailMessaging/EmailMessaging');
const Filter = require('bad-words')

const sendEmailMessageController = asyncHandler(async(req, res) => {
  console.log(req.user)
  const {to, subject, message} = req.body
  // Get the email message.
  const emailMessage =  subject + ' ' + message
  // Create filter and check for profane messages
  const filter = new Filter()
  const isProfone = filter.isProfane(emailMessage)
  if(isProfone) throw new Error('Sending email message failed because profane words were found')
 try {
   // Build sendgrid message.
   const msg = {
    to,
    subject,
    text: message
  }
  // send mail.
  // await sgMail.send(msg)
  await EmailMessage.create({...req.body, sentBy: req?.user?.id,
    from: req?.user?.email,})
  res.status(200).json({data: 'Mail sent successfully'})
 } catch (error) {
  res.status(400).json({success: false, error: error})
 }
})

module.exports = {sendEmailMessageController}