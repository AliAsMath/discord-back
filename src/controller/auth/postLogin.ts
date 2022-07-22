import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/User";

interface reqBody {
  mail: string;
  password: string;
}
type resBody = any;
type params = any;

export const postLogin: RequestHandler<params, resBody, reqBody> = async (
  req,
  res
) => {
  try {
    const { mail, password } = req.body;

    const user = await User.findOne({ mail: mail.toLowerCase() });
    if (!user) return res.status(400).send("Invalid email. please try again.");

    const isCorrectPass = await bcrypt.compare(password, user.password);
    if (!isCorrectPass)
      return res.status(400).send("Invalid password. please try again.");

    const token = jwt.sign(
      {
        id: user._id,
        mail: user.mail,
      },
      process.env.SECRET_KEY!,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      userDetails: {
        id: user._id,
        mail: user.mail,
        token,
        username: user.username,
      },
    });
  } catch (error) {
    if (error instanceof Error) return res.status(500).json(error.message);
  }
};
