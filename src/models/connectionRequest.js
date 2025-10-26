const mongoose = require('mongoose');

const connectionReqestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    status: {
      type: String,
      require: true,

      enum: {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// ConnectionRequest.find({fromUserId: 2153487484874, toUserId: 849895957})
connectionReqestSchema.index({ fromUserId: 1, toUserId: 1 });

// Whenever we use schema functions no arrows allowed
connectionReqestSchema.pre('save', function (next) {
  const connectionRequest = this;
  //   Check if the fromUserId is same as toUserId

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error('Can not send connection request to yourself!');
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  'ConnectionRequest',
  connectionReqestSchema
);

module.exports = ConnectionRequestModel;
