import { RequestHandler, RequestParamHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/User";
import friendInvitation from "../../model/FriendInvitation";
import {
  updateFriendPendingInvitation,
  updateFriendsList,
} from "../../socketHandlers/update/friend";
import { UserDecode } from "./../../util/types";
import FriendInvitation from "../../model/FriendInvitation";

interface reqBody {
  invitationId?: string;
}
interface local {
  user: UserDecode;
}
type resBody = any;
type params = any;
type reqQuery = any;

export const postAccept: RequestHandler<
  params,
  resBody,
  reqBody,
  reqQuery,
  local
> = async (req, res) => {
  try {
    const { invitationId } = req.body;

    const invitation = await FriendInvitation.findOne({ _id: invitationId });

    if (!invitation)
      return res.status(401).send("This invitation doesn't exitst");

    const { senderId, receiverId } = invitation;

    const senderUser = await User.findOne({ _id: senderId });
    const receiverUser = await User.findOne({ _id: receiverId });

    if (senderUser) {
      senderUser.friends = [...senderUser.friends, receiverId];
      await senderUser.save();
    }

    if (receiverUser) {
      receiverUser.friends = [...receiverUser?.friends, senderId];
      await receiverUser.save();
    }

    await FriendInvitation.findByIdAndDelete(invitationId);

    updateFriendPendingInvitation(receiverId.toString());

    updateFriendsList(receiverId.toString());
    updateFriendsList(senderId.toString());

    res.send("Invitation successfuly accepted");
  } catch (error) {
    if (error instanceof Error) return res.status(500).json(error.message);
  }
};
