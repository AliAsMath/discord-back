import { extendedSocket } from "./../middleware/authSocket";

export const signalDataHandler = (socket: extendedSocket, data: any) => {
  socket
    .to(data.connectedSocketId)
    .emit("connection-signal", {
      signal: data.signal,
      connectedSocketId: socket.id,
    });
};
