import { extendedSocket } from "../middleware/authSocket";
import Conversation from "../model/Conversation";
import { updateChatHistory } from "./update/chat";

export const directMessageHistory = async (
  socket: extendedSocket,
  conversationAnotherUserId: string
) => {
  const userId = socket.data.user?.id;

  const conversation = await Conversation.findOne({
    participants: { $all: [userId, conversationAnotherUserId] },
  });

  if (!conversation) return;

  updateChatHistory(conversation._id.toString(), socket.id);
};
