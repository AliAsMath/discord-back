import { RequestHandler, RequestParamHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/User";
import friendInvitation from "../../model/FriendInvitation";
import { updateFriendPendingInvitation } from "../../socketHandlers/update/friend";
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

export const postReject: RequestHandler<
  params,
  resBody,
  reqBody,
  reqQuery,
  local
> = async (req, res) => {
  try {
    const { id } = res.locals.user;
    const { invitationId } = req.body;

    await FriendInvitation.findByIdAndDelete(invitationId);

    updateFriendPendingInvitation(id);

    res.status(200).send("Invitation successfully rejected.");
  } catch (error) {
    if (error instanceof Error) return res.status(500).json(error.message);
  }
};
