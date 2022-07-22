import { extendedSocket } from "./../middleware/authSocket";

export const initConnectionHandler = (
  socket: extendedSocket,
  connectedSocketId: string
) => {
  socket
    .to(connectedSocketId)
    .emit("connection-init", { connectedSocketId: socket.id });
};
