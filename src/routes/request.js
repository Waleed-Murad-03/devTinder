const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

// This api is only for interested  or ignored api. So that status in here, it is only interested or ignored. Basically right swipe for accepted or left swipe for ignore.
requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; // Remember I have my userAuth middleware here so basically this is the person who is logged in who is sending the data
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // http://localhost:7777/request/send/:status/:userId - RN WE ARE CHECKING THE STATUS AND MAKING SURE IT IS EITHER 'ignored' or 'interested'
      const allowedStatus = ['ignored', 'interested'];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: 'Invalid Status Type: ' + status });
      }

      // Another thing that we need to handle is that we should not allow users to send connection requests to themselves http://localhost:7777/request/send/interested/logged-inUser
      // We will do it using schema validations. You will find the method at the bottom below the schema.
      // -----------------------------------------

      // Now another thing I need to handle is that we need to make sure we are sending a request to a person who actaully exists in my db: http://localhost:7777/request/send/interested/xyz
      // So like basically we need to just check that this person yes is there in my db.
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: 'User not found ' });
      }

      // Check if there is an exisitng connection request between user a and b.
      // Now we also want to check if b has also send a request to user a even though user a has sent it first
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: 'Connection Request Already Exists!!' });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName + ' is ' + status + ' in ' + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send('Error: ' + err.message);
    }
  }
);

module.exports = requestRouter;
