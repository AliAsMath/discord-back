import { RequestHandler, RequestParamHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/User";
import friendInvitation from "../../model/FriendInvitation";
import { updateFriendPendingInvitation } from "../../socketHandlers/update/friend";
import { UserDecode } from "../../util/types";

interface reqBody {
  mail?: string;
}
interface local {
  user: UserDecode;
}
type resBody = any;
type params = any;
type reqQuery = any;

export const postInvite: RequestHandler<
  params,
  resBody,
  reqBody,
  reqQuery,
  local
> = async (req, res) => {
  try {
    const { id, mail } = res.locals.user;
    const targetMail = req.body.mail;

    if (mail.toLowerCase() === targetMail?.toLowerCase())
      return res.status(409).send("You can't invite yourself.");

    const targetUser = await User.findOne({ mail: targetMail?.toLowerCase() });
    if (!targetUser)
      return res.status(404).send(`User with ${targetMail} isn't exist.`);

    const invitationAlredySent = await friendInvitation.findOne({
      senderId: id,
      receiverId: targetUser._id,
    });
    if (!!invitationAlredySent)
      return res
        .status(409)
        .send(`Invitation to ${targetUser.mail} has been alredy sent`);

    const bothAlreadyFriends = targetUser.friends.find(
      (friendId) => friendId.toString() === id
    );
    if (!!bothAlreadyFriends)
      return res.status(409).send("Friend already added.");

    await friendInvitation.create({ senderId: id, receiverId: targetUser._id });

    //send to all device of target user all pending invitation
    updateFriendPendingInvitation(targetUser._id.toString());

    res.status(201).send("Invitation has been sent");
  } catch (error) {
    if (error instanceof Error) return res.status(500).json(error.message);
  }
};
