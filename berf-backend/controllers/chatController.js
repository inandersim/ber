const Message = require('../models/Message');
const Room = require('../models/Room');

exports.sendMessage = async (req, res) => {
  const { sender, content, room } = req.body;

  const newMessage = new Message({ sender, content, room });
  await newMessage.save();

  res.status(201).json(newMessage);
};

exports.getMessages = async (req, res) => {
  const { room } = req.params;
  const messages = await Message.find({ room }).populate('sender');

  res.json(messages);
};
