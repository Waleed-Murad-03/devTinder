const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();
const User = require('../models/user');

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

// So we need to see the people who we are not connected with yet.
// We need to avoid the people who we have already ignored
// We should not see users who we are already interested in
// We should not see our own card as well\ // User should see all the cards except
// 0. his own card
// 1. his connections
// 2. ignored people
// 3. Already send the connection request to
// We will only see the users cards on our fields which we did not interact with or like there isnt any sort of entry
userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // Find all of the connection requests that either I have sent or received so that we do not see them on our feed
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select('fromUserId toUserId');
    // .populate('fromUserId', 'firstName')
    // .populate('toUserId', 'firstName'); //These are the people that I bascially do not want in my feed. They are all of the peope who either donald soendsomething to or donald have received from.

    // SET is a data structure similar to arrays but if we try to add 2 times the same values it will not count the second.So it is  a set or list of unique values.
    // No duplicates. So now we will get a list of uniqe people whose profile should not be shown
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    // console.log(hideUsersFromFeed);
    // Now that we know ho are the people that we should hide from the feed
    // So basically in the query below I am basically finding all of the users whose id is not present in the hideUsersFromFeed set list. We are doing kind of the reverse here
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } }, //We are finnding all of the users who are not in the hideUsersFromFeed array and their id is not equal to the logged in user id
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
