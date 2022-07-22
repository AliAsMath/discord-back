import { Server } from "socket.io";
import http from "http";
import { extendedSocket, verifyTokenSocket } from "./middleware/authSocket";
import { connectedUsers } from "./socketHandlers/socket-store";
import { emitToOnlineUsers } from "./socketHandlers/emitToOnlineUsers";
import { sendDirectMessage } from "./socketHandlers/sendDirectMessage";
import { directMessageHistory } from "./socketHandlers/directMessageHistory";
import { createNewRoom } from "./socketHandlers/createNewRoom";
import { joinRoomHandler } from "./socketHandlers/joinRoomHandler";
import { leaveRoomHandler } from "./socketHandlers/leaveRoomHandler";
import { disconnectHandler } from "./socketHandlers/disconnectHandler";
import { newConnectionHandler } from "./socketHandlers/newConnectionHandler";
import { initConnectionHandler } from "./socketHandlers/initConnectionHandler";
import { signalDataHandler } from "./socketHandlers/signalDataHandler";

export let io: Server;

export const registerSocketServer = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(verifyTokenSocket);

  io.on("connection", (socket: extendedSocket) => {
    newConnectionHandler(socket);

    socket.on("direct-message", (data) => sendDirectMessage(socket, data));

    socket.on("direct-chat-history", (data) =>
      directMessageHistory(socket, data.anotherUserId)
    );

    socket.on("create-room", () => {
      createNewRoom(socket);
    });

    socket.on("join-room", (data) => {
      joinRoomHandler(socket, data.roomId);
    });

    socket.on("leave-room", (data) => {
      leaveRoomHandler(socket, data.roomId);
    });

    socket.on("connection-init", (data) => {
      initConnectionHandler(socket, data.connectedSocketId);
    });

    socket.on("connection-signal", (data) => {
      signalDataHandler(socket, data);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      disconnectHandler(socket);
      console.log(connectedUsers);

      emitToOnlineUsers();
    });
  });
};
