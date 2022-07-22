import { Router } from "express";
import Joi from "joi";
import { createValidator } from "express-joi-validation";
import { verifyToken } from "../middleware/auth";
import { friendInvitationController } from "./../controller/friend/friendInvitationController";

const router = Router();
const validator = createValidator();

const postFriendInvitationSchema = Joi.object({
  mail: Joi.string().email().required(),
});

const decisionSchema = Joi.object({
  invitationId: Joi.string().required(),
});

router.post(
  "/invite",
  validator.body(postFriendInvitationSchema),
  verifyToken,
  friendInvitationController.postInvite
);

router.post(
  "/accept",
  validator.body(decisionSchema),
  verifyToken,
  friendInvitationController.postAccept
);

router.post(
  "/reject",
  validator.body(decisionSchema),
  verifyToken,
  friendInvitationController.postReject
);

export default router;
