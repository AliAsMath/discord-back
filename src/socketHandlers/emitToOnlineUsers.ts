import { io } from "./../socket";
import { getOnlineUserId } from "./socket-store";

export const emitToOnlineUsers = () => {
  const onlineUsers = getOnlineUserId();

  onlineUsers.forEach((user) =>
    io.to(user.socketId).emit("online-users", { onlineUsers })
  );
};
