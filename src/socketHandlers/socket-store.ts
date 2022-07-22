import { v4 as uuidv4 } from "uuid";

export const connectedUsers = new Map<string, { userId: string }>();
export const activeRooms: Room[] = [];

export const addUserToConnected = ({
  socketId,
  userId,
}: {
  socketId: string;
  userId: string;
}) => connectedUsers.set(socketId, { userId });

export const removeUserFromConnected = (socketId: string) =>
  connectedUsers.delete(socketId);

export const getOnlineSocketIdsOfUserId = (userId: string) => {
  const activeConnectionsOfUser: string[] = [];

  connectedUsers.forEach((user, socketId) => {
    if (user.userId === userId) activeConnectionsOfUser.push(socketId);
  });

  return activeConnectionsOfUser;
};

export const getOnlineUserId = () => {
  const onlineUsers: any[] = [];

  connectedUsers.forEach((user, socketId) =>
    onlineUsers.push({ socketId, userId: user.userId })
  );

  return onlineUsers;
};

export class Room {
  roomCreator: { userId: string; socketId: string };
  participants: { userId: string; socketId: string }[];
  roomId: string;

  constructor(socketId: string, userId: string) {
    this.roomCreator = { userId, socketId };
    this.participants = [{ userId, socketId }];
    this.roomId = uuidv4();
  }
}

export const getActiveRoom = (roomId: string) => {
  return activeRooms.find((room) => room.roomId === roomId);
};

export const addToActiveRoom = (socketId: string, userId: string): Room => {
  const newRoom = new Room(socketId, userId);
  activeRooms.push(newRoom);
  return newRoom;
};

export const addParticiapantToActiveRoom = (
  roomId: string,
  participant: { socketId: string; userId: string }
) => {
  activeRooms.forEach(
    (room) => room.roomId === roomId && room.participants.push(participant)
  );
};

export const removeParticipantFromActiveRoom = (
  roomId: string,
  participantSocketId: string
) => {
  activeRooms.forEach((room, index) => {
    room.roomId === roomId &&
      room.participants.forEach(
        (participant, index) =>
          participant.socketId === participantSocketId &&
          room.participants.splice(index, 1)
      );

    if (room.participants.length === 0) activeRooms.splice(index, 1);
  });
};
