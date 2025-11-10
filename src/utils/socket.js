const socket = require('socket.io');

const crypto = require('crypto');
const { Chat } = require('../models/chat');
const ConnectionRequest = require('../models/connectionRequest');
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash('sha256')
    .update([userId, targetUserId].sort().join('$'))
    .digest('hex');
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  io.on('connection', (socket) => {
    // Handle events

    socket.on('joinChat', ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      // console.log(firstName + ' Joinied room: ' + roomId);
      socket.join(roomId);
    });
    socket.on(
      'sendMessage',
      async ({ firstName, userId, targetUserId, text }) => {
        // Save message to the db
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          // console.log(firstName + ' ' + text);

          // Check if the userId and the targetid are friends becase we do not want anyone to be able to talk to anyone
          //  ConnectionRequest.findOne({});

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          // This means this is the first time the users are chatting
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({ senderId: userId, text });
          await chat.save();

          io.to(roomId).emit('messageReceived', { firstName, text });
        } catch (err) {
          console.error(err);
        }
      }
    );
    socket.on('disconnect', () => {});
  });
};

module.exports = initializeSocket;

// Chat
