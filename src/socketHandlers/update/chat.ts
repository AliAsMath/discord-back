import Conversation from "../../model/Conversation";
import { io } from "../../socket";
import { getOnlineSocketIdsOfUserId } from "../socket-store";

export const updateChatHistory = async (
  conversationId: string,
  specifiedSocketId: string | undefined = undefined
) => {
  try {
    const conversation = await Conversation.findById(conversationId).populate({
      path: "messages",
      model: "Message",
      populate: {
        path: "author",
        model: "User",
        select: "username _id",
      },
    });

    if (!conversation) return;

    if (specifiedSocketId)
      return io.to(specifiedSocketId).emit("direct-chat-history", conversation);

    conversation.participants.forEach((userId) => {
      const OnlineSocketIdsOfUserId = getOnlineSocketIdsOfUserId(
        userId.toString()
      );

      io.to(OnlineSocketIdsOfUserId).emit("direct-chat-history", conversation);
    });
  } catch (error) {
    console.log(error);
  }
};
