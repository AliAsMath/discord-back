import { extendedSocket } from "./../middleware/authSocket";
import { addToActiveRoom, Room } from "./socket-store";
import { updateRooms } from "./update/room";

export const createNewRoom = (socket: extendedSocket) => {
  const socketId = socket.id;
  const userId = socket.data.user?.id;

  if (userId) {
    const newActiveRoom: Room = addToActiveRoom(socketId, userId);
    socket.emit("create-room", { roomDetails: newActiveRoom });
  }

  updateRooms();
};
