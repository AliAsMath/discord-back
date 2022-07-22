import FriendInvitation from "../../model/FriendInvitation";
import User from "../../model/User";
import { io } from "../../socket";
import { getOnlineSocketIdsOfUserId } from "../socket-store";

interface FreindsList {
  friends: { _id: string; mail: string; username: string }[];
}

export const updateFriendPendingInvitation = async (userId: string) => {
  try {
    const senderReceiverInvitation = await FriendInvitation.find({
      receiverId: userId,
    }).populate("senderId", "_id mail username");

    const senderInvitation = senderReceiverInvitation.map((invitation) => {
      return { id: invitation._id, senderUser: invitation.senderId };
    });

    //send to all device of one userId
    const receiverList = getOnlineSocketIdsOfUserId(userId);

    io.to(receiverList).emit("friend-invitation", { senderInvitation });
  } catch (error) {
    console.log(error);
  }
};

export const updateFriendsList = async (userId: string) => {
  try {
    const receiverList = getOnlineSocketIdsOfUserId(userId);
    if (receiverList.length < 1) return;

    const user = await User.findById(userId, {
      _id: 1,
      friends: 1,
    }).populate<FreindsList>("friends", "_id mail username");

    if (!user) return;

    const friends = user.friends.map((friend) => {
      return { id: friend._id, mail: friend.mail, username: friend.username };
    });

    io.to(receiverList).emit("friend-list", { friends });
  } catch (error) {
    console.log(error);
  }
};
