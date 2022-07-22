import Conversation from "../model/Conversation";
import Message from "../model/Message";
import { extendedSocket } from "./../middleware/authSocket";
import { updateChatHistory } from "./update/chat";

export const sendDirectMessage = async (
  socket: extendedSocket,
  data: { receiverId: string; content: string }
) => {
  try {
    const senderId = socket.data.user?.id;
    const { receiverId, content } = data;

    const message = await Message.create({
      author: senderId,
      content,
      date: new Date(),
      type: "DIRECT",
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation)
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });

    conversation.messages.push(message._id);
    await conversation.save();

    updateChatHistory(conversation._id.toString());
  } catch (error) {
    console.log(error);
  }
};
