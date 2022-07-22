import { extendedSocket } from "../middleware/authSocket";
import { addParticiapantToActiveRoom, getActiveRoom } from "./socket-store";
import { updateRooms } from "./update/room";

export const joinRoomHandler = (socket: extendedSocket, roomId: string) => {
  if (!socket.data.user?.id) return;

  const roomDetails = getActiveRoom(roomId);
  roomDetails?.participants.forEach((participant) => {
    socket
      .to(participant.socketId)
      .emit("connection-prepare", { connectedSocketId: socket.id });
  });

  const newParticipant = { socketId: socket.id, userId: socket.data.user?.id };
  addParticiapantToActiveRoom(roomId, newParticipant);

  updateRooms();
};
