import { extendedSocket } from "./../middleware/authSocket";
import { leaveRoomHandler } from "./leaveRoomHandler";
import { activeRooms, removeUserFromConnected } from "./socket-store";

export const disconnectHandler = (socket: extendedSocket) => {
  activeRooms.forEach((room) => {
    const isUserInAnyRoom = room.participants.some(
      (participant) => participant.socketId === socket.id
    );

    if (isUserInAnyRoom) leaveRoomHandler(socket, room.roomId);
  });

  removeUserFromConnected(socket.id);
};
