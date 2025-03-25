import { Conversation } from "../models/conversation.model.js"
import { Message } from "../models/message.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js"

export const sendMessage = async (req, res) => {
    try {
      const senderId = req.id;
      const receiverId = req.params.id;
      const { message } = req.body; // Changed from textMessage to message
  
      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Message content is required"
        });
      }
  
      // Find or create conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
      });
  
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId]
        });
      }
  
      // Create new message
      const newMessage = await Message.create({
        senderId,
        receiverId,
        message
      });
  
      // Add message to conversation
      if (newMessage) {
        conversation.messages.push(newMessage._id);
        await conversation.save();
      }
  
      // Socket.io notification
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
  
      return res.status(201).json({
        success: true,
        message: "Message sent successfully",
        newMessage
      });
  
    } catch (error) {
      console.error("Error in send message controller:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  };

  export const getMessage = async (req, res) => {
    try {
      const senderId = req.id;
      const receiverId = req.params.id;
  
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
      }).populate("messages");
  
      if (!conversation) {
        return res.status(200).json({
          success: true,
          messages: []
        });
      }
  
      return res.status(200).json({
        success: true,
        messages: conversation.messages
      });
  
    } catch (error) {
      console.error("Error in get messages controller:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  };