import { extendedSocket } from "./../middleware/authSocket";
import { emitToOnlineUsers } from "./emitToOnlineUsers";
import { addUserToConnected, connectedUsers } from "./socket-store";
import {
  updateFriendPendingInvitation,
  updateFriendsList,
} from "./update/friend";
import { updateRooms } from "./update/room";

export const newConnectionHandler = (socket: extendedSocket) => {
  console.log("user connected");

  if (!socket.data.user?.id) return;

  const userId = socket.data.user?.id;

  addUserToConnected({ socketId: socket.id, userId });

  console.log(connectedUsers);

  updateFriendPendingInvitation(userId);
  //update room must run after friends update beacuse rooms need new list of friend
  updateFriendsList(userId).then(() => updateRooms(socket.id));

  emitToOnlineUsers();
};
