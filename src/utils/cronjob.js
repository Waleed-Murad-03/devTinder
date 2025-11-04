// const cron = require('node-cron');
// const ConnectionRequestModel = require('../models/connectionRequest');
// const { subDays, startOfDay, endOfDay } = require('date-fns');
// const sendEmail = require('./sendEmail');

// cron.schedule('0 8 * * *', async () => {
//   // console.log('Hello World' + new Date());
//   //   Send emails to all people who got requests the previous day
//   try {
//     const yesterday = subDays(new Date(), 1);
//     const yesterdayStart = startOfDay(yesterday);
//     const yesterdayEnd = endOfDay(yesterday);

//     const pendingRequsts = await ConnectionRequestModel.find({
//       status: 'interested',
//       createdAt: {
//         $gte: yesterdayStart,
//         $lt: yesterdayEnd,
//       },
//     }).populate('fromUserId toUserId');

//     const listOfEmails = [
//       ...new Set(pendingRequsts.map((req) => req.toUserId.emailId)),
//     ];

//     for (const email of listOfEmails) {
//       try {
//         // Send emails
//         //   Here we use the AWS SES Logic
//         const res = await sendEmail.run(
//           'New Friend Request Pending for ' + email,
//           'There  are so many firend requests pending, please login to tinderDevs.com and accept or reject the requests'
//         );
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   } catch (err) {
//     console.error(err);
//   }
// });
