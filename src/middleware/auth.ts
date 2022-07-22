import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { UserDecode } from "../util/types";

interface reqBody {
  invitationId?: string;
  token: string;
  mail?: string;
  username?: string;
}
type resBody = any;
type params = any;
type reqQuery = { token: string };

export const verifyToken: RequestHandler<
  params,
  resBody,
  reqBody,
  reqQuery
> = async (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];
  if (!token) return res.status(403).send("Token is requierd.");

  try {
    token = token.replace(/^Bearer\s+/, "");

    const decoded = jwt.verify(token, process.env.SECRET_KEY!);

    res.locals.user = decoded;

    next();
  } catch (error) {
    if (error instanceof Error) return res.status(401).json(error.message);
  }
};
