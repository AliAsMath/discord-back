import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/User";

interface reqBody {
  mail: string;
  username: string;
  password: string;
}
type resBody = any;
type params = any;

export const postRegister: RequestHandler<params, resBody, reqBody> = async (
  req,
  res
) => {
  try {
    const { mail, username, password } = req.body;

    const isUserExist = await User.exists({ mail: mail.toLowerCase() });
    if (isUserExist) return res.status(409).send("Email already in use.");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      mail: mail.toLowerCase(),
      username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        mail: newUser.mail,
      },
      process.env.SECRET_KEY!,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      userDetails: {
        id: newUser._id,
        mail: newUser.mail,
        token,
        username,
      },
    });
  } catch (error) {
    if (error instanceof Error) return res.status(500).json(error.message);
  }
};
