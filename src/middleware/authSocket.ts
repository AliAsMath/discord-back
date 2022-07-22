import bcrypt from "bcryptjs";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { io } from "../socket";

interface reqBody {
  token: string;
}

interface User {
  mail: string;
  id: string;
}

export interface extendedSocket extends Socket {
  data: { user?: User; error?: Error };
}

export const verifyTokenSocket = (
  socket: extendedSocket,
  next: (error?: ExtendedError) => void
) => {
  const token = socket.handshake.auth.token;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as User;

    socket.data.user = decoded;

    next();
  } catch (err) {
    next(new Error("Not authorized"));
  }
};
