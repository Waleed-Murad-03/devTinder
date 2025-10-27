const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills';

// Get all the pending connection requests for the logged in user (nothing more nothing less)
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate(
      'fromUserId',
      'firstName lastName photoUrl age gender about skills'
    ); // What we did in here is magic where we literally joined 2 tables
    // }).populate('fromUserId', ['firstName', 'lastName']);

    // Now that we got the  users, we will loop through our results and get the information we need from these users because we do not want to return the full db details to the user
    //  But we will not do that because that is a poor way of doing it. Instead mongodb has a ref method which basically connects to databases. To see what I am talking about. Look at how we use populate method up in here.
    // And look at what I have done in the connectionRequest file to the  toUserId field. I added a reference/

    res.json({
      message: 'Data fetched Successfully',
      data: connectionRequests,
    });
  } catch (err) {
    res.statusCode(400).send('Error: ' + err.message);
  }
});

// An api to get all of my connections and all of the people who are connected to me
// So we are only concerned about the status of accepted
userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = userRouter;
