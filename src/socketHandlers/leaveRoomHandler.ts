import { extendedSocket } from "./../middleware/authSocket";
import { getActiveRoom, removeParticipantFromActiveRoom } from "./socket-store";
import { updateRooms } from "./update/room";

export const leaveRoomHandler = (socket: extendedSocket, roomId: string) => {
  removeParticipantFromActiveRoom(roomId, socket.id);

  const room = getActiveRoom(roomId);
  if (room)
    room.participants.forEach((participant) =>
      socket
        .to(participant.socketId)
        .emit("other-socketUser-leave", { leaveSocketId: socket.id })
    );

  updateRooms();
};
